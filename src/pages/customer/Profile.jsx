import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Edit3, MapPin, Wallet, Gift, HelpCircle, LogOut, Bell, Shield,
  ChevronRight, Star, Package, Phone, Mail, Camera, CheckCircle,
  Settings, Headphones, FileText, Globe, Share2
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'
import { Modal, Input, Btn } from '../../components/ui'

export default function CustomerProfile() {
  const { user, profile, wallet, orders, logout, showToast } = useApp()
  const navigate = useNavigate()
  const [editModal, setEditModal] = useState(false)
  const [name, setName] = useState(profile?.name || user?.email?.split('@')[0] || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)

  const delivered = orders?.filter(o=>o.status==='delivered').length || 0
  const totalSpent = orders?.reduce((s,o)=>s+(+o.price||0),0) || 0
  const initials = (profile?.name||user?.email||'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r=>setTimeout(r,800))
    showToast('Profile updated','success')
    setSaving(false)
    setEditModal(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    showToast('Logged out','info')
  }

  const MENU_SECTIONS = [
    {
      title:'Account',
      items:[
        { icon:<MapPin size={18}/>, label:'Address Book', sub:'Saved pickup & dropoff locations', onClick:()=>navigate('/customer/addresses'), badge:null },
        { icon:<Wallet size={18}/>, label:'Wallet', sub:`Balance: ₦${(wallet?.balance||0).toLocaleString()}`, onClick:()=>navigate('/customer/wallet'), badge:null },
        { icon:<Bell size={18}/>, label:'Notifications', sub:'Push, email & SMS preferences', onClick:()=>navigate('/notifications'), badge:null },
        { icon:<Shield size={18}/>, label:'Privacy & Security', sub:'Password, 2FA, data settings', onClick:()=>showToast('Coming soon','info'), badge:null },
      ]
    },
    {
      title:'Rewards',
      items:[
        { icon:<Gift size={18}/>, label:'Referral Program', sub:'Earn ₦500 per friend you invite', onClick:()=>navigate('/customer/referral'), badge:'₦500' },
        { icon:<Star size={18}/>, label:'Promo Codes', sub:'Enter discount codes', onClick:()=>navigate('/customer/promo'), badge:null },
      ]
    },
    {
      title:'Support',
      items:[
        { icon:<Headphones size={18}/>, label:'Help Center', sub:'FAQs and customer support', onClick:()=>navigate('/customer/support'), badge:null },
        { icon:<FileText size={18}/>, label:'Order Disputes', sub:'Refunds and complaints', onClick:()=>navigate('/customer/disputes'), badge:null },
        { icon:<Globe size={18}/>, label:'Language', sub:'English', onClick:()=>showToast('More languages coming soon','info'), badge:null },
      ]
    },
  ]

  return (
    <PageLayout title="Profile">
      {/* Profile card */}
      <div className="bg-gray-900 rounded-3xl p-5 mb-4 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
              {initials}
            </div>
            <button onClick={()=>setEditModal(true)} className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
              <Camera size={12} className="text-gray-900"/>
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-lg leading-tight truncate">{profile?.name || user?.email?.split('@')[0] || 'Guest User'}</h2>
            <p className="text-white/60 text-xs truncate mt-0.5">{user?.email}</p>
            {profile?.phone && <p className="text-white/60 text-xs">{profile.phone}</p>}
          </div>
          <button onClick={()=>setEditModal(true)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            <Edit3 size={14} className="text-white"/>
          </button>
        </div>

        {/* Verification */}
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 mb-4">
          <CheckCircle size={14} className="text-green-400"/>
          <span className="text-xs font-semibold text-white/80">Email verified</span>
          <button onClick={()=>showToast('Verify phone coming soon','info')} className="ml-auto text-xs text-orange-400 font-bold">Verify phone →</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Orders', value: orders?.length||0 },
            { label:'Delivered', value: delivered },
            { label:'Spent', value:`₦${(totalSpent/1000).toFixed(0)}k` },
          ].map(s=>(
            <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="font-black text-lg text-white">{s.value}</p>
              <p className="text-white/50 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      {MENU_SECTIONS.map(sec=>(
        <div key={sec.title} className="mb-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider px-1 mb-2">{sec.title}</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {sec.items.map((item,i)=>(
              <button key={item.label} onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50 ${i<sec.items.length-1?'border-b border-gray-50':''}`}>
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                </div>
                {item.badge && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                <ChevronRight size={15} className="text-gray-300 flex-shrink-0"/>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-2xl text-sm mb-6">
        <LogOut size={16}/> Log Out
      </button>

      <p className="text-center text-xs text-gray-400 mb-8">Amplified Logistics v1.0.0 • <button className="underline" onClick={()=>showToast('Privacy policy','info')}>Privacy Policy</button> • <button className="underline" onClick={()=>showToast('Terms','info')}>Terms</button></p>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={()=>setEditModal(false)} title="Edit Profile">
        <div className="space-y-4 mt-2">
          <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/>
          <Input label="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+234 xxx xxx xxxx" type="tel"/>
          <Btn onClick={handleSave} disabled={saving} className="w-full py-3.5 text-sm">
            {saving?'Saving…':'Save Changes'}
          </Btn>
        </div>
      </Modal>
    </PageLayout>
  )
}
