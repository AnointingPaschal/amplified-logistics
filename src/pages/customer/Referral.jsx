import { useState } from 'react'
import { Gift, Copy, Share2, Users, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'

export default function Referral() {
  const { user, showToast } = useApp()
  const [copied, setCopied] = useState(false)
  const code = 'AMP-' + (user?.id?.slice(0,6)||'DEMO').toUpperCase()

  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false),2000)
    showToast('Referral code copied!','success')
  }

  const share = () => {
    navigator.share?.({ title:'Amplified Logistics', text:`Use my referral code ${code} and get ₦500 off your first delivery!`, url:'https://amplified-logistics.vercel.app' }).catch(()=>{})
  }

  const referrals = []

  return (
    <PageLayout title="Referral Program" back>
      <div className="bg-gray-900 rounded-3xl p-6 mb-5 text-center text-white">
        <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift size={28} className="text-white"/>
        </div>
        <h2 className="font-black text-2xl mb-1">Earn ₦500</h2>
        <p className="text-white/60 text-sm">for every friend you refer who places their first order</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Your Referral Code</p>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <span className="font-mono font-black text-xl text-gray-900 flex-1 tracking-widest">{code}</span>
          <button onClick={copyCode} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${copied?'bg-green-100 text-green-700':'bg-gray-200 text-gray-700'}`}>
            {copied?<><CheckCircle size={13}/>Copied!</>:<><Copy size={13}/>Copy</>}
          </button>
        </div>
        <button onClick={share} className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-sm">
          <Share2 size={16}/> Share with Friends
        </button>
      </div>

      <div className="space-y-3">
        {[{label:'Friends Invited',val:referrals.length},{label:'Orders Placed',val:0},{label:'Rewards Earned',val:'₦0'}].map(s=>(
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">{s.label}</span>
            <span className="font-black text-gray-900">{s.val}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm font-bold text-blue-800 mb-1">How it works</p>
        {['Share your unique referral code','Friend signs up & places first order','You both earn ₦500 wallet credit'].map((s,i)=>(
          <div key={i} className="flex items-start gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
            <p className="text-xs text-blue-700">{s}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
