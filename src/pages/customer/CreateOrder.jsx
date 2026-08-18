import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpDown, Plus, X, ChevronRight,
  BookOpen, FileText, Shirt, Pill, MoreHorizontal,
  Shield, Star, CheckCircle, Bike, Truck,
  Package, Layers, Globe, Clock, Calendar,
  Home, Briefcase, Bookmark, AlertCircle,
  Info, ChevronDown, MapPin
} from 'lucide-react'
import { PlacesInput } from '../../components/map/PlacesInput'
import { useApp } from '../../context/AppContext'
import { Spinner } from '../../components/ui'
import * as db from '../../lib/db'

/* ── Constants ─────────────────────────────── */
const fmt = n => '₦' + Number(n || 0).toLocaleString()

const PKG_CATS = [
  { id:'food',      label:'Food',      icon:<Package size={15}/> },
  { id:'books',     label:'Books',     icon:<BookOpen size={15}/> },
  { id:'document',  label:'Document',  icon:<FileText size={15}/> },
  { id:'cloths',    label:'Clothes',   icon:<Shirt size={15}/> },
  { id:'medicine',  label:'Medicine',  icon:<Pill size={15}/> },
  { id:'others',    label:'Others',    icon:<MoreHorizontal size={15}/> },
]

const PKG_SIZES = [
  { id:'small',  label:'Small',  sub:'Max. 5 kg',   icon:'📦' },
  { id:'medium', label:'Medium', sub:'Max. 20 kg',  icon:'📦' },
  { id:'large',  label:'Large',  sub:'Max. 100 kg', icon:'📦' },
]

const PROTECTION_PLANS = [
  { id:'silver',   label:'Silver',   price:2000,  color:'bg-slate-100 text-slate-600',   cover:'₦500K/month' },
  { id:'gold',     label:'Gold',     price:4000,  color:'bg-amber-50 text-amber-600',    cover:'₦2M/month' },
  { id:'platinum', label:'Platinum', price:8000,  color:'bg-blue-50 text-blue-600',      cover:'₦5M/month' },
]

const VEHICLE_OPTIONS = [
  { id:'bike',  icon:<Bike size={20}/>,  label:'Instant – Bike',   sub:'1–2 hrs • Max 5 kg',    price:2500 },
  { id:'van',   icon:<Truck size={20}/>, label:'Same Day – Van',   sub:'3–5 hrs • Max 100 kg',  price:8000 },
  { id:'truck', icon:<Truck size={20}/>, label:'Heavy – Truck',    sub:'Same day • Up to 5 tons',price:25000 },
]

const MOVE_TYPES = [
  { id:'furniture',   label:'Furniture' },
  { id:'electronics', label:'Electronics' },
  { id:'full_home',   label:'Full Home Move' },
  { id:'office',      label:'Office Relocation' },
  { id:'others',      label:'Others' },
]

const SERVICE_META = {
  standard: {
    label: 'Standard Order',
    icon: <Bike size={18}/>,
    color: 'bg-orange-50 text-orange-500',
    description: 'Lightweight packages, max 3 locations',
    maxStops: 3,
    vehicles: ['bike'],
    basePrice: 2500,
  },
  bulk: {
    label: 'Bulk Order',
    icon: <Layers size={18}/>,
    color: 'bg-amber-50 text-amber-600',
    description: 'Fixed price, 4+ delivery locations',
    maxStops: 20,
    vehicles: ['van', 'truck'],
    basePrice: 8500,
  },
  heavy: {
    label: 'Heavy & Relocation',
    icon: <Truck size={18}/>,
    color: 'bg-slate-100 text-slate-700',
    description: 'Big loads, furniture & home moves',
    maxStops: 1,
    vehicles: ['truck'],
    basePrice: 25000,
  },
  interstate: {
    label: 'Inter-State Order',
    icon: <Globe size={18}/>,
    color: 'bg-green-50 text-green-600',
    description: 'Nationwide delivery across Nigeria',
    maxStops: 1,
    vehicles: ['van', 'truck'],
    basePrice: 45000,
  },
}

/* ── Helper: empty location ─────────────────── */
const emptyLoc = (label='') => ({ label, address:'', lat:null, lng:null, placeId:null, name:'', note:'' })

/* ── Size bottom sheet ──────────────────────── */
function SizeSheet({ value, onChange, onClose }) {
  const [sel, setSel] = useState(value || 'small')
  return (
    <div>
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
      <h2 className="text-lg font-black text-gray-900 mb-1">Package size</h2>
      <p className="text-sm text-gray-400 mb-5">Helps drivers prepare & handle packages correctly.</p>
      <div className="space-y-2 mb-6">
        {PKG_SIZES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all ${sel===s.id?'border-gray-900 bg-gray-50':'border-gray-100 bg-white'}`}>
            <div className="text-left">
              <p className={`font-bold text-sm ${sel===s.id?'text-gray-900':'text-gray-600'}`}>{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel===s.id?'border-gray-900 bg-gray-900':'border-gray-300'}`}>
              {sel===s.id && <div className="w-2 h-2 rounded-full bg-white"/>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { onChange(sel); onClose() }}
        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-sm">
        Save Selection
      </button>
    </div>
  )
}

/* ── Saved Address sheet ────────────────────── */
function SavedSheet({ addresses, onSelect, onClose }) {
  return (
    <div>
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"/>
      <h2 className="text-lg font-black text-gray-900 mb-4">Saved Addresses</h2>
      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark size={32} className="text-gray-200 mx-auto mb-2"/>
          <p className="text-sm text-gray-400">No saved addresses yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map(a => (
            <button key={a.id} onClick={() => { onSelect(a); onClose() }}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-left transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.label==='Home'?'bg-blue-100 text-blue-600':a.label==='Work'?'bg-purple-100 text-purple-600':'bg-gray-200 text-gray-600'}`}>
                {a.label==='Home' ? <Home size={18}/> : a.label==='Work' ? <Briefcase size={18}/> : <MapPin size={18}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{a.label}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{a.address}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300"/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Protection sheet ───────────────────────── */
function ProtectionSheet({ value, onChange, onClose }) {
  const [sel, setSel] = useState(value)
  return (
    <div>
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"/>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-blue-600"/>
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900">Package Protection</h2>
          <p className="text-xs text-gray-400 mt-0.5">Enhanced coverage for loss or damage</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {/* No protection */}
        <button onClick={() => setSel(null)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${!sel?'border-gray-900 bg-gray-50':'border-gray-100'}`}>
          <div>
            <p className="font-bold text-sm text-gray-900">No Protection</p>
            <p className="text-xs text-gray-400 mt-0.5">Standard handling, no coverage</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!sel?'border-gray-900 bg-gray-900':'border-gray-300'}`}>
            {!sel && <div className="w-2 h-2 rounded-full bg-white"/>}
          </div>
        </button>
        {PROTECTION_PLANS.map(p => (
          <button key={p.id} onClick={() => setSel(p.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${sel===p.id?'border-gray-900 bg-gray-50':'border-gray-100'}`}>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${p.color}`}>{p.label}</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-gray-900">{fmt(p.price)}<span className="text-xs text-gray-400 font-normal ml-1">/ order</span></p>
              <p className="text-xs text-gray-400">Coverage up to {p.cover}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel===p.id?'border-gray-900 bg-gray-900':'border-gray-300'}`}>
              {sel===p.id && <div className="w-2 h-2 rounded-full bg-white"/>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { onChange(sel); onClose() }}
        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-sm">
        Confirm Protection
      </button>
    </div>
  )
}

/* ── Bottom Sheet wrapper ───────────────────── */
function Sheet({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative z-10 w-full max-w-[430px] bg-white rounded-t-3xl px-5 pt-4 pb-10 anim-slide-up max-h-[88vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

/* ── Location row component ─────────────────── */
function LocationCard({ pickup, dropoff, onPickupChange, onDropoffChange, onSwap,
  extraStops=[], onAddStop, onRemoveStop, onStopChange,
  savedAddresses=[], maxStops=3, showSwap=true }) {

  const [savedSheet, setSavedSheet] = useState(null) // 'pickup' | 'dropoff' | number

  const handleSavedSelect = (addr) => {
    if (savedSheet === 'pickup') onPickupChange({ ...pickup, address: addr.address, lat: addr.lat, lng: addr.lng })
    else if (savedSheet === 'dropoff') onDropoffChange({ ...dropoff, address: addr.address, lat: addr.lat, lng: addr.lng })
    else if (typeof savedSheet === 'number') onStopChange(savedSheet, { ...extraStops[savedSheet], address: addr.address, lat: addr.lat, lng: addr.lng })
    setSavedSheet(null)
  }

  return (
    <>
    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
      {/* Pickup */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full border-2 border-gray-800 flex-shrink-0" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pickup</span>
          {savedAddresses.length > 0 && (
            <button onClick={() => setSavedSheet('pickup')} className="ml-auto flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <Bookmark size={11}/> Saved
            </button>
          )}
        </div>
        <PlacesInput
          value={pickup.address}
          onChange={v => onPickupChange({...pickup, address:v})}
          onSelect={v => v && onPickupChange({...pickup, ...v})}
          savedAddresses={savedAddresses}
          placeholder="Pickup location"
        />
        {pickup.address && (
          <div className="mt-2">
            <input value={pickup.name} onChange={e=>onPickupChange({...pickup,name:e.target.value})}
              placeholder="Sender's name (optional)"
              className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 placeholder-gray-300"/>
          </div>
        )}
      </div>

      {/* Divider with swap */}
      <div className="mx-4 flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-100"/>
        {showSwap && (
          <button onClick={onSwap} className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
            <ArrowUpDown size={13} className="text-gray-500"/>
          </button>
        )}
        <div className="flex-1 h-px bg-gray-100"/>
      </div>

      {/* Dropoff */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-gray-900 flex-shrink-0"/>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dropoff</span>
          {savedAddresses.length > 0 && (
            <button onClick={() => setSavedSheet('dropoff')} className="ml-auto flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <Bookmark size={11}/> Saved
            </button>
          )}
        </div>
        <PlacesInput
          value={dropoff.address}
          onChange={v => onDropoffChange({...dropoff,address:v})}
          onSelect={v => v && onDropoffChange({...dropoff,...v})}
          savedAddresses={savedAddresses}
          placeholder="Dropoff location"
        />
        {dropoff.address && (
          <div className="mt-2">
            <input value={dropoff.name} onChange={e=>onDropoffChange({...dropoff,name:e.target.value})}
              placeholder="Recipient's name (optional)"
              className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 placeholder-gray-300"/>
          </div>
        )}
      </div>

      {/* Extra stops */}
      {extraStops.map((stop, i) => (
        <div key={i} className="border-t border-gray-50 px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full border-2 border-orange-400 flex-shrink-0"/>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stop {i+1}</span>
            <button onClick={() => setSavedSheet(i)} className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <Bookmark size={11}/> Saved
            </button>
            <button onClick={() => onRemoveStop(i)} className="ml-auto w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
              <X size={10} className="text-gray-500"/>
            </button>
          </div>
          <PlacesInput
            value={stop.address}
            onChange={v => onStopChange(i,{...stop,address:v})}
            onSelect={v => v && onStopChange(i,{...stop,...v})}
            savedAddresses={savedAddresses}
            placeholder={`Stop ${i+1} location`}
          />
          {stop.address && (
            <input value={stop.name} onChange={e=>onStopChange(i,{...stop,name:e.target.value})}
              placeholder="Recipient name (optional)"
              className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 placeholder-gray-300 mt-2"/>
          )}
        </div>
      ))}

      {/* Add stop */}
      {(extraStops.length + 2) < maxStops && (
        <button onClick={onAddStop}
          className="w-full flex items-center gap-2 px-5 py-3 border-t border-gray-50 text-orange-500 text-xs font-bold">
          <Plus size={14}/> Add delivery location
        </button>
      )}
    </div>

    <Sheet open={savedSheet !== null} onClose={() => setSavedSheet(null)}>
      <SavedSheet addresses={savedAddresses} onSelect={handleSavedSelect} onClose={() => setSavedSheet(null)}/>
    </Sheet>
    </>
  )
}

/* ── MAIN COMPONENT ────────────────────────── */
export default function CreateOrder() {
  const { user, submitOrder, showToast } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const type = params.get('type') || 'standard'
  const meta = SERVICE_META[type] || SERVICE_META.standard

  // Core state
  const [step, setStep]     = useState('booking')
  const [pickup, setPickup] = useState(emptyLoc('Pickup'))
  const [dropoff, setDropoff] = useState(emptyLoc('Dropoff'))
  const [stops, setStops]   = useState([])

  // Package options
  const [pkgSize, setPkgSize]   = useState('small')
  const [pkgCat, setPkgCat]     = useState(null)
  const [protection, setProtect]= useState(null)
  const [vehicle, setVehicle]   = useState(meta.vehicles[0] || 'bike')
  const [guarantee, setGuarantee] = useState(false)
  const [notes, setNotes]       = useState('')

  // Heavy-specific
  const [moveType, setMoveType]     = useState(null)
  const [needPacking, setNeedPacking] = useState(false)
  const [needDismantle, setNeedDismantle] = useState(false)
  const [schedDate, setSchedDate]   = useState('')
  const [schedTime, setSchedTime]   = useState('')
  const [floorPickup, setFloorPickup] = useState('')
  const [floorDropoff, setFloorDropoff] = useState('')

  // Interstate-specific
  const [depDate, setDepDate]       = useState('')

  // Save address
  const [savePickup, setSavePickup]   = useState(false)
  const [saveDropoff, setSaveDropoff] = useState(false)
  const [pickupLabel, setPickupLabel] = useState('')
  const [dropoffLabel, setDropoffLabel] = useState('')

  // Sheets
  const [sizeSheet, setSizeSheet]       = useState(false)
  const [protectSheet, setProtectSheet] = useState(false)

  // Saved addresses from DB
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [trackId, setTrackId] = useState('')

  useEffect(() => {
    if (user) db.getSavedAddresses(user.id).then(setSavedAddresses).catch(()=>{})
  }, [user])

  // Pricing
  const basePrice = meta.basePrice + stops.length * 1500
  const protPrice = PROTECTION_PLANS.find(p=>p.id===protection)?.price || 0
  const guarPrice = guarantee ? 3400 : 0
  const packPrice = needPacking ? 5000 : 0
  const disPrice  = needDismantle ? 3000 : 0
  const total     = basePrice + protPrice + guarPrice + packPrice + disPrice

  const canContinue = pickup.address.length > 3 && dropoff.address.length > 3 &&
    (type !== 'bulk' || (stops.length + 2) >= 4)

  const handleSwap = () => {
    const tmp = pickup; setPickup(dropoff); setDropoff(tmp)
  }

  const handleSubmit = async () => {
    if (!user) { navigate(`/login?return=/customer/orders/create?type=${type}`); return }
    setLoading(true)
    try {
      const order = await submitOrder({
        service_type: type,
        pickup_address: pickup.address,
        pickup_name: pickup.name,
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        dropoff_address: dropoff.address,
        dropoff_name: dropoff.name,
        dropoff_lat: dropoff.lat,
        dropoff_lng: dropoff.lng,
        package_size: pkgSize,
        package_category: pkgCat,
        protection_tier: protection || 'none',
        delivery_guarantee: guarantee,
        price: total,
        note: notes,
        payment_method: 'wallet',
      })
      // Save addresses if requested
      if (savePickup && pickupLabel && pickup.address && user) {
        db.getSavedAddresses(user.id) // placeholder for save
      }
      setTrackId(order.tracking_id)
      setStep('done')
    } catch (e) {
      showToast(e.message || 'Order failed. Try again.', 'error')
    } finally { setLoading(false) }
  }

  /* ── DONE ── */
  if (step === 'done') return (
    <div className="h-dvh max-w-[430px] mx-auto bg-gray-900 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <CheckCircle size={40} className="text-green-500"/>
      </div>
      <h1 className="text-white font-black text-2xl mb-2">Order Confirmed!</h1>
      <p className="text-gray-400 text-sm mb-6">Your delivery is being processed.</p>
      <div className="bg-white/10 border border-white/10 rounded-2xl px-8 py-4 mb-3 w-full">
        <p className="text-gray-400 text-xs mb-1">Tracking ID</p>
        <p className="text-white font-mono font-black text-xl">{trackId}</p>
      </div>
      <div className="bg-white/10 border border-white/10 rounded-2xl px-8 py-3 mb-10 w-full">
        <p className="text-gray-400 text-xs mb-1">Total Paid</p>
        <p className="text-white font-black text-lg">{fmt(total)}</p>
      </div>
      <button onClick={() => navigate('/')} className="w-full bg-white text-gray-900 font-black py-4 rounded-2xl mb-3 text-sm">
        Back to Home
      </button>
      <button onClick={() => navigate('/customer/orders')} className="text-gray-400 text-sm underline">View all orders</button>
    </div>
  )

  /* ── STEP: PRICING ── */
  if (step === 'pricing') return (
    <div className="h-dvh flex flex-col bg-white max-w-[430px] mx-auto">
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-100 relative">
        <button onClick={() => setStep('booking')} className="absolute left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <h1 className="font-bold text-gray-900 text-base">{meta.label}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Route summary */}
        <div className="bg-gray-50 rounded-3xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-700"/>
              <div className="w-px h-6 bg-gray-200 my-1"/>
              {stops.map((_, i) => <div key={i}><div className="w-2.5 h-2.5 rounded-full border-2 border-orange-400"/><div className="w-px h-6 bg-gray-200 my-1"/></div>)}
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900"/>
            </div>
            <div className="flex-1 space-y-3">
              <div><p className="text-xs text-gray-400">Pickup</p><p className="text-sm font-semibold text-gray-900 leading-tight">{pickup.address}</p></div>
              {stops.map((s,i) => <div key={i}><p className="text-xs text-gray-400">Stop {i+1}</p><p className="text-sm font-semibold text-gray-900">{s.address}</p></div>)}
              <div><p className="text-xs text-gray-400">Dropoff</p><p className="text-sm font-semibold text-gray-900 leading-tight">{dropoff.address}</p></div>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Choose vehicle</h3>
          <div className="space-y-2">
            {VEHICLE_OPTIONS.filter(v => meta.vehicles.includes(v.id)).map(v => (
              <button key={v.id} onClick={() => setVehicle(v.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${vehicle===v.id?'border-gray-900 bg-gray-50':'border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${vehicle===v.id?'bg-gray-900 text-white':'bg-gray-100 text-gray-500'}`}>{v.icon}</div>
                <div className="flex-1 text-left"><p className="font-bold text-sm text-gray-900">{v.label}</p><p className="text-xs text-gray-400">{v.sub}</p></div>
                <p className="font-black text-gray-900">{fmt(v.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <Star size={18} className="text-amber-500 fill-amber-500 flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">1-hour delivery guarantee</p>
            <p className="text-xs text-gray-500 mt-0.5">Get a voucher if we're late</p>
          </div>
          <span className="text-sm font-bold text-gray-700 mr-2">{fmt(3400)}</span>
          <button onClick={() => setGuarantee(!guarantee)}
            className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all flex-shrink-0 ${guarantee?'bg-gray-900':'bg-gray-200'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${guarantee?'translate-x-5':''}`}/>
          </button>
        </div>

        {/* Price breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
          <p className="font-bold text-gray-900 text-sm mb-3">Price Breakdown</p>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Base delivery</span><span className="font-semibold">{fmt(basePrice)}</span></div>
          {protPrice>0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Protection ({protection})</span><span className="font-semibold">{fmt(protPrice)}</span></div>}
          {guarantee && <div className="flex justify-between text-sm"><span className="text-gray-500">1-hr guarantee</span><span className="font-semibold">{fmt(guarPrice)}</span></div>}
          {needPacking && <div className="flex justify-between text-sm"><span className="text-gray-500">Packing service</span><span className="font-semibold">{fmt(packPrice)}</span></div>}
          {needDismantle && <div className="flex justify-between text-sm"><span className="text-gray-500">Dismantling</span><span className="font-semibold">{fmt(disPrice)}</span></div>}
          <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-gray-900 text-xl">{fmt(total)}</span>
          </div>
        </div>
        <div className="h-2"/>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60">
          {loading
            ? <><Spinner size={18} className="border-white/30 border-t-white"/>Processing...</>
            : `Confirm & Pay ${fmt(total)}`}
        </button>
        {!user && <p className="text-center text-xs text-gray-400 mt-2">You'll be asked to login to confirm</p>}
      </div>
    </div>
  )

  /* ── STEP: BOOKING ── */
  return (
    <div className="h-dvh flex flex-col bg-gray-50 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-4 border-b border-gray-100 relative flex-shrink-0">
        <button onClick={() => navigate(-1)} className="absolute left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${meta.color}`}>{meta.icon}</div>
            <h1 className="font-bold text-gray-900 text-base">{meta.label}</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{meta.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* ── BOOKING DETAILS HEADER ── */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm">Booking Details</h2>
          {(stops.length + 2) < meta.maxStops && (
            <button onClick={() => setStops(s=>[...s, emptyLoc(`Stop ${s.length+1}`)])}
              className="flex items-center gap-1 text-orange-500 text-xs font-bold">
              <Plus size={13}/> Add delivery
            </button>
          )}
        </div>

        {/* ── LOCATION CARD ── */}
        <LocationCard
          pickup={pickup} onPickupChange={setPickup}
          dropoff={dropoff} onDropoffChange={setDropoff}
          onSwap={handleSwap}
          extraStops={stops}
          onAddStop={() => setStops(s=>[...s, emptyLoc(`Stop ${s.length+1}`)])}
          onRemoveStop={i => setStops(s=>s.filter((_,j)=>j!==i))}
          onStopChange={(i,v) => setStops(s=>s.map((x,j)=>j===i?v:x))}
          savedAddresses={savedAddresses}
          maxStops={meta.maxStops}
        />

        {/* ── BULK: minimum stops notice ── */}
        {type === 'bulk' && (stops.length + 2) < 4 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <Info size={15} className="text-amber-500 flex-shrink-0"/>
            <p className="text-xs text-amber-700 font-medium">Bulk orders require at least 4 locations. Add {4-(stops.length+2)} more.</p>
          </div>
        )}

        {/* ── PACKAGE OPTIONS ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Category */}
          <button onClick={() => {}} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                <Package size={16} className="text-gray-500"/>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{pkgCat ? PKG_CATS.find(c=>c.id===pkgCat)?.label : 'Item category'}</p>
                <p className="text-xs text-gray-400 mt-0.5">What are you sending?</p>
              </div>
            </div>
            <span className="text-xs text-orange-500 font-bold">Tap to change</span>
          </button>

          {/* Category picker */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div className="grid grid-cols-3 gap-2">
              {PKG_CATS.map(c => (
                <button key={c.id} onClick={() => setPkgCat(c.id)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all text-xs font-semibold ${pkgCat===c.id?'border-gray-900 bg-gray-900 text-white':'border-gray-100 bg-gray-50 text-gray-600'}`}>
                  {c.icon}{c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Protection */}
          <button onClick={() => setProtectSheet(true)} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-gray-500"/>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {protection ? `${protection.charAt(0).toUpperCase()+protection.slice(1)} protection` : 'No protection'}
                </p>
                <p className="text-xs text-gray-400">{protection ? fmt(PROTECTION_PLANS.find(p=>p.id===protection)?.price) + '/order' : 'Optional'}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300"/>
          </button>

          {/* Weight */}
          <button onClick={() => setSizeSheet(true)} className="w-full flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                <Package size={16} className="text-gray-500"/>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Total weight</p>
                <p className="text-xs text-gray-400">{PKG_SIZES.find(s=>s.id===pkgSize)?.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{PKG_SIZES.find(s=>s.id===pkgSize)?.label}</span>
              <ChevronRight size={16} className="text-gray-300"/>
            </div>
          </button>
        </div>

        {/* ── HEAVY-SPECIFIC OPTIONS ── */}
        {type === 'heavy' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Move Type</p>
              <div className="flex flex-wrap gap-2">
                {MOVE_TYPES.map(m => (
                  <button key={m.id} onClick={() => setMoveType(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${moveType===m.id?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-600'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Floor Details</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={floorPickup} onChange={e=>setFloorPickup(e.target.value)}
                  placeholder="Pickup floor/apt" className="text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"/>
                <input value={floorDropoff} onChange={e=>setFloorDropoff(e.target.value)}
                  placeholder="Dropoff floor/apt" className="text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"/>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { label:'Packing service', sub:`+${fmt(5000)}`, val:needPacking, set:setNeedPacking },
                { label:'Dismantling service', sub:`+${fmt(3000)}`, val:needDismantle, set:setNeedDismantle },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between px-4 py-3.5">
                  <div><p className="text-sm font-semibold text-gray-800">{opt.label}</p><p className="text-xs text-gray-400">{opt.sub}</p></div>
                  <button onClick={() => opt.set(!opt.val)}
                    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all ${opt.val?'bg-gray-900':'bg-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${opt.val?'translate-x-5':''}`}/>
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Scheduled Date & Time</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-600"/>
                <input type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-600"/>
              </div>
            </div>
          </div>
        )}

        {/* ── INTERSTATE-SPECIFIC ── */}
        {type === 'interstate' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Departure Date</p>
              <input type="date" value={depDate} onChange={e=>setDepDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                className="w-full text-sm bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-700"/>
            </div>
            <div className="px-4 py-3.5 border-t border-gray-50 bg-blue-50/50">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                <p className="text-xs text-blue-700">Inter-state deliveries typically take 1–3 business days depending on destination. A dedicated agent will contact you to confirm pickup time.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── DELIVERY GUARANTEE ── */}
        {type !== 'interstate' && (
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <Star size={18} className="text-amber-500 fill-amber-500 flex-shrink-0"/>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">1-hr delivery guarantee</p>
              <p className="text-xs text-gray-400">Get a voucher if we're late</p>
            </div>
            <span className="text-sm font-bold text-gray-700">{fmt(3400)}</span>
            <button onClick={() => setGuarantee(!guarantee)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all flex-shrink-0 ${guarantee?'bg-gray-900':'bg-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${guarantee?'translate-x-5':''}`}/>
            </button>
          </div>
        )}

        {/* ── NOTES ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Special Instructions</p>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)}
            placeholder="Any instructions for the rider? (fragile items, building access, etc.)"
            rows={2} className="w-full text-sm bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 resize-none text-gray-700 placeholder-gray-400"/>
        </div>

        {/* ── SAVE ADDRESS ── */}
        {user && (pickup.address || dropoff.address) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 space-y-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Save Addresses</p>
            {pickup.address && (
              <div className="flex items-center gap-3">
                <button onClick={() => setSavePickup(!savePickup)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${savePickup?'bg-gray-900 border-gray-900':'border-gray-300'}`}>
                  {savePickup && <CheckCircle size={12} className="text-white"/>}
                </button>
                <span className="text-xs text-gray-600 flex-1">Save pickup address</span>
                {savePickup && (
                  <input value={pickupLabel} onChange={e=>setPickupLabel(e.target.value)}
                    placeholder="e.g. Home, Work" className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 w-24"/>
                )}
              </div>
            )}
            {dropoff.address && (
              <div className="flex items-center gap-3">
                <button onClick={() => setSaveDropoff(!saveDropoff)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${saveDropoff?'bg-gray-900 border-gray-900':'border-gray-300'}`}>
                  {saveDropoff && <CheckCircle size={12} className="text-white"/>}
                </button>
                <span className="text-xs text-gray-600 flex-1">Save dropoff address</span>
                {saveDropoff && (
                  <input value={dropoffLabel} onChange={e=>setDropoffLabel(e.target.value)}
                    placeholder="e.g. Office" className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 w-24"/>
                )}
              </div>
            )}
          </div>
        )}

        <div className="h-2"/>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 flex-shrink-0">
        <button onClick={() => canContinue ? setStep('pricing') : showToast(type==='bulk'?'Add at least 4 locations for bulk orders':'Enter pickup and dropoff locations','warning')}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${canContinue?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'}`}>
          {canContinue ? 'Continue' : type==='bulk'&&(stops.length+2)<4 ? `Add ${4-(stops.length+2)} more location${4-(stops.length+2)>1?'s':''}` : 'Enter locations to continue'}
        </button>
      </div>

      {/* Sheets */}
      <Sheet open={sizeSheet} onClose={() => setSizeSheet(false)}>
        <SizeSheet value={pkgSize} onChange={setPkgSize} onClose={() => setSizeSheet(false)}/>
      </Sheet>
      <Sheet open={protectSheet} onClose={() => setProtectSheet(false)}>
        <ProtectionSheet value={protection} onChange={setProtect} onClose={() => setProtectSheet(false)}/>
      </Sheet>
    </div>
  )
}
