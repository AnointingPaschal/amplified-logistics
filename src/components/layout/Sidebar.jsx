import { useNavigate } from 'react-router-dom'
import {
  X, Home, Package, MapPin, Wallet, User, Gift, HelpCircle,
  LogOut, Bell, Shield, Settings, BarChart2, Truck, Users,
  ChevronRight, Bike, Store, LayoutDashboard, FileText,
  Headphones, Bookmark, Star, Share2, ToggleLeft
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ROLE_MENUS = {
  customer: [
    { section: 'Deliveries', items: [
      { icon: <Home size={18}/>,     label: 'Home',          path: '/customer' },
      { icon: <Package size={18}/>,  label: 'My Orders',     path: '/customer/orders' },
      { icon: <MapPin size={18}/>,   label: 'Track Order',   path: '/customer/track' },
    ]},
    { section: 'Account', items: [
      { icon: <Wallet size={18}/>,   label: 'Wallet',        path: '/customer/wallet' },
      { icon: <Bookmark size={18}/>, label: 'Address Book',  path: '/customer/addresses' },
      { icon: <Bell size={18}/>,     label: 'Notifications', path: '/notifications' },
      { icon: <Shield size={18}/>,   label: 'Privacy',       path: null, soon: true },
    ]},
    { section: 'Rewards & More', items: [
      { icon: <Gift size={18}/>,     label: 'Referral Program', path: '/customer/referral', badge: '₦500' },
      { icon: <Star size={18}/>,     label: 'Promo Codes',      path: '/customer/promo' },
      { icon: <Headphones size={18}/>,label:'Help & Support',   path: '/customer/support' },
    ]},
  ],
  rider: [
    { section: 'Work', items: [
      { icon: <Home size={18}/>,     label: 'Dashboard',     path: '/rider' },
      { icon: <Package size={18}/>,  label: 'Deliveries',    path: '/rider/deliveries' },
      { icon: <MapPin size={18}/>,   label: 'Map',           path: '/rider/map' },
      { icon: <Wallet size={18}/>,   label: 'Earnings',      path: '/rider/earnings' },
    ]},
    { section: 'Account', items: [
      { icon: <User size={18}/>,     label: 'My Profile',    path: '/rider/profile' },
      { icon: <Bell size={18}/>,     label: 'Notifications', path: '/notifications' },
      { icon: <Headphones size={18}/>,label:'Support',        path: '/customer/support' },
    ]},
  ],
  merchant: [
    { section: 'Business', items: [
      { icon: <LayoutDashboard size={18}/>, label:'Dashboard', path:'/merchant' },
      { icon: <Package size={18}/>,  label: 'Orders',        path: '/merchant/orders' },
      { icon: <BarChart2 size={18}/>,label: 'Analytics',     path: '/merchant/analytics' },
      { icon: <Wallet size={18}/>,   label: 'Payments',      path: '/merchant/wallet' },
    ]},
    { section: 'Account', items: [
      { icon: <Store size={18}/>,    label: 'Business Profile', path: '/merchant/profile' },
      { icon: <Bell size={18}/>,     label: 'Notifications',    path: '/notifications' },
      { icon: <Headphones size={18}/>,label:'Support',           path: '/customer/support' },
    ]},
  ],
  admin: [
    { section: 'Operations', items: [
      { icon: <LayoutDashboard size={18}/>, label:'Overview',    path:'/admin' },
      { icon: <MapPin size={18}/>,   label: 'Live Map',      path: '/admin/map' },
      { icon: <Package size={18}/>,  label: 'All Orders',    path: '/admin/orders' },
      { icon: <Users size={18}/>,    label: 'Users',         path: '/admin/users' },
      { icon: <BarChart2 size={18}/>,label: 'Analytics',     path: '/admin/analytics' },
    ]},
  ],
}

const GUEST_MENU = [
  { section: 'Get Started', items: [
    { icon: <Home size={18}/>,     label: 'Home',            path: '/' },
    { icon: <Package size={18}/>,  label: 'Send a Package',  path: '/customer/orders/create?type=standard' },
    { icon: <Headphones size={18}/>, label: 'Help Center',   path: '/customer/support' },
  ]},
]

export default function Sidebar({ open, onClose }) {
  const { user, logout, showToast } = useApp()
  const navigate = useNavigate()

  const role = user?.user_metadata?.role || user?.role || 'customer'
  const menuSections = user ? (ROLE_MENUS[role] || ROLE_MENUS.customer) : GUEST_MENU

  const initials = (user?.user_metadata?.name || user?.email || 'G')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const go = (path) => {
    if (!path) { showToast('Coming soon!', 'info'); return }
    onClose()
    setTimeout(() => navigate(path), 180)
  }

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate('/')
    showToast('Logged out', 'info')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[500] flex justify-end max-w-[430px] mx-auto left-1/2 -translate-x-1/2" style={{ maxWidth: 430 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'fade-in .2s ease' }}
        onClick={onClose}
      />

      {/* Drawer — slides from right */}
      <div
        className="relative w-[85%] max-w-[340px] bg-white h-full flex flex-col shadow-2xl overflow-hidden"
        style={{ animation: 'slideInRight .25s cubic-bezier(.32,0,.67,0)' }}
      >
        {/* Header */}
        <div className="bg-gray-900 px-5 pt-10 pb-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            {user ? (
              <button onClick={() => go(`/${role}/profile`)} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-white font-black text-base">{initials}</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm leading-tight">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5 truncate max-w-[160px]">{user.email}</p>
                  <span className="text-[10px] bg-white/15 text-white/80 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                    {role}
                  </span>
                </div>
              </button>
            ) : (
              <div>
                <p className="text-white font-black text-lg">Welcome!</p>
                <p className="text-white/50 text-xs mt-0.5">Sign in to manage orders</p>
              </div>
            )}
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mt-1">
              <X size={16} className="text-white/80" />
            </button>
          </div>

          {/* Auth CTA for guests */}
          {!user && (
            <div className="flex gap-2 mt-2">
              <button onClick={() => go('/login')}
                className="flex-1 bg-white/15 text-white font-bold py-2.5 rounded-xl text-xs text-center">
                Login
              </button>
              <button onClick={() => go('/signup')}
                className="flex-1 bg-white text-gray-900 font-bold py-2.5 rounded-xl text-xs text-center">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-3">
          {menuSections.map(sec => (
            <div key={sec.section} className="mb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-5 py-2">
                {sec.section}
              </p>
              {sec.items.map(item => (
                <button
                  key={item.label}
                  onClick={() => item.soon ? showToast('Coming soon!', 'info') : go(item.path)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-gray-800">{item.label}</span>
                  {item.badge && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.soon && (
                    <span className="text-[10px] text-gray-400 font-semibold">Soon</span>
                  )}
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0 space-y-1">
          {user && (
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 transition-colors text-left">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-red-500" />
              </div>
              <span className="text-sm font-bold text-red-600">Log Out</span>
            </button>
          )}
          <p className="text-center text-[10px] text-gray-300 pt-1">Amplified Logistics v1.0</p>
        </div>
      </div>
    </div>
  )
}
