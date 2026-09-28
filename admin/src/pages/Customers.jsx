import React, { useState, useEffect } from 'react'
import { supabase, fmt, fmtDate, initials } from '../lib/supabase'
import { Search, RefreshCw } from 'lucide-react'
import { Card, Badge, Table, PageHeader, Modal, Btn } from '../components/ui'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [custOrders, setCustOrders] = useState([])

  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q ? customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    ) : customers)
  }, [customers, search])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('role','customer').order('created_at', { ascending:false })
    // Enrich with order count and wallet balance
    const enriched = await Promise.all((data || []).map(async (c) => {
      const [ordRes, walRes] = await Promise.allSettled([
        supabase.from('orders').select('id,price,status').eq('customer_id', c.id),
        supabase.from('wallets').select('balance').eq('user_id', c.id).single(),
      ])
      const ords = ordRes.value?.data || []
      return {
        ...c,
        order_count: ords.length,
        total_spent: ords.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.price || 0), 0),
        wallet_balance: walRes.value?.data?.balance || 0,
      }
    }))
    setCustomers(enriched)
    setLoading(false)
  }

  const viewCustomer = async (c) => {
    setSelected(c)
    const { data } = await supabase.from('orders').select('*').eq('customer_id', c.id).order('created_at', { ascending:false }).limit(10)
    setCustOrders(data || [])
  }

  const toggleBan = async (c) => {
    const verified = !c.verified
    await supabase.from('profiles').update({ verified }).eq('id', c.id)
    setCustomers(customers.map(x => x.id === c.id ? { ...x, verified } : x))
    if (selected?.id === c.id) setSelected({ ...selected, verified })
  }

  const COLS = [
    { key:'name', label:'Customer', render: (v, r) => (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:'#DBEAFE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#1D4ED8', flexShrink:0 }}>
          {initials(v || r.phone)}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:13 }}>{v || 'Unknown'}</div>
          <div style={{ fontSize:11, color:'var(--text-light)' }}>{r.phone || '—'}</div>
        </div>
      </div>
    )},
    { key:'phone', label:'Phone', render: v => v || '—' },
    { key:'order_count', label:'Orders', render: v => <b>{v}</b> },
    { key:'total_spent', label:'Total Spent', render: v => <b style={{ color:'#16A34A' }}>{fmt(v)}</b> },
    { key:'wallet_balance', label:'Wallet', render: v => fmt(v) },
    { key:'verified', label:'Status', render: v => <Badge color={v ? 'green' : 'amber'}>{v ? 'Verified' : 'Unverified'}</Badge> },
    { key:'created_at', label:'Joined', render: v => fmtDate(v) },
    { key:'id', label:'', render: (_, r) => (
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={() => viewCustomer(r)} style={{ padding:'5px 12px', borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', color:'#2563EB', fontSize:12, fontWeight:600 }}>View</button>
        <button onClick={() => toggleBan(r)} style={{ padding:'5px 12px', borderRadius:8, background: r.verified ? '#FEF2F2' : '#F0FDF4', border:'none', cursor:'pointer', color: r.verified ? '#DC2626' : '#16A34A', fontSize:12, fontWeight:600 }}>
          {r.verified ? 'Unverify' : 'Verify'}
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Customers" sub={`${filtered.length} registered customers`}
        action={<Btn onClick={load} loading={loading} variant="ghost" size="sm"><RefreshCw size={14} />Refresh</Btn>}
      />
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg)', borderRadius:10, padding:'9px 14px' }}>
          <Search size={15} color="var(--text-light)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone..." style={{ border:'none', background:'transparent', outline:'none', fontSize:13, width:'100%' }} />
        </div>
      </Card>
      <Card><Table cols={COLS} rows={filtered} emptyMsg={loading ? 'Loading...' : 'No customers found'} /></Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || 'Customer'} width={640}>
        {selected && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, padding:16, background:'var(--bg)', borderRadius:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>
                {initials(selected.name || selected.phone)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800 }}>{selected.name || 'Unknown'}</div>
                <div style={{ color:'var(--text-light)', fontSize:13 }}>{selected.phone || '—'}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <Badge color={selected.verified ? 'green' : 'amber'}>{selected.verified ? 'Verified' : 'Unverified'}</Badge>
                <div style={{ fontSize:12, color:'var(--text-light)', marginTop:6 }}>Joined {fmtDate(selected.created_at)}</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
              {[['Orders', selected.order_count], ['Spent', fmt(selected.total_spent)], ['Wallet', fmt(selected.wallet_balance)]].map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:12, padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:900, color:'var(--navy)' }}>{v}</div>
                  <div style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>{k}</div>
                </div>
              ))}
            </div>
            <h4 style={{ fontWeight:800, marginBottom:12, fontSize:14 }}>Recent Orders</h4>
            {custOrders.length === 0 ? <p style={{ color:'var(--text-light)', fontSize:13 }}>No orders yet</p> : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {custOrders.map(o => (
                  <div key={o.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg)', borderRadius:10 }}>
                    <div>
                      <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:12, color:'var(--navy)' }}>{o.tracking_id}</span>
                      <span style={{ fontSize:11, color:'var(--text-light)', marginLeft:10 }}>{fmtDate(o.created_at)}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Badge color={o.status==='delivered'?'green':o.status==='cancelled'?'red':'amber'}>{o.status}</Badge>
                      <b style={{ fontSize:13 }}>{fmt(o.price)}</b>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop:20 }}>
              <Btn onClick={() => toggleBan(selected)} variant={selected.verified ? 'red' : 'green'} size="sm">
                {selected.verified ? 'Unverify' : 'Verify Customer'}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
