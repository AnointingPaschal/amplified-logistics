import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, BarChart2, TrendingUp, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Btn, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', orders: 12 }, { day: 'Tue', orders: 19 }, { day: 'Wed', orders: 8 },
  { day: 'Thu', orders: 25 }, { day: 'Fri', orders: 31 }, { day: 'Sat', orders: 22 }, { day: 'Sun', orders: 15 },
];

export default function MerchantDashboard() {
  const { user, orders: myOrders = [], submitOrder: createOrder, showToast } = useApp();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Orders', value: myOrders.length || 132, icon: <Package size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length || 108, icon: <CheckCircle size={18} />, color: 'bg-green-50 text-green-600' },
    { label: 'In Progress', value: myOrders.filter(o => ['pending', 'accepted', 'pickup', 'transit'].includes(o.status)).length || 8, icon: <Clock size={18} />, color: 'bg-orange-50 text-orange-600' },
    { label: 'Revenue', value: formatCurrency(myOrders.reduce((s, o) => s + (o.price || 0), 0) || 487000), icon: <TrendingUp size={18} />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <PageLayout title={user?.businessName || 'Business Dashboard'}>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 mb-5 text-white">
        <p className="text-slate-400 text-xs mb-1">Welcome back</p>
        <h2 className="font-black text-xl">{user?.businessName || user?.name}</h2>
        <p className="text-slate-400 text-xs mt-0.5">{user?.businessType || 'Business'} Account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(s => (
          <Card key={s.label} className="p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-2`}>{s.icon}</div>
            <div className="font-black text-xl text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-4 mb-5">
        <h3 className="font-bold text-slate-800 mb-4">Orders This Week</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} barSize={24}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Btn className="flex-col h-20 gap-1" onClick={() => navigate('/merchant/orders/create')}>
          <Plus size={22} /> New Order
        </Btn>
        <Btn variant="secondary" className="flex-col h-20 gap-1" onClick={() => navigate('/merchant/analytics')}>
          <BarChart2 size={22} /> Analytics
        </Btn>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">Recent Orders</h3>
          <button onClick={() => navigate('/merchant/orders')} className="text-xs text-orange-500 font-semibold">View all →</button>
        </div>
        {myOrders.slice(0, 4).map(order => (
          <Card key={order.id} className="p-4 mb-2 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${order.status === 'delivered' ? 'bg-green-100' : 'bg-orange-100'}`}>
              {order.status === 'delivered' ? <CheckCircle size={16} className="text-green-600" /> : <Truck size={16} className="text-orange-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">#{order.trackingId}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{order.dropoff}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-400">{timeAgo(order.createdAt)}</span>
                <span className="text-xs font-bold text-slate-700">{formatCurrency(order.price)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
