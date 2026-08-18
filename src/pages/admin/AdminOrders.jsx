import { useState } from 'react';
import { Search, Filter, Package, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Modal, Btn } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.trackingId.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <PageLayout title="Order Management">
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="flex-1 text-sm outline-none" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', 'pending', 'accepted', 'transit', 'delivered', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{f}</button>
        ))}
      </div>

      <p className="text-xs text-slate-500 mb-3">{filtered.length} orders</p>

      <div className="space-y-2">
        {filtered.map(o => (
          <Card key={o.id} className="p-4" onClick={() => setSelected(o)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-black text-sm text-slate-800">#{o.trackingId}</span>
                <p className="text-xs text-slate-500">{o.customerName} → {o.riderName}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="space-y-1 mb-2">
              <p className="text-xs text-slate-600 truncate">📦 {o.pickup}</p>
              <p className="text-xs text-slate-600 truncate">📍 {o.dropoff}</p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{timeAgo(o.createdAt)}</span>
              <span className="font-black text-slate-700">{formatCurrency(o.price)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order #${selected?.trackingId}`}>
        {selected && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Customer', value: selected.customerName },
                { label: 'Rider', value: selected.riderName },
                { label: 'Type', value: selected.packageType },
                { label: 'Price', value: formatCurrency(selected.price) },
                { label: 'Weight', value: selected.weight },
                { label: 'Payment', value: selected.paymentMethod },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Route</p>
              <p className="text-sm text-slate-700">📦 {selected.pickup}</p>
              <p className="text-sm text-slate-700">📍 {selected.dropoff}</p>
            </div>

            {/* Status Update */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['accepted', 'pickup', 'transit', 'delivered'].filter(s => s !== selected.status).map(s => (
                  <button key={s} onClick={() => { updateOrderStatus(selected.id, s); setSelected(p => ({ ...p, status: s })); }}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold capitalize hover:bg-blue-100">
                    → {s}
                  </button>
                ))}
                {selected.status !== 'cancelled' && (
                  <button onClick={() => { cancelOrder(selected.id); setSelected(null); }} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
