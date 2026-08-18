import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

// ── All menu data (no JSX at module level) ──────────────
function getMenus(role, navigate, go, handleLogout) {
  const customer = [
    { group: 'Deliveries', items: [
      { label: 'Home',          path: '/customer' },
      { label: 'My Orders',     path: '/customer/orders' },
      { label: 'Track Order',   path: '/customer/track' },
    ]},
    { group: 'Account', items: [
      { label: 'Wallet',        path: '/customer/wallet' },
      { label: 'Address Book',  path: '/customer/addresses' },
      { label: 'Notifications', path: '/notifications' },
    ]},
    { group: 'Rewards', items: [
      { label: 'Refer & Earn',  path: '/customer/referral', badge: '₦500' },
      { label: 'Promo Codes',   path: '/customer/promo' },
      { label: 'Help Center',   path: '/customer/support' },
    ]},
  ]
  const rider = [
    { group: 'Work', items: [
      { label: 'Dashboard',     path: '/rider' },
      { label: 'Deliveries',    path: '/rider/deliveries' },
      { label: 'Map',           path: '/rider/map' },
      { label: 'Earnings',      path: '/rider/earnings' },
      { label: 'Profile',       path: '/rider/profile' },
    ]},
  ]
  const merchant = [
    { group: 'Business', items: [
      { label: 'Dashboard',     path: '/merchant' },
      { label: 'Orders',        path: '/merchant/orders' },
      { label: 'Analytics',     path: '/merchant/analytics' },
      { label: 'Wallet',        path: '/merchant/wallet' },
    ]},
  ]
  const admin = [
    { group: 'Admin', items: [
      { label: 'Overview',      path: '/admin' },
      { label: 'Live Map',      path: '/admin/map' },
      { label: 'Orders',        path: '/admin/orders' },
      { label: 'Users',         path: '/admin/users' },
      { label: 'Analytics',     path: '/admin/analytics' },
    ]},
  ]
  const guest = [
    { group: 'Get Started', items: [
      { label: 'Home',                path: '/' },
      { label: 'Send a Package',      path: '/customer/orders/create?type=standard' },
      { label: 'Track an Order',      path: '/customer/track' },
      { label: 'Help Center',         path: '/customer/support' },
    ]},
  ]
  const map = { customer, rider, merchant, admin }
  return map[role] || guest
}

// ── Sidebar component ────────────────────────────────────
const AppSidebar = function({ open, onClose }) {
  const { user, logout, showToast } = useApp()
  const navigate = useNavigate()

  const role = (user && (user.user_metadata?.role || user.role)) || 'customer'
  const name = (user && (user.user_metadata?.name || user.email?.split('@')[0])) || 'Guest'
  const email = (user && user.email) || ''
  const initials = name.split(' ').map(function(n) { return n[0] }).join('').slice(0, 2).toUpperCase()

  useEffect(function() {
    document.body.style.overflow = open ? 'hidden' : ''
    return function() { document.body.style.overflow = '' }
  }, [open])

  function go(path) {
    onClose()
    setTimeout(function() { navigate(path) }, 180)
  }

  function handleLogout() {
    onClose()
    logout().then(function() {
      navigate('/')
      showToast('Logged out', 'info')
    }).catch(function() {
      navigate('/')
    })
  }

  const sections = getMenus(role)

  // Backdrop
  const backdropStyle = {
    position: 'fixed', inset: 0, zIndex: 9998,
    background: 'rgba(0,0,0,0.55)',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: 'opacity 0.25s ease',
  }

  // Drawer
  const drawerStyle = {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: '82%', maxWidth: 320, zIndex: 9999,
    background: '#fff',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.28s cubic-bezier(0.32,0,0.67,0)',
    display: 'flex', flexDirection: 'column',
    overflowY: 'auto',
  }

  const headerStyle = {
    background: '#0A1628',
    padding: '40px 20px 20px',
    flexShrink: 0,
  }

  return (
    <div>
      <div style={backdropStyle} onClick={onClose} />
      <div style={drawerStyle}>

        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{initials}</span>
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>{name}</p>
                {email && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '2px 0 0' }}>{email}</p>}
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: 10, padding: '2px 8px', borderRadius: 20, marginTop: 4, textTransform: 'capitalize' }}>{user ? role : 'guest'}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: '#fff', fontSize: 18, lineHeight: 1 }}>
              ×
            </button>
          </div>

          {!user && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={function() { go('/login') }} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Login</button>
              <button onClick={function() { go('/signup') }} style={{ flex: 1, background: '#fff', color: '#0A1628', fontWeight: 800, fontSize: 12, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Sign Up</button>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {sections.map(function(sec) {
            return (
              <div key={sec.group}>
                <p style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 20px 6px', margin: 0 }}>{sec.group}</p>
                {sec.items.map(function(item) {
                  return (
                    <button key={item.label} onClick={function() { go(item.path) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</span>
                      {item.badge && <span style={{ background: '#DCFCE7', color: '#166534', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>{item.badge}</span>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '12px 12px 24px', flexShrink: 0 }}>
          {user && (
            <button onClick={handleLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>↩</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Log Out</span>
            </button>
          )}
          <p style={{ textAlign: 'center', fontSize: 10, color: '#D1D5DB', marginTop: 8 }}>Amplified Logistics v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default AppSidebar
