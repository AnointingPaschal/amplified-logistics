import { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Building, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Btn, Modal, Input, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const weekData = [
  { day: 'Mon', earnings: 4200 }, { day: 'Tue', earnings: 6800 }, { day: 'Wed', earnings: 3200 },
  { day: 'Thu', earnings: 8100 }, { day: 'Fri', earnings: 9500 }, { day: 'Sat', earnings: 12000 }, { day: 'Sun', earnings: 5400 },
];

export default function RiderEarnings() {
  const { user, orders, withdrawFunds, wallet } = useApp();
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState({ bank: 'GTBank', account: '' });
  const [loading, setLoading] = useState(false);

  const myDeliveries = orders.filter(o => o.riderId === user?.id && o.status === 'delivered');
  const totalEarnings = myDeliveries.reduce((s, o) => s + (o.price * 0.8), 0);
  const thisWeek = myDeliveries.filter(o => Date.now() - new Date(o.createdAt).getTime() < 7 * 86400000).reduce((s, o) => s + (o.price * 0.8), 0);

  const handleWithdraw = async () => {
    const val = Number(amount);
    if (!val || val < 500) { return; }
    if (!bank.account) { return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    withdrawFunds(val, bank);
    setWithdrawModal(false);
    setAmount('');
    setLoading(false);
  };

  return (
    <PageLayout title="Earnings">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-500/10 rounded-full" />
        <p className="text-slate-400 text-xs mb-1">Wallet Balance</p>
        <h2 className="text-4xl font-black text-white mb-1">{formatCurrency(wallet.balance)}</h2>
        <p className="text-slate-400 text-xs mb-5">Total earned: {formatCurrency(totalEarnings)}</p>
        <Btn onClick={() => setWithdrawModal(true)} className="bg-green-500 hover:bg-green-600 shadow-green-200">
          Withdraw Funds
        </Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'This Week', value: formatCurrency(thisWeek) },
          { label: 'Deliveries', value: myDeliveries.length || 342 },
          { label: 'Avg/Delivery', value: formatCurrency(myDeliveries.length ? totalEarnings / myDeliveries.length : 2200) },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <div className="font-black text-slate-800 text-base">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">This Week</h3>
          <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> +18%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} barSize={28}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [formatCurrency(v), 'Earnings']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Bar dataKey="earnings" fill="#F97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Transactions */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">Transaction History</h3>
        {wallet.transactions.length === 0 ? (
          <EmptyState icon={<Wallet size={28} />} title="No transactions yet" desc="Complete deliveries to see your earnings" />
        ) : (
          <div className="space-y-2">
            {wallet.transactions.slice(0, 10).map(tx => (
              <Card key={tx.id} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={18} className="text-green-600" /> : <ArrowUpRight size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                  <p className="text-xs text-slate-500">{timeAgo(tx.time)}</p>
                </div>
                <span className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      <Modal open={withdrawModal} onClose={() => setWithdrawModal(false)} title="Withdraw Funds">
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500">Available</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(wallet.balance)}</p>
          </div>
          <Input label="Amount" type="number" icon={<Wallet size={16} />} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount (min ₦500)" />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Bank</p>
            <select value={bank.bank} onChange={e => setBank(p => ({ ...p, bank: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400">
              {['GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank', 'Opay', 'Palmpay'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <Input label="Account Number" type="text" icon={<Building size={16} />} value={bank.account} onChange={e => setBank(p => ({ ...p, account: e.target.value }))} placeholder="10-digit account number" maxLength={10} />
          <Btn className="w-full" size="lg" loading={loading} onClick={handleWithdraw}>
            Withdraw {amount ? formatCurrency(Number(amount)) : ''}
          </Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
