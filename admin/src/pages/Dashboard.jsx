import React, { useState, useEffect } from 'react'
import { supabase, fmt, fmtDate } from '../lib/supabase'
import { Package, Users, Bike, Wallet, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, Stat, Badge, Table, PageHeader } from '../components/ui'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const STATUS_COLOR = { pending:'amber', accepted:'blue', pickup:'blue', transit:'navy', delivered:'green', cancelled:'red' }

export default function Dashboard() {
  const [stats, setStats] = useState({ orders:0, customers:0, riders:0, revenue:0, pending:0, delivered:0, cancelled:0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const [ordersRes, customersRes, ridersRes] = await Promise.allSettled([
      supabase.from('orders').select('id,status,price,created_at,service_type,tracking_id,pickup_address,dropoff_address').order('created_at', { ascending:false }).limit(200),
      supabase.from('profiles').select('id', { count:'exact', head:true }).eq('role','customer'),
      supabase.from('profiles').select('id', { count:'exact', head:true }).eq('role','rider'),
    ])

    const orders = ordersRes.value?.data || []
    const revenue = orders.filter(o => o.status === 'delivered').reduce((s,o) => s + (o.price || 0), 0)
    const pending = orders.filter(o => o.status === 'pending').length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const cancelled = orders.filter(o => o.status === 'cancelled').length

    setStats({
      orders: orders.length,
      customers: customersRes.value?.count || 0,
      riders: ridersRes.value?.count || 0,
      revenue, pending, delivered, cancelled
    })
    setRecentOrders(orders.slice(0, 8))

    // Group by day for chart (last 7 days)
    const days = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-NG', { weekday:'short' })
      days[key] = { day:key, orders:0, revenue:0 }
    }
    orders.forEach(o => {
      const d = new Date(o.created_at)
      const daysAgo = Math.floor((now - d) / 86400000)
      if (daysAgo < 7) {
        const key = d.toLocaleDateString('en-NG', { weekday:'short' })
        if (days[key]) { days[key].orders++; days[key].revenue += (o.price || 0) }
      }
    })
    setChartData(Object.values(days))
    setLoading(false)
  }

  const COLS = [
    { key:'tracking_id', label:'Tracking ID', render: v => <span style={{ fontWeight:700, color:'var(--navy)', fontFamily:'monospace' }}>{v}</span> },
    { key:'service_type', label:'Service', render: v => <Badge color={v==='heavy'?'navy':v==='bulk'?'amber':'blue'}>{v}</Badge> },
    { key:'pickup_address', label:'Pickup', wrap:true, render: v => <span style={{ maxWidth:160, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</span> },
    { key:'status', label:'Status', render: v => <Badge color={STATUS_COLOR[v]||'gray'}>{v}</Badge> },
    { key:'price', label:'Amount', render: v => <span style={{ fontWeight:700 }}>{fmt(v)}</span> },
    { key:'created_at', label:'Date', render: v => fmtDate(v) },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" sub={`Good morning — here's what's happening today`} />

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
        <Stat label="Total Orders" value={stats.orders} icon={Package} color="#2563EB" trend={12} />
        <Stat label="Total Revenue" value={fmt(stats.revenue)} icon={Wallet} color="#16A34A" trend={8} />
        <Stat label="Customers" value={stats.customers} icon={Users} color="#F97316" trend={5} />
        <Stat label="Active Riders" value={stats.riders} icon={Bike} color="#7C3AED" />
      </div>

      {/* Sub stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Pending', value:stats.pending, icon:Clock, color:'#F97316' },
          { label:'Delivered', value:stats.delivered, icon:CheckCircle, color:'#16A34A' },
          { label:'Cancelled', value:stats.cancelled, icon:AlertCircle, color:'#DC2626' },
        ].map(s => (
          <Card key={s.label} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px' }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:'var(--navy)' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'var(--text-light)' }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:16, marginBottom:24 }}>
        <Card>
          <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Orders This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F7" />
              <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} />
              <Area type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Revenue (₦)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} formatter={v => fmt(v)} />
              <Bar dataKey="revenue" fill="#16A34A" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:800 }}>Recent Orders</h3>
          <a href="/orders" style={{ fontSize:13, color:'#2563EB', fontWeight:600 }}>View all →</a>
        </div>
        <Table cols={COLS} rows={recentOrders} />
      </Card>
    </div>
  )
}
