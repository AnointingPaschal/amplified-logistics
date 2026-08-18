import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Menu, Wallet, ArrowRight, Bike, Layers, Truck, Globe,
  Package, Search, Clock, ChevronUp, ChevronDown, Navigation
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import LiveMap from '../../components/map/LiveMap'
import { formatCurrency } from '../../utils/mockData'

const SERVICES = [
  {
    id: 'standard', iconBg: 'bg-orange-500',
    icon: <Bike size={20} strokeWidth={1.6} />,
    title: 'Standard Packages', desc: 'Lightweight items & packages',
    eta: '20–40 min', price: '₦2,500',
    limit: 'Max 3 Locations', limitColor: 'text-orange-500',
  },
  {
    id: 'bulk', iconBg: 'bg-amber-500',
    icon: <Layers size={20} strokeWidth={1.6} />,
    title: 'Bulk Packages', desc: 'Fixed price, 4+ drop locations',
    eta: '1–3 hrs', price: '₦8,500', limit: null,
  },
  {
    id: 'heavy', iconBg: 'bg-slate-700',
    icon: <Truck size={20} strokeWidth={1.6} />,
    title: 'Heavy & Relocation', desc: 'Furniture, big loads & home moves',
    eta: 'Same day', price: '₦25,000', limit: null,
  },
  {
    id: 'interstate', iconBg: 'bg-emerald-600',
    icon: <Globe size={20} strokeWidth={1.6} />,
    title: 'Inter-State', desc: 'Nationwide delivery across Nigeria',
    eta: '1–3 days', price: '₦45,000', limit: null,
  },
]

export default function CustomerDashboard() {
  const { user, wallet, openSidebar } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const initials = (user?.user_metadata?.name || user?.email || 'CO')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const SHEET_H = expanded ? '78%' : '50%'

  return (
    <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: '#111827' }}>

      {/* MAP — full screen behind everything */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LiveMap height="100%" showRoute={false} />
      </div>

      {/* TOP BAR — frosted gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(10,22,40,0.94) 0%, rgba(10,22,40,0.7) 75%, transparent 100%)',
      }}>
        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
          {/* Left: avatar + greeting */}
          <button
            onClick={openSidebar}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>{initials}</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: 0, lineHeight: 1 }}>Good Morning</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '2px 0 0', lineHeight: 1 }}>
                {user?.user_metadata?.name || 'Guest User'}
              </p>
            </div>
          </button>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <>
                <button
                  onClick={() => navigate('/notifications')}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Bell size={17} color="rgba(255,255,255,0.85)" />
                </button>
                <button
                  onClick={openSidebar}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Menu size={17} color="rgba(255,255,255,0.85)" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')}
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Login
                </button>
                <button onClick={() => navigate('/signup')}
                  style={{ background: '#fff', color: '#0A1628', fontSize: 12, fontWeight: 800, padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                  Sign Up
                </button>
                <button onClick={openSidebar}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Menu size={17} color="rgba(255,255,255,0.85)" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '0 16px 14px' }}>
          <button
            onClick={() => navigate('/customer/orders/create?type=standard')}
            style={{ width: '100%', background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
          >
            <Search size={16} color="#9CA3AF" />
            <span style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#9CA3AF' }}>Where are we delivering?</span>
            <div style={{ width: 30, height: 30, background: '#0A1628', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Navigation size={14} color="#fff" />
            </div>
          </button>
        </div>
      </div>

      {/* WALLET CARD — floating over map */}
      <div style={{ position: 'absolute', top: 'calc(3.5rem + 88px)', left: 16, right: 16, zIndex: 10 }}>
        <button
          onClick={() => navigate(user ? '/customer/wallet' : '/login')}
          style={{ width: '100%', background: 'rgba(255,255,255,0.92)', borderRadius: 18, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', cursor: 'pointer' }}
        >
          <div style={{ width: 34, height: 34, background: '#0A1628', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wallet size={15} color="#fff" />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Amplified Wallet</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: '1px 0 0' }}>
              {user ? formatCurrency(wallet?.balance || 0) : 'Your one-stop logistics solution.'}
            </p>
          </div>
          <span style={{ background: '#2563EB', color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 10, flexShrink: 0 }}>
            {user ? 'Fund' : 'Activate'}
          </span>
        </button>
      </div>

      {/* NAV FAB — bottom right, above sheet */}
      <div style={{
        position: 'absolute', right: 16, zIndex: 15,
        bottom: `calc(${SHEET_H} + 16px)`,
        transition: 'bottom 0.35s cubic-bezier(.32,0,.67,0)',
      }}>
        <button style={{ width: 42, height: 42, background: '#fff', borderRadius: 14, border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
          <Navigation size={18} color="#374151" />
        </button>
      </div>

      {/* BOTTOM SHEET */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
        height: SHEET_H,
        display: 'flex', flexDirection: 'column',
        transition: 'height 0.35s cubic-bezier(.32,0,.67,0)',
      }}>
        {/* Frosted header — map shows through */}
        <div style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.1)',
          flexShrink: 0,
          paddingTop: 10,
        }}>
          {/* Handle */}
          <button onClick={() => setExpanded(!expanded)}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
          </button>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
            <div>
              <p style={{ fontWeight: 900, fontSize: 16, color: '#111827', margin: 0, lineHeight: 1.2 }}>Ship a Package</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>Select delivery type to get started</p>
            </div>
            <button onClick={() => setExpanded(!expanded)}
              style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {expanded
                ? <ChevronDown size={16} color="#6B7280" />
                : <ChevronUp size={16} color="#6B7280" />}
            </button>
          </div>
        </div>

        {/* Service list — solid white */}
        <div style={{ flex: 1, background: '#fff', overflowY: 'auto' }}>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/orders/create?type=${s.id}`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < SERVICES.length - 1 ? '1px solid #F3F4F6' : 'none',
                textAlign: 'left',
              }}
            >
              <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <span style={{ color: '#fff' }}>{s.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', margin: 0 }}>{s.title}</p>
                  {s.limit && <span className={`text-[10px] font-bold ${s.limitColor}`}>{s.limit}</span>}
                </div>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#9CA3AF' }}>
                    <Clock size={9} /> {s.eta}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>from {s.price}</span>
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowRight size={15} color="#6B7280" />
              </div>
            </button>
          ))}

          {/* Guest CTA */}
          {!user && (
            <div style={{ margin: '12px 16px 16px', background: '#0A1628', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: 0 }}>Login to track & manage orders</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '2px 0 0' }}>Create an account in 30 seconds</p>
              </div>
              <button onClick={() => navigate('/login')}
                style={{ background: '#fff', color: '#0A1628', fontSize: 12, fontWeight: 800, padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Login
              </button>
            </div>
          )}
          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  )
}
