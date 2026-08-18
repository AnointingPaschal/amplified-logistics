import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Spinner } from '../../components/ui'

export default function Login() {
  const { login, showToast } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnTo = params.get('return') || null

  const [searchParams] = useSearchParams()
  const [email, setEmail]       = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email || !password) { setError('Fill in all fields'); return }
    setLoading(true); setError('')
    try {
      await login(email, password)
      navigate(returnTo || '/customer')
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto px-6">

      {/* Back */}
      <div className="pt-12 pb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-10">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <Zap size={18} fill="white" className="text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">amplified</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email address</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-sm text-gray-900"
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-auto pt-4 pb-8 space-y-3">
          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Spinner size={18} className="border-white/30 border-t-white" /> Signing in...</> : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gray-900 font-semibold">Create one</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
