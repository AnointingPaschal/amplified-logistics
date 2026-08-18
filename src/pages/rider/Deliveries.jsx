import { useState } from 'react';
import { Package, MapPin, Clock, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';

export default function RiderDeliveries() {
  const { user, orders } = useApp();
  const [tab, setTab] = useState('all');

  const myOrders = orders.filter(o => o.riderId === user?.id);
  const filtered = tab === 'all' ? myOrders : myOrders.filter(o => o.status === tab);

  return (
    <PageLayout title="My Deliveries">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', 'accepted', 'transit', 'delivered', 'cancelled'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Package size={28} />} title="No deliveries" desc="Deliveries will appear here once assigned" />
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm">#{order.trackingId}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-2 h-2 rounded-full bg-green-500" />{order.pickup}</div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-2 h-2 rounded-full bg-red-500" />{order.dropoff}</div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{timeAgo(order.createdAt)}</span>
                <span className="font-black text-slate-800">{formatCurrency(order.price * 0.8)}</span>
              </div>
              {order.rating && (
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <Star size={11} fill="#F59E0B" /> Customer rated: {order.rating}/5
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
