import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Search, Package, HandMetal, Plus, X, CreditCard, Wallet, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/mockData';

const LABELS = { standard:'Standard Order', bulk:'Bulk Order', heavy:'Heavy & Relocation', interstate:'Inter-State Order' };

const ITEM_TYPES = [
  { id:'packaged',  label:'Packaged',         icon:<Package  size={26} strokeWidth={1.5} className="text-amber-600" />, bg:'bg-amber-50'  },
  { id:'fragile',   label:'Handle With Care',  icon:<HandMetal size={26} strokeWidth={1.5} className="text-green-600" />, bg:'bg-green-50'  },
];

const PRICES = { bulk:8500, heavy:25000, interstate:45000, standard:2500 };

export default function CreateOrder() {
  const { user, createOrder, wallet } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type') || 'standard';

  const [step, setStep]         = useState('location');
  const [pickup, setPickup]     = useState('');
  const [dropoff, setDropoff]   = useState('');
  const [stops, setStops]       = useState([]);
  const [itemType, setItemType] = useState(null);
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [note, setNote]         = useState('');
  const [pay, setPay]           = useState('wallet');
  const [loading, setLoading]   = useState(false);
  const [trackId, setTrackId]   = useState('');

  const price = PRICES[type] + (type === 'standard' ? stops.length * 800 : 0);
  const locOk  = pickup.trim().length > 3 && dropoff.trim().length > 3 && itemType;
  const detOk  = name.trim().length > 1 && phone.trim().length > 7;

  const goNext = () => {
    if (step === 'location') {
      if (!locOk) return;
      if (!user) { navigate(`/login?return=/customer/orders/create?type=${type}`); return; }
      setStep('details');
    } else if (step === 'details') {
      if (!detOk) return;
      setStep('payment');
    }
  };

  const submit = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const o = createOrder?.({ pickupAddress:pickup, dropoffAddress:dropoff, packageType:type, price, recipientName:name, recipientPhone:phone, note, paymentMethod:pay, itemType });
    setTrackId(o?.trackingId || 'AMP-' + Math.floor(Math.random()*9000+1000));
    setStep('done');
    setLoading(false);
  };

  /* ── DONE SCREEN ── */
  if (step === 'done') return (
    <div className="min-h-dvh bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
        <CheckCircle size={34} className="text-white" />
      </div>
      <h1 className="text-white font-black text-2xl mb-1">Order Placed!</h1>
      <p className="text-white/50 text-sm mb-4">Your order has been confirmed.</p>
      <div className="bg-white/10 rounded-xl px-6 py-3 mb-8">
        <p className="text-white/40 text-xs mb-0.5">Tracking ID</p>
        <p className="text-white font-mono font-bold text-lg">{trackId}</p>
      </div>
      <button onClick={() => navigate('/')} className="w-full bg-white text-navy-900 font-bold py-3.5 rounded-2xl mb-3 text-sm">
        Back to Home
      </button>
      <button onClick={() => navigate('/customer/orders')} className="text-white/50 text-xs underline">
        View all orders
      </button>
    </div>
  );

  const title = LABELS[type] || 'New Order';
  const steps = ['location','details','payment'];

  return (
    <div className="flex flex-col bg-slate-100" style={{ height:'100dvh' }}>

      {/* ── HEADER ── */}
      <div className="bg-navy-900 px-4 pt-3 pb-4 flex-shrink-0">
        <button onClick={() => step === 'location' ? navigate(-1) : setStep(steps[steps.indexOf(step)-1])} className="mb-3">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">{title}</h1>
        <div className="flex gap-1.5 mt-2">
          {steps.map(s => (
            <div key={s} className={`h-1 rounded-full flex-1 transition-all ${steps.indexOf(step) >= steps.indexOf(s) ? 'bg-white' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* ── LOCATION STEP ── */}
      {step === 'location' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

            {/* Location card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-sm mb-3">Where's Your Package Going?</h2>

              {/* Pickup row */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="flex flex-col items-center pt-2.5 flex-shrink-0">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-white" />
                  <div className="w-px h-6 border-l border-dashed border-slate-300 my-1" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Pickup Location</p>
                  <div className="relative">
                    <input value={pickup} onChange={e=>setPickup(e.target.value)}
                      placeholder="Enter Exact Pickup Location"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-xs bg-slate-50 focus:bg-white" />
                    <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Extra stops */}
              {stops.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 mb-2">
                  <div className="flex flex-col items-center pt-2.5 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 bg-blue-50" />
                    <div className="w-px h-6 border-l border-dashed border-slate-300 my-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-semibold text-slate-400">Stop {i+1}</p>
                      <button onClick={() => setStops(v=>v.filter((_,j)=>j!==i))}><X size={12} className="text-slate-400" /></button>
                    </div>
                    <input value={s} onChange={e=>setStops(v=>v.map((x,j)=>j===i?e.target.value:x))}
                      placeholder="Stop address"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50" />
                  </div>
                </div>
              ))}

              {/* Dropoff row */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-2.5">
                  <MapPin size={8} className="text-white" fill="white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Dropoff Location</p>
                  <div className="relative">
                    <input value={dropoff} onChange={e=>setDropoff(e.target.value)}
                      placeholder="Enter Exact Dropoff Location"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-xs bg-slate-50 focus:bg-white" />
                    <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {type === 'bulk' && (
                <button onClick={() => setStops(v=>[...v,''])}
                  className="flex items-center gap-1 text-navy-900 text-xs font-semibold mt-2.5 ml-6">
                  <Plus size={12} /> Add another stop
                </button>
              )}
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 ml-6">
                Tip: Type the specific location — a street, neighbourhood, or landmark.
              </p>
            </div>

            {/* Item type */}
            <div>
              <h2 className="font-bold text-navy-900 text-sm mb-2.5">What Are We Handling?</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {ITEM_TYPES.map(t => (
                  <button key={t.id} onClick={() => setItemType(t.id)}
                    className={`bg-white rounded-2xl p-3.5 text-left border-2 transition-all shadow-sm ${itemType===t.id ? 'border-navy-900' : 'border-transparent'}`}>
                    <div className={`w-11 h-11 ${t.bg} rounded-xl flex items-center justify-center mb-2`}>
                      {t.icon}
                    </div>
                    <p className="font-bold text-navy-900 text-sm">{t.label}</p>
                    <ArrowRight size={13} className="text-slate-400 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price preview */}
            {pickup && dropoff && (
              <div className="bg-navy-900 rounded-2xl px-4 py-3 flex items-center justify-between">
                <p className="text-white/60 text-xs">Estimated Price</p>
                <p className="text-white font-black text-lg">{formatCurrency(price)}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="px-3 py-3 bg-white border-t border-slate-100 flex-shrink-0">
            <button onClick={goNext} disabled={!locOk}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${locOk ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {!user ? 'Login to Continue' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── DETAILS STEP ── */}
      {step === 'details' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-sm mb-3">Recipient Details</h2>
              <div className="space-y-2.5">
                {[
                  { label:'Recipient Name', val:name, set:setName, ph:'Full name', type:'text' },
                  { label:'Phone Number', val:phone, set:setPhone, ph:'08012345678', type:'tel' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">{f.label}</label>
                    <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} type={f.type}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Delivery Note (Optional)</label>
                  <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Any special instructions?" rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-navy-900 text-sm mb-2.5">Order Summary</h3>
              <div className="space-y-1.5 text-sm">
                {[['From', pickup],['To', dropoff],['Type', itemType]].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400 text-xs">{k}</span>
                    <span className="font-medium text-navy-900 text-xs text-right max-w-[60%] truncate capitalize">{v}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-1.5 flex justify-between">
                  <span className="font-bold text-navy-900 text-sm">Total</span>
                  <span className="font-black text-navy-900 text-base">{formatCurrency(price)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 py-3 bg-white border-t border-slate-100 flex-shrink-0">
            <button onClick={goNext} disabled={!detOk}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 ${detOk ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── PAYMENT STEP ── */}
      {step === 'payment' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-sm mb-3">Choose Payment Method</h2>
              <div className="space-y-2">
                {[
                  { id:'wallet',   icon:<Wallet size={18} />,     label:'Wallet Balance',  sub: formatCurrency(wallet?.balance||0) },
                  { id:'card',     icon:<CreditCard size={18} />, label:'Debit/Credit Card',sub:'Visa, Mastercard, Verve' },
                  { id:'transfer', icon:<ChevronRight size={18}/>,label:'Bank Transfer',    sub:'Transfer to account' },
                ].map(m => (
                  <button key={m.id} onClick={() => setPay(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${pay===m.id ? 'border-navy-900 bg-navy-50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${pay===m.id ? 'bg-navy-900 text-white' : 'bg-white text-slate-500'}`}>{m.icon}</div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-navy-900 text-xs">{m.label}</p>
                      <p className="text-xs text-slate-400">{m.sub}</p>
                    </div>
                    {pay===m.id && <CheckCircle size={16} className="text-navy-900" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-navy-900 rounded-2xl px-4 py-3 flex items-center justify-between">
              <p className="text-white/60 text-xs">Total to pay</p>
              <p className="text-white font-black text-xl">{formatCurrency(price)}</p>
            </div>
          </div>
          <div className="px-3 py-3 bg-white border-t border-slate-100 flex-shrink-0">
            <button onClick={submit} disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-navy-900 text-white disabled:opacity-70">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                : <><CheckCircle size={16} /> Confirm & Pay {formatCurrency(price)}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
