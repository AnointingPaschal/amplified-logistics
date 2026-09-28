import React, { useState, useEffect } from 'react'
import { supabase, fmt, fmtDate } from '../lib/supabase'
import { Search, RefreshCw, Eye, Edit2, Trash2 } from 'lucide-react'
import { Card, Badge, Table, PageHeader, Modal, Btn, Field, Select } from '../components/ui'

const STATUS_COLOR = { pending:'amber', accepted:'blue', pickup:'navy', transit:'blue', delivered:'green', cancelled:'red' }
const STATUSES = ['all','pending','accepted','pickup','transit','delivered','cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  useEffect(() => { filter() }, [orders, search, status])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending:false }).limit(500)
    setOrders(data || [])
    setLoading(false)
  }

  const filter = () => {
    let r = orders
    if (status !== 'all') r = r.filter(o => o.status === status)
    if (search) r = r.filter(o =>
      o.tracking_id?.toLowerCase().includes(search.toLowerCase()) ||
      o.pickup_address?.toLowerCase().includes(search.toLowerCase()) ||
      o.dropoff_address?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(r)
  }

  const updateStatus = async () => {
    if (!selected) return
    setSaving(true)
    await supabase.from('orders').update({ status: editStatus, updated_at: new Date().toISOString() }).eq('id', selected.id)
    setOrders(orders.map(o => o.id === selected.id ? { ...o, status: editStatus } : o))
    setEditModal(false)
    setSaving(false)
  }

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return
    await supabase.from('orders').delete().eq('id', id)
    setOrders(orders.filter(o => o.id !== id))
  }

  const COLS = [
    { key:'tracking_id', label:'Tracking', render: v => <span style={{ fontFamily:'monospace', fontWeight:700, color:'var(--navy)', fontSize:12 }}>{v}</span> },
    { key:'service_type', label:'Type', render: v => <Badge color={v==='heavy'?'navy':v==='bulk'?'amber':'blue'}>{v}</Badge> },
    { key:'pickup_address', label:'Pickup', render: v => <span style={{ maxWidth:180, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:12 }} title={v}>{v}</span> },
    { key:'dropoff_address', label:'Dropoff', render: v => <span style={{ maxWidth:180, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:12 }} title={v}>{v}</span> },
    { key:'dropoff_name', label:'Recipient', render: v => v || '—' },
    { key:'status', label:'Status', render: v => <Badge color={STATUS_COLOR[v]||'gray'}>{v}</Badge> },
    { key:'price', label:'Amount', render: v => <b>{fmt(v)}</b> },
    { key:'created_at', label:'Date', render: v => fmtDate(v) },
    { key:'id', label:'', render: (v, row) => (
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={() => setSelected(row)} style={{ padding:6, borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', color:'#2563EB' }}><Eye size={14} /></button>
        <button onClick={() => { setSelected(row); setEditStatus(row.status); setEditModal(true) }} style={{ padding:6, borderRadius:8, background:'#F0FDF4', border:'none', cursor:'pointer', color:'#16A34A' }}><Edit2 size={14} /></button>
        <button onClick={() => deleteOrder(v)} style={{ padding:6, borderRadius:8, background:'#FEF2F2', border:'none', cursor:'pointer', color:'#DC2626' }}><Trash2 size={14} /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Orders" sub={`${filtered.length} of ${orders.length} orders`}
        action={<Btn onClick={load} loading={loading} variant="ghost" size="sm"><RefreshCw size={14} />Refresh</Btn>}
      />

      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:220, display:'flex', alignItems:'center', gap:10, background:'var(--bg)', borderRadius:10, padding:'9px 14px' }}>
            <Search size={15} color="var(--text-light)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking ID, address..." style={{ border:'none', background:'transparent', outline:'none', fontSize:13, width:'100%' }} />
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding:'8px 14px', borderRadius:10, fontSize:12, fontWeight:700, border:'1.5px solid', borderColor: status===s ? 'var(--navy)' : 'var(--border)', background: status===s ? 'var(--navy)' : '#fff', color: status===s ? '#fff' : 'var(--text-mid)', cursor:'pointer', whiteSpace:'nowrap' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <Table cols={COLS} rows={filtered} emptyMsg={loading ? 'Loading...' : 'No orders found'} />
      </Card>

      {/* View modal */}
      <Modal open={!!selected && !editModal} onClose={() => setSelected(null)} title={`Order ${selected?.tracking_id}`}>
        {selected && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              ['Status', <Badge color={STATUS_COLOR[selected.status]||'gray'}>{selected.status}</Badge>],
              ['Service', <Badge color="blue">{selected.service_type}</Badge>],
              ['Amount', fmt(selected.price)],
              ['Package Size', selected.package_size || '—'],
              ['Category', selected.package_category || '—'],
              ['Protection', selected.protection_tier || 'none'],
              ['Recipient', selected.dropoff_name || '—'],
              ['Phone', selected.dropoff_phone || '—'],
              ['Date', fmtDate(selected.created_at)],
            ].map(([k,v]) => (
              <div key={k}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{k}</div>
                <div style={{ fontSize:14, color:'var(--navy)', fontWeight:500 }}>{v}</div>
              </div>
            ))}
            <div style={{ gridColumn:'span 2' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Pickup</div>
              <div style={{ fontSize:13, color:'var(--navy)' }}>{selected.pickup_address}</div>
            </div>
            <div style={{ gridColumn:'span 2' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Dropoff</div>
              <div style={{ fontSize:13, color:'var(--navy)' }}>{selected.dropoff_address}</div>
            </div>
            {selected.note && <div style={{ gridColumn:'span 2' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Note</div>
              <div style={{ fontSize:13, color:'var(--navy)' }}>{selected.note}</div>
            </div>}
          </div>
        )}
      </Modal>

      {/* Edit status modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Update Order Status" width={400}>
        <Field label="New Status">
          <Select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
            {['pending','accepted','pickup','transit','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Btn onClick={updateStatus} loading={saving} variant="blue" style={{ width:'100%', justifyContent:'center' }}>Save Status</Btn>
      </Modal>
    </div>
  )
}
