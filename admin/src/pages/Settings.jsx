import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Card, PageHeader, Btn, Field, Input } from '../components/ui'
import { Shield, Bell, Database, Palette, Globe, Save } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [pwd, setPwd] = useState({ current:'', new:'', confirm:'' })
  const [pwdMsg, setPwdMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    site_name: 'Amplified Logistics',
    support_email: 'support@amplifiedlogistics.com',
    support_phone: '+234 800 000 0000',
    base_price_standard: '2500',
    base_price_bulk: '8500',
    base_price_heavy: '25000',
    min_wallet_fund: '500',
    notifications_email: true,
    notifications_sms: false,
  })

  const updatePassword = async () => {
    if (pwd.new !== pwd.confirm) { setPwdMsg('Passwords do not match'); return }
    if (pwd.new.length < 6) { setPwdMsg('Password must be at least 6 characters'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwd.new })
    setPwdMsg(error ? error.message : 'Password updated successfully!')
    if (!error) setPwd({ current:'', new:'', confirm:'' })
    setSaving(false)
  }

  const Section = ({ icon: Icon, title, children }) => (
    <Card style={{ marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={18} color="#2563EB" />
        </div>
        <h3 style={{ fontSize:15, fontWeight:800, color:'var(--navy)' }}>{title}</h3>
      </div>
      {children}
    </Card>
  )

  return (
    <div style={{ maxWidth:700 }}>
      <PageHeader title="Settings" sub="Configure your admin portal" />

      <Section icon={Globe} title="General Settings">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Site Name">
            <Input value={settings.site_name} onChange={e => setSettings({...settings, site_name:e.target.value})} />
          </Field>
          <Field label="Support Email">
            <Input value={settings.support_email} onChange={e => setSettings({...settings, support_email:e.target.value})} />
          </Field>
          <Field label="Support Phone">
            <Input value={settings.support_phone} onChange={e => setSettings({...settings, support_phone:e.target.value})} />
          </Field>
          <Field label="Min Wallet Funding (₦)">
            <Input type="number" value={settings.min_wallet_fund} onChange={e => setSettings({...settings, min_wallet_fund:e.target.value})} />
          </Field>
        </div>
      </Section>

      <Section icon={Database} title="Pricing Configuration">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[['Standard (₦)', 'base_price_standard'], ['Bulk (₦)', 'base_price_bulk'], ['Heavy & Relocation (₦)', 'base_price_heavy']].map(([label, key]) => (
            <Field key={key} label={label}>
              <Input type="number" value={settings[key]} onChange={e => setSettings({...settings, [key]:e.target.value})} />
            </Field>
          ))}
        </div>
        <Btn variant="blue" size="sm"><Save size={14} />Save Pricing</Btn>
      </Section>

      <Section icon={Bell} title="Notifications">
        {[['Email Notifications', 'notifications_email'], ['SMS Notifications', 'notifications_sms']].map(([label, key]) => (
          <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--navy)' }}>{label}</div>
              <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>Receive alerts for new orders and updates</div>
            </div>
            <button
              onClick={() => setSettings({...settings, [key]:!settings[key]})}
              style={{ width:44, height:24, borderRadius:12, background:settings[key]?'#2563EB':'#E5E7EB', border:'none', cursor:'pointer', position:'relative', transition:'background .2s' }}
            >
              <span style={{ position:'absolute', top:2, left:settings[key]?22:2, width:20, height:20, borderRadius:10, background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
            </button>
          </div>
        ))}
      </Section>

      <Section icon={Shield} title="Account Security">
        <div style={{ marginBottom:16, padding:'12px 16px', background:'#F0F9FF', borderRadius:12, fontSize:13, color:'#0369A1' }}>
          Logged in as <b>{user?.email}</b>
        </div>
        <Field label="New Password">
          <Input type="password" value={pwd.new} onChange={e => setPwd({...pwd, new:e.target.value})} placeholder="New password" />
        </Field>
        <Field label="Confirm Password">
          <Input type="password" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm:e.target.value})} placeholder="Confirm new password" />
        </Field>
        {pwdMsg && (
          <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:14, fontSize:13, background:pwdMsg.includes('success')?'#F0FDF4':'#FEF2F2', color:pwdMsg.includes('success')?'#15803D':'#DC2626' }}>
            {pwdMsg}
          </div>
        )}
        <Btn onClick={updatePassword} loading={saving} variant="navy"><Shield size={14} />Update Password</Btn>
      </Section>

      <Section icon={Database} title="Supabase Connection">
        <div style={{ padding:'14px 16px', background:'var(--bg)', borderRadius:12, fontSize:13 }}>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <span style={{ color:'var(--text-light)', minWidth:80 }}>Project:</span>
            <b>nlrvkcebwzremhksjzwp</b>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <span style={{ color:'var(--text-light)', minWidth:80 }}>Region:</span>
            <b>Africa (Lagos)</b>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ color:'var(--text-light)', minWidth:80 }}>Status:</span>
            <span style={{ color:'#16A34A', fontWeight:700 }}>● Connected</span>
          </div>
        </div>
      </Section>
    </div>
  )
}
