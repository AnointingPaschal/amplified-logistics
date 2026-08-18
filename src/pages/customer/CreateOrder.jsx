import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Package, Camera, Tag, ChevronRight, Bike, Truck, Globe, Box, CreditCard, Wallet, Banknote, Clock, Plus, Trash2, CheckCircle, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Input, Select, Btn, Card, Modal } from '../../components/ui';
import { PACKAGE_TYPES, formatCurrency } from '../../utils/mockData';
import LiveMap from '../../components/map/LiveMap';

const ICONS = { bike: <Bike size={22} />, package: <Box size={22} />, truck: <Truck size={22} />, map: <Globe size={22} /> };

const PAYMENT_METHODS = [
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={18} />, desc: 'Pay from your wallet balance' },
  { id: 'card', label: 'Card', icon: <CreditCard size={18} />, desc: 'Credit or debit card' },
  { id: 'bank', label: 'Bank Transfer', icon: <Banknote size={18} />, desc: 'Direct bank transfer' },
  { id: 'cash', label: 'Cash on Delivery', icon: <Banknote size={18} />, desc: 'Pay rider on delivery' },
];

export default function CreateOrder() {
  const { createOrder, user, wallet, applyPromo, promoApplied, showToast } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(params.get('type') || 'standard');
  const [form, setForm] = useState({ pickup: user?.savedAddresses?.[0]?.address || '', dropoff: '', stops: [], weight: '1', description: '', fragile: false, scheduleNow: true, scheduledTime: '', paymentMethod: 'wallet', promoCode: '' });
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promoModal, setPromoModal] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [created, setCreated] = useState(null);

  const pkgType = PACKAGE_TYPES.find(p => p.id === selectedType) || PACKAGE_TYPES[0];

  // Calculate price
  useEffect(() => {
    const distance = 8 + Math.random() * 15;
    let base = pkgType.basePrice + (pkgType.pricePerKm * distance);
    if (promoApplied) {
      base = promoApplied.type === 'percent' ? base * (1 - promoApplied.discount / 100) : base - promoApplied.discount;
    }
    setPrice(Math.round(base));
  }, [selectedType, promoApplied]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addStop = () => {
    if (form.stops.length < pkgType.maxLocations - 2) setForm(p => ({ ...p, stops: [...p.stops, ''] }));
  };

  const handleSubmit = async () => {
    if (!form.pickup || !form.dropoff) { showToast('Please enter pickup and dropoff locations', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const order = createOrder({ pickup: form.pickup, dropoff: form.dropoff, packageType: pkgType.name, weight: form.weight + 'kg', description: form.description || 'Package', price, paymentMethod: form.paymentMethod, distance: '~10km', scheduledTime: form.scheduleNow ? null : form.scheduledTime });
    setCreated(order);
    setLoading(false);
  };

  if (created) {
    return (
      <PageLayout title="Order Placed" back noNav>
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Order Placed!</h2>
          <p className="text-slate-500 text-sm mb-2">Your order has been created and a rider has been assigned.</p>
          <div className="bg-orange-50 rounded-2xl p-4 my-6 w-full text-left">
            <p className="text-xs text-slate-500 mb-1">Tracking ID</p>
            <p className="text-2xl font-black text-orange-500 tracking-wider">{created.trackingId}</p>
            <p className="text-xs text-slate-500 mt-3 mb-1">Assigned Rider</p>
            <p className="font-semibold text-slate-800">{created.riderName}</p>
            <p className="text-sm text-slate-500">{created.riderPhone}</p>
            <p className="text-xs text-slate-500 mt-3 mb-1">Estimated Delivery</p>
            <p className="font-semibold text-slate-800">~45 minutes</p>
          </div>
          <LiveMap height="180px" riders={[{ id: 'r', name: created.riderName, online: true, lat: 5.5264 + 0.01, lng: 7.4855 }]} />
          <div className="flex gap-3 w-full mt-6">
            <Btn variant="secondary" className="flex-1" onClick={() => navigate('/customer/orders')}>View Orders</Btn>
            <Btn className="flex-1" onClick={() => navigate('/customer/track')}>Track Live</Btn>
          </div>
        </div>
      </PageLayout>
    );
  }

  const steps = ['Package', 'Details', 'Payment'];

  return (
    <PageLayout title="New Delivery" back backTo="/customer" noNav>
      {/* Step Progress */}
      <div className="flex gap-1 mb-6 -mx-4 px-4 pt-1">
        {steps.map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">{steps[step]}</p>

      {/* Step 0: Package Type */}
      {step === 0 && (
        <div className="space-y-3">
          {PACKAGE_TYPES.map(pkg => (
            <button key={pkg.id} onClick={() => setSelectedType(pkg.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedType === pkg.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: pkg.color + '20', color: pkg.color }}>
                {ICONS[pkg.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{pkg.name}</span>
                  {selectedType === pkg.id && <CheckCircle size={18} className="text-orange-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{pkg.desc}</p>
                <p className="text-xs text-slate-400 mt-1">Max {pkg.maxWeight}kg · Max {pkg.maxLocations} stops</p>
              </div>
            </button>
          ))}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Estimated price</span>
              <span className="font-bold text-slate-900">{formatCurrency(price)}</span>
            </div>
          </div>
          <Btn size="lg" className="w-full mt-2" onClick={() => setStep(1)}>Continue</Btn>
        </div>
      )}

      {/* Step 1: Pickup/Dropoff */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="w-0.5 h-6 bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pickup</p>
                    <input value={form.pickup} onChange={e => update('pickup', e.target.value)} placeholder="Enter pickup address" className="w-full text-sm text-slate-800 border-0 outline-none bg-transparent placeholder-slate-400" />
                  </div>
                  {form.stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stop {i + 1}</p>
                        <input value={stop} onChange={e => { const s = [...form.stops]; s[i] = e.target.value; update('stops', s); }} placeholder="Enter stop address" className="w-full text-sm text-slate-800 border-0 outline-none bg-transparent placeholder-slate-400" />
                      </div>
                      <button onClick={() => update('stops', form.stops.filter((_, j) => j !== i))}><Trash2 size={16} className="text-slate-400" /></button>
                    </div>
                  ))}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Drop-off</p>
                    <input value={form.dropoff} onChange={e => update('dropoff', e.target.value)} placeholder="Enter dropoff address" className="w-full text-sm text-slate-800 border-0 outline-none bg-transparent placeholder-slate-400" />
                  </div>
                </div>
              </div>
            </div>
            {pkgType.maxLocations > 2 && form.stops.length < pkgType.maxLocations - 2 && (
              <button onClick={addStop} className="w-full flex items-center gap-2 px-4 py-3 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-colors">
                <Plus size={16} /> Add a stop
              </button>
            )}
          </div>

          {/* Saved addresses */}
          {user?.savedAddresses?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Saved Addresses</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {user.savedAddresses.map(addr => (
                  <button key={addr.id} onClick={() => update('pickup', addr.address)} className="flex-shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:border-orange-300">
                    <MapPin size={14} className="text-orange-500" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-700">{addr.label}</div>
                      <div className="text-[10px] text-slate-500 max-w-[120px] truncate">{addr.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input label="Package Description" type="text" icon={<Package size={16} />} value={form.description} onChange={e => update('description', e.target.value)} placeholder="What are you sending?" />
          <Select label="Weight (approx)" value={form.weight} onChange={e => update('weight', e.target.value)}>
            <option value="0.5">Under 1 kg</option>
            <option value="1">1 - 2 kg</option>
            <option value="3">3 - 5 kg</option>
            <option value="10">6 - 10 kg</option>
            <option value="20">11 - 30 kg</option>
            <option value="50">30+ kg</option>
          </Select>

          {/* Photo upload */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
            <Camera size={20} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-600">Add package photo (optional)</p>
              <p className="text-xs text-slate-400">Helps rider identify your package</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Pickup Time</p>
            <div className="flex gap-2">
              <button onClick={() => update('scheduleNow', true)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.scheduleNow ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <Zap size={15} /> Now
              </button>
              <button onClick={() => update('scheduleNow', false)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${!form.scheduleNow ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <Clock size={15} /> Schedule
              </button>
            </div>
            {!form.scheduleNow && <input type="datetime-local" className="mt-3 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" min={new Date().toISOString().slice(0, 16)} value={form.scheduledTime} onChange={e => update('scheduledTime', e.target.value)} />}
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" className="flex-1" onClick={() => setStep(0)}>Back</Btn>
            <Btn className="flex-1" onClick={() => { if (!form.pickup || !form.dropoff) { showToast('Enter pickup and dropoff', 'error'); return; } setStep(2); }}>Continue</Btn>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Price Summary */}
          <Card className="p-4">
            <h4 className="font-bold text-slate-800 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Package Type</span><span className="font-medium">{pkgType.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Route</span><span className="font-medium text-right text-xs max-w-[180px]">{form.pickup.slice(0, 20)}... → {form.dropoff.slice(0, 20)}...</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Distance</span><span className="font-medium">~10 km</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Base Price</span><span className="font-medium">{formatCurrency(pkgType.basePrice)}</span></div>
              {promoApplied && <div className="flex justify-between text-green-600"><span>Promo ({promoApplied.code})</span><span>-{promoApplied.type === 'percent' ? promoApplied.discount + '%' : formatCurrency(promoApplied.discount)}</span></div>}
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-orange-500">{formatCurrency(price)}</span>
              </div>
            </div>
          </Card>

          {/* Promo Code */}
          <button onClick={() => setPromoModal(true)} className="w-full flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-3.5 hover:bg-orange-100 transition-colors">
            <Tag size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">{promoApplied ? `${promoApplied.code} applied!` : 'Apply promo code'}</span>
            <ChevronRight size={16} className="text-orange-400 ml-auto" />
          </button>

          {/* Payment Method */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Payment Method</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(pm => (
                <button key={pm.id} onClick={() => update('paymentMethod', pm.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${form.paymentMethod === pm.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <span className={`p-2 rounded-lg ${form.paymentMethod === pm.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{pm.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-800">{pm.label}</div>
                    <div className="text-xs text-slate-500">{pm.id === 'wallet' ? `Balance: ${formatCurrency(wallet.balance)}` : pm.desc}</div>
                  </div>
                  {form.paymentMethod === pm.id && <CheckCircle size={18} className="text-orange-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Btn>
            <Btn className="flex-1" loading={loading} onClick={handleSubmit}>Place Order</Btn>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      <Modal open={promoModal} onClose={() => setPromoModal(false)} title="Promo Code">
        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="Enter promo code" className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
            <Btn onClick={() => { applyPromo(promoInput); setPromoModal(false); }} size="md">Apply</Btn>
          </div>
          <div className="space-y-2">
            {[{ code: 'FIRST50', desc: '50% off your first order' }, { code: 'AMP200', desc: '₦200 off any delivery' }, { code: 'NEWUSER', desc: '30% off for new users' }].map(p => (
              <button key={p.code} onClick={() => { setPromoInput(p.code); }} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-orange-50 text-left">
                <div><div className="text-sm font-bold text-orange-600">{p.code}</div><div className="text-xs text-slate-500">{p.desc}</div></div>
                <span className="text-xs font-semibold text-orange-500">Use</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
