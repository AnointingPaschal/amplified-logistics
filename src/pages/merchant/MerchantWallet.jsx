import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Download, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Btn, Modal, Input } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';

export default function MerchantWallet() {
  const { wallet, addFunds, withdrawFunds, showToast } = useApp();
  const [fundModal, setFundModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState({ bank: 'GTBank', account: '' });
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!Number(amount) || Number(amount) < 1000) { showToast('Minimum top-up is ₦1,000', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addFunds(Number(amount), 'bank');
    setFundModal(false);
    setAmount('');
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!Number(amount)) { showToast('Enter valid amount', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    withdrawFunds(Number(amount), bank);
    setWithdrawModal(false);
    setAmount('');
    setLoading(false);
  };

  return (
    <PageLayout title="Payments">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full" />
        <p className="text-slate-400 text-xs mb-1">Settlement Balance</p>
        <h2 className="text-4xl font-black text-white mb-5">{formatCurrency(wallet.balance)}</h2>
        <div className="flex gap-3">
          <Btn size="md" className="flex-1" onClick={() => setFundModal(true)}>Top Up</Btn>
          <Btn variant="secondary" size="md" className="flex-1 bg-white/10 text-white hover:bg-white/20 border-0" onClick={() => setWithdrawModal(true)}>Withdraw</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="p-4 text-center bg-green-50">
          <div className="font-black text-xl text-green-700">{formatCurrency(wallet.transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0) + 487000)}</div>
          <div className="text-xs text-green-600 mt-1">Total Revenue</div>
        </Card>
        <Card className="p-4 text-center bg-red-50">
          <div className="font-black text-xl text-red-700">{formatCurrency(wallet.transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0))}</div>
          <div className="text-xs text-red-600 mt-1">Total Withdrawn</div>
        </Card>
      </div>

      <Btn variant="secondary" size="md" className="w-full mb-5" onClick={() => showToast('Report downloaded!', 'success')}>
        <Download size={16} /> Download Settlement Report
      </Btn>

      <h3 className="font-bold text-slate-800 mb-3">Transactions</h3>
      <div className="space-y-2">
        {wallet.transactions.map(tx => (
          <Card key={tx.id} className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
              {tx.type === 'credit' ? <ArrowDownLeft size={18} className="text-green-600" /> : <ArrowUpRight size={18} className="text-red-500" />}
            </div>
            <div className="flex-1"><p className="text-sm font-semibold text-slate-800">{tx.description}</p><p className="text-xs text-slate-500">{timeAgo(tx.time)}</p></div>
            <span className={`font-black text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>{tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
          </Card>
        ))}
      </div>

      <Modal open={fundModal} onClose={() => setFundModal(false)} title="Top Up Wallet">
        <div className="p-5 space-y-4">
          <Input label="Amount (min ₦1,000)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          <Btn className="w-full" loading={loading} onClick={handleFund}>Fund Wallet</Btn>
        </div>
      </Modal>

      <Modal open={withdrawModal} onClose={() => setWithdrawModal(false)} title="Withdraw Funds">
        <div className="p-5 space-y-4">
          <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          <select value={bank.bank} onChange={e => setBank(p => ({ ...p, bank: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
            {['GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank'].map(b => <option key={b}>{b}</option>)}
          </select>
          <Input label="Account Number" type="text" icon={<Building size={16} />} value={bank.account} onChange={e => setBank(p => ({ ...p, account: e.target.value }))} placeholder="10-digit account" />
          <Btn className="w-full" loading={loading} onClick={handleWithdraw}>Withdraw</Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
