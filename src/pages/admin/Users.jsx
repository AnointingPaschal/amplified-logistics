import { useState } from 'react';
import { Search, Filter, User, Truck, Store, ShieldCheck, ShieldX, CheckCircle, XCircle, Phone, Mail, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Btn, Modal, Input, StatusBadge, Avatar } from '../../components/ui';
import { MOCK_USERS, MOCK_RIDERS, timeAgo } from '../../utils/mockData';

const ROLE_TABS = ['All', 'Customers', 'Riders', 'Merchants'];

const roleIcon = (role) => {
  if (role === 'rider') return <Truck size={14} className="text-blue-500" />;
  if (role === 'merchant') return <Store size={14} className="text-purple-500" />;
  return <User size={14} className="text-slate-500" />;
};

const roleBadgeColor = {
  customer: 'bg-slate-100 text-slate-600',
  rider: 'bg-blue-50 text-blue-600',
  merchant: 'bg-purple-50 text-purple-600',
  admin: 'bg-orange-50 text-orange-600',
};

export default function AdminUsers() {
  const { riders: ctxRiders, verifyRider, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Build unified user list
  const allUsers = [
    ...MOCK_USERS.filter(u => u.role !== 'admin'),
    ...(ctxRiders?.length ? ctxRiders.map(r => ({ ...r, role: 'rider' })) : MOCK_RIDERS.map(r => ({ ...r, role: 'rider' }))),
  ];

  const filtered = allUsers.filter(u => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Customers' && u.role === 'customer') ||
      (activeTab === 'Riders' && u.role === 'rider') ||
      (activeTab === 'Merchants' && u.role === 'merchant');
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleVerify = (userId) => {
    verifyRider?.(userId);
    showToast('Rider KYC verified successfully', 'success');
    setShowModal(false);
  };

  const handleSuspend = (userId) => {
    showToast('User suspended', 'error');
    setShowModal(false);
  };

  const openUser = (u) => {
    setSelectedUser(u);
    setShowModal(true);
  };

  const counts = {
    All: allUsers.length,
    Customers: allUsers.filter(u => u.role === 'customer').length,
    Riders: allUsers.filter(u => u.role === 'rider').length,
    Merchants: allUsers.filter(u => u.role === 'merchant').length,
  };

  return (
    <PageLayout title="User Management">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Customers', count: counts.Customers, icon: <User size={16} />, color: 'text-slate-600 bg-slate-100' },
          { label: 'Riders', count: counts.Riders, icon: <Truck size={16} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Merchants', count: counts.Merchants, icon: <Store size={16} />, color: 'text-purple-600 bg-purple-50' },
        ].map(c => (
          <Card key={c.label} className="p-3 text-center">
            <div className={`w-8 h-8 ${c.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>{c.icon}</div>
            <div className="font-black text-lg text-slate-800">{c.count}</div>
            <div className="text-xs text-slate-500">{c.label}</div>
          </Card>
        ))}
      </div>

      {/* KYC Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
        <ShieldX size={16} className="text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-amber-800">7 riders pending KYC verification</p>
          <p className="text-xs text-amber-600">Review and approve their documents</p>
        </div>
        <button
          onClick={() => setActiveTab('Riders')}
          className="text-xs text-amber-700 font-bold underline"
        >
          Review
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ROLE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-2">
        {filtered.map(u => (
          <Card key={`${u.id}-${u.role}`} className="p-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm">
                {u.name?.charAt(0)?.toUpperCase()}
              </div>
              {u.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-semibold text-sm text-slate-800 truncate">{u.name}</span>
                {u.verified && <ShieldCheck size={13} className="text-green-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColor[u.role] || roleBadgeColor.customer}`}>
                  {u.role}
                </span>
                {u.role === 'rider' && !u.verified && (
                  <span className="text-xs text-amber-600 font-medium">KYC pending</span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 truncate">{u.email}</div>
            </div>

            <button
              onClick={() => openUser(u)}
              className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 active:scale-95"
            >
              <Eye size={15} />
            </button>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <User size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No users found</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                {selectedUser.name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-800">{selectedUser.name}</h3>
                  {selectedUser.verified && <ShieldCheck size={16} className="text-green-500" />}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColor[selectedUser.role] || roleBadgeColor.customer}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                {selectedUser.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                {selectedUser.phone || '+234 800 000 0000'}
              </div>
            </div>

            {/* Rider-specific */}
            {selectedUser.role === 'rider' && (
              <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                <h4 className="font-semibold text-sm text-slate-700">Rider Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Vehicle</span>
                    <p className="font-semibold text-slate-800">{selectedUser.vehicle || 'Motorcycle'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Rating</span>
                    <p className="font-semibold text-slate-800">{selectedUser.rating || '4.8'}★</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Deliveries</span>
                    <p className="font-semibold text-slate-800">{selectedUser.deliveries || 0}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">KYC Status</span>
                    <p className={`font-semibold ${selectedUser.verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {selectedUser.verified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {selectedUser.role === 'rider' && !selectedUser.verified && (
                <Btn className="w-full" onClick={() => handleVerify(selectedUser.id)}>
                  <ShieldCheck size={16} /> Verify KYC & Approve Rider
                </Btn>
              )}
              <Btn variant="danger" className="w-full" onClick={() => handleSuspend(selectedUser.id)}>
                <XCircle size={16} /> Suspend Account
              </Btn>
              <Btn variant="ghost" className="w-full" onClick={() => setShowModal(false)}>
                Close
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
