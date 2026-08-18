import { useState, useEffect } from 'react';
import { Package, MapPin, CheckCircle, Clock, DollarSign, Navigation, Phone, MessageSquare, Camera, Send, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Avatar, StatusBadge, Btn, Modal, Toggle, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';
import LiveMap from '../../components/map/LiveMap';

export default function RiderDashboard() {
  const { user, orders, updateOrderStatus, toggleRiderOnline, chat, sendChatMessage, showToast, wallet } = useApp();
  const [online, setOnline] = useState(user?.online || false);
  const [chatModal, setChatModal] = useState(false);
  const [proofModal, setProofModal] = useState(null);
  const [msg, setMsg] = useState('');
  const [activeDelivery, setActiveDelivery] = useState(null);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const myActiveOrders = orders.filter(o => o.riderId === user?.id && ['accepted', 'pickup', 'transit'].includes(o.status));
  const myCompletedToday = orders.filter(o => o.riderId === user?.id && o.status === 'delivered' && new Date(o.createdAt).toDateString() === new Date().toDateString());

  const todayEarnings = myCompletedToday.reduce((s, o) => s + (o.price * 0.8), 0);

  useEffect(() => {
    if (myActiveOrders.length > 0 && !activeDelivery) setActiveDelivery(myActiveOrders[0]);
  }, [myActiveOrders]);

  const handleToggleOnline = (val) => {
    setOnline(val);
    toggleRiderOnline(user.id, val);
    showToast(val ? 'You are now online' : 'You are now offline', val ? 'success' : 'info');
  };

  const handleAccept = (order) => {
    updateOrderStatus(order.id, 'accepted');
    setActiveDelivery(order);
    showToast('Order accepted! Head to pickup', 'success');
  };

  const handlePickup = () => {
    if (!activeDelivery) return;
    updateOrderStatus(activeDelivery.id, 'pickup');
    showToast('Pickup confirmed', 'success');
  };

  const handleDeliver = () => {
    if (!activeDelivery) return;
    setProofModal(activeDelivery);
  };

  const confirmDelivery = () => {
    if (!proofModal) return;
    updateOrderStatus(proofModal.id, 'delivered');
    setProofModal(null);
    setActiveDelivery(null);
    showToast('Delivery confirmed!', 'success');
  };

  const sendMsg = () => {
    if (!msg.trim()) return;
    sendChatMessage(msg.trim(), 'rider');
    setMsg('');
  };

  return (
    <PageLayout title={`${user?.name?.split(' ')[0]}'s Dashboard`}>
      {/* Status Toggle */}
      <div className={`rounded-2xl p-4 mb-4 flex items-center justify-between ${online ? 'bg-green-50 border border-green-200' : 'bg-slate-100 border border-slate-200'}`}>
        <div>
          <p className="font-bold text-slate-800">{online ? '🟢 You are Online' : '⚫ You are Offline'}</p>
          <p className="text-xs text-slate-500 mt-0.5">{online ? `${pendingOrders.length} orders available near you` : 'Go online to receive orders'}</p>
        </div>
        <Toggle checked={online} onChange={handleToggleOnline} />
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Today's Earnings", value: formatCurrency(todayEarnings), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Deliveries', value: myCompletedToday.length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Rating', value: '4.7★', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <Card key={s.label} className={`p-3 text-center ${s.bg}`}>
            <div className={`font-black text-lg ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 mb-3">Active Delivery</h3>
          <Card className="overflow-hidden">
            <div className="p-4 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-orange-600">#{activeDelivery.trackingId}</span>
                <StatusBadge status={activeDelivery.status} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" /> {activeDelivery.pickup}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" /> {activeDelivery.dropoff}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-slate-500">{activeDelivery.packageType} · {activeDelivery.weight}</span>
                <span className="font-black text-slate-800">{formatCurrency(activeDelivery.price * 0.8)}</span>
              </div>
            </div>
            <LiveMap height="180px" riders={[]} pickupLocation={[5.5264, 7.4855]} dropoffLocation={[5.5300, 7.4900]} showRoute />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-semibold text-slate-800 text-sm">{activeDelivery.customerName}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setChatModal(true)} className="p-2.5 bg-blue-100 rounded-xl"><MessageSquare size={18} className="text-blue-600" /></button>
                  <a href="tel:+2348001234567" className="p-2.5 bg-green-100 rounded-xl"><Phone size={18} className="text-green-600" /></a>
                  <a href="https://maps.google.com" target="_blank" className="p-2.5 bg-orange-100 rounded-xl"><Navigation size={18} className="text-orange-600" /></a>
                </div>
              </div>
              <div className="flex gap-2">
                {activeDelivery.status === 'accepted' && (
                  <Btn size="md" className="flex-1" onClick={handlePickup}>Confirm Pickup</Btn>
                )}
                {['pickup', 'transit'].includes(activeDelivery.status) && (
                  <>
                    {activeDelivery.status === 'pickup' && <Btn variant="secondary" size="sm" className="flex-1" onClick={() => updateOrderStatus(activeDelivery.id, 'transit')}>Mark In Transit</Btn>}
                    <Btn size="md" className="flex-1" onClick={handleDeliver}>Confirm Delivery</Btn>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Available Orders */}
      {online && pendingOrders.length > 0 && !activeDelivery && (
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 mb-3">Available Orders</h3>
          <div className="space-y-3">
            {pendingOrders.slice(0, 3).map(order => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-black text-sm text-slate-800">#{order.trackingId}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{order.packageType} · {order.weight}</p>
                  </div>
                  <span className="font-black text-orange-500 text-lg">{formatCurrency(order.price * 0.8)}</span>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-2 h-2 rounded-full bg-green-500" />{order.pickup}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-2 h-2 rounded-full bg-red-500" />{order.dropoff}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{order.distance} away · {timeAgo(order.createdAt)}</span>
                  <div className="flex gap-2">
                    <Btn variant="secondary" size="sm">Decline</Btn>
                    <Btn size="sm" onClick={() => handleAccept(order)}>Accept</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!online && !activeDelivery && (
        <EmptyState icon={<MapPin size={28} />} title="You're offline" desc="Go online to start receiving delivery orders" action={<Btn onClick={() => handleToggleOnline(true)}>Go Online</Btn>} />
      )}

      {/* Live Map for idle */}
      {online && !activeDelivery && (
        <LiveMap height="220px" riders={[{ id: user?.id, name: user?.name, online: true, lat: 5.5264, lng: 7.4855 }]} />
      )}

      {/* Chat Modal */}
      <Modal open={chatModal} onClose={() => setChatModal(false)} title="Chat with Customer" size="lg">
        <div className="flex flex-col h-[50vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'rider' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.sender === 'rider' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
                  {m.text}
                  <div className={`text-[10px] mt-1 ${m.sender === 'rider' ? 'text-orange-200' : 'text-slate-400'}`}>{timeAgo(m.time)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message..." className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
            <button onClick={sendMsg} className="p-2.5 bg-orange-500 rounded-xl text-white"><Send size={18} /></button>
          </div>
        </div>
      </Modal>

      {/* Proof of Delivery Modal */}
      <Modal open={!!proofModal} onClose={() => setProofModal(null)} title="Confirm Delivery">
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">Take a photo of the delivered package or get recipient's signature.</p>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
            <Camera size={28} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">Upload Delivery Photo</p>
            <p className="text-xs text-slate-400 mt-1">Tap to take or choose photo</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center text-sm text-slate-500">Or collect recipient's signature</div>
          <Btn className="w-full" onClick={confirmDelivery}>Confirm Delivery ✓</Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
