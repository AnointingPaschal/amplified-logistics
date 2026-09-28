import React, { useState, useEffect } from 'react'
import { supabase, fmt, fmtDate, initials } from '../lib/supabase'
import { Search, Plus, RefreshCw, MapPin, Star } from 'lucide-react'
import { Card, Badge, Table, PageHeader, Modal, Btn, Field, Input, Select } from '../components/ui'

const VEHICLE_TYPES = ['Motorcycle','Van','Truck','Pickup']

export default function Riders() {
  const [riders, setRiders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', vehicle_type:'Motorcycle', vehicle_plate:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q ? riders.filter(r => r.full_name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.phone?.includes(q)) : riders)
  }, [riders, search])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('role','rider').order('created_at', { ascending:false })
    setRiders(data || [])
    setLoading(false)
  }

  const toggleStatus = async (r) => {
    const status = r.rider_status === 'active' ? 'inactive' : 'active'
    await supabase.from('profiles').update({ rider_status: status }).eq('id', r.id)
    setRiders(riders.map(x => x.id === r.id ? { ...x, rider_status: status } : x))
  }

  const toggleApproval = async (r) => {
    const approved = !r.approved
    await supabase.from('profiles').update({ approved }).eq('id', r.id)
    setRiders(riders.map(x => x.id === r.id ? { ...x, approved } : x))
  }

  const COLS = [
    { key:'full_name', label:'Rider', render: (v,r) => (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#16A34A', flexShrink:0 }}>
          {initials(v || r.email)}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:13 }}>{v || 'Unknown'}</div>
          <div style={{ fontSize:11, color:'var(--text-light)' }}>{r.email}</div>
        </div>
      </div>
    )},
    { key:'phone', label:'Phone', render: v => v || '—' },
    { key:'vehicle_type', label:'Vehicle', render: v => v || '—' },
    { key:'vehicle_plate', label:'Plate', render: v => <span style={{ fontFamily:'monospace', fontWeight:700 }}>{v || '—'}</span> },
    { key:'approved', label:'Approved', render: v => <Badge color={v?'green':'amber'}>{v?'Yes':'Pending'}</Badge> },
    { key:'rider_status', label:'Status', render: v => <Badge color={v==='active'?'green':'gray'}>{v||'inactive'}</Badge> },
    { key:'total_deliveries', label:'Deliveries', render: v => <b>{v || 0}</b> },
    { key:'rating', label:'Rating', render: v => v ? <span style={{ display:'flex', alignItems:'center', gap:4 }}><Star size={12} color="#F97316" fill="#F97316" />{Number(v).toFixed(1)}</span> : '—' },
    { key:'created_at', label:'Joined', render: v => fmtDate(v) },
    { key:'id', label:'', render: (_,r) => (
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={() => setSelected(r)} style={{ padding:'5px 12px', borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', color:'#2563EB', fontSize:12, fontWeight:600 }}>View</button>
        <button onClick={() => toggleApproval(r)} style={{ padding:'5px 12px', borderRadius:8, background: r.approved?'#FEF2F2':'#F0FDF4', border:'none', cursor:'pointer', color: r.approved?'#DC2626':'#16A34A', fontSize:12, fontWeight:600 }}>
          {r.approved ? 'Revoke' : 'Approve'}
        </button>
        <button onClick={() => toggleStatus(r)} style={{ padding:'5px 12px', borderRadius:8, background:'var(--bg)', border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontWeight:600, color:'var(--text-mid)' }}>
          {r.rider_status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Riders" sub={`${filtered.length} registered riders`}
        action={
          <div style={{ display:'flex', gap:10 }}>
            <Btn onClick={load} loading={loading} variant="ghost" size="sm"><RefreshCw size={14} />Refresh</Btn>
            <Btn onClick={() => setAddModal(true)} variant="blue" size="sm"><Plus size={14} />Add Rider</Btn>
          </div>
        }
      />
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg)', borderRadius:10, padding:'9px 14px' }}>
          <Search size={15} color="var(--text-light)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone..." style={{ border:'none', background:'transparent', outline:'none', fontSize:13, width:'100%' }} />
        </div>
      </Card>
      <Card><Table cols={COLS} rows={filtered} emptyMsg={loading ? 'Loading...' : 'No riders found'} /></Card>

      {/* View modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.full_name || 'Rider'}>
        {selected && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, padding:16, background:'var(--bg)', borderRadius:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'#16A34A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>
                {initials(selected.full_name || selected.email)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800 }}>{selected.full_name}</div>
                <div style={{ color:'var(--text-light)', fontSize:13 }}>{selected.email}</div>
                <div style={{ color:'var(--text-mid)', fontSize:13 }}>{selected.phone}</div>
              </div>
              <div>
                <Badge color={selected.rider_status==='active'?'green':'gray'}>{selected.rider_status||'inactive'}</Badge>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
              {[['Deliveries', selected.total_deliveries||0], ['Rating', selected.rating ? Number(selected.rating).toFixed(1) : '—'], ['Vehicle', selected.vehicle_type||'—']].map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:12, padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:900, color:'var(--navy)' }}>{v}</div>
                  <div style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[['Vehicle Plate', selected.vehicle_plate||'—'], ['Joined', fmtDate(selected.created_at)], ['Approved', selected.approved?'Yes':'Pending'], ['Earnings', fmt(selected.total_earnings||0)]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--navy)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Btn onClick={() => toggleApproval(selected)} variant={selected.approved?'red':'green'} size="sm">
                {selected.approved ? 'Revoke Approval' : 'Approve Rider'}
              </Btn>
              <Btn onClick={() => toggleStatus(selected)} variant="ghost" size="sm">
                {selected.rider_status === 'active' ? 'Deactivate' : 'Activate'}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Add rider modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Rider" width={440}>
        <Field label="Full Name"><Input value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} placeholder="John Rider" /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="rider@email.com" /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="08012345678" /></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Vehicle Type">
            <Select value={form.vehicle_type} onChange={e => setForm({...form, vehicle_type:e.target.value})}>
              {VEHICLE_TYPES.map(v => <option key={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Plate Number"><Input value={form.vehicle_plate} onChange={e => setForm({...form, vehicle_plate:e.target.value})} placeholder="ABI-123-AB" /></Field>
        </div>
        <Btn onClick={async () => {
          setSaving(true)
          const { error } = await supabase.from('profiles').insert({ ...form, role:'rider', rider_status:'inactive', approved:false })
          if (!error) { load(); setAddModal(false); setForm({ full_name:'', email:'', phone:'', vehicle_type:'Motorcycle', vehicle_plate:'' }) }
          setSaving(false)
        }} loading={saving} variant="blue" style={{ width:'100%', justifyContent:'center', marginTop:8 }}>Add Rider</Btn>
      </Modal>
    </div>
  )
}
