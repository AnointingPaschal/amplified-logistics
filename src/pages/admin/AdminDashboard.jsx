import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card } from '../../components/ui';
import { Package, Users, Truck, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 145000 }, { day: 'Tue', revenue: 210000 }, { day: 'Wed', revenue: 178000 },
  { day: 'Thu', revenue: 245000 }, { day: 'Fri', revenue: 289000 }, { day: 'Sat', revenue: 198000 }, { day: 'Sun', revenue: 134000 },
];

export default function AdminDashboard() {
  const { orders, users, riders } = useApp();
  const totalRevenue = orders.reduce((s, o) => s + (o.price || 0), 0) + 1480000;
  const onlineRiders = riders.filter(r => r.online).length;
  const customers = users.filter(u => u.role === 'customer').length;
  const unverifiedRiders = users.filter(u => u.role === 'rider' && !u.verified).length;

  const stats = [
    { label: 'Total Orders', value: orders.length + 1204, icon: <Package size={18} />, color: 'bg-blue-50 text-blue-600', change: '+12%' },
    { label: 'Active Riders', value: onlineRiders, icon: <Truck size={18} />, color: 'bg-green-50 text-green-600', change: onlineRiders + ' online' },
    { label: 'Customers', value: customers + 9847, icon: <Users size={18} />, color: 'bg-purple-50 text-purple-600', change: '+5.4%' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign size={18} />, color: 'bg-orange-50 text-orange-600', change: '+23%' },
  ];

  return (
    <PageLayout title="Admin Overview">
      {/* Alert for unverified riders */}
      {unverifiedRiders > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{unverifiedRiders} rider{unverifiedRiders > 1 ? 's' : ''} pending verification</p>
            <p className="text-xs text-amber-600">Review KYC documents in Users section</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(s => (
          <Card key={s.label} className="p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-2`}>{s.icon}</div>
            <div className="font-black text-xl text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="text-[10px] text-green-600 font-semibold mt-1">{s.change}</div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Weekly Revenue</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={revenueData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Order Status */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3">Order Status Today</h3>
        <div className="space-y-3">
          {[
            { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length + 234, color: 'bg-green-500', pct: 65 },
            { label: 'In Transit', count: orders.filter(o => o.status === 'transit').length + 89, color: 'bg-orange-500', pct: 25 },
            { label: 'Pending', count: orders.filter(o => o.status === 'pending').length + 34, color: 'bg-amber-500', pct: 9 },
            { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length + 4, color: 'bg-red-500', pct: 1 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="font-bold text-slate-800">{item.count}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">Recent Orders</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map(o => (
            <Card key={o.id} className="p-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${o.status === 'delivered' ? 'bg-green-100' : o.status === 'transit' ? 'bg-orange-100' : 'bg-slate-100'}`}>
                {o.status === 'delivered' ? <CheckCircle size={14} className="text-green-600" /> : <Clock size={14} className="text-orange-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">#{o.trackingId} · {o.customerName}</p>
                <p className="text-[10px] text-slate-500 truncate">{o.pickup} → {o.dropoff}</p>
              </div>
              <span className="text-xs font-black text-slate-700">{formatCurrency(o.price)}</span>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
