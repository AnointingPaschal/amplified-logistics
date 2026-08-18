import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Search, Filter, ChevronRight, Clock, CheckCircle, XCircle, Truck, MapPin, RotateCcw, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'
import { StatusBadge, EmptyState, Spinner } from '../../components/ui'
import * as db from '../../lib/db'

const TABS = ['All','Active','Delivered','Cancelled']
const STATUS_ICONS = {
  pending:<Clock size={14} className="text-amber-500"/>, accepted:<Truck size={14} className="text-blue-500"/>,
  pickup:<Package size={14} className="text-purple-500"/>, transit:<MapPin size={14} className="text-orange-500"/>,
  delivered:<CheckCircle size={14} className="text-green-500"/>, cancelled:<XCircle size={14} className="text-red-500"/>
}
const TAB_STATUS = { Active:['pending','accepted','pickup','transit'], Delivered:['delivered'], Cancelled:['cancelled'] }

export default function CustomerOrders() {
  const { user, orders: ctxOrders, refreshOrders } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) { setLoading(true); refreshOrders?.().finally(()=>setLoading(false)) }
  }, [user])

  const all = ctxOrders || []
  const filtered = all.filter(o => {
    const matchTab = tab==='All' || TAB_STATUS[tab]?.includes(o.status)
    const matchSearch = !search || o.tracking_id?.toLowerCase().includes(search.toLowerCase()) ||
      o.pickup_address?.toLowerCase().includes(search.toLowerCase()) ||
      o.dropoff_address?.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const counts = { All:all.length, Active:all.filter(o=>TAB_STATUS.Active.includes(o.status)).length,
    Delivered:all.filter(o=>o.status==='delivered').length, Cancelled:all.filter(o=>o.status==='cancelled').length }

  return (
    <PageLayout title="My Orders" noNav={false}>
      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders, addresses…"
          className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-2.5 text-sm"/>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tab===t?'bg-gray-900 text-white':'bg-white text-gray-500 border border-gray-200'}`}>
            {t} {counts[t]>0&&<span className="ml-1 opacity-70">({counts[t]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28}/></div>
      ) : filtered.length===0 ? (
        <EmptyState icon={<Package size={48}/>} title={search?'No matching orders':'No orders yet'}
          desc={search?'Try a different search term':`You haven't made any ${tab.toLowerCase()==='all'?'':tab.toLowerCase()} orders yet.`}
          action={<button onClick={()=>navigate('/')} className="bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl text-sm">Send a Package</button>}/>
      ) : (
        <div className="space-y-3">
          {filtered.map(o=>(
            <button key={o.id} onClick={()=>navigate(`/customer/orders/${o.id}`)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left active:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {STATUS_ICONS[o.status]}
                  <span className="font-mono text-xs font-bold text-gray-700">{o.tracking_id}</span>
                </div>
                <StatusBadge status={o.status}/>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"/>
                  <p className="text-xs text-gray-600 truncate flex-1">{o.pickup_address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"/>
                  <p className="text-xs text-gray-600 truncate flex-1">{o.dropoff_address}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{new Date(o.created_at).toLocaleDateString('en',{month:'short',day:'numeric'})}</span>
                  <span className="font-bold text-gray-900">₦{Number(o.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {['pending','accepted','pickup','transit'].includes(o.status) && (
                    <button onClick={e=>{e.stopPropagation();navigate(`/customer/track/${o.id}`)}}
                      className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl">Track</button>
                  )}
                  {o.status==='delivered' && !o.rated && (
                    <button onClick={e=>{e.stopPropagation();navigate(`/customer/rate/${o.id}`)}}
                      className="flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                      <Star size={11}/> Rate
                    </button>
                  )}
                  {o.status==='delivered' && (
                    <button onClick={e=>{e.stopPropagation();navigate(`/customer/orders/create?reorder=${o.id}`)}}
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                      <RotateCcw size={11}/> Reorder
                    </button>
                  )}
                  <ChevronRight size={15} className="text-gray-400"/>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
