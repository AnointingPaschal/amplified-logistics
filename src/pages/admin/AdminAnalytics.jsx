import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card } from '../../components/ui';
import { formatCurrency } from '../../utils/mockData';

const weekRevenue = [
  { day: 'Mon', revenue: 145000, orders: 45 }, { day: 'Tue', revenue: 210000, orders: 68 },
  { day: 'Wed', revenue: 178000, orders: 55 }, { day: 'Thu', revenue: 245000, orders: 78 },
  { day: 'Fri', revenue: 289000, orders: 92 }, { day: 'Sat', revenue: 198000, orders: 63 }, { day: 'Sun', revenue: 134000, orders: 42 },
];

const riderPerf = [
  { name: 'Emeka R.', deliveries: 342, rating: 4.7, earnings: 756000 },
  { name: 'Chukwudi S.', deliveries: 218, rating: 4.5, earnings: 480000 },
  { name: 'Obinna F.', deliveries: 189, rating: 4.6, earnings: 416000 },
  { name: 'Nkechi E.', deliveries: 567, rating: 4.9, earnings: 1248000 },
];

const cityData = [
  { name: 'Aba', value: 42, color: '#F97316' },
  { name: 'Umuahia', value: 28, color: '#8B5CF6' },
  { name: 'Owerri', value: 18, color: '#06B6D4' },
  { name: 'Port Harcourt', value: 12, color: '#22C55E' },
];

export default function AdminAnalytics() {
  const { orders, users } = useApp();
  const totalRevenue = weekRevenue.reduce((s, d) => s + d.revenue, 0);

  return (
    <PageLayout title="Analytics">
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue + 1850000), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Delivery Time', value: '38 min', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completion Rate', value: '94.2%', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Active Users', value: (users.length + 9843).toLocaleString(), color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className={`p-4 ${s.bg}`}>
            <div className={`font-black text-xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-600 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Revenue vs Orders (This Week)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekRevenue} barSize={20}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#F97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" name="Orders" fill="#0F172A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4">Deliveries by City</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={cityData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                {cityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1">
            {cityData.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}</div>
                <div className="text-xs font-bold text-slate-700">{c.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Riders */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3">Top Riders</h3>
        <div className="space-y-3">
          {riderPerf.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-orange-700'}`}>{i + 1}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                <p className="text-xs text-slate-500">{r.deliveries} deliveries · ⭐{r.rating}</p>
              </div>
              <span className="text-xs font-bold text-slate-700">{formatCurrency(r.earnings)}</span>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
}
