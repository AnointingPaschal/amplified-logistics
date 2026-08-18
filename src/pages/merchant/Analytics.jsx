import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card } from '../../components/ui';
import { formatCurrency } from '../../utils/mockData';

const monthData = [
  { month: 'Jan', orders: 42, revenue: 87000 }, { month: 'Feb', orders: 58, revenue: 112000 },
  { month: 'Mar', orders: 71, revenue: 145000 }, { month: 'Apr', orders: 65, revenue: 131000 },
  { month: 'May', orders: 89, revenue: 178000 }, { month: 'Jun', orders: 95, revenue: 192000 },
  { month: 'Jul', orders: 102, revenue: 208000 }, { month: 'Aug', orders: 87, revenue: 176000 },
];

const statusData = [
  { name: 'Delivered', value: 68, color: '#22C55E' },
  { name: 'In Transit', value: 18, color: '#F97316' },
  { name: 'Pending', value: 10, color: '#F59E0B' },
  { name: 'Cancelled', value: 4, color: '#EF4444' },
];

export default function MerchantAnalytics() {
  const { myOrders } = useApp();
  const totalRevenue = monthData.reduce((s, d) => s + d.revenue, 0);

  return (
    <PageLayout title="Analytics">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), sub: '+18% this month', color: 'text-green-600' },
          { label: 'Total Orders', value: '609', sub: '+12% this month', color: 'text-orange-600' },
          { label: 'Avg Order Value', value: formatCurrency(Math.round(totalRevenue / 609)), sub: 'per delivery', color: 'text-blue-600' },
          { label: 'Success Rate', value: '94.2%', sub: 'delivery rate', color: 'text-purple-600' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={`font-black text-xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-800 font-semibold mt-1">{s.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={monthData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders Chart */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Orders Per Month</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={monthData} barSize={22}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <Tooltip formatter={(v) => [v, 'Orders']} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            <Bar dataKey="orders" fill="#0F172A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Status Pie */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Order Status Breakdown</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-bold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}
