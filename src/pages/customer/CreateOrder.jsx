import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Search, Plus, X, CheckCircle, ChevronRight, ArrowUpDown, Landmark, Shield, Package, BookOpen, FileText, Shirt, Pill, MoreHorizontal, Bike, Truck, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Spinner, Modal } from '../../components/ui'

const SERVICE_LABELS = { standard:'Standard Order', bulk:'Bulk Order', heavy:'Heavy & Relocation', interstate:'Inter-State Order' }
const VEHICLE_OPTIONS = [
  { id:'bike',  icon:<Bike size={22}/>,  label:'Instant – Bike',  sub:'1–2 hrs • Max 5 kg',   price:2500 },
  { id:'van',   icon:<Truck size={22}/>, label:'Same Day – Van',  sub:'3–5 hrs • Max 100 kg',  price:8000 },
  { id:'truck', icon:<Truck size={22}/>, label:'Heavy – Truck',   sub:'Same day • Up to 5 tons',price:25000 },
]
const PKG_CATS = [
  { id:'food',      label:'Food',      icon:<Package size={16}/> },
  { id:'books',     label:'Books',     icon:<BookOpen size={16}/> },
  { id:'document',  label:'Document',  icon:<FileText size={16}/> },
  { id:'cloths',    label:'Clothes',   icon:<Shirt size={16}/> },
  { id:'medicine',  label:'Medicine',  icon:<Pill size={16}/> },
  { id:'others',    label:'Others',    icon:<MoreHorizontal size={16}/> },
]
const PKG_SIZES = [
  { id:'small',  label:'Small',  sub:'Max. 5 kg' },
  { id:'medium', label:'Medium', sub:'Max. 20 kg' },
  { id:'large',  label:'Large',  sub:'Max. 100 kg' },
]
const PROTECTION = [
  { id:'silver',   label:'Silver',   price:2000,  color:'text-slate-500',  cover:'Coverage up to ₦500,000/month' },
  { id:'gold',     label:'Gold',     price:4000,  color:'text-amber-500',  cover:'Coverage up to ₦2,000,000/month' },
  { id:'platinum', label:'Platinum', price:8000,  color:'text-blue-500',   cover:'Coverage up to ₦5,000,000/month' },
]

const fmt = n => '₦' + Number(n).toLocaleString()

function SizeSheet({ value, onChange, onClose }) {
  const [sel, setSel] = useState(value)
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-gray-900">What's your package size?</h2>
        <p className="text-sm text-gray-400 mt-0.5">This helps the driver prepare & handle your packages better.</p>
      </div>
      <div className="space-y-2">
        {PKG_SIZES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            className={`w-full flex items-center justify-between py-3.5 px-1 border-b border-gray-100 ${sel===s.id?'opacity-100':'opacity-60'}`}>
            <span className="font-semibold text-gray-900 text-sm">{s.label} ({s.sub})</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel===s.id?'border-gray-900 bg-gray-900':'border-gray-300'}`}>
              {sel===s.id && <div className="w-2 h-2 rounded-full bg-white"/>}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { onChange(sel); onClose() }}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl mt-4">
        Save
      </button>
    </div>
  )
}

export default function CreateOrder() {
  const { user, submitOrder, showToast } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const type = params.get('type') || 'standard'

  // Form state
  const [step, setStep]         = useState('booking') // booking | delivery | pricing | done
  const [pickup, setPickup]     = useState({ name:'', phone:'', address:'' })
  const [dropoff, setDropoff]   = useState({ name:'', phone:'', address:'' })
  const [stops, setStops]       = useState([])
  const [pkgSize, setPkgSize]   = useState('small')
  const [pkgCat, setPkgCat]     = useState(null)
  const [protection, setProtect]= useState(null)
  const [vehicle, setVehicle]   = useState('bike')
  const [landmark, setLandmark] = useState('')
  const [guarantee, setGuarantee]=useState(false)
  const [loading, setLoading]   = useState(false)
  const [trackId, setTrackId]   = useState('')
  const [sizeSheet, setSizeSheet]=useState(false)

  const basePrice = VEHICLE_OPTIONS.find(v=>v.id===vehicle)?.price || 2500
  const protPrice = PROTECTION.find(p=>p.id===protection)?.price || 0
  const guarPrice = guarantee ? 3400 : 0
  const total     = basePrice + protPrice + guarPrice

  const canGoDelivery = pickup.address.length > 3 && dropoff.address.length > 3
  const canGoPricing  = dropoff.name.length > 1 && dropoff.phone.length > 7 && pkgCat

  async function handleConfirm() {
    if (!user) { navigate(`/login?return=/customer/orders/create?type=${type}`); return }
    setLoading(true)
    try {
      const order = await submitOrder({
        service_type: type,
        pickup_address: pickup.address,
        pickup_name: pickup.name,
        pickup_phone: pickup.phone,
        dropoff_address: dropoff.address,
        dropoff_name: dropoff.name,
        dropoff_phone: dropoff.phone,
        landmark,
        package_size: pkgSize,
        package_category: pkgCat,
        protection_tier: protection || 'none',
        delivery_guarantee: guarantee,
        price: total,
        payment_method: 'wallet',
      })
      setTrackId(order.tracking_id)
      setStep('done')
    } catch (e) {
      showToast(e.message || 'Order failed', 'error')
    } finally { setLoading(false) }
  }

  /* ── DONE ── */
  if (step === 'done') return (
    <div className="h-dvh bg-gray-900 flex flex-col items-center justify-center px-8 text-center max-w-[430px] mx-auto">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-white font-black text-2xl mb-2">Order Placed!</h1>
      <p className="text-gray-400 text-sm mb-6">Your delivery is confirmed and being processed.</p>
      <div className="bg-white/10 border border-white/10 rounded-2xl px-8 py-4 mb-10 w-full">
        <p className="text-gray-400 text-xs mb-1">Tracking ID</p>
        <p className="text-white font-mono font-black text-xl">{trackId}</p>
      </div>
      <button onClick={() => navigate('/')} className="w-full bg-white text-gray-900 font-black py-4 rounded-2xl mb-3">Back to Home</button>
      <button onClick={() => navigate('/customer/orders')} className="text-gray-400 text-sm underline">View my orders</button>
    </div>
  )

  const title = SERVICE_LABELS[type] || 'New Delivery'

  /* ── SHARED HEADER ── */
  const Header = () => (
    <div className="flex items-center justify-center px-4 py-4 border-b border-gray-100 relative">
      <button onClick={() => step==='booking' ? navigate(-1) : setStep(step==='delivery'?'booking':'delivery')}
        className="absolute left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <ArrowLeft size={16} className="text-gray-700" />
      </button>
      <h1 className="font-bold text-gray-900 text-base">{title}</h1>
    </div>
  )

  /* ── BOOKING DETAILS ── */
  if (step === 'booking') return (
    <div className="h-dvh flex flex-col bg-white max-w-[430px] mx-auto">
      <Header />
      <div className="flex-1 overflow-y-auto">

        {/* Section: Booking Details */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm">Booking Details</h2>
            {stops.length < 2 && (
              <button onClick={() => setStops(s=>[...s,{name:'',phone:'',address:''}])}
                className="flex items-center gap-1 text-xs font-bold text-orange-500">
                <Plus size={12}/> Add delivery
              </button>
            )}
          </div>

          {/* Pickup row */}
          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
            <LocationRow
              icon={<div className="w-3 h-3 rounded-full border-2 border-gray-800"/>}
              data={pickup} onChange={setPickup}
              placeholder="Pickup location"
            />
            {/* swap */}
            <div className="flex justify-center py-0.5 bg-gray-50">
              <button onClick={() => { const tmp=pickup; setPickup(dropoff); setDropoff(tmp) }}
                className="text-gray-400"><ArrowUpDown size={14}/></button>
            </div>
            <LocationRow
              icon={<div className="w-3 h-3 rounded-full bg-gray-900"/>}
              data={dropoff} onChange={setDropoff}
              placeholder="Dropoff location"
            />
            {stops.map((s,i) => (
              <div key={i} className="relative">
                <LocationRow icon={<div className="w-3 h-3 rounded-full border-2 border-orange-400"/>}
                  data={s} onChange={v=>setStops(arr=>arr.map((x,j)=>j===i?v:x))} placeholder={`Stop ${i+1}`} />
                <button onClick={()=>setStops(arr=>arr.filter((_,j)=>j!==i))}
                  className="absolute top-3 right-3 text-gray-300"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Package info chips */}
        <div className="px-4 pb-4">
          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50">
            <button onClick={() => setSizeSheet(true)}
              className="w-full flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Package size={16}/>
                <span className="text-sm">{pkgCat ? PKG_CATS.find(c=>c.id===pkgCat)?.label : 'Item category'}</span>
              </div>
              <span className="text-xs text-gray-400">Tap to change</span>
            </button>
            <button onClick={() => setSizeSheet(true)}
              className="w-full flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Shield size={16}/>
                <span className="text-sm">{protection ? `${protection.charAt(0).toUpperCase()+protection.slice(1)} protection` : 'No protection'}</span>
              </div>
              <span className="text-xs text-gray-400">{protection ? fmt(PROTECTION.find(p=>p.id===protection)?.price) : 'Optional'}</span>
            </button>
          </div>
        </div>

        {/* Total weight */}
        <div className="px-4 pb-2">
          <button onClick={() => setSizeSheet(true)}
            className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center">
                <Package size={16} className="text-gray-500"/>
              </div>
              <span className="text-sm font-medium text-gray-700">Total weight</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{PKG_SIZES.find(s=>s.id===pkgSize)?.label} ({PKG_SIZES.find(s=>s.id===pkgSize)?.sub})</span>
              <ChevronRight size={14}/>
            </div>
          </button>
        </div>

        {/* Delivery guarantee */}
        <div className="px-4 pb-4">
          <div className="border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <Star size={18} className="text-yellow-500 fill-yellow-500"/>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">1 hour delivery guarantee</p>
              <p className="text-xs text-gray-400">If we're late, you'll get a voucher for next time.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">{fmt(3400)}</span>
              <button onClick={()=>setGuarantee(!guarantee)}
                className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all ${guarantee?'bg-gray-900':'bg-gray-200'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${guarantee?'translate-x-5':''}`}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={() => canGoDelivery ? setStep('delivery') : showToast('Enter pickup & dropoff addresses','warning')}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${canGoDelivery?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'}`}>
          Continue
        </button>
      </div>

      {/* Package size sheet */}
      {sizeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="sheet-backdrop" onClick={()=>setSizeSheet(false)}/>
          <div className="relative z-50 w-full max-w-[430px] bg-white rounded-t-3xl px-5 pt-5 pb-8 anim-slide-up">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"/>
            <SizeSheet value={pkgSize} onChange={setPkgSize} onClose={()=>setSizeSheet(false)}/>
          </div>
        </div>
      )}
    </div>
  )

  /* ── DELIVERY DETAILS ── */
  if (step === 'delivery') return (
    <div className="h-dvh flex flex-col bg-white max-w-[430px] mx-auto">
      <Header />
      <div className="flex-1 overflow-y-auto">

        {/* Map thumbnail */}
        <div className="h-40 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-gray-400"/>
          </div>
          <button className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Tap to set on map</span>
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Dropoff address display */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
            <Landmark size={18} className="text-gray-400 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Dropoff</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{dropoff.address || 'Enter address below'}</p>
            </div>
            <button onClick={()=>setStep('booking')} className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Edit</button>
          </div>

          {/* Address input if empty */}
          {!dropoff.address && (
            <div className="relative">
              <input value={dropoff.address} onChange={e=>setDropoff(d=>({...d,address:e.target.value}))}
                placeholder="Enter exact dropoff address"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pr-10 text-sm"/>
              <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            </div>
          )}

          {/* Landmark */}
          <div className="relative">
            <input value={landmark} onChange={e=>setLandmark(e.target.value)}
              placeholder="Any landmark near here? (optional)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pr-4 text-sm"/>
          </div>

          <div className="h-px bg-gray-100"/>

          {/* Recipient details */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Recipient details</h3>
            {(dropoff.name||dropoff.phone) && (
              <button onClick={()=>setDropoff(d=>({...d,name:'',phone:''}))} className="text-xs text-orange-500 font-semibold">Clear details</button>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Recipient's name *</label>
            <input value={dropoff.name} onChange={e=>setDropoff(d=>({...d,name:e.target.value}))}
              placeholder="Full name"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm"/>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Phone number *</label>
            <input value={dropoff.phone} onChange={e=>setDropoff(d=>({...d,phone:e.target.value}))}
              placeholder="+234 xxx xxx xxxx" type="tel"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm"/>
          </div>

          {/* Package category */}
          <div className="h-px bg-gray-100"/>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">What kind of package?*</h3>
            <div className="grid grid-cols-3 gap-2">
              {PKG_CATS.map(c => (
                <button key={c.id} onClick={()=>setPkgCat(c.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all text-xs font-semibold ${pkgCat===c.id?'border-gray-900 bg-gray-50 text-gray-900':'border-gray-100 text-gray-500'}`}>
                  {c.icon}
                  {c.label}
                </button>
              ))}
            </div>
            {!pkgCat && <p className="text-xs text-red-500 mt-2 flex items-center gap-1">Please select a package type</p>}
          </div>

          {/* Protection */}
          <div className="h-px bg-gray-100"/>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Package protection</h3>
            <p className="text-xs text-gray-400 mb-3">Enhanced coverage for any risk of damage or loss.</p>
            <div className="space-y-2">
              {PROTECTION.map(p => (
                <button key={p.id} onClick={()=>setProtect(protection===p.id?null:p.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${protection===p.id?'border-gray-900':'border-gray-100'}`}>
                  <Shield size={18} className={p.color}/>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900 capitalize">{p.label} protection — {fmt(p.price)}</p>
                    <p className="text-xs text-gray-400">{p.cover}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${protection===p.id?'border-gray-900':'border-gray-200'}`}>
                    {protection===p.id&&<div className="w-2.5 h-2.5 rounded-full bg-gray-900"/>}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="h-20"/>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={()=>canGoPricing?setStep('pricing'):showToast('Complete required fields','warning')}
          className={`w-full py-4 rounded-2xl font-bold text-sm ${canGoPricing?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'}`}>
          Continue
        </button>
      </div>
    </div>
  )

  /* ── PRICING / VEHICLE SELECTION ── */
  if (step === 'pricing') return (
    <div className="h-dvh flex flex-col bg-white max-w-[430px] mx-auto">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Route summary */}
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-700 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">From</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{pickup.address||'Pickup location'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">To — {dropoff.name}</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{dropoff.address}</p>
            </div>
          </div>
        </div>

        {/* Guarantee toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
          <Star size={18} className="text-yellow-500 fill-yellow-500 flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">1 hour delivery guarantee</p>
            <p className="text-xs text-gray-400">If we're late, you get a voucher.</p>
          </div>
          <span className="text-sm font-bold text-gray-700">{fmt(3400)}</span>
          <button onClick={()=>setGuarantee(!guarantee)}
            className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-all ${guarantee?'bg-gray-900':'bg-gray-200'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${guarantee?'translate-x-5':''}`}/>
          </button>
        </div>

        {/* Vehicle selection */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Choose vehicle</h3>
          <div className="space-y-2">
            {VEHICLE_OPTIONS.map(v => (
              <button key={v.id} onClick={()=>setVehicle(v.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${vehicle===v.id?'border-gray-900 bg-gray-50':'border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${vehicle===v.id?'bg-gray-900 text-white':'bg-gray-100 text-gray-500'}`}>
                  {v.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 text-sm">{v.label}</p>
                  <p className="text-xs text-gray-400">{v.sub}</p>
                </div>
                <p className="font-black text-gray-900 text-base">{fmt(v.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery fee</span><span className="font-semibold">{fmt(basePrice)}</span></div>
          {protPrice>0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Protection</span><span className="font-semibold">{fmt(protPrice)}</span></div>}
          {guarantee && <div className="flex justify-between text-sm"><span className="text-gray-500">1-hr guarantee</span><span className="font-semibold">{fmt(guarPrice)}</span></div>}
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-gray-900 text-lg">{fmt(total)}</span>
          </div>
        </div>
        <div className="h-4"/>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={handleConfirm} disabled={loading}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Spinner size={18} className="border-white/30 border-t-white"/>Processing...</> : `Confirm & Pay ${fmt(total)}`}
        </button>
      </div>
    </div>
  )

  return null
}

function LocationRow({ icon, data, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0 space-y-1">
        <input value={data.address} onChange={e=>onChange({...data,address:e.target.value})}
          placeholder={placeholder}
          className="w-full text-sm font-semibold text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none" />
        <div className="flex gap-2">
          <input value={data.name} onChange={e=>onChange({...data,name:e.target.value})}
            placeholder="Name" className="flex-1 text-xs text-gray-400 bg-transparent border-none outline-none placeholder-gray-300"/>
          <input value={data.phone} onChange={e=>onChange({...data,phone:e.target.value})}
            placeholder="Phone" type="tel" className="flex-1 text-xs text-gray-400 bg-transparent border-none outline-none placeholder-gray-300"/>
        </div>
      </div>
    </div>
  )
}
