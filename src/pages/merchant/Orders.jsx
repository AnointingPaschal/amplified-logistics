import { useState } from 'react';
import { Plus, Package, Upload, Trash2, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Btn, Modal, Input, Select, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo, PACKAGE_TYPES } from '../../utils/mockData';

export default function MerchantOrders() {
  const { myOrders, createOrder, user, showToast } = useApp();
  const navigate = useNavigate();
  const [createModal, setCreateModal] = useState(false);
  const [bulkRows, setBulkRows] = useState([{ pickup: '', dropoff: '', description: '', weight: '1' }]);
  const [pkgType, setPkgType] = useState('standard');
  const [payMethod, setPayMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);

  const addRow = () => setBulkRows(r => [...r, { pickup: '', dropoff: '', description: '', weight: '1' }]);
  const removeRow = (i) => setBulkRows(r => r.filter((_, j) => j !== i));
  const updateRow = (i, k, v) => setBulkRows(r => r.map((row, j) => j === i ? { ...row, [k]: v } : row));

  const handleBulkCreate = async () => {
    const valid = bulkRows.filter(r => r.pickup && r.dropoff);
    if (valid.length === 0) { showToast('Add at least one valid order', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    valid.forEach(row => {
      createOrder({ pickup: row.pickup, dropoff: row.dropoff, description: row.description || 'Package', packageType: PACKAGE_TYPES.find(p => p.id === pkgType)?.name || 'Standard', weight: row.weight + 'kg', price: Math.round(600 + Math.random() * 1200), paymentMethod: payMethod, distance: '~8km' });
    });
    setCreateModal(false);
    setBulkRows([{ pickup: '', dropoff: '', description: '', weight: '1' }]);
    setLoading(false);
  };

  return (
    <PageLayout title="Order Management" right={<Btn size="sm" onClick={() => setCreateModal(true)}><Plus size={16} /> New</Btn>}>
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', value: myOrders.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'Active', value: myOrders.filter(o => ['pending','accepted','pickup','transit'].includes(o.status)).length, color: 'bg-orange-100 text-orange-700' },
          { label: 'Done', value: myOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-100 text-green-700' },
          { label: 'Cancelled', value: myOrders.filter(o => o.status === 'cancelled').length, color: 'bg-red-100 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-2.5 text-center`}>
            <div className="font-black text-lg">{s.value}</div>
            <div className="text-[10px] font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {myOrders.length === 0 ? (
        <EmptyState icon={<Package size={28} />} title="No orders yet" desc="Create your first bulk order" action={<Btn onClick={() => setCreateModal(true)}>Create Order</Btn>} />
      ) : (
        <div className="space-y-3">
          {myOrders.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-black text-sm text-slate-800">#{o.trackingId}</span>
                  <p className="text-xs text-slate-500">{o.packageType} · {o.weight}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="w-px h-5 bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-xs text-slate-600 truncate">{o.pickup}</p>
                  <p className="text-xs text-slate-600 truncate">{o.dropoff}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-slate-400">{timeAgo(o.createdAt)}</span>
                <span className="font-bold text-slate-700">{formatCurrency(o.price)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bulk Create Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Orders" size="lg">
        <div className="p-4 space-y-4">
          <Select label="Package Type" value={pkgType} onChange={e => setPkgType(e.target.value)}>
            {PACKAGE_TYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Select label="Payment Method" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
            <option value="wallet">Wallet</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </Select>

          <div className="space-y-4">
            {bulkRows.map((row, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Order {i + 1}</span>
                  {bulkRows.length > 1 && <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
                </div>
                <input value={row.pickup} onChange={e => updateRow(i, 'pickup', e.target.value)} placeholder="📦 Pickup address" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-400" />
                <input value={row.dropoff} onChange={e => updateRow(i, 'dropoff', e.target.value)} placeholder="📍 Dropoff address" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-400" />
                <input value={row.description} onChange={e => updateRow(i, 'description', e.target.value)} placeholder="Package description" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-400" />
              </div>
            ))}
          </div>

          <button onClick={addRow} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-300 rounded-xl text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors">
            <Plus size={16} /> Add Another Order
          </button>

          <Btn className="w-full" size="lg" loading={loading} onClick={handleBulkCreate}>
            Create {bulkRows.length} Order{bulkRows.length > 1 ? 's' : ''}
          </Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
