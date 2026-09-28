import React, { useState, useEffect } from 'react'
import { supabase, fmt } from '../lib/supabase'
import { Card, PageHeader, Stat } from '../components/ui'
import { Package, TrendingUp, Users, Bike } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563EB','#16A34A','#F97316','#7C3AED','#DC2626','#0891B2']

export default function Analytics() {
  const [data, setData] = useState({ daily:[], byType:[], byStatus:[], monthly:[], topCustomers:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data: orders } = await supabase.from('orders').select('id,status,price,service_type,created_at').order('created_at', { ascending:false }).limit(1000)
    const all = orders || []

    // Daily (last 14 days)
    const dailyMap = {}
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-NG', { month:'short', day:'numeric' })
      dailyMap[key] = { day:key, orders:0, revenue:0 }
    }
    all.forEach(o => {
      const d = new Date(o.created_at)
      const daysAgo = Math.floor((now - d) / 86400000)
      if (daysAgo < 14) {
        const key = d.toLocaleDateString('en-NG', { month:'short', day:'numeric' })
        if (dailyMap[key]) { dailyMap[key].orders++; dailyMap[key].revenue += (o.price||0) }
      }
    })

    // By type
    const typeMap = {}
    all.forEach(o => { if (!typeMap[o.service_type]) typeMap[o.service_type] = { name:o.service_type, count:0, revenue:0 }; typeMap[o.service_type].count++; typeMap[o.service_type].revenue += (o.price||0) })

    // By status
    const statusMap = {}
    all.forEach(o => { if (!statusMap[o.status]) statusMap[o.status] = { name:o.status, value:0 }; statusMap[o.status].value++ })

    // Monthly (last 6 months)
    const monthMap = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now); d.setMonth(d.getMonth() - i)
      const key = d.toLocaleDateString('en-NG', { month:'short', year:'2-digit' })
      monthMap[key] = { month:key, orders:0, revenue:0 }
    }
    all.forEach(o => {
      const d = new Date(o.created_at)
      const key = d.toLocaleDateString('en-NG', { month:'short', year:'2-digit' })
      if (monthMap[key]) { monthMap[key].orders++; monthMap[key].revenue += (o.price||0) }
    })

    setData({
      daily: Object.values(dailyMap),
      byType: Object.values(typeMap),
      byStatus: Object.values(statusMap),
      monthly: Object.values(monthMap),
    })
    setLoading(false)
  }

  const totalRev = data.byType.reduce((s,t) => s+t.revenue, 0)
  const totalOrd = data.byType.reduce((s,t) => s+t.count, 0)

  return (
    <div>
      <PageHeader title="Analytics" sub="Business performance overview" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
        <Stat label="Total Revenue" value={fmt(totalRev)} icon={TrendingUp} color="#16A34A" trend={8} />
        <Stat label="Total Orders" value={totalOrd} icon={Package} color="#2563EB" trend={12} />
        {data.byType.map((t,i) => (
          <Stat key={t.name} label={`${t.name} Orders`} value={t.count} icon={Package} color={COLORS[i]} sub={fmt(t.revenue)} />
        ))}
      </div>

      {/* Daily orders */}
      <Card style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Daily Orders & Revenue (14 Days)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.daily}>
            <defs>
              <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15}/><stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F7" />
            <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="l" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
            <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} formatter={(v,n) => n==='revenue' ? fmt(v) : v} />
            <Legend wrapperStyle={{ fontSize:12 }} />
            <Area yAxisId="l" type="monotone" dataKey="orders" name="Orders" stroke="#2563EB" strokeWidth={2} fill="url(#gOrd)" />
            <Area yAxisId="r" type="monotone" dataKey="revenue" name="Revenue" stroke="#16A34A" strokeWidth={2} fill="url(#gRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {/* By type */}
        <Card>
          <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Orders by Service</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.byType} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} />
              <Bar dataKey="count" name="Orders" radius={[6,6,0,0]}>
                {data.byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* By status */}
        <Card>
          <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={true}>
                {data.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} />
              <Legend wrapperStyle={{ fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly */}
      <Card>
        <h3 style={{ fontSize:15, fontWeight:800, marginBottom:20 }}>Monthly Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.monthly} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="l" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
            <Tooltip contentStyle={{ borderRadius:10, border:'1px solid var(--border)', fontSize:12 }} formatter={(v,n) => n==='Revenue' ? fmt(v) : v} />
            <Legend wrapperStyle={{ fontSize:12 }} />
            <Bar yAxisId="l" dataKey="orders" name="Orders" fill="#2563EB" radius={[6,6,0,0]} />
            <Bar yAxisId="r" dataKey="revenue" name="Revenue" fill="#16A34A" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
