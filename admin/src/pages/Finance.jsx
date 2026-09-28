import React, { useState, useEffect } from 'react'
import { supabase, fmt, fmtDate } from '../lib/supabase'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, RefreshCw, Search } from 'lucide-react'
import { Card, Stat, Badge, Table, PageHeader, Modal, Btn, Field, Input } from '../components/ui'

export default function Finance() {
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [stats, setStats] = useState({ total_funded:0, total_spent:0, total_balance:0, tx_count:0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [fundModal, setFundModal] = useState(false)
  const [fundForm, setFundForm] = useState({ user_id:'', amount:'', note:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [txRes, walRes] = await Promise.allSettled([
      supabase.from('wallet_transactions').select('*, profiles(name, phone)').order('created_at', { ascending:false }).limit(300),
      supabase.from('wallets').select('*, profiles(name, phone)').order('balance', { ascending:false }).limit(100),
    ])
    const txs = txRes.value?.data || []
    const ws = walRes.value?.data || []
    setTransactions(txs)
    setWallets(ws)
    const funded = txs.filter(t => t.type === 'credit').reduce((s, t) => s + (t.amount || 0), 0)
    const spent = txs.filter(t => t.type === 'debit').reduce((s, t) => s + (t.amount || 0), 0)
    const balance = ws.reduce((s, w) => s + (w.balance || 0), 0)
    setStats({ total_funded:funded, total_spent:spent, total_balance:balance, tx_count:txs.length })
    setLoading(false)
  }

  const filtered = search
    ? transactions.filter(t =>
        t.profiles?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.profiles?.phone?.includes(search) ||
        t.reference?.includes(search)
      )
    : transactions

  const TX_COLS = [
    { key:'created_at', label:'Date', render: v => fmtDate(v) },
    { key:'profiles', label:'User', render: v => (
      <div>
        <div style={{ fontWeight:600, fontSize:13 }}>{v?.name || 'Unknown'}</div>
        <div style={{ fontSize:11, color:'var(--text-light)' }}>{v?.phone}</div>
      </div>
    )},
    { key:'type', label:'Type', render: v => (
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {v === 'credit' ? <ArrowDownLeft size={14} color="#16A34A" /> : <ArrowUpRight size={14} color="#DC2626" />}
        <Badge color={v === 'credit' ? 'green' : 'red'}>{v}</Badge>
      </div>
    )},
    { key:'amount', label:'Amount', render: (v, r) => <b style={{ color: r.type === 'credit' ? '#16A34A' : '#DC2626' }}>{r.type === 'credit' ? '+' : '-'}{fmt(v)}</b> },
    { key:'description', label:'Description', render: v => v || '—' },
    { key:'reference', label:'Reference', render: v => <span style={{ fontFamily:'monospace', fontSize:11 }}>{v || '—'}</span> },
  ]

  const WALLET_COLS = [
    { key:'profiles', label:'Customer', render: v => (
      <div>
        <div style={{ fontWeight:600 }}>{v?.name || 'Unknown'}</div>
        <div style={{ fontSize:11, color:'var(--text-light)' }}>{v?.phone}</div>
      </div>
    )},
    { key:'balance', label:'Balance', render: v => <b style={{ fontSize:15, color:'var(--navy)' }}>{fmt(v)}</b> },
    { key:'updated_at', label:'Last Activity', render: v => fmtDate(v) },
    { key:'user_id', label:'', render: (v) => (
      <button onClick={() => { setFundForm({user_id:v, amount:'', note:''}); setFundModal(true) }} style={{ padding:'5px 12px', borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', color:'#2563EB', fontSize:12, fontWeight:600 }}>Fund</button>
    )},
  ]

  const handleFund = async () => {
    if (!fundForm.user_id || !fundForm.amount) return
    setSaving(true)
    const amt = parseFloat(fundForm.amount)
    const { data: w } = await supabase.from('wallets').select('balance').eq('user_id', fundForm.user_id).single()
    if (w) {
      await supabase.from('wallets').update({ balance: (w.balance || 0) + amt }).eq('user_id', fundForm.user_id)
    } else {
      await supabase.from('wallets').insert({ user_id: fundForm.user_id, balance: amt })
    }
    await supabase.from('wallet_transactions').insert({
      user_id: fundForm.user_id,
      amount: amt,
      type: 'credit',
      description: fundForm.note || 'Admin top-up',
      reference: `ADMIN-${Date.now()}`
    })
    load()
    setFundModal(false)
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Finance" sub="Wallets, transactions and payouts"
        action={<Btn onClick={load} loading={loading} variant="ghost" size="sm"><RefreshCw size={14} />Refresh</Btn>}
      />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
        <Stat label="Total Credited" value={fmt(stats.total_funded)} icon={ArrowDownLeft} color="#16A34A" />
        <Stat label="Total Debited" value={fmt(stats.total_spent)} icon={ArrowUpRight} color="#DC2626" />
        <Stat label="Total Balances" value={fmt(stats.total_balance)} icon={Wallet} color="#2563EB" />
        <Stat label="Transactions" value={stats.tx_count} icon={TrendingUp} color="#7C3AED" />
      </div>

      <Card style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:15, fontWeight:800, marginBottom:16 }}>Customer Wallets</h3>
        <Table cols={WALLET_COLS} rows={wallets} emptyMsg={loading ? 'Loading...' : 'No wallets found'} />
      </Card>

      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:800 }}>All Transactions</h3>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg)', borderRadius:10, padding:'8px 14px', width:280 }}>
            <Search size={14} color="var(--text-light)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ border:'none', background:'transparent', outline:'none', fontSize:13, width:'100%' }} />
          </div>
        </div>
        <Table cols={TX_COLS} rows={filtered} emptyMsg={loading ? 'Loading...' : 'No transactions'} />
      </Card>

      <Modal open={fundModal} onClose={() => setFundModal(false)} title="Fund Wallet" width={400}>
        <Field label="Amount (₦)">
          <Input type="number" value={fundForm.amount} onChange={e => setFundForm({...fundForm, amount:e.target.value})} placeholder="e.g. 5000" />
        </Field>
        <Field label="Note (optional)">
          <Input value={fundForm.note} onChange={e => setFundForm({...fundForm, note:e.target.value})} placeholder="Reason for top-up" />
        </Field>
        <Btn onClick={handleFund} loading={saving} variant="green" style={{ width:'100%', justifyContent:'center', marginTop:8 }}>Credit Wallet</Btn>
      </Modal>
    </div>
  )
}
