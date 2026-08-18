import { useState } from 'react';
import { Store, Globe, Bell, Shield, LogOut, Edit3, Code } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Avatar, Modal, Input, Select, Btn, MenuRow } from '../../components/ui';

export default function MerchantProfile() {
  const { user, logout, updateProfile } = useApp();
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({ businessName: user?.businessName || '', businessType: user?.businessType || 'Retail' });

  return (
    <PageLayout title="Settings">
      <Card className="p-5 mb-4 text-center">
        <div className="relative inline-block mb-3">
          <Avatar name={user?.businessName || user?.name} size={72} />
          <button onClick={() => setEditModal(true)} className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center"><Edit3 size={13} className="text-white" /></button>
        </div>
        <h2 className="font-black text-lg text-slate-800">{user?.businessName || user?.name}</h2>
        <p className="text-sm text-slate-500">{user?.businessType || 'Business'}</p>
        <p className="text-xs text-slate-400">{user?.email}</p>
      </Card>

      <Card className="mb-4 overflow-hidden">
        <MenuRow icon={<Store size={18} className="text-orange-500" />} label="Business Profile" sublabel="Edit business information" onClick={() => setEditModal(true)} />
        <MenuRow icon={<Code size={18} className="text-blue-500" />} label="API Access" sublabel="Integration keys & webhooks" onClick={() => {}} />
        <MenuRow icon={<Bell size={18} className="text-purple-500" />} label="Notifications" sublabel="Manage alerts" onClick={() => {}} />
        <MenuRow icon={<Shield size={18} className="text-green-500" />} label="Security" sublabel="Password & permissions" onClick={() => {}} />
        <MenuRow icon={<Globe size={18} className="text-cyan-500" />} label="Language & Region" onClick={() => {}} />
      </Card>

      <Card className="mb-6 overflow-hidden">
        <MenuRow icon={<LogOut size={18} className="text-red-500" />} label="Log Out" onClick={logout} danger />
      </Card>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Business Profile">
        <div className="p-5 space-y-4">
          <Input label="Business Name" icon={<Store size={16} />} value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} />
          <Select label="Business Type" value={form.businessType} onChange={e => setForm(p => ({ ...p, businessType: e.target.value }))}>
            {['Retail', 'Restaurant', 'Pharmacy', 'Fashion', 'Electronics', 'Wholesale', 'Other'].map(t => <option key={t}>{t}</option>)}
          </Select>
          <Btn className="w-full" onClick={() => { updateProfile(form); setEditModal(false); }}>Save</Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
