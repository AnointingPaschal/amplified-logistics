import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, password)
    if (ok) navigate('/')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0A1628 0%,#1E3A5F 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:64, height:64, background:'#2563EB', borderRadius:20, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
            <Zap size={32} color="#fff" />
          </div>
          <h1 style={{ color:'#fff', fontSize:26, fontWeight:900, marginBottom:6 }}>Amplified Admin</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:14 }}>Logistics Management Portal</p>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,.07)', backdropFilter:'blur(20px)', borderRadius:24, border:'1px solid rgba(255,255,255,.12)', padding:32 }}>
          <h2 style={{ color:'#fff', fontSize:20, fontWeight:800, marginBottom:6 }}>Sign In</h2>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:13, marginBottom:28 }}>Admin access only</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', color:'rgba(255,255,255,.6)', fontSize:12, fontWeight:600, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} color="rgba(255,255,255,.3)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="admin@amplifiedlogistics.com" required
                  style={{ width:'100%', background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.15)', borderRadius:12, padding:'12px 14px 12px 40px', color:'#fff', fontSize:14, outline:'none', fontFamily:'inherit' }} />
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', color:'rgba(255,255,255,.6)', fontSize:12, fontWeight:600, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="rgba(255,255,255,.3)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input type={show ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••" required
                  style={{ width:'100%', background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.15)', borderRadius:12, padding:'12px 40px 12px 40px', color:'#fff', fontSize:14, outline:'none', fontFamily:'inherit' }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.4)', background:'none', border:'none', cursor:'pointer' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background:'rgba(220,38,38,.15)', border:'1px solid rgba(220,38,38,.3)', borderRadius:10, padding:'10px 14px', marginBottom:20, color:'#FCA5A5', fontSize:13 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:'100%', background:'#2563EB', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.7:1 }}>
              {loading ? <span style={{ width:18, height:18, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .6s linear infinite' }} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,.2)', fontSize:12, marginTop:24 }}>
          © 2026 Amplified Logistics • Admin Portal
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::placeholder{color:rgba(255,255,255,.25)} input:focus{border-color:rgba(37,99,235,.6)!important}`}</style>
    </div>
  )
}
