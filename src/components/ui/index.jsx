import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Star, ChevronRight } from 'lucide-react'

/* ── Toast ─────────────────────────────────────── */
const TOAST_ICONS = {
  success: <CheckCircle size={16} className="text-green-600" />,
  error:   <AlertCircle  size={16} className="text-red-500"   />,
  warning: <AlertTriangle size={16} className="text-amber-500"/>,
  info:    <Info          size={16} className="text-blue-500"  />,
}
export function Toast({ message, type = 'info' }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] anim-scale-in" style={{ maxWidth:380 }}>
      <div className="bg-white border border-gray-100 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 mx-3">
        {TOAST_ICONS[type]}
        <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
      </div>
    </div>
  )
}

/* ── Modal ──────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="relative z-50 w-full max-w-[430px] bg-white rounded-t-3xl anim-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && <h2 className="font-semibold text-base text-gray-900">{title}</h2>}
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ml-auto">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

/* ── Input ──────────────────────────────────────── */
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <input
        className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ── Btn ────────────────────────────────────────── */
const BTN_STYLES = {
  primary:   'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  outline:   'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  ghost:     'text-gray-600 hover:bg-gray-100',
  navy:      'bg-[#0A1628] text-white hover:bg-[#0d1e33]',
}
export function Btn({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all active:scale-[.98] disabled:opacity-50 ${BTN_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* ── Card ───────────────────────────────────────── */
export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

/* ── StatusBadge ────────────────────────────────── */
export function StatusBadge({ status }) {
  return (
    <span className={`chip-${status} text-xs font-semibold px-2.5 py-1 rounded-full capitalize`}>
      {status}
    </span>
  )
}

/* ── StarRating ─────────────────────────────────── */
export function StarRating({ rating = 0, max = 5, onRate, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(v => (
        <button key={v} onClick={() => onRate?.(v)} className={onRate ? 'cursor-pointer' : 'cursor-default'}>
          <Star
            size={size}
            className={v <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
          />
        </button>
      ))}
    </div>
  )
}

/* ── Avatar ─────────────────────────────────────── */
export function Avatar({ name = '', size = 36 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  return (
    <div
      className="rounded-full bg-gray-900 flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

/* ── EmptyState ─────────────────────────────────── */
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8">
      {icon && <div className="text-gray-200 mb-4">{icon}</div>}
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      {desc && <p className="text-sm text-gray-400 mb-5">{desc}</p>}
      {action}
    </div>
  )
}

/* ── Spinner ─────────────────────────────────────── */
export function Spinner({ size = 20, className = '' }) {
  return (
    <div
      className={`rounded-full border-2 border-gray-200 border-t-gray-700 animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

/* ── Divider ─────────────────────────────────────── */
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-100" />
      {label && <span className="text-xs text-gray-400">{label}</span>}
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

/* ── MenuRow ─────────────────────────────────────── */
export function MenuRow({ icon, label, value, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0 ${danger?'text-red-500':'text-gray-800'}`}>
      {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-gray-400">{value}</span>}
      <ChevronRight size={16} className="text-gray-300"/>
    </button>
  )
}

/* ── Toggle ─────────────────────────────────────── */
export function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all ${value?'bg-gray-900':'bg-gray-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${value?'translate-x-5':''}`}/>
    </button>
  )
}

/* ── Select ─────────────────────────────────────── */
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <select className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ── LoadingSpinner (alias) ───────────────────────── */
export { Spinner as LoadingSpinner }
