import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Wallet, ArrowRight, Bike, Layers, Truck, Globe, Package, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LiveMap from '../../components/map/LiveMap';
import { formatCurrency } from '../../utils/mockData';

const SERVICE_TYPES = [
  {
    id: 'standard',
    icon: <Bike size={28} strokeWidth={1.5} />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-navy-900',
    title: 'Standard Packages',
    desc: 'For lightweight items and packages',
    limit: 'Max 3 Locations',
  },
  {
    id: 'bulk',
    icon: <Layers size={28} strokeWidth={1.5} />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    title: 'Bulk Packages',
    desc: 'Fixed Price 4+ Locations',
    limit: null,
  },
  {
    id: 'heavy',
    icon: <Truck size={28} strokeWidth={1.5} />,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    title: 'Heavy Items & Relocation',
    desc: 'For big loads, relocation, home moves, or carrying heavy stuff',
    limit: null,
  },
  {
    id: 'interstate',
    icon: <Globe size={28} strokeWidth={1.5} />,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-700',
    title: 'Inter-State',
    desc: 'Move packages nationwide, stress free.',
    limit: null,
  },
];

export default function CustomerDashboard() {
  const { user, wallet } = useApp();
  const navigate = useNavigate();
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const handleServiceSelect = (type) => {
    navigate(`/customer/orders/create?type=${type.id}`);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CO';

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="relative h-dvh overflow-hidden bg-navy-900">

      {/* ── TOP BAR ─────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-navy-900 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          {/* Avatar + greeting */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-600 flex items-center justify-center border-2 border-white/20">
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>
            <div>
              <p className="text-white/50 text-xs">Good Morning</p>
              <p className="text-white font-bold text-sm leading-tight">{user?.name || 'Guest User'}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/notifications')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10"
                >
                  <Bell size={20} />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10">
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-white/80 text-sm font-semibold px-3 py-1.5 rounded-xl hover:bg-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-white text-navy-900 text-sm font-bold px-3 py-1.5 rounded-xl"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAP ─────────────────────────────────── */}
      <div className="absolute inset-0 top-[80px]" style={{ bottom: sheetExpanded ? '70%' : '44%' }}>
        <LiveMap height="100%" showRoute={false} />
      </div>

      {/* ── WALLET PROMO CARD ───────────────────── */}
      <div className="absolute top-[92px] left-4 right-4 z-20 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
          <Wallet size={18} className="text-white" />
        </div>
        <p className="flex-1 text-xs text-slate-600 leading-snug">
          Your one-stop solution for hassle-free orders.
        </p>
        <button
          onClick={() => navigate(user ? '/customer/wallet' : '/login')}
          className="bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex-shrink-0"
        >
          {user ? `${formatCurrency(wallet?.balance || 0)}` : 'Activate'}
        </button>
      </div>

      {/* ── BOTTOM SHEET ────────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 bg-white rounded-t-3xl shadow-2xl transition-all duration-300"
        style={{ height: sheetExpanded ? '72%' : '46%' }}
      >
        {/* Drag handle */}
        <button
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full flex flex-col items-center pt-3 pb-1"
        >
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
          <ChevronUp
            size={16}
            className={`text-slate-400 mt-1 transition-transform ${sheetExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Service list */}
        <div className="overflow-y-auto h-full pb-6">
          {SERVICE_TYPES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleServiceSelect(s)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left active:bg-slate-50 transition-colors ${
                i < SERVICE_TYPES.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              {/* Icon box */}
              <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 ${s.iconColor}`}>
                {s.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy-900 text-sm">{s.title}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{s.desc}</p>
                {s.limit && (
                  <p className="text-xs text-orange-500 font-semibold mt-1">{s.limit}</p>
                )}
              </div>
              {/* Arrow */}
              <ArrowRight size={18} className="text-slate-400 flex-shrink-0" />
            </button>
          ))}

          {/* Login prompt for guests */}
          {!user && (
            <div className="mx-5 mt-4 bg-navy-900 rounded-2xl p-4 flex items-center gap-3">
              <Package size={20} className="text-white flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-xs font-semibold">Login to track & manage orders</p>
                <p className="text-white/60 text-xs mt-0.5">Create account in 30 seconds</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-navy-900 text-xs font-bold px-3 py-2 rounded-lg flex-shrink-0"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
