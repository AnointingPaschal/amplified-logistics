import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, Users, Bike, Wallet, BarChart3,
  Settings, LogOut, Menu, X, Bell, ChevronDown, Search, Zap
} from 'lucide-react'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders',    icon: Package,          label: 'Orders' },
  { to: '/customers', icon: Users,            label: 'Customers' },
  { to: '/riders',    icon: Bike,             label: 'Riders' },
  { to: '/finance',   icon: Wallet,           label: 'Finance' },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics' },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 240 : 68, transition: 'width .2s', background: 'var(--navy)',
        display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100,
        overflow:'hidden'
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ width:36, height:36, background:'#2563EB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Zap size={18} color="#fff" />
          </div>
          {open && <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:15, lineHeight:1 }}>Amplified</div>
            <div style={{ color:'rgba(255,255,255,.4)', fontSize:11, marginTop:2 }}>Admin Portal</div>
          </div>}
        </div>

        {/* Toggle */}
        <button onClick={() => setOpen(!open)} style={{ display:'flex', alignItems:'center', justifyContent: open ? 'flex-end' : 'center', padding:'12px 16px', color:'rgba(255,255,255,.4)' }}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px 8px' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:12, padding:'10px 10px', borderRadius:10, marginBottom:4,
              color: isActive ? '#fff' : 'rgba(255,255,255,.5)',
              background: isActive ? 'rgba(37,99,235,.35)' : 'transparent',
              textDecoration:'none', whiteSpace:'nowrap', overflow:'hidden',
              transition:'all .15s'
            })}>
              <Icon size={18} style={{ flexShrink:0 }} />
              {open && <span style={{ fontSize:13, fontWeight:600 }}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:10, background:'rgba(255,255,255,.05)' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, fontWeight:800, color:'#fff' }}>
              AP
            </div>
            {open && <div style={{ flex:1, overflow:'hidden' }}>
              <div style={{ color:'#fff', fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Anointing Paschal</div>
              <div style={{ color:'rgba(255,255,255,.4)', fontSize:10 }}>Super Admin</div>
            </div>}
            {open && <button onClick={handleLogout} style={{ color:'rgba(255,255,255,.4)', padding:4 }}><LogOut size={15} /></button>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, marginLeft: open ? 240 : 68, transition:'margin-left .2s', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        {/* Topbar */}
        <header style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 24px', height:60, display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:50 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'var(--bg)', borderRadius:10, padding:'8px 14px', maxWidth:380 }}>
            <Search size={15} color="var(--text-light)" />
            <input placeholder="Search orders, customers..." style={{ border:'none', background:'transparent', outline:'none', fontSize:13, color:'var(--text)', width:'100%' }} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ position:'relative', width:38, height:38, borderRadius:10, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bell size={16} color="var(--text-mid)" />
              <span style={{ position:'absolute', top:8, right:8, width:7, height:7, borderRadius:4, background:'var(--red)', border:'1.5px solid #fff' }} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:10, background:'var(--bg)', cursor:'pointer' }} onClick={() => setUserMenu(!userMenu)}>
              <div style={{ width:28, height:28, borderRadius:8, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>AP</div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Admin</span>
              <ChevronDown size={14} color="var(--text-light)" />
            </div>
          </div>
        </header>

        <div style={{ flex:1, padding:24 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
