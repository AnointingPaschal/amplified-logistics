import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Zap, User, Truck, Store } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Spinner } from '../../components/ui'

const ROLES = [
  { id:'customer',  label:'Customer',  desc:'Send packages',   icon:<User size={18} /> },
  { id:'rider',     label:'Rider',     desc:'Deliver packages', icon:<Truck size={18} /> },
  { id:'merchant',  label:'Merchant',  desc:'Business orders',  icon:<Store size={18} /> },
]

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [role, setRole] = useState('customer')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await signup({ email, password, name, phone, role })
      navigate('/customer')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists') || msg.includes('already_exists')) {
        setError('ALREADY_EXISTS')
      } else if (msg.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else if (msg.toLowerCase().includes('weak password') || msg.toLowerCase().includes('password')) {
        setError('Password must be at least 6 characters.')
      } else {
        setError(msg || 'Signup failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto px-6">
      <div className="pt-12 pb-6">
        <button onClick={() => step > 1 ? setStep(s=>s-1) : navigate(-1)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-8">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <Zap size={18} fill="white" className="text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">amplified</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-400 text-sm">Step {step} of 2</p>

        {/* Progress */}
        <div className="flex gap-1.5 mt-4">
          {[1,2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gray-900' : 'bg-gray-100'}`} />
          ))}
        </div>
      </div>

      {/* Step 1 – Role + personal info */}
      {step === 1 && (
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">I am a...</p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${role===r.id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role===r.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {r.icon}
                </div>
                <span className="text-xs font-bold text-gray-800">{r.label}</span>
                <span className="text-[10px] text-gray-400 text-center">{r.desc}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Chima Ozoemena"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08012345678" type="tel"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm" />
          </div>

          <div className="mt-auto pt-4 pb-8">
            <button onClick={() => { if(name && phone) setStep(2); else setError('Fill all fields') }}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl">
              Continue
            </button>
            {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>
      )}

      {/* Step 2 – Email + password */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 8 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-sm" />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {error === 'ALREADY_EXISTS' ? (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-orange-800 mb-1">Account already exists</p>
              <p className="text-xs text-orange-600 mb-3">An account with <span className="font-bold">{email}</span> already exists. Sign in instead?</p>
              <button
                type="button"
                onClick={() => navigate(`/login?email=${encodeURIComponent(email)}`)}
                className="w-full bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                Sign In with this Email
              </button>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3"><p className="text-xs text-red-600">{error}</p></div>
          ) : null}

          <div className="mt-auto pt-4 pb-8 space-y-3">
            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Spinner size={18} className="border-white/30 border-t-white"/>Creating account...</> : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-400">
              Already have an account? <Link to="/login" className="text-gray-900 font-semibold">Sign in</Link>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}
