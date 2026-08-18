import { useState } from 'react';
import { Search, Shield, ShieldCheck, Truck, User, Store, LayoutDashboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Avatar, Btn, Modal } from '../../components/ui';

const ROLE_ICONS = { customer: <User size={16} />, rider: <Truck size={16} />, merchant: <Store size={16} />, admin: <LayoutDashboard size={16} /> };
const ROLE_COLORS = { customer: 'bg-orange-100 text-orange-600', rider: 'bg-purple-100 text-purple-600', merchant: 'bg-cyan-100 text-cyan-600', admin: 'bg-green-100 text-green-600' };

export default function AdminUsers() {
  const { users, verifyRider, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = role === 'all' || u.role === role;
    return matchSearch && matchRole;
  });

  return (
    <PageLayout title="User Management">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 mb-3">
        <Search size={16} className="text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 text-sm outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', 'customer', 'rider', 'merchant', 'admin'].map(r => (
          <button key={r} onClick={() => setRole(r)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${role === r ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{r}</button>
        ))}
      </div>

      <p className="text-xs text-slate-500 mb-3">{filtered.length} users</p>

      <div className="space-y-2">
        {filtered.map(u => (
          <Card key={u.id} className="p-4 flex items-center gap-3" onClick={() => setSelected(u)}>
            <Avatar name={u.name} size={40} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-800">{u.name}</span>
                {u.verified && <ShieldCheck size={14} className="text-green-500" />}
              </div>
              <p className="text-xs text-slate-500 truncate">{u.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>
                  {ROLE_ICONS[u.role]} {u.role}
                </span>
                {!u.verified && u.role === 'rider' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⚠ Pending KYC</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details">
        {selected && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar name={selected.name} size={64} />
              <h3 className="font-black text-lg mt-3">{selected.name}</h3>
              <p className="text-sm text-slate-500">{selected.email}</p>
              <span className={`mt-2 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLORS[selected.role]}`}>
                {ROLE_ICONS[selected.role]} {selected.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Phone', value: selected.phone || '—' },
                { label: 'Joined', value: new Date(selected.createdAt).toLocaleDateString() },
                { label: 'Verified', value: selected.verified ? '✓ Yes' : '✗ No' },
                { label: 'Status', value: selected.online ? 'Online' : 'Offline' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.role === 'rider' && !selected.verified && (
              <Btn className="w-full" onClick={() => { verifyRider(selected.id); setSelected(p => ({ ...p, verified: true })); }}>
                <ShieldCheck size={16} /> Verify Rider
              </Btn>
            )}
            <Btn variant="danger" size="sm" className="w-full" onClick={() => { showToast('User suspended', 'error'); setSelected(null); }}>
              Suspend User
            </Btn>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
