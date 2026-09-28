import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, Users, Bike, Wallet, BarChart3,
  Settings, LogOut, Menu, X, Bell, Search, Zap
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

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopExpanded, setDesktopExpanded] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }

  // Mobile: overlay sidebar + bottom nav
  if (isMobile) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' }}>
        {/* Mobile topbar */}
        <header style={{ background:'var(--navy)', padding:'0 16px', height:56, display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:100, flexShrink:0 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color:'rgba(255,255,255,.7)', padding:4, display:'flex' }}>
            <Menu size={22} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, background:'#2563EB', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={15} color="#fff" />
            </div>
            <span style={{ color:'#fff', fontWeight:800, fontSize:15 }}>Amplified Admin</span>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ position:'relative', width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bell size={16} color="rgba(255,255,255,.7)" />
              <span style={{ position:'absolute', top:8, right:8, width:6, height:6, borderRadius:3, background:'#EF4444' }} />
            </button>
          </div>
        </header>

        {/* Overlay sidebar */}
        {sidebarOpen && (
          <div style={{ position:'fixed', inset:0, zIndex:200 }}>
            {/* Backdrop */}
            <div onClick={() => setSidebarOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.5)' }} />
            {/* Drawer */}
            <aside style={{ position:'absolute', top:0, left:0, bottom:0, width:260, background:'var(--navy)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, background:'#2563EB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Zap size={17} color="#fff" />
                  </div>
                  <div>
                    <div style={{ color:'#fff', fontWeight:800, fontSize:14 }}>Amplified</div>
                    <div style={{ color:'rgba(255,255,255,.4)', fontSize:11 }}>Admin Portal</div>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ color:'rgba(255,255,255,.4)' }}><X size={18} /></button>
              </div>

              <nav style={{ flex:1, padding:'12px 8px' }}>
                {NAV.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} end={to==='/'} onClick={() => setSidebarOpen(false)} style={({ isActive }) => ({
                    display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, marginBottom:4,
                    color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
                    background: isActive ? 'rgba(37,99,235,.35)' : 'transparent',
                    textDecoration:'none', fontSize:14, fontWeight:600
                  })}>
                    <Icon size={18} style={{ flexShrink:0 }} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,.05)', marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>
                    AP
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:'#fff', fontSize:12, fontWeight:600 }}>Admin</div>
                    <div style={{ color:'rgba(255,255,255,.4)', fontSize:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{user?.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, color:'rgba(255,255,255,.55)', fontSize:13, fontWeight:600, width:'100%' }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Page content */}
        <main style={{ flex:1, padding:'16px 14px 80px', overflowX:'hidden' }}>
          {children}
        </main>

        {/* Bottom nav */}
        <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--navy)', display:'flex', zIndex:100, borderTop:'1px solid rgba(255,255,255,.08)', paddingBottom:'env(safe-area-inset-bottom)' }}>
          {NAV.slice(0,5).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              padding:'8px 4px', color: isActive ? '#fff' : 'rgba(255,255,255,.4)',
              textDecoration:'none', fontSize:9, fontWeight:600, gap:3
            })}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    )
  }

  // Desktop: collapsible sidebar
  const sideW = desktopExpanded ? 240 : 68
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <aside style={{
        width: sideW, transition: 'width .2s', background: 'var(--navy)',
        display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100,
        overflow:'hidden'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ width:36, height:36, background:'#2563EB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Zap size={18} color="#fff" />
          </div>
          {desktopExpanded && <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:15, lineHeight:1 }}>Amplified</div>
            <div style={{ color:'rgba(255,255,255,.4)', fontSize:11, marginTop:2 }}>Admin Portal</div>
          </div>}
        </div>

        <button onClick={() => setDesktopExpanded(!desktopExpanded)} style={{ display:'flex', alignItems:'center', justifyContent: desktopExpanded ? 'flex-end' : 'center', padding:'12px 16px', color:'rgba(255,255,255,.4)' }}>
          {desktopExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav style={{ flex:1, padding:'8px 8px' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:12, padding:'10px 10px', borderRadius:10, marginBottom:4,
              color: isActive ? '#fff' : 'rgba(255,255,255,.5)',
              background: isActive ? 'rgba(37,99,235,.35)' : 'transparent',
              textDecoration:'none', whiteSpace:'nowrap', overflow:'hidden', transition:'all .15s'
            })}>
              <Icon size={18} style={{ flexShrink:0 }} />
              {desktopExpanded && <span style={{ fontSize:13, fontWeight:600 }}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:10, background:'rgba(255,255,255,.05)' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, fontWeight:800, color:'#fff' }}>AP</div>
            {desktopExpanded && <div style={{ flex:1, overflow:'hidden' }}>
              <div style={{ color:'#fff', fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Admin</div>
              <div style={{ color:'rgba(255,255,255,.4)', fontSize:10 }}>Super Admin</div>
            </div>}
            {desktopExpanded && <button onClick={handleLogout} style={{ color:'rgba(255,255,255,.4)', padding:4 }}><LogOut size={15} /></button>}
          </div>
        </div>
      </aside>

      <main style={{ flex:1, marginLeft: sideW, transition:'margin-left .2s', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
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
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:10, background:'var(--bg)', cursor:'pointer' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>AP</div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Admin</span>
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
