import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Search, Package, HandMetal, Plus, X, Clock, CreditCard, Wallet, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateId, PACKAGE_TYPES } from '../../utils/mockData';

const STEPS = ['location', 'details', 'payment', 'done'];

const SERVICE_LABELS = {
  standard: 'Standard Order',
  bulk: 'Bulk Order',
  heavy: 'Heavy & Relocation',
  interstate: 'Inter-State Order',
};

const ITEM_TYPES = [
  { id: 'packaged', label: 'Packaged', icon: <Package size={28} strokeWidth={1.5} className="text-amber-700" />, bg: 'bg-amber-50' },
  { id: 'fragile', label: 'Handle With Care', icon: <HandMetal size={28} strokeWidth={1.5} className="text-green-700" />, bg: 'bg-green-50' },
];

export default function CreateOrder() {
  const { user, createOrder, wallet, showToast } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const serviceType = params.get('type') || 'standard';

  const [step, setStep] = useState('location');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [extraStops, setExtraStops] = useState([]);
  const [itemType, setItemType] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [note, setNote] = useState('');
  const [payMethod, setPayMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const price = serviceType === 'bulk' ? 8500
    : serviceType === 'heavy' ? 25000
    : serviceType === 'interstate' ? 45000
    : 2500 + extraStops.length * 800;

  const locationReady = pickup.trim().length > 3 && dropoff.trim().length > 3 && itemType;
  const detailsReady = recipientName.trim().length > 1 && recipientPhone.trim().length > 7;

  const handleContinueLocation = () => {
    if (!locationReady) return;
    if (!user) { navigate(`/login?return=/customer/orders/create?type=${serviceType}`); return; }
    setStep('details');
  };

  const handleContinueDetails = () => {
    if (!detailsReady) return;
    setStep('payment');
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const order = createOrder?.({
      pickupAddress: pickup, dropoffAddress: dropoff,
      packageType: serviceType, price,
      recipientName, recipientPhone, note,
      paymentMethod: payMethod, itemType,
    });
    setOrderId(order?.trackingId || 'AMP-' + Math.floor(Math.random() * 9000 + 1000));
    setStep('done');
    setLoading(false);
  };

  // ── DONE ──────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-dvh bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-white font-black text-2xl mb-2">Order Placed!</h1>
        <p className="text-white/60 text-sm mb-2">Your order has been confirmed.</p>
        <div className="bg-white/10 rounded-xl px-6 py-3 mb-8">
          <p className="text-white/50 text-xs">Tracking ID</p>
          <p className="text-white font-mono font-bold text-lg">{orderId}</p>
        </div>
        <button
          onClick={() => navigate('/customer')}
          className="w-full bg-white text-navy-900 font-bold py-4 rounded-2xl mb-3"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate('/customer/orders')}
          className="text-white/60 text-sm underline"
        >
          View all orders
        </button>
      </div>
    );
  }

  const title = SERVICE_LABELS[serviceType] || 'New Order';

  return (
    <div className="min-h-dvh bg-slate-100 flex flex-col">

      {/* ── HEADER ── */}
      <div className="bg-navy-900 px-4 pt-12 pb-6 flex-shrink-0">
        <button onClick={() => step === 'location' ? navigate(-1) : setStep(STEPS[STEPS.indexOf(step) - 1])} className="mb-4">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-xl">{title}</h1>
        {/* Step dots */}
        <div className="flex gap-1.5 mt-3">
          {['location','details','payment'].map(s => (
            <div key={s} className={`h-1 rounded-full flex-1 transition-all ${step === s || STEPS.indexOf(step) > STEPS.indexOf(s) ? 'bg-white' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* ── STEP: LOCATION ── */}
      {step === 'location' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

            {/* Location card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-base mb-4">Where's Your Package Going?</h2>

              {/* Pickup */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center mt-1 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-400 bg-white" />
                  <div className="w-px h-8 bg-dashed border-l-2 border-dashed border-slate-300 my-1" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Pickup Location</p>
                  <div className="relative">
                    <input
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                      placeholder="Enter Exact Pickup Location"
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 pr-10 text-sm bg-slate-50 focus:bg-white"
                    />
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Extra stops for bulk */}
              {serviceType === 'bulk' && extraStops.map((stop, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <div className="flex flex-col items-center mt-1 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-400 bg-blue-50" />
                    <div className="w-px h-8 border-l-2 border-dashed border-slate-300 my-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-slate-500">Stop {i + 1}</p>
                      <button onClick={() => setExtraStops(s => s.filter((_, j) => j !== i))}><X size={14} className="text-slate-400" /></button>
                    </div>
                    <input
                      value={stop}
                      onChange={e => setExtraStops(s => s.map((v, j) => j === i ? e.target.value : v))}
                      placeholder="Enter stop address"
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-slate-50"
                    />
                  </div>
                </div>
              ))}

              {/* Dropoff */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={10} className="text-white" fill="white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Dropoff Location</p>
                  <div className="relative">
                    <input
                      value={dropoff}
                      onChange={e => setDropoff(e.target.value)}
                      placeholder="Enter Exact Dropoff Location"
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 pr-10 text-sm bg-slate-50 focus:bg-white"
                    />
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {serviceType === 'bulk' && (
                <button
                  onClick={() => setExtraStops(s => [...s, ''])}
                  className="flex items-center gap-1 text-navy-900 text-xs font-semibold mt-3 ml-8"
                >
                  <Plus size={13} /> Add another stop
                </button>
              )}

              <p className="text-slate-400 text-xs leading-relaxed mt-3 ml-8">
                Tip: To avoid high prices, type the specific location in your area — for example a street, neighbourhood, or popular landmark — not just the broad area name.
              </p>
            </div>

            {/* Item type */}
            <div>
              <h2 className="font-bold text-navy-900 text-base mb-3">What Are We Handling?</h2>
              <div className="grid grid-cols-2 gap-3">
                {ITEM_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setItemType(t.id)}
                    className={`bg-white rounded-2xl p-4 text-left border-2 transition-all ${
                      itemType === t.id ? 'border-navy-900 shadow-md' : 'border-transparent shadow-sm'
                    }`}
                  >
                    <div className={`w-12 h-12 ${t.bg} rounded-xl flex items-center justify-center mb-3`}>
                      {t.icon}
                    </div>
                    <p className="font-bold text-navy-900 text-sm">{t.label}</p>
                    <ArrowRight size={14} className="text-slate-400 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price preview */}
            {pickup && dropoff && (
              <div className="bg-navy-900 rounded-2xl p-4 flex items-center justify-between">
                <p className="text-white/70 text-sm">Estimated Price</p>
                <p className="text-white font-black text-xl">{formatCurrency(price)}</p>
              </div>
            )}
          </div>

          {/* Continue */}
          <div className="px-4 py-4 bg-white border-t border-slate-100">
            <button
              onClick={handleContinueLocation}
              disabled={!locationReady}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                locationReady ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {!user ? 'Login to Continue' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP: DETAILS ── */}
      {step === 'details' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-base mb-4">Recipient Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Recipient Name</label>
                  <input value={recipientName} onChange={e => setRecipientName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Phone Number</label>
                  <input value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)}
                    placeholder="08012345678" type="tel"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Delivery Note (Optional)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Any special instructions?"
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 resize-none" />
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-navy-900 text-sm mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">From</span><span className="font-medium text-navy-900 text-right max-w-[55%] truncate">{pickup}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">To</span><span className="font-medium text-navy-900 text-right max-w-[55%] truncate">{dropoff}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-navy-900 capitalize">{itemType}</span></div>
                <div className="border-t border-slate-100 pt-2 flex justify-between"><span className="font-bold text-navy-900">Total</span><span className="font-black text-navy-900 text-base">{formatCurrency(price)}</span></div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 bg-white border-t border-slate-100">
            <button onClick={handleContinueDetails} disabled={!detailsReady}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 ${detailsReady ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP: PAYMENT ── */}
      {step === 'payment' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-navy-900 text-base mb-4">Choose Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet Balance', sub: formatCurrency(useApp().wallet?.balance || 0) },
                  { id: 'card', icon: <CreditCard size={20} />, label: 'Debit/Credit Card', sub: 'Visa, Mastercard, Verve' },
                  { id: 'transfer', icon: <ChevronRight size={20} />, label: 'Bank Transfer', sub: 'Transfer to account' },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${payMethod === m.id ? 'border-navy-900 bg-navy-50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === m.id ? 'bg-navy-900 text-white' : 'bg-white text-slate-500'}`}>{m.icon}</div>
                    <div className="text-left">
                      <p className="font-semibold text-navy-900 text-sm">{m.label}</p>
                      <p className="text-xs text-slate-500">{m.sub}</p>
                    </div>
                    {payMethod === m.id && <CheckCircle size={18} className="text-navy-900 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-navy-900 rounded-2xl p-4 flex items-center justify-between">
              <p className="text-white/70 text-sm">Total to pay</p>
              <p className="text-white font-black text-2xl">{formatCurrency(price)}</p>
            </div>
          </div>

          <div className="px-4 py-4 bg-white border-t border-slate-100">
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 bg-navy-900 text-white disabled:opacity-70">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span>
              ) : (
                <><CheckCircle size={18} /> Confirm & Pay {formatCurrency(price)}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
