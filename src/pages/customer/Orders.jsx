import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, MapPin, Clock, Star, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, EmptyState, Btn, StarRating, Modal } from '../../components/ui';
import { formatCurrency, timeAgo, formatDate } from '../../utils/mockData';

const FILTERS = ['All', 'Pending', 'Active', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { myOrders, rateOrder, setActiveOrder } = useApp();
  const [filter, setFilter] = useState('All');
  const [rateModal, setRateModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const filtered = myOrders.filter(o => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['pending', 'accepted', 'pickup', 'transit'].includes(o.status);
    return o.status === filter.toLowerCase();
  });

  return (
    <PageLayout title="My Orders">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Package size={28} />} title="No orders found" desc="Orders matching this filter will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <Link key={order.id} to={`/customer/orders/${order.id}`} onClick={() => setActiveOrder(order)}>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${order.status === 'delivered' ? 'bg-green-100' : order.status === 'cancelled' ? 'bg-red-100' : 'bg-orange-100'}`}>
                    <Package size={18} className={order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-500' : 'text-orange-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-slate-800">#{order.trackingId}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                      <MapPin size={10} className="text-green-500 flex-shrink-0" /> {order.pickup}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                      <MapPin size={10} className="text-red-500 flex-shrink-0" /> {order.dropoff}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{timeAgo(order.createdAt)}</span>
                      <span className="text-sm font-bold text-slate-800">{formatCurrency(order.price)}</span>
                    </div>
                    {order.status === 'delivered' && (
                      <div className="mt-2 flex items-center justify-between">
                        {order.rating ? (
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                            <Star size={12} fill="#F59E0B" /> {order.rating}/5 rated
                          </div>
                        ) : (
                          <button onClick={e => { e.preventDefault(); setRateModal(order); }} className="text-xs font-semibold text-orange-500 hover:text-orange-600">Rate this delivery ⭐</button>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-slate-400 flex-shrink-0 mt-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={!!rateModal} onClose={() => setRateModal(null)} title="Rate Delivery">
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">How was your delivery #{rateModal?.trackingId}?</p>
          <div className="flex justify-center py-2"><StarRating value={rating} onChange={setRating} /></div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Write a comment..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" />
          <Btn className="w-full" onClick={() => { rateOrder(rateModal.id, rating, comment); setRateModal(null); }}>Submit</Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
