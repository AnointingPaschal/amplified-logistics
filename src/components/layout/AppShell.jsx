import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Package, MapPin, Wallet, User, LayoutDashboard, Truck, Users, Settings, BarChart2, Bell, ChevronLeft, Bike } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const NAV_CONFIGS = {
  customer: [
    { to:'/customer',          icon:<Home size={22}/>,        label:'Home' },
    { to:'/customer/orders',   icon:<Package size={22}/>,     label:'Orders' },
    { to:'/customer/track',    icon:<MapPin size={22}/>,      label:'Track' },
    { to:'/customer/wallet',   icon:<Wallet size={22}/>,      label:'Wallet' },
    { to:'/customer/profile',  icon:<User size={22}/>,        label:'Profile' },
  ],
  rider: [
    { to:'/rider',             icon:<Home size={22}/>,        label:'Home' },
    { to:'/rider/deliveries',  icon:<Package size={22}/>,     label:'Deliveries' },
    { to:'/rider/map',         icon:<MapPin size={22}/>,      label:'Map' },
    { to:'/rider/earnings',    icon:<Wallet size={22}/>,      label:'Earnings' },
    { to:'/rider/profile',     icon:<User size={22}/>,        label:'Profile' },
  ],
  merchant: [
    { to:'/merchant',          icon:<LayoutDashboard size={22}/>, label:'Dashboard' },
    { to:'/merchant/orders',   icon:<Package size={22}/>,     label:'Orders' },
    { to:'/merchant/analytics',icon:<BarChart2 size={22}/>,   label:'Analytics' },
    { to:'/merchant/wallet',   icon:<Wallet size={22}/>,      label:'Wallet' },
    { to:'/merchant/profile',  icon:<Settings size={22}/>,    label:'Settings' },
  ],
  admin: [
    { to:'/admin',             icon:<LayoutDashboard size={22}/>, label:'Overview' },
    { to:'/admin/map',         icon:<MapPin size={22}/>,          label:'Live Map' },
    { to:'/admin/orders',      icon:<Package size={22}/>,         label:'Orders' },
    { to:'/admin/users',       icon:<Users size={22}/>,           label:'Users' },
    { to:'/admin/analytics',   icon:<BarChart2 size={22}/>,       label:'Analytics' },
  ],
}

export function BottomNav() {
  const { user, unreadCount } = useApp()
  const location = useLocation()
  const role = user?.user_metadata?.role || user?.role || 'customer'
  const nav = NAV_CONFIGS[role] || NAV_CONFIGS.customer

  const isActive = (path) => path === `/${role}` ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
         style={{ paddingBottom:'env(safe-area-inset-bottom,8px)', background:'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderTop:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 -4px 24px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {nav.map(item => {
          const active = isActive(item.to)
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${active?'text-gray-900':'text-gray-400'}`}>
              <div className={`relative p-1.5 rounded-xl transition-all ${active?'bg-gray-900/8':''}`}>
                {item.icon}
                {item.label==='Orders' && unreadCount>0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {unreadCount>9?'9+':unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active?'text-gray-900':'text-gray-400'}`}>{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-gray-900"/>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function TopBar({ title, back, backTo, right, transparent }) {
  const { user, unreadCount, markAllRead, openSidebar } = useApp()
  const navigate = useNavigate()

  const bg = transparent
    ? 'bg-transparent'
    : 'bg-white/96 border-b border-gray-100 shadow-sm'

  return (
    <>
    <div className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 ${bg}`}
      style={{ backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-2.5">
        {back ? (
          <button onClick={()=>backTo?navigate(backTo):navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={20} className="text-gray-700"/>
          </button>
        ) : (
          <button onClick={() => openSidebar()} className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white font-black text-xs">
              {(user?.user_metadata?.name||user?.email||'G').charAt(0).toUpperCase()}
            </span>
          </button>
        )}
        <h1 className={`font-bold ${back?'text-gray-900 text-base':'text-sm text-gray-800'}`}>
          {title||(user?.user_metadata?.name?.split(' ')[0]||'Home')}
        </h1>
      </div>
      <div className="flex items-center gap-1.5">
        {right}
        {!back && (
          <>
            <button onClick={()=>{ markAllRead?.(); navigate('/notifications') }}
              className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bell size={16} className="text-gray-700"/>
              {unreadCount>0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-black">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => openSidebar()}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
    <Sidebar open={sidebarOpen} onClose={() => () => {}}/>
    </>
  )
}

export function PageLayout({ children, title, back, backTo, right, noNav, noPad }) {
  return (
    <div className="min-h-dvh bg-gray-50 flex justify-center">
      <div className="app-root flex flex-col w-full">
        <TopBar title={title} back={back} backTo={backTo} right={right}/>
        <main className={`flex-1 overflow-y-auto ${noPad?'':'px-4 py-4'} ${noNav?'pb-4':'pb-24'}`}>
          {children}
        </main>
        {!noNav && <BottomNav/>}
      </div>
    </div>
  )
}
