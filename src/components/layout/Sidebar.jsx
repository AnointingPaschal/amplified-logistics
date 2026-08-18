import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, Home, Package, MapPin, Wallet, User, Gift, LogOut, Bell,
  Shield, BarChart2, Users, Settings, Headphones, Bookmark,
  Star, ChevronRight, Bike, Store, LayoutDashboard, FileText, Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

/* ── Role-specific nav sections ─────────────────────── */
const MENUS = {
  customer: [
    { section:'Deliveries', items:[
      { icon:<Home size={17}/>,     label:'Home',         path:'/customer' },
      { icon:<Package size={17}/>,  label:'My Orders',    path:'/customer/orders' },
      { icon:<MapPin size={17}/>,   label:'Track Order',  path:'/customer/track' },
    ]},
    { section:'Account', items:[
      { icon:<Wallet size={17}/>,   label:'Wallet',       path:'/customer/wallet' },
      { icon:<Bookmark size={17}/>, label:'Address Book', path:'/customer/addresses' },
      { icon:<Bell size={17}/>,     label:'Notifications',path:'/notifications' },
    ]},
    { section:'Rewards', items:[
      { icon:<Gift size={17}/>,     label:'Refer & Earn', path:'/customer/referral', badge:'₦500' },
      { icon:<Star size={17}/>,     label:'Promo Codes',  path:'/customer/promo' },
      { icon:<Headphones size={17}/>,label:'Help Center', path:'/customer/support' },
    ]},
  ],
  rider: [
    { section:'Work', items:[
      { icon:<Home size={17}/>,     label:'Dashboard',    path:'/rider' },
      { icon:<Package size={17}/>,  label:'Deliveries',   path:'/rider/deliveries' },
      { icon:<MapPin size={17}/>,   label:'Map',          path:'/rider/map' },
      { icon:<Wallet size={17}/>,   label:'Earnings',     path:'/rider/earnings' },
      { icon:<User size={17}/>,     label:'My Profile',   path:'/rider/profile' },
    ]},
    { section:'Support', items:[
      { icon:<Bell size={17}/>,     label:'Notifications',path:'/notifications' },
      { icon:<Headphones size={17}/>,label:'Help',        path:'/customer/support' },
    ]},
  ],
  merchant: [
    { section:'Business', items:[
      { icon:<LayoutDashboard size={17}/>, label:'Dashboard', path:'/merchant' },
      { icon:<Package size={17}/>,   label:'Orders',      path:'/merchant/orders' },
      { icon:<BarChart2 size={17}/>, label:'Analytics',   path:'/merchant/analytics' },
      { icon:<Wallet size={17}/>,    label:'Payments',    path:'/merchant/wallet' },
      { icon:<Store size={17}/>,     label:'Profile',     path:'/merchant/profile' },
    ]},
  ],
  admin: [
    { section:'Admin', items:[
      { icon:<LayoutDashboard size={17}/>, label:'Overview',  path:'/admin' },
      { icon:<MapPin size={17}/>,    label:'Live Map',     path:'/admin/map' },
      { icon:<Package size={17}/>,   label:'All Orders',   path:'/admin/orders' },
      { icon:<Users size={17}/>,     label:'Users',        path:'/admin/users' },
      { icon:<BarChart2 size={17}/>, label:'Analytics',    path:'/admin/analytics' },
    ]},
  ],
}

const GUEST_MENU = [
  { section:'Get Started', items:[
    { icon:<Home size={17}/>,      label:'Home',           path:'/' },
    { icon:<Package size={17}/>,   label:'Send a Package', path:'/customer/orders/create?type=standard' },
    { icon:<MapPin size={17}/>,    label:'Track an Order', path:'/customer/track' },
    { icon:<Headphones size={17}/>,label:'Help Center',    path:'/customer/support' },
  ]},
]

/* ── Main Sidebar (right drawer) ────────────────────── */
export default function Sidebar({ open, onClose }) {
  const { user, logout, showToast } = useApp()
  const navigate = useNavigate()
  const role = user?.user_metadata?.role || user?.role || 'customer'
  const sections = user ? (MENUS[role] || MENUS.customer) : GUEST_MENU
  const initials = (user?.user_metadata?.name || user?.email || 'G')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (path) => {
    if (!path) { showToast('Coming soon!', 'info'); return }
    onClose()
    setTimeout(() => navigate(path), 200)
  }

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate('/')
    showToast('Logged out', 'info')
  }

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── Drawer (right side) ── */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '82%', maxWidth: 320,
          zIndex: 999,
          background: '#fff',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.32,0,0.67,0)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ background: '#0A1628', padding: '40px 20px 20px', flexShrink: 0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 16 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', fontWeight:900, fontSize:16 }}>{initials}</span>
              </div>
              {user ? (
                <div>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:14, lineHeight:1.2 }}>
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginTop:2 }}>{user.email}</p>
                  <span style={{ background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.7)', fontSize:10, padding:'2px 8px', borderRadius:20, display:'inline-block', marginTop:4, textTransform:'capitalize' }}>{role}</span>
                </div>
              ) : (
                <div>
                  <p style={{ color:'#fff', fontWeight:900, fontSize:16 }}>amplified</p>
                  <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Sign in to manage orders</p>
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
              <X size={16} color="rgba(255,255,255,0.8)"/>
            </button>
          </div>

          {!user && (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => go('/login')}
                style={{ flex:1, background:'rgba(255,255,255,0.12)', color:'#fff', fontWeight:700, fontSize:12, padding:'10px 0', borderRadius:12, border:'none', cursor:'pointer' }}>
                Login
              </button>
              <button onClick={() => go('/signup')}
                style={{ flex:1, background:'#fff', color:'#0A1628', fontWeight:800, fontSize:12, padding:'10px 0', borderRadius:12, border:'none', cursor:'pointer' }}>
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {sections.map(sec => (
            <div key={sec.section}>
              <p style={{ fontSize:10, fontWeight:800, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em', padding:'12px 20px 6px' }}>
                {sec.section}
              </p>
              {sec.items.map(item => (
                <button key={item.label} onClick={() => go(item.path)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 20px', background:'none', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background='none'}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#4B5563' }}>
                    {item.icon}
                  </div>
                  <span style={{ flex:1, fontSize:14, fontWeight:600, color:'#111827' }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background:'#DCFCE7', color:'#166534', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>{item.badge}</span>
                  )}
                  <ChevronRight size={14} color="#D1D5DB"/>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop:'1px solid #F3F4F6', padding:'8px 12px 24px', flexShrink:0 }}>
          {user && (
            <button onClick={handleLogout}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px', borderRadius:12, background:'none', border:'none', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background='#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background='none'}
            >
              <div style={{ width:36, height:36, borderRadius:10, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <LogOut size={16} color="#EF4444"/>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:'#EF4444' }}>Log Out</span>
            </button>
          )}
          <p style={{ textAlign:'center', fontSize:10, color:'#D1D5DB', marginTop:8 }}>Amplified Logistics v1.0</p>
        </div>
      </div>
    </>
  )
}
