import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Wallet, ArrowRight, Bike, Layers, Truck, Globe, Package, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LiveMap from '../../components/map/LiveMap';
import { formatCurrency } from '../../utils/mockData';

const SERVICES = [
  {
    id: 'standard',
    icon: <Bike size={22} strokeWidth={1.5} />,
    bg: 'bg-orange-50', color: 'text-orange-500',
    title: 'Standard Packages',
    desc: 'For lightweight items and packages',
    limit: 'Max 3 Locations',
  },
  {
    id: 'bulk',
    icon: <Layers size={22} strokeWidth={1.5} />,
    bg: 'bg-amber-50', color: 'text-amber-600',
    title: 'Bulk Packages',
    desc: 'Fixed Price 4+ Locations',
    limit: null,
  },
  {
    id: 'heavy',
    icon: <Truck size={22} strokeWidth={1.5} />,
    bg: 'bg-slate-100', color: 'text-slate-600',
    title: 'Heavy Items & Relocation',
    desc: 'For big loads, relocation & home moves',
    limit: null,
  },
  {
    id: 'interstate',
    icon: <Globe size={22} strokeWidth={1.5} />,
    bg: 'bg-green-50', color: 'text-green-600',
    title: 'Inter-State',
    desc: 'Move packages nationwide, stress free.',
    limit: null,
  },
];

export default function CustomerDashboard() {
  const { user, wallet } = useApp();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CO';

  // Header height: ~56px. Wallet card: ~52px. Gap: 8px.
  // Map fills from header bottom to sheet top
  const HEADER_H  = 56;
  const SHEET_H   = expanded ? '72%' : '46%';

  return (
    <div className="relative overflow-hidden bg-navy-900" style={{ height: '100dvh' }}>

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-navy-900 px-4 flex items-center justify-between" style={{ height: HEADER_H }}>
        {/* Left: avatar + greeting */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center border border-white/20 flex-shrink-0">
            <span className="text-white font-bold text-xs">{initials}</span>
          </div>
          <div>
            <p className="text-white/50 text-[10px] leading-none mb-0.5">Good Morning</p>
            <p className="text-white font-bold text-sm leading-none">{user?.name || 'Guest User'}</p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <button onClick={() => navigate('/notifications')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10">
                <Bell size={18} />
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10">
                <Menu size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                className="text-white/80 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10">
                Login
              </button>
              <button onClick={() => navigate('/signup')}
                className="bg-white text-navy-900 text-xs font-bold px-3 py-1.5 rounded-lg">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MAP ── fills between header and sheet ── */}
      <div className="absolute left-0 right-0 z-10"
           style={{ top: HEADER_H, bottom: SHEET_H }}>
        <LiveMap height="100%" showRoute={false} />
      </div>

      {/* ── WALLET CARD (floating over map) ── */}
      <div className="absolute left-3 right-3 z-20 bg-white rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-lg"
           style={{ top: HEADER_H + 10 }}>
        <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Wallet size={15} className="text-white" />
        </div>
        <p className="flex-1 text-xs text-slate-500 leading-snug">Your one-stop solution for hassle-free orders.</p>
        <button
          onClick={() => navigate(user ? '/customer/wallet' : '/login')}
          className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0">
          {user ? formatCurrency(wallet?.balance || 0) : 'Activate'}
        </button>
      </div>

      {/* ── BOTTOM SHEET ── */}
      <div className="absolute left-0 right-0 bottom-0 z-20 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 flex flex-col"
           style={{ height: SHEET_H }}>

        {/* Handle */}
        <button onClick={() => setExpanded(!expanded)}
          className="flex flex-col items-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-8 h-1 bg-slate-200 rounded-full" />
          {expanded
            ? <ChevronDown size={14} className="text-slate-400 mt-0.5" />
            : <ChevronUp   size={14} className="text-slate-400 mt-0.5" />}
        </button>

        {/* Service items */}
        <div className="flex-1 overflow-y-auto">
          {SERVICES.map((s, i) => (
            <button key={s.id} onClick={() => navigate(`/customer/orders/create?type=${s.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-slate-50 ${i < SERVICES.length - 1 ? 'border-b border-slate-100' : ''}`}>
              {/* Icon */}
              <div className={`w-11 h-11 ${s.bg} ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy-900 text-sm leading-tight">{s.title}</p>
                <p className="text-xs text-slate-400 leading-snug mt-0.5 truncate">{s.desc}</p>
                {s.limit && <p className="text-xs text-orange-500 font-semibold mt-0.5">{s.limit}</p>}
              </div>
              <ArrowRight size={16} className="text-slate-300 flex-shrink-0" />
            </button>
          ))}

          {/* Guest login prompt */}
          {!user && (
            <div className="mx-4 my-3 bg-navy-900 rounded-2xl p-3 flex items-center gap-3">
              <Package size={18} className="text-white flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-xs font-semibold">Login to track & manage orders</p>
                <p className="text-white/50 text-xs">Create account in 30 seconds</p>
              </div>
              <button onClick={() => navigate('/login')}
                className="bg-white text-navy-900 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0">
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
