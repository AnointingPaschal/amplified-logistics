import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Zap, ChevronLeft, Truck, Package, LayoutDashboard, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Input, Btn } from '../../components/ui';

const ROLES = [
  { id: 'customer', label: 'Customer', icon: <Package size={18} />, color: 'bg-orange-500' },
  { id: 'rider', label: 'Rider', icon: <Truck size={18} />, color: 'bg-purple-600' },
  { id: 'merchant', label: 'Merchant', icon: <Store size={18} />, color: 'bg-cyan-600' },
  { id: 'admin', label: 'Admin', icon: <LayoutDashboard size={18} />, color: 'bg-green-600' },
];

export default function Login() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'customer');
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user]);

  // Auto-fill demo emails
  useEffect(() => {
    const demoEmails = { customer: 'customer@demo.com', rider: 'rider@demo.com', merchant: 'merchant@demo.com', admin: 'admin@demo.com' };
    if (!params.get('email')) setEmail(demoEmails[role]);
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password, role);
    if (result.success) {
      navigate(`/${result.user.role}`);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Top */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full" />
        <Link to="/" className="inline-flex items-center text-slate-400 text-sm mb-8">
          <ChevronLeft size={18} /> Back
        </Link>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center">
            <Zap size={20} fill="white" className="text-white" />
          </div>
          <span className="font-black text-white text-xl tracking-tight">amplified</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm">Sign in to your account</p>
      </div>

      <div className="flex-1 px-5 py-8">
        {/* Role Selector */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Signing in as</p>
          <div className="grid grid-cols-4 gap-2">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${role === r.id ? `${r.color} border-transparent text-white` : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {r.icon}
                <span className="text-[10px] font-semibold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email address" type="email" icon={<Mail size={16} />} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" icon={<Lock size={16} />} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-xs text-orange-700">
            💡 Demo accounts: use password <strong>password</strong>
          </div>

          <Btn type="submit" size="lg" loading={loading} className="w-full mt-2">
            Sign In
          </Btn>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-slate-500">Don't have an account? </span>
          <Link to="/signup" className="text-sm font-semibold text-orange-500 hover:text-orange-600">Sign Up</Link>
        </div>

        {/* Quick demo login buttons */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500 text-center mb-3 font-medium">Quick demo access</p>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => { setRole(r.id); setEmail(`${r.id}@demo.com`); setPassword('password'); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left">
                <span className={`p-1 rounded-lg ${r.color} text-white`}>{r.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-700">{r.label}</div>
                  <div className="text-[10px] text-slate-400">Quick fill</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
