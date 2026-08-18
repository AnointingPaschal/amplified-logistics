import { Link, useLocation } from 'react-router-dom';
import { Home, Package, MapPin, Wallet, User, LayoutDashboard, Truck, Users, Settings, BarChart2, Bell, ChevronLeft, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui';

const NAV_CONFIGS = {
  customer: [
    { to: '/customer', icon: <Home size={22} />, label: 'Home' },
    { to: '/customer/orders', icon: <Package size={22} />, label: 'Orders' },
    { to: '/customer/track', icon: <MapPin size={22} />, label: 'Track' },
    { to: '/customer/wallet', icon: <Wallet size={22} />, label: 'Wallet' },
    { to: '/customer/profile', icon: <User size={22} />, label: 'Profile' },
  ],
  rider: [
    { to: '/rider', icon: <Home size={22} />, label: 'Home' },
    { to: '/rider/deliveries', icon: <Package size={22} />, label: 'Deliveries' },
    { to: '/rider/map', icon: <MapPin size={22} />, label: 'Map' },
    { to: '/rider/earnings', icon: <Wallet size={22} />, label: 'Earnings' },
    { to: '/rider/profile', icon: <User size={22} />, label: 'Profile' },
  ],
  merchant: [
    { to: '/merchant', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { to: '/merchant/orders', icon: <Package size={22} />, label: 'Orders' },
    { to: '/merchant/analytics', icon: <BarChart2 size={22} />, label: 'Analytics' },
    { to: '/merchant/wallet', icon: <Wallet size={22} />, label: 'Payments' },
    { to: '/merchant/profile', icon: <Settings size={22} />, label: 'Settings' },
  ],
  admin: [
    { to: '/admin', icon: <LayoutDashboard size={22} />, label: 'Overview' },
    { to: '/admin/map', icon: <MapPin size={22} />, label: 'Live Map' },
    { to: '/admin/orders', icon: <Package size={22} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={22} />, label: 'Users' },
    { to: '/admin/analytics', icon: <BarChart2 size={22} />, label: 'Analytics' },
  ],
};

export function BottomNav() {
  const { user, unreadCount } = useApp();
  const location = useLocation();
  const role = user?.role;
  const nav = NAV_CONFIGS[role] || [];

  const isActive = (path) => path === `/${role}` ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 shadow-2xl z-40 bottom-nav">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {nav.map(item => {
          const active = isActive(item.to);
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-orange-500' : 'text-slate-400'}`}>
              <div className="relative">
                {item.icon}
                {item.label === 'Home' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-orange-500' : 'text-slate-400'}`}>{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-orange-500" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title, back, backTo, right, transparent }) {
  const { user, notifications, markNotificationsRead, unreadCount } = useApp();
  const location = useLocation();

  return (
    <div className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 ${transparent ? 'bg-transparent' : 'bg-white border-b border-slate-100'}`}>
      <div className="flex items-center gap-3">
        {back ? (
          <Link to={backTo || -1} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={20} />
          </Link>
        ) : (
          <Avatar name={user?.name} size={34} />
        )}
        <div>
          {!back && <p className="text-xs text-slate-500">Good morning</p>}
          <h1 className={`font-bold ${back ? 'text-slate-800 text-base' : 'text-slate-900 text-sm'}`}>{title || user?.name?.split(' ')[0]}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {right}
        <Link to="/notifications" onClick={markNotificationsRead} className="relative p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>
          )}
        </Link>
      </div>
    </div>
  );
}

export function PageLayout({ children, title, back, backTo, right, noNav, noPad }) {
  return (
    <div className="min-h-dvh bg-slate-200 flex justify-center">
      <div className="app-container flex flex-col w-full">
        <TopBar title={title} back={back} backTo={backTo} right={right} />
        <main className={`flex-1 overflow-y-auto bg-slate-50 ${noPad ? '' : 'px-4 py-3'} ${noNav ? 'pb-4' : 'pb-24'}`}>
          {children}
        </main>
        {!noNav && <BottomNav />}
      </div>
    </div>
  );
}
