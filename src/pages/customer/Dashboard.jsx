import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Menu, Wallet, ArrowRight, Bike, Layers, Truck, Globe,
  Package, Search, MapPin, Clock, ChevronUp, ChevronDown, Navigation
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Sidebar from '../../components/layout/Sidebar'
import LiveMap from '../../components/map/LiveMap'
import { formatCurrency } from '../../utils/mockData'

const SERVICES = [
  {
    id: 'standard',
    icon: <Bike size={20} strokeWidth={1.6} />,
    iconBg: 'bg-orange-500',
    title: 'Standard Packages',
    desc: 'Lightweight items & packages',
    eta: '20–40 min',
    price: '₦2,500',
    limit: 'Max 3 Locations',
    limitColor: 'text-orange-500',
  },
  {
    id: 'bulk',
    icon: <Layers size={20} strokeWidth={1.6} />,
    iconBg: 'bg-amber-500',
    title: 'Bulk Packages',
    desc: 'Fixed price, 4+ drop locations',
    eta: '1–3 hrs',
    price: '₦8,500',
    limit: null,
  },
  {
    id: 'heavy',
    icon: <Truck size={20} strokeWidth={1.6} />,
    iconBg: 'bg-slate-700',
    title: 'Heavy & Relocation',
    desc: 'Furniture, big loads & home moves',
    eta: 'Same day',
    price: '₦25,000',
    limit: null,
  },
  {
    id: 'interstate',
    icon: <Globe size={20} strokeWidth={1.6} />,
    iconBg: 'bg-emerald-600',
    title: 'Inter-State',
    desc: 'Nationwide delivery across Nigeria',
    eta: '1–3 days',
    price: '₦45,000',
    limit: null,
  },
]

export default function CustomerDashboard() {
  const { user, wallet } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sheetRef = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CO'

  const SHEET_H = expanded ? '78%' : '50%'

  return (
    <div className="relative bg-gray-900 overflow-hidden" style={{ height: '100dvh' }}>

      {/* ── MAP — fills entire screen ─────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <LiveMap height="100%" showRoute={false} />
      </div>

      {/* ── FROSTED TOP BAR ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20"
        style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.6) 80%, transparent 100%)' }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-6">
          {/* Avatar + greeting */}
          <div className="flex items-center gap-2.5">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-xs">{initials}</span>
            </button>
            <div>
              <p className="text-white/50 text-[10px] leading-none">Good Morning</p>
              <p className="text-white font-bold text-sm">{user?.name || 'Guest User'}</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <>
                <button onClick={() => navigate('/notifications')}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Bell size={17} className="text-white/80" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Menu size={17} className="text-white/80" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')}
                  className="text-white/80 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white/10">
                  Login
                </button>
                <button onClick={() => navigate('/signup')}
                  className="bg-white text-gray-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <button onClick={() => navigate('/customer/orders/create?type=standard')}
            className="w-full bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <Search size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm flex-1 text-left">Where are we delivering?</span>
            <div className="w-7 h-7 bg-gray-900 rounded-xl flex items-center justify-center">
              <Navigation size={13} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* ── WALLET CARD (floating, map visible through) ─────── */}
      <div className="absolute z-10 left-4 right-4"
        style={{ top: 'calc(3rem + 100px)' }}>
        <button
          onClick={() => navigate(user ? '/customer/wallet' : '/login')}
          className="w-full bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-2xl border border-white/40">
          <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet size={14} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-gray-500">Amplified Wallet</p>
            <p className="text-xs font-bold text-gray-900">
              {user ? formatCurrency(wallet?.balance || 0) : 'Your one-stop logistics solution.'}
            </p>
          </div>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
            {user ? 'Fund' : 'Activate'}
          </span>
        </button>
      </div>

      {/* ── LOCATION INDICATOR ──────────────────────────────── */}
      <div className="absolute bottom-0 right-4 z-20 flex flex-col gap-2"
        style={{ bottom: `calc(${SHEET_H} + 16px)`, transition: 'bottom 0.35s cubic-bezier(.32,0,.67,0)' }}>
        <button className="w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
          <Navigation size={18} className="text-gray-700" />
        </button>
      </div>

      {/* ── BOTTOM SHEET ─────────────────────────────────────── */}
      <div
        ref={sheetRef}
        className="absolute left-0 right-0 bottom-0 z-20 flex flex-col"
        style={{
          height: SHEET_H,
          transition: 'height 0.35s cubic-bezier(.32,0,.67,0)',
        }}
      >
        {/* Frosted top portion (map visible through) */}
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-2xl rounded-t-3xl pt-2.5 pb-0 border-t border-white/50 shadow-2xl">
          {/* Handle */}
          <button onClick={() => setExpanded(!expanded)} className="w-full flex flex-col items-center pb-2">
            <div className="w-9 h-1 bg-gray-300/80 rounded-full" />
          </button>

          {/* Header row */}
          <div className="flex items-center justify-between px-5 pb-3">
            <div>
              <h2 className="font-black text-gray-900 text-base leading-tight">Ship a Package</h2>
              <p className="text-gray-500 text-xs mt-0.5">Select delivery type to get started</p>
            </div>
            <button onClick={() => setExpanded(!expanded)}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              {expanded ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronUp size={16} className="text-gray-500"/>}
            </button>
          </div>
        </div>

        {/* White solid list area */}
        <div className="flex-1 bg-white overflow-y-auto">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/orders/create?type=${s.id}`)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left active:bg-gray-50 transition-colors ${i < SERVICES.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white">{s.icon}</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                  {s.limit && <span className={`text-[10px] font-bold ${s.limitColor}`}>{s.limit}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock size={9}/> {s.eta}
                  </span>
                  <span className="text-[10px] font-bold text-gray-700">from {s.price}</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <ArrowRight size={15} className="text-gray-600" />
              </div>
            </button>
          ))}

          {/* Guest CTA */}
          {!user && (
            <div className="mx-4 my-4 bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-bold">Login to track & manage orders</p>
                <p className="text-white/50 text-xs">Create an account in 30 seconds</p>
              </div>
              <button onClick={() => navigate('/login')}
                className="bg-white text-gray-900 text-xs font-black px-3 py-2 rounded-xl flex-shrink-0">
                Login
              </button>
            </div>
          )}

          {/* Bottom safe area */}
          <div className="h-4" />
        </div>
      </div>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
    </div>
  )
}
