import { useState } from 'react';
import { User, Phone, Car, Shield, Star, LogOut, HelpCircle, FileText, Award, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Avatar, Modal, Input, Btn, MenuRow } from '../../components/ui';

export default function RiderProfile() {
  const { user, logout, updateProfile, orders } = useApp();
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const completedDeliveries = orders.filter(o => o.riderId === user?.id && o.status === 'delivered').length;
  const totalEarned = orders.filter(o => o.riderId === user?.id && o.status === 'delivered').reduce((s, o) => s + (o.price * 0.8), 342 * 2200);

  return (
    <PageLayout title="My Profile">
      {/* Profile Card */}
      <Card className="p-5 mb-4 text-center">
        <div className="relative inline-block mb-3">
          <Avatar name={user?.name} size={72} />
          <button onClick={() => setEditModal(true)} className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Edit3 size={13} className="text-white" />
          </button>
        </div>
        <h2 className="font-black text-slate-800 text-lg">{user?.name}</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${user?.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          <Shield size={12} /> {user?.verified ? 'Verified Rider' : 'Pending Verification'}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: 'Deliveries', value: completedDeliveries || 342 },
            { label: 'Rating', value: '4.7★' },
            { label: 'Total Earned', value: '₦' + (Math.round(totalEarned / 1000)) + 'K' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-black text-lg text-slate-800">{s.value}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Vehicle Info */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Vehicle Information</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600"><Car size={16} /> Vehicle Type</div>
            <span className="text-sm font-semibold text-slate-800">{user?.vehicleType || 'Motorcycle'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-slate-600"><FileText size={16} /> Plate Number</div>
            <span className="text-sm font-semibold text-slate-800">{user?.plateNumber || 'ABA-234-XY'}</span>
          </div>
        </div>
      </Card>

      {/* Menu */}
      <Card className="mb-4 overflow-hidden">
        <MenuRow icon={<User size={18} className="text-orange-500" />} label="Edit Profile" sublabel="Update your details" onClick={() => setEditModal(true)} />
        <MenuRow icon={<Shield size={18} className="text-green-500" />} label="KYC Documents" sublabel="View verification status" onClick={() => {}} />
        <MenuRow icon={<Award size={18} className="text-amber-500" />} label="Achievements" sublabel="View your badges" onClick={() => {}} />
        <MenuRow icon={<FileText size={18} className="text-blue-500" />} label="Training Materials" sublabel="Learn best practices" onClick={() => {}} />
        <MenuRow icon={<HelpCircle size={18} className="text-purple-500" />} label="Support" sublabel="Get help" onClick={() => {}} />
      </Card>

      <Card className="mb-6 overflow-hidden">
        <MenuRow icon={<LogOut size={18} className="text-red-500" />} label="Log Out" onClick={logout} danger />
      </Card>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
        <div className="p-5 space-y-4">
          <Input label="Full Name" type="text" icon={<User size={16} />} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Phone" type="tel" icon={<Phone size={16} />} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Btn className="w-full" onClick={() => { updateProfile(form); setEditModal(false); }}>Save Changes</Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
