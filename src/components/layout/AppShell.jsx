import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, MapPin, Wallet, User, LayoutDashboard, Truck, Users, Settings, BarChart2, Bell, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_CONFIGS = {
  customer: [
    { to: '/customer',        icon: <Home size={22} />,          label: 'Home' },
    { to: '/customer/orders', icon: <Package size={22} />,       label: 'Orders' },
    { to: '/customer/track',  icon: <MapPin size={22} />,        label: 'Track' },
    { to: '/customer/wallet', icon: <Wallet size={22} />,        label: 'Wallet' },
    { to: '/customer/profile',icon: <User size={22} />,          label: 'Me' },
  ],
  rider: [
    { to: '/rider',             icon: <Home size={22} />,        label: 'Home' },
    { to: '/rider/deliveries',  icon: <Package size={22} />,     label: 'Orders' },
    { to: '/rider/map',         icon: <MapPin size={22} />,      label: 'Map' },
    { to: '/rider/earnings',    icon: <Wallet size={22} />,      label: 'Earnings' },
    { to: '/rider/profile',     icon: <User size={22} />,        label: 'Me' },
  ],
  merchant: [
    { to: '/merchant',          icon: <LayoutDashboard size={22} />, label: 'Home' },
    { to: '/merchant/orders',   icon: <Package size={22} />,     label: 'Orders' },
    { to: '/merchant/analytics',icon: <BarChart2 size={22} />,   label: 'Analytics' },
    { to: '/merchant/wallet',   icon: <Wallet size={22} />,      label: 'Wallet' },
    { to: '/merchant/profile',  icon: <Settings size={22} />,    label: 'Settings' },
  ],
  admin: [
    { to: '/admin',           icon: <LayoutDashboard size={22} />, label: 'Overview' },
    { to: '/admin/map',       icon: <MapPin size={22} />,          label: 'Live Map' },
    { to: '/admin/orders',    icon: <Package size={22} />,         label: 'Orders' },
    { to: '/admin/users',     icon: <Users size={22} />,           label: 'Users' },
    { to: '/admin/analytics', icon: <BarChart2 size={22} />,       label: 'Analytics' },
  ],
};

export function BottomNav() {
  const { user, unreadCount } = useApp();
  const location = useLocation();
  const role = user?.role;
  const nav = NAV_CONFIGS[role] || [];

  const isActive = (path) =>
    path === `/${role}` ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 shadow-lg z-40"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {nav.map(item => {
          const active = isActive(item.to);
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-navy-900' : 'text-slate-400'}`}>
              <div className="relative">
                {item.icon}
                {item.label === 'Home' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-navy-900' : 'text-slate-400'}`}>{item.label}</span>
              {active && <div className="w-1.5 h-1.5 rounded-full bg-navy-900" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title, back, backTo, right }) {
  const { user, markNotificationsRead, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 bg-navy-900 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {back ? (
          <button onClick={() => backTo ? navigate(backTo) : navigate(-1)}
            className="p-1.5 rounded-full text-white/80">
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <span className="text-white font-bold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
            </span>
          </div>
        )}
        <h1 className={`font-bold text-white ${back ? 'text-base' : 'text-sm'}`}>
          {title || user?.name?.split(' ')[0]}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        {right}
        <button onClick={() => { markNotificationsRead?.(); navigate('/notifications'); }}
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10">
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export function PageLayout({ children, title, back, backTo, right, noNav, noPad }) {
  return (
    <div className="min-h-dvh bg-slate-100 flex justify-center">
      <div className="app-container flex flex-col w-full">
        <TopBar title={title} back={back} backTo={backTo} right={right} />
        <main className={`flex-1 overflow-y-auto bg-slate-50 ${noPad ? '' : 'px-4 py-4'} ${noNav ? 'pb-4' : 'pb-24'}`}>
          {children}
        </main>
        {!noNav && <BottomNav />}
      </div>
    </div>
  );
}
