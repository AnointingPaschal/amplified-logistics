import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, CheckCircle, Circle, Clock, Package, MapPin, Star, X, Navigation, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Btn, Modal, StarRating, Avatar } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';
import LiveMap from '../../components/map/LiveMap';

export default function TrackOrder() {
  const { myOrders, activeOrder, setActiveOrder, rateOrder, cancelOrder, chat, sendChatMessage, showToast } = useApp();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [trackInput, setTrackInput] = useState('');

  const inProgressOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const order = activeOrder || inProgressOrders[0] || myOrders[0];

  const TIMELINE_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: <Package size={16} /> },
    { key: 'accepted', label: 'Rider Assigned', icon: <CheckCircle size={16} /> },
    { key: 'pickup', label: 'Package Picked Up', icon: <Navigation size={16} /> },
    { key: 'transit', label: 'In Transit', icon: <Clock size={16} /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> },
  ];

  const getStepIndex = (status) => {
    const idx = { pending: 0, accepted: 1, pickup: 2, transit: 3, delivered: 4, cancelled: 0 };
    return idx[status] ?? 0;
  };

  const currentIdx = order ? getStepIndex(order.status) : 0;

  const handleSendMsg = () => {
    if (!msg.trim()) return;
    sendChatMessage(msg.trim(), 'customer');
    setMsg('');
  };

  const handleRate = () => {
    if (order) { rateOrder(order.id, rating, ratingComment); setRateOpen(false); }
  };

  const handleCancel = () => {
    if (order) { cancelOrder(order.id, 'Customer requested'); setCancelOpen(false); showToast('Order cancelled', 'error'); }
  };

  const searchOrder = () => {
    const found = myOrders.find(o => o.trackingId === trackInput.toUpperCase() || o.id === trackInput);
    if (found) { setActiveOrder(found); setTrackInput(''); }
    else showToast('Order not found', 'error');
  };

  return (
    <PageLayout title="Track Order">
      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input value={trackInput} onChange={e => setTrackInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchOrder()} placeholder="Enter tracking ID (e.g. ALXK92P)" className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
        <Btn size="md" onClick={searchOrder} className="px-4">Track</Btn>
      </div>

      {!order ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin size={48} className="text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-700 mb-2">No active orders</h3>
          <p className="text-sm text-slate-500 mb-6">Track your orders here once you've placed them</p>
          <Btn onClick={() => navigate('/customer/create')}>Place an Order</Btn>
        </div>
      ) : (
        <>
          {/* Order selector if multiple */}
          {inProgressOrders.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {inProgressOrders.map(o => (
                <button key={o.id} onClick={() => setActiveOrder(o)} className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${(activeOrder || inProgressOrders[0]).id === o.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-600'}`}>
                  #{o.trackingId}
                </button>
              ))}
            </div>
          )}

          {/* Map */}
          <LiveMap
            height="220px"
            riders={[{ id: order.riderId, name: order.riderName, online: true, lat: 5.5264 + (Math.random() - 0.5) * 0.01, lng: 7.4855 + (Math.random() - 0.5) * 0.01 }]}
            pickupLocation={[5.5264, 7.4855]}
            dropoffLocation={[5.5300, 7.4900]}
            showRoute
          />

          {/* Order Info */}
          <Card className="mt-4 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Tracking ID</p>
                <p className="font-black text-xl text-slate-800 tracking-wide">{order.trackingId}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Rider info */}
            <div className="p-4 flex items-center gap-3 border-b border-slate-100">
              <Avatar name={order.riderName} size={44} />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{order.riderName}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Star size={11} fill="#F59E0B" className="text-amber-400" /> 4.7 · Motorcycle
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.riderPhone}`} className="p-2.5 bg-green-100 rounded-xl"><Phone size={18} className="text-green-600" /></a>
                <button onClick={() => setChatOpen(true)} className="p-2.5 bg-blue-100 rounded-xl"><MessageSquare size={18} className="text-blue-600" /></button>
              </div>
            </div>

            {/* Route */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="w-0.5 h-10 bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-3">
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p><p className="text-sm text-slate-700">{order.pickup}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">Drop-off</p><p className="text-sm text-slate-700">{order.dropoff}</p></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Delivery Timeline</p>
              <div className="space-y-3">
                {TIMELINE_STEPS.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? active ? 'bg-orange-500 text-white' : 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {done && !active ? <CheckCircle size={16} /> : step.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                        {order.timeline?.find(t => t.status === step.key) && (
                          <p className="text-xs text-slate-400">{timeAgo(order.timeline.find(t => t.status === step.key).time)}</p>
                        )}
                      </div>
                      {active && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm">Total Paid</span>
                <span className="font-black text-lg text-slate-800">{formatCurrency(order.price)}</span>
              </div>
              <div className="flex gap-2">
                {['pending', 'accepted'].includes(order.status) && (
                  <Btn variant="danger" size="sm" className="flex-1" onClick={() => setCancelOpen(true)}>Cancel Order</Btn>
                )}
                {order.status === 'delivered' && !order.rating && (
                  <Btn size="sm" className="flex-1" onClick={() => setRateOpen(true)}>Rate Rider ⭐</Btn>
                )}
                {order.status === 'delivered' && order.rating && (
                  <div className="flex-1 text-center py-2 text-sm text-green-600 font-semibold">
                    ✓ You rated {order.rating}/5
                  </div>
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Chat Modal */}
      <Modal open={chatOpen} onClose={() => setChatOpen(false)} title={`Chat with ${order?.riderName || 'Rider'}`} size="lg">
        <div className="flex flex-col h-[50vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.sender === 'customer' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
                  {m.text}
                  <div className={`text-[10px] mt-1 ${m.sender === 'customer' ? 'text-orange-200' : 'text-slate-400'}`}>{timeAgo(m.time)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMsg()} placeholder="Type a message..." className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
            <button onClick={handleSendMsg} className="p-2.5 bg-orange-500 rounded-xl text-white hover:bg-orange-600"><Send size={18} /></button>
          </div>
        </div>
      </Modal>

      {/* Rate Modal */}
      <Modal open={rateOpen} onClose={() => setRateOpen(false)} title="Rate Your Rider">
        <div className="p-5 space-y-4">
          <div className="text-center">
            <Avatar name={order?.riderName} size={60} className="mx-auto mb-3" />
            <p className="font-semibold text-slate-800">{order?.riderName}</p>
          </div>
          <div className="flex justify-center"><StarRating value={rating} onChange={setRating} /></div>
          <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Leave a comment (optional)" rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" />
          <Btn className="w-full" onClick={handleRate}>Submit Rating</Btn>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Order">
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Btn variant="secondary" className="flex-1" onClick={() => setCancelOpen(false)}>Keep Order</Btn>
            <Btn variant="danger" className="flex-1" onClick={handleCancel}>Yes, Cancel</Btn>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
