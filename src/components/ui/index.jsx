import { CheckCircle, XCircle, AlertCircle, Info, X, Eye, EyeOff, Star, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/mockData';

export function Toast({ toast }) {
  if (!toast) return null;
  const icons = { success: <CheckCircle size={16} />, error: <XCircle size={16} />, warning: <AlertCircle size={16} />, info: <Info size={16} /> };
  const colors = { success: 'bg-green-600', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-600' };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl animate-slide-up max-w-[360px] w-[90%] ${colors[toast.type] || 'bg-gray-800'}`}>
      {icons[toast.type]}
      <span>{toast.message}</span>
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-h-[50vh]', md: 'max-h-[80vh]', lg: 'max-h-[90vh]' };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative w-full max-w-[430px] bg-white rounded-t-3xl ${sizes[size]} overflow-hidden flex flex-col animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, icon, type = 'text', error, className = '', ...props }) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          type={isPassword && showPwd ? 'text' : type}
          className={`w-full border border-slate-200 rounded-xl py-3 text-sm bg-slate-50 text-slate-800 placeholder-slate-400 transition-all ${icon ? 'pl-10' : 'pl-3.5'} ${isPassword ? 'pr-10' : 'pr-3.5'} ${error ? 'border-red-400 bg-red-50' : ''}`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export function Select({ label, icon, error, children, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
        <select className={`w-full border border-slate-200 rounded-xl py-3 text-sm bg-slate-50 text-slate-800 transition-all appearance-none ${icon ? 'pl-10' : 'pl-3.5'} pr-8 ${error ? 'border-red-400' : ''}`} {...props}>
          {children}
        </select>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export function Btn({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60';
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    navy: 'bg-slate-900 text-white hover:bg-slate-800',
  };
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-3 text-sm', lg: 'px-6 py-3.5 text-base', xl: 'px-8 py-4 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${onClick ? 'cursor-pointer card-hover active:scale-98' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function StarRating({ value, onChange, readonly }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={22} fill={s <= (value || 0) ? '#F59E0B' : 'none'} color={s <= (value || 0) ? '#F59E0B' : '#CBD5E1'}
          className={readonly ? '' : 'cursor-pointer hover:scale-110 transition-transform'}
          onClick={() => !readonly && onChange && onChange(s)} />
      ))}
    </div>
  );
}

export function MenuRow({ icon, label, sublabel, onClick, rightIcon = true, danger }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left ${danger ? 'text-red-500' : ''}`}>
      <span className={`p-2 rounded-xl ${danger ? 'bg-red-50' : 'bg-orange-50'}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sublabel && <div className="text-xs text-slate-500 mt-0.5">{sublabel}</div>}
      </div>
      {rightIcon && <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />}
    </button>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-8">
      <div className={`${s[size]} border-3 border-slate-200 border-t-orange-500 rounded-full animate-spin`} style={{ borderWidth: 3 }} />
    </div>
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">{icon}</div>
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{desc}</p>
      {action}
    </div>
  );
}

export function Avatar({ name, size = 40, src }) {
  const colors = ['#F97316', '#8B5CF6', '#06B6D4', '#22C55E', '#EC4899', '#F59E0B'];
  const color = colors[(name || 'A').charCodeAt(0) % colors.length];
  const initials = (name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <div className="relative">
        <input type="checkbox" className="sr-only toggle-input" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-slate-300'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    </label>
  );
}
