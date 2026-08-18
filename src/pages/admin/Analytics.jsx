import { useState } from 'react';
import { TrendingUp, TrendingDown, Package, Users, Star, Clock, DollarSign, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card } from '../../components/ui';
import { formatCurrency, MOCK_ORDERS } from '../../utils/mockData';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PERIOD_TABS = ['7D', '30D', '90D', 'All'];

const weeklyRevenue = [
  { day: 'Mon', revenue: 145000, orders: 45 },
  { day: 'Tue', revenue: 210000, orders: 62 },
  { day: 'Wed', revenue: 178000, orders: 38 },
  { day: 'Thu', revenue: 245000, orders: 71 },
  { day: 'Fri', revenue: 289000, orders: 89 },
  { day: 'Sat', revenue: 198000, orders: 54 },
  { day: 'Sun', revenue: 134000, orders: 33 },
];

const monthlyTrend = [
  { month: 'Mar', revenue: 1200000 }, { month: 'Apr', revenue: 1480000 },
  { month: 'May', revenue: 1650000 }, { month: 'Jun', revenue: 1420000 },
  { month: 'Jul', revenue: 1890000 }, { month: 'Aug', revenue: 2100000 },
];

const deliveryStatusData = [
  { name: 'Delivered', value: 78, color: '#22C55E' },
  { name: 'In Transit', value: 12, color: '#F97316' },
  { name: 'Pending', value: 7, color: '#3B82F6' },
  { name: 'Cancelled', value: 3, color: '#EF4444' },
];

const topRiders = [
  { name: 'Emeka O.', deliveries: 142, rating: 4.9, earnings: 284000 },
  { name: 'Femi A.', deliveries: 128, rating: 4.8, earnings: 256000 },
  { name: 'Chioma B.', deliveries: 115, rating: 4.9, earnings: 230000 },
  { name: 'Kola M.', deliveries: 98, rating: 4.7, earnings: 196000 },
];

const COLORS = ['#22C55E', '#F97316', '#3B82F6', '#EF4444'];

export default function AdminAnalytics() {
  const { orders: allOrders = [] } = useApp();
  const [period, setPeriod] = useState('7D');

  const orders = allOrders?.length ? allOrders : MOCK_ORDERS;

  const kpis = [
    {
      label: 'Total Revenue', value: formatCurrency(2100000),
      change: '+12.4%', up: true, icon: <DollarSign size={18} />, color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Orders', value: orders.length || 392,
      change: '+8.1%', up: true, icon: <Package size={18} />, color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Avg Delivery Time', value: '18 min',
      change: '-2.3 min', up: true, icon: <Clock size={18} />, color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Customer Rating', value: '4.7★',
      change: '+0.2', up: true, icon: <Star size={18} />, color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Active Riders', value: 24,
      change: '+3 this week', up: true, icon: <Truck size={18} />, color: 'bg-teal-50 text-teal-600',
    },
    {
      label: 'Cancellation Rate', value: '3.2%',
      change: '-0.8%', up: true, icon: <Users size={18} />, color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <PageLayout title="Analytics">
      {/* Period Selector */}
      <div className="flex gap-2 mb-5">
        {PERIOD_TABS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              period === p
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {kpis.map(k => (
          <Card key={k.label} className="p-4">
            <div className={`w-9 h-9 ${k.color} rounded-xl flex items-center justify-center mb-2`}>
              {k.icon}
            </div>
            <div className="font-black text-lg text-slate-800">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${k.up ? 'text-green-600' : 'text-red-500'}`}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue + Orders Chart */}
      <Card className="p-4 mb-5">
        <h3 className="font-bold text-slate-800 mb-4">Daily Revenue & Orders</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyRevenue} barSize={18}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip
              formatter={(v, name) => [name === 'revenue' ? formatCurrency(v) : v, name === 'revenue' ? 'Revenue' : 'Orders']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
            />
            <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} name="revenue" />
            <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} name="orders" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Trend */}
      <Card className="p-4 mb-5">
        <h3 className="font-bold text-slate-800 mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={monthlyTrend}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip
              formatter={(v) => [formatCurrency(v), 'Revenue']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Delivery Status Pie */}
      <Card className="p-4 mb-5">
        <h3 className="font-bold text-slate-800 mb-4">Order Status Distribution</h3>
        <div className="flex items-center gap-4">
          <PieChart width={130} height={130}>
            <Pie data={deliveryStatusData} cx={60} cy={60} innerRadius={36} outerRadius={58} dataKey="value" paddingAngle={3}>
              {deliveryStatusData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex-1 space-y-2">
            {deliveryStatusData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Riders */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">Top Performing Riders</h3>
        {topRiders.map((rider, i) => (
          <Card key={rider.name} className="p-3 mb-2 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 ${
              i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-600' : 'bg-slate-300'
            }`}>
              #{i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-800">{rider.name}</div>
              <div className="text-xs text-slate-500">{rider.deliveries} deliveries • {rider.rating}★</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">{formatCurrency(rider.earnings)}</div>
              <div className="text-xs text-slate-400">earned</div>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
