import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChevronLeft, Zap, Truck, Package, LayoutDashboard, Store, Upload, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Input, Select, Btn } from '../../components/ui';

const ROLES = [
  { id: 'customer', label: 'Customer', icon: <Package size={18} />, desc: 'Send packages', color: 'bg-orange-500' },
  { id: 'rider', label: 'Rider', icon: <Truck size={18} />, desc: 'Earn by delivering', color: 'bg-purple-600' },
  { id: 'merchant', label: 'Business', icon: <Store size={18} />, desc: 'Bulk deliveries', color: 'bg-cyan-600' },
];

const STEPS = { customer: ['Account', 'Done'], rider: ['Account', 'KYC', 'Done'], merchant: ['Account', 'Business', 'Done'] };

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'customer');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', vehicleType: 'Motorcycle', plateNumber: '', idNumber: '', businessName: '', businessType: 'Retail' });

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const steps = STEPS[role] || ['Account', 'Done'];
  const maxStep = steps.length - 1;

  const validate = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.phone || !form.password) return 'All fields are required';
      if (form.password !== form.confirmPassword) return 'Passwords do not match';
      if (form.password.length < 6) return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleNext = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    if (step < maxStep - 1) { setStep(s => s + 1); return; }
    // Submit
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const result = signup({ ...form, role });
    if (result.success) navigate(`/${role}`);
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full" />
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-slate-400 p-1"><ChevronLeft size={20} /></Link>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center"><Zap size={16} fill="white" className="text-white" /></div>
            <span className="font-black text-white text-base tracking-tight">amplified</span>
          </div>
          <div className="w-8" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
        <p className="text-slate-400 text-sm">Join thousands of users today</p>

        {/* Step indicator */}
        {steps.length > 2 && (
          <div className="flex gap-2 mt-5">
            {steps.slice(0, -1).map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-orange-400' : 'bg-slate-700'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-5 py-6">
        {/* Role selector (step 0 only) */}
        {step === 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">I want to</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button key={r.id} onClick={() => { setRole(r.id); setStep(0); }}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${role === r.id ? `${r.color} border-transparent text-white` : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {r.icon}
                  <div className="text-center">
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] opacity-75">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Steps */}
        {step === 0 && (
          <div className="space-y-4">
            <Input label="Full Name" type="text" icon={<User size={16} />} value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" />
            <Input label="Email Address" type="email" icon={<Mail size={16} />} value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@email.com" />
            <Input label="Phone Number" type="tel" icon={<Phone size={16} />} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 800 000 0000" />
            <Input label="Password" type="password" icon={<Lock size={16} />} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 6 characters" />
            <Input label="Confirm Password" type="password" icon={<Lock size={16} />} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat password" />
          </div>
        )}

        {step === 1 && role === 'rider' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              <strong>KYC Required</strong> — Upload your documents to get verified and start delivering.
            </div>
            <Select label="Vehicle Type" icon={<Car size={16} />} value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)}>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Tricycle">Tricycle (Keke)</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </Select>
            <Input label="Plate Number" type="text" icon={<Car size={16} />} value={form.plateNumber} onChange={e => update('plateNumber', e.target.value)} placeholder="e.g. ABA-234-XY" />
            <Input label="Government ID Number" type="text" icon={<User size={16} />} value={form.idNumber} onChange={e => update('idNumber', e.target.value)} placeholder="NIN or Driver's License" />
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <Upload size={24} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">Upload ID Document</p>
              <p className="text-xs text-slate-400 mt-1">NIN slip, Driver's license, or Passport</p>
              <button className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors">Choose File</button>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <Upload size={24} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">Upload Vehicle Document</p>
              <p className="text-xs text-slate-400 mt-1">Vehicle registration or road worthiness</p>
              <button className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors">Choose File</button>
            </div>
          </div>
        )}

        {step === 1 && role === 'merchant' && (
          <div className="space-y-4">
            <Input label="Business Name" type="text" icon={<Store size={16} />} value={form.businessName} onChange={e => update('businessName', e.target.value)} placeholder="Your business name" />
            <Select label="Business Type" value={form.businessType} onChange={e => update('businessType', e.target.value)}>
              <option value="Retail">Retail Store</option>
              <option value="Restaurant">Restaurant / Food</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Fashion">Fashion & Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Other">Other</option>
            </Select>
            <Input label="Business Address" type="text" value={form.businessAddress || ''} onChange={e => update('businessAddress', e.target.value)} placeholder="Street, City, State" />
            <Input label="Business Registration Number (Optional)" type="text" value={form.regNumber || ''} onChange={e => update('regNumber', e.target.value)} placeholder="CAC Number" />
          </div>
        )}

        {error && <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 mt-6">
          {step > 0 && <Btn variant="secondary" size="lg" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Btn>}
          <Btn size="lg" loading={loading} onClick={handleNext} className={step > 0 ? 'flex-1' : 'w-full'}>
            {step >= maxStep - 1 ? 'Create Account' : 'Continue'}
          </Btn>
        </div>

        <div className="text-center mt-5">
          <span className="text-sm text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-sm font-semibold text-orange-500">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
