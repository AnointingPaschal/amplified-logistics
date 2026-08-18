import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Plus, CreditCard, Building2, Phone, Copy, ChevronRight, Wallet as WalletIcon, Gift } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'
import { Modal, Spinner } from '../../components/ui'
import * as db from '../../lib/db'

const fmt = n => '₦' + Number(n||0).toLocaleString()

const FUND_METHODS = [
  { id:'card', icon:<CreditCard size={20}/>, label:'Debit/Credit Card', sub:'Instant • Visa, Mastercard, Verve', color:'bg-blue-50 text-blue-600' },
  { id:'transfer', icon:<Building2 size={20}/>, label:'Bank Transfer', sub:'2–5 minutes', color:'bg-purple-50 text-purple-600' },
  { id:'ussd', icon:<Phone size={20}/>, label:'USSD', sub:'*966# and others', color:'bg-green-50 text-green-600' },
]
const AMOUNTS = [1000,2000,5000,10000,20000,50000]

export default function CustomerWallet() {
  const { user, wallet, setWallet, showToast } = useApp()
  const navigate = useNavigate()
  const [txns, setTxns]       = useState([])
  const [fundModal, setFundModal] = useState(false)
  const [amount, setAmount]   = useState('')
  const [method, setMethod]   = useState('card')
  const [loading, setLoading] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setTxnLoading(true)
      db.getTransactions(user.id).then(setTxns).catch(()=>{}).finally(()=>setTxnLoading(false))
    }
  }, [user])

  const handleFund = async () => {
    const n = Number(amount)
    if (!n || n < 100) { showToast('Enter a valid amount (min ₦100)','error'); return }
    setLoading(true)
    await new Promise(r=>setTimeout(r,1500))
    // Simulate wallet credit
    setWallet?.(w=>({...w, balance:(w?.balance||0)+n}))
    setTxns(t=>[{ id:Date.now(), amount:n, type:'credit', description:`Wallet funded via ${method}`, created_at:new Date().toISOString() }, ...t])
    setLoading(false); setFundModal(false); setAmount('')
    showToast(`₦${n.toLocaleString()} added to wallet`,'success')
  }

  const balance = wallet?.balance || 0

  return (
    <PageLayout title="Wallet" back>
      {/* Balance card */}
      <div className="bg-gray-900 rounded-3xl p-5 mb-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <WalletIcon size={16} className="text-white/60"/>
          <span className="text-white/60 text-xs">Available Balance</span>
        </div>
        <p className="font-black text-4xl tracking-tight mb-5">{fmt(balance)}</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setFundModal(true)}
            className="flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3 rounded-2xl text-sm">
            <Plus size={16}/> Add Money
          </button>
          <button onClick={()=>showToast('Withdrawal coming soon','info')}
            className="flex items-center justify-center gap-2 bg-white/15 text-white font-bold py-3 rounded-2xl text-sm">
            <ArrowUpRight size={16}/> Withdraw
          </button>
        </div>
      </div>

      {/* Referral bonus */}
      <button onClick={()=>navigate('/customer/referral')}
        className="w-full flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5 text-left">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift size={18} className="text-white"/>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">Earn ₦500 per referral!</p>
          <p className="text-xs text-amber-600">Invite friends and both get rewarded</p>
        </div>
        <ChevronRight size={16} className="text-amber-400"/>
      </button>

      {/* Transactions */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Transaction History</p>
        {txnLoading ? (
          <div className="flex justify-center py-8"><Spinner/></div>
        ) : txns.length===0 ? (
          <div className="text-center py-12">
            <WalletIcon size={36} className="text-gray-200 mx-auto mb-3"/>
            <p className="text-sm text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {txns.map((t,i)=>(
              <div key={t.id} className={`flex items-center gap-3 px-4 py-3.5 ${i<txns.length-1?'border-b border-gray-50':''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type==='credit'?'bg-green-100':'bg-red-100'}`}>
                  {t.type==='credit'
                    ? <ArrowDownLeft size={16} className="text-green-600"/>
                    : <ArrowUpRight size={16} className="text-red-500"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.description||'Transaction'}</p>
                  <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString('en',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                <p className={`font-black text-sm ${t.type==='credit'?'text-green-600':'text-red-500'}`}>
                  {t.type==='credit'?'+':'-'}{fmt(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fund Wallet Modal */}
      <Modal isOpen={fundModal} onClose={()=>setFundModal(false)} title="Add Money">
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Quick Amounts</label>
            <div className="grid grid-cols-3 gap-2">
              {AMOUNTS.map(a=>(
                <button key={a} onClick={()=>setAmount(String(a))}
                  className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${amount===String(a)?'border-gray-900 bg-gray-900 text-white':'border-gray-100 text-gray-700'}`}>
                  {fmt(a)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Custom Amount</label>
            <input value={amount} onChange={e=>setAmount(e.target.value.replace(/\D/,''))}
              placeholder="Enter amount" type="number" inputMode="numeric"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Payment Method</label>
            <div className="space-y-2">
              {FUND_METHODS.map(m=>(
                <button key={m.id} onClick={()=>setMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${method===m.id?'border-gray-900':'border-gray-100'}`}>
                  <div className={`w-9 h-9 ${m.color} rounded-xl flex items-center justify-center flex-shrink-0`}>{m.icon}</div>
                  <div className="text-left"><p className="text-sm font-semibold text-gray-900">{m.label}</p><p className="text-xs text-gray-400">{m.sub}</p></div>
                  {method===m.id&&<div className="ml-auto w-4 h-4 rounded-full bg-gray-900"/>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleFund} disabled={loading||!amount}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {loading?<><Spinner size={16} className="border-white/30 border-t-white"/>Processing…</>:`Fund ${amount?fmt(Number(amount)):''} Wallet`}
          </button>
        </div>
      </Modal>
    </PageLayout>
  )
}
