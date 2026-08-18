import { useState } from 'react';
import { User, Phone, Mail, MapPin, Bell, Shield, HelpCircle, LogOut, ChevronRight, Edit3, Plus, Trash2, Globe, Star, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Avatar, Modal, Input, Btn, MenuRow, Toggle } from '../../components/ui';

export default function CustomerProfile() {
  const { user, logout, updateProfile, saveAddress, myOrders } = useApp();
  const [editModal, setEditModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [addrForm, setAddrForm] = useState({ label: 'Home', address: '' });
  const [notifSettings, setNotifSettings] = useState({ orderUpdates: true, riderMessages: true, promotions: true, newsletter: false });

  const stats = [
    { label: 'Total Orders', value: myOrders.length },
    { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length },
    { label: 'Rating Given', value: myOrders.filter(o => o.rating).length > 0 ? (myOrders.filter(o => o.rating).reduce((s, o) => s + o.rating, 0) / myOrders.filter(o => o.rating).length).toFixed(1) + '★' : '—' },
  ];

  return (
    <PageLayout title="Profile">
      {/* Profile Header */}
      <Card className="p-5 mb-4 text-center">
        <div className="relative inline-block mb-3">
          <Avatar name={user?.name} size={72} />
          <button onClick={() => setEditModal(true)} className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Edit3 size={13} className="text-white" />
          </button>
        </div>
        <h2 className="font-black text-slate-800 text-lg">{user?.name}</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <p className="text-xs text-slate-400 mt-1">{user?.phone}</p>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          {stats.map(s => (
            <div key={s.label}>
              <div className="font-black text-lg text-slate-800">{s.value}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Saved Addresses */}
      <Card className="mb-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="font-bold text-slate-800 text-sm">Saved Addresses</span>
          <button onClick={() => setAddressModal(true)} className="text-orange-500 text-xs font-semibold">+ Add</button>
        </div>
        {(user?.savedAddresses || []).length === 0 ? (
          <div className="p-4 text-sm text-slate-500 text-center">No saved addresses</div>
        ) : (
          (user?.savedAddresses || []).map(addr => (
            <div key={addr.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{addr.label}</p>
                <p className="text-xs text-slate-500">{addr.address}</p>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Menu */}
      <Card className="mb-4 overflow-hidden">
        <MenuRow icon={<User size={18} className="text-orange-500" />} label="Edit Profile" sublabel="Update your name and phone" onClick={() => setEditModal(true)} />
        <MenuRow icon={<Bell size={18} className="text-blue-500" />} label="Notifications" sublabel="Manage alert preferences" onClick={() => setNotifModal(true)} />
        <MenuRow icon={<Shield size={18} className="text-green-500" />} label="Security & Privacy" sublabel="Password, 2FA, data" onClick={() => {}} />
        <MenuRow icon={<Globe size={18} className="text-purple-500" />} label="Language" sublabel="English (UK)" onClick={() => {}} />
        <MenuRow icon={<HelpCircle size={18} className="text-cyan-500" />} label="Help & Support" sublabel="FAQs, contact us" onClick={() => {}} />
      </Card>

      <Card className="mb-6 overflow-hidden">
        <MenuRow icon={<LogOut size={18} className="text-red-500" />} label="Log Out" onClick={logout} danger />
      </Card>

      <p className="text-center text-xs text-slate-400 mb-4">Amplified Logistics v1.0.0 · Member since {new Date(user?.createdAt).getFullYear()}</p>

      {/* Edit Profile Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
        <div className="p-5 space-y-4">
          <Input label="Full Name" type="text" icon={<User size={16} />} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Phone Number" type="tel" icon={<Phone size={16} />} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Btn className="w-full" onClick={() => { updateProfile(form); setEditModal(false); }}>Save Changes</Btn>
        </div>
      </Modal>

      {/* Address Modal */}
      <Modal open={addressModal} onClose={() => setAddressModal(false)} title="Add Address">
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Label</p>
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map(l => (
                <button key={l} onClick={() => setAddrForm(p => ({ ...p, label: l }))} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${addrForm.label === l ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-600'}`}>{l}</button>
              ))}
            </div>
          </div>
          <Input label="Address" type="text" icon={<MapPin size={16} />} value={addrForm.address} onChange={e => setAddrForm(p => ({ ...p, address: e.target.value }))} placeholder="Street, City, State" />
          <Btn className="w-full" onClick={() => { if (addrForm.address) { saveAddress(addrForm); setAddressModal(false); setAddrForm({ label: 'Home', address: '' }); } }}>Save Address</Btn>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal open={notifModal} onClose={() => setNotifModal(false)} title="Notifications">
        <div className="p-5 space-y-4">
          {Object.entries({ orderUpdates: 'Order Status Updates', riderMessages: 'Rider Messages', promotions: 'Promotions & Offers', newsletter: 'Newsletter' }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-700">{label}</span>
              <Toggle checked={notifSettings[key]} onChange={v => setNotifSettings(p => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>
      </Modal>
    </PageLayout>
  );
}
