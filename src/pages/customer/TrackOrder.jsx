import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  ArrowLeft, Phone, MessageCircle, Star, MapPin, Clock,
  CheckCircle, Package, Bike, Navigation, X, ChevronUp,
  ChevronDown, Copy, Share2, AlertTriangle
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' })

const riderIcon = L.divIcon({ className:'', html:`<div style="width:40px;height:40px;background:#0A1628;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3)"><svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M5 3h14l-1.5 9h-11z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg></div>`, iconSize:[40,40], iconAnchor:[20,20] })
const pickupIcon = L.divIcon({ className:'', html:`<div style="width:14px;height:14px;background:#22C55E;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`, iconSize:[14,14], iconAnchor:[7,7] })
const dropoffIcon = L.divIcon({ className:'', html:`<div style="width:14px;height:14px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`, iconSize:[14,14], iconAnchor:[7,7] })

const STATUS_STEPS = [
  { key:'pending',   label:'Order Placed',     icon:<Package size={14}/>,    desc:'Finding a rider…' },
  { key:'accepted',  label:'Rider Assigned',   icon:<Bike size={14}/>,       desc:'Rider is on the way to pickup' },
  { key:'pickup',    label:'Picked Up',         icon:<CheckCircle size={14}/>,desc:'Package collected' },
  { key:'transit',   label:'In Transit',        icon:<Navigation size={14}/>, desc:'On the way to you' },
  { key:'delivered', label:'Delivered',         icon:<CheckCircle size={14}/>,desc:'Package delivered' },
]
const STATUS_ORDER = ['pending','accepted','pickup','transit','delivered']

// Demo mock order for display when no real order
const MOCK_ORDER = {
  id:'demo-001', tracking_id:'AMP-MSYZ9WEC', status:'transit',
  service_type:'standard',
  pickup_address:'Chicago Avenue, Zulum, Borno State, Nigeria',
  dropoff_address:'12 World Bank Estate, Umudike, Umuahia, Abia, Nigeria',
  pickup_lat:11.0801, pickup_lng:13.6762,
  dropoff_lat:5.5134, dropoff_lng:7.5011,
  price:5900, created_at: new Date(Date.now()-25*60000).toISOString(),
  rider:{ name:'Emeka Okonkwo', rating:4.8, vehicle:'Motorcycle', plate:'ABI 234 KE', phone:'+2348012345678', deliveries:342 },
}

function MapController({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 14, { duration:1.2 }) }, [center])
  return null
}

export default function TrackOrder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, showToast } = useApp()
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { from:'rider', text:"I'm on my way to pick up your package!", time:'7:02 AM' },
  ])
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [riderPos, setRiderPos] = useState(null)
  const [eta, setEta] = useState(18)
  const intervalRef = useRef(null)

  const order = orders?.find(o=>o.id===id||o.tracking_id===id) || MOCK_ORDER
  const rider = order.rider || MOCK_ORDER.rider
  const currentStep = STATUS_ORDER.indexOf(order.status)
  const isActive = ['pending','accepted','pickup','transit'].includes(order.status)

  // Simulate rider movement
  useEffect(() => {
    const pLat = order.pickup_lat || 5.4527
    const pLng = order.pickup_lng || 7.5248
    const dLat = order.dropoff_lat || 5.5134
    const dLng = order.dropoff_lng || 7.5011
    setRiderPos([pLat + (dLat-pLat)*0.3, pLng + (dLng-pLng)*0.3])

    if (isActive) {
      let step = 0.3
      intervalRef.current = setInterval(() => {
        step = Math.min(step + 0.01, 0.95)
        setRiderPos([pLat + (dLat-pLat)*step, pLng + (dLng-pLng)*step])
        setEta(prev => Math.max(1, prev - 0.5))
      }, 4000)
    }
    return () => clearInterval(intervalRef.current)
  }, [order.id])

  const center = riderPos || [5.4527, 7.5248]
  const pickupCoords = [order.pickup_lat||5.4527, order.pickup_lng||7.5248]
  const dropCoords   = [order.dropoff_lat||5.5134, order.dropoff_lng||7.5011]
  const route = [pickupCoords, riderPos||center, dropCoords]

  const copyTracking = () => {
    navigator.clipboard?.writeText(order.tracking_id).catch(()=>{})
    showToast('Tracking ID copied', 'success')
  }

  const sendChat = () => {
    if (!chatMsg.trim()) return
    const now = new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})
    setChatHistory(h=>[...h, { from:'me', text:chatMsg, time:now }])
    setChatMsg('')
    setTimeout(() => {
      setChatHistory(h=>[...h, { from:'rider', text:"Got it! I'll be there soon.", time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) }])
    }, 2000)
  }

  const SHEET_H = sheetExpanded ? '72%' : '44%'

  return (
    <div className="relative overflow-hidden bg-gray-100" style={{height:'100dvh'}}>

      {/* ── MAP ── */}
      <div className="absolute inset-0 z-0" style={{bottom: SHEET_H, transition:'bottom 0.3s ease'}}>
        <MapContainer center={center} zoom={13} style={{width:'100%',height:'100%'}} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <MapController center={riderPos}/>
          {riderPos && <Marker position={riderPos} icon={riderIcon}><Popup>{rider.name}</Popup></Marker>}
          <Marker position={pickupCoords} icon={pickupIcon}/>
          <Marker position={dropCoords} icon={dropoffIcon}/>
          {isActive && <Polyline positions={route} color="#0A1628" weight={3} dashArray="8,6" opacity={0.7}/>}
        </MapContainer>
      </div>

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between"
        style={{background:'linear-gradient(to bottom, rgba(255,255,255,.95) 70%, transparent)'}}>
        <button onClick={()=>navigate(-1)} className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-700"/>
        </button>
        <div className="bg-white rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive?'bg-green-500 animate-pulse':'bg-gray-400'}`}/>
          <span className="text-xs font-bold text-gray-800 capitalize">{order.status}</span>
          {isActive && <span className="text-xs text-gray-500">• {Math.round(eta)} min</span>}
        </div>
        <button onClick={copyTracking} className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
          <Copy size={16} className="text-gray-700"/>
        </button>
      </div>

      {/* ── ETA FLOATING PILL ── */}
      {isActive && riderPos && (
        <div className="absolute z-10 left-4 right-4 flex justify-center"
          style={{bottom:`calc(${SHEET_H} + 12px)`, transition:'bottom 0.3s ease'}}>
          <div className="bg-gray-900 text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-xl">
            <Navigation size={13} className="text-green-400"/>
            <span className="text-xs font-bold">Rider is {Math.round(eta)} min away</span>
          </div>
        </div>
      )}

      {/* ── BOTTOM SHEET ── */}
      <div className="absolute left-0 right-0 bottom-0 z-20 flex flex-col bg-white rounded-t-3xl shadow-2xl"
        style={{height:SHEET_H, transition:'height 0.3s ease'}}>

        {/* Handle */}
        <button onClick={()=>setSheetExpanded(!sheetExpanded)} className="flex flex-col items-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full"/>
          {sheetExpanded ? <ChevronDown size={14} className="text-gray-400 mt-1"/> : <ChevronUp size={14} className="text-gray-400 mt-1"/>}
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* Tracking ID + status */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm font-bold text-gray-900">{order.tracking_id}</span>
              <button onClick={copyTracking} className="text-xs text-blue-500 font-semibold flex items-center gap-1">
                <Copy size={11}/> Copy
              </button>
            </div>
            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('en',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
          </div>

          {/* Timeline */}
          <div className="px-5 mb-4">
            <div className="space-y-0">
              {STATUS_STEPS.map((s,i)=>{
                const done = i <= currentStep
                const active = i === currentStep
                return (
                  <div key={s.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${done?'bg-gray-900 border-gray-900 text-white':active?'border-gray-900 text-gray-900':'border-gray-200 text-gray-300'}`}>
                        {done && i < currentStep ? <CheckCircle size={13}/> : s.icon}
                      </div>
                      {i < STATUS_STEPS.length-1 && <div className={`w-0.5 h-6 ${i<currentStep?'bg-gray-900':'bg-gray-100'}`}/>}
                    </div>
                    <div className="pt-1 pb-2">
                      <p className={`text-xs font-bold ${done?'text-gray-900':'text-gray-400'}`}>{s.label}</p>
                      {active && <p className="text-xs text-orange-500 font-medium">{s.desc}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rider card */}
          {['accepted','pickup','transit','delivered'].includes(order.status) && (
            <div className="mx-5 mb-4 bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {rider.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{rider.name}</p>
                  <p className="text-xs text-gray-500">{rider.vehicle} • {rider.plate}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400"/>
                    <span className="text-xs font-semibold text-gray-700">{rider.rating}</span>
                    <span className="text-xs text-gray-400">({rider.deliveries} deliveries)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${rider.phone}`} className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone size={16} className="text-green-600"/>
                  </a>
                  <button onClick={()=>setShowChat(true)} className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageCircle size={16} className="text-blue-600"/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Route */}
          <div className="mx-5 mb-4 border border-gray-100 rounded-2xl divide-y divide-gray-50">
            <div className="flex items-start gap-3 p-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"/>
              <div><p className="text-xs text-gray-400">Pickup</p><p className="text-sm font-semibold text-gray-800 leading-tight">{order.pickup_address}</p></div>
            </div>
            <div className="flex items-start gap-3 p-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"/>
              <div><p className="text-xs text-gray-400">Dropoff</p><p className="text-sm font-semibold text-gray-800 leading-tight">{order.dropoff_address}</p></div>
            </div>
          </div>

          {/* Price + cancel */}
          <div className="mx-5 mb-4 flex items-center justify-between bg-gray-50 rounded-2xl p-4">
            <div><p className="text-xs text-gray-400">Total</p><p className="font-black text-lg text-gray-900">₦{Number(order.price).toLocaleString()}</p></div>
            {order.status==='pending' && (
              <button onClick={()=>setCancelConfirm(true)} className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-xl">
                <X size={13}/> Cancel
              </button>
            )}
            {order.status==='delivered' && (
              <button onClick={()=>navigate(`/customer/rate/${order.id}`)} className="flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-2 rounded-xl">
                <Star size={13}/> Rate Rider
              </button>
            )}
          </div>
          <div className="h-4"/>
        </div>
      </div>

      {/* ── CHAT MODAL ── */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex flex-col max-w-[430px] mx-auto">
          <div className="bg-gray-900 px-4 py-4 flex items-center gap-3 flex-shrink-0">
            <button onClick={()=>setShowChat(false)} className="text-white/70"><ArrowLeft size={20}/></button>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">{rider.name.charAt(0)}</div>
            <div><p className="text-white font-bold text-sm">{rider.name}</p><p className="text-white/50 text-xs">Your Rider</p></div>
            <a href={`tel:${rider.phone}`} className="ml-auto w-9 h-9 bg-white/10 rounded-full flex items-center justify-center"><Phone size={16} className="text-white"/></a>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
            {chatHistory.map((m,i)=>(
              <div key={i} className={`flex ${m.from==='me'?'justify-end':''}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.from==='me'?'bg-gray-900 text-white':'bg-white text-gray-900 border border-gray-100'}`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-0.5 ${m.from==='me'?'text-white/50':'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 flex-shrink-0">
            <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()}
              placeholder="Type a message…" className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm"/>
            <button onClick={sendChat} className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-bold">→</button>
          </div>
        </div>
      )}

      {/* ── CANCEL CONFIRM ── */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setCancelConfirm(false)}/>
          <div className="relative z-10 w-full max-w-[430px] bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle size={22} className="text-red-500"/></div>
              <h3 className="font-black text-gray-900 text-lg">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mt-1">A cancellation fee may apply if a rider has already been assigned.</p>
            </div>
            <div className="space-y-2">
              <button onClick={()=>{ showToast('Order cancelled','success'); setCancelConfirm(false); navigate('/customer/orders') }}
                className="w-full bg-red-500 text-white font-bold py-3.5 rounded-2xl text-sm">Yes, Cancel Order</button>
              <button onClick={()=>setCancelConfirm(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl text-sm">Keep Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
