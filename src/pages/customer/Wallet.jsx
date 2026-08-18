import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, CreditCard, Wallet as WalletIcon, Building, Zap, Copy, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, Btn, Modal, Input, EmptyState } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';

const FUND_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function CustomerWallet() {
  const { wallet, addFunds, user, showToast } = useApp();
  const [fundModal, setFundModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    const val = Number(amount);
    if (!val || val < 100) { showToast('Enter a valid amount (min ₦100)', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addFunds(val, method);
    setFundModal(false);
    setAmount('');
    setLoading(false);
  };

  const copyRef = () => {
    navigator.clipboard?.writeText(user?.referralCode || 'AMP12345');
    showToast('Referral code copied!', 'success');
  };

  return (
    <PageLayout title="Wallet">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
        <p className="text-slate-400 text-xs font-medium mb-1 relative">Available Balance</p>
        <h2 className="text-4xl font-black text-white mb-5 relative">{formatCurrency(wallet.balance)}</h2>
        <div className="flex gap-3 relative">
          <Btn variant="primary" size="md" className="flex-1 bg-orange-500" onClick={() => setFundModal(true)}>
            <Plus size={16} /> Add Funds
          </Btn>
          <button onClick={() => showToast('Bank transfer details sent to your email', 'info')} className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/20 transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Spent', value: formatCurrency(wallet.transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)), icon: <ArrowUpRight size={16} className="text-red-500" /> },
          { label: 'Total Funded', value: formatCurrency(wallet.transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)), icon: <ArrowDownLeft size={16} className="text-green-500" /> },
          { label: 'Transactions', value: wallet.transactions.length.toString(), icon: <WalletIcon size={16} className="text-orange-500" /> },
        ].map(item => (
          <Card key={item.label} className="p-3 text-center">
            <div className="flex justify-center mb-1">{item.icon}</div>
            <div className="font-black text-slate-800 text-sm">{item.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Referral */}
      <Card className="p-4 mb-5 border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-slate-800">Earn ₦500 per referral</p>
            <p className="text-xs text-slate-500 mt-0.5">Share your code, earn when they order</p>
          </div>
          <Zap size={28} className="text-orange-400" />
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl p-3">
          <span className="flex-1 font-black text-orange-600 text-lg tracking-widest">{user?.referralCode}</span>
          <button onClick={copyRef} className="p-2 bg-orange-100 rounded-lg"><Copy size={16} className="text-orange-600" /></button>
        </div>
      </Card>

      {/* Transaction History */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 mb-3">Transaction History</h3>
        {wallet.transactions.length === 0 ? (
          <EmptyState icon={<WalletIcon size={28} />} title="No transactions" desc="Your wallet transactions will appear here" />
        ) : (
          <div className="space-y-2">
            {wallet.transactions.map(tx => (
              <Card key={tx.id} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={18} className="text-green-600" /> : <ArrowUpRight size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                  <p className="text-xs text-slate-500">{timeAgo(tx.time)} · {tx.method}</p>
                </div>
                <span className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      <Modal open={fundModal} onClose={() => setFundModal(false)} title="Add Funds">
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Select Amount</p>
            <div className="grid grid-cols-3 gap-2">
              {FUND_AMOUNTS.map(a => (
                <button key={a} onClick={() => setAmount(a.toString())} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${amount === a.toString() ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-700 hover:border-orange-300'}`}>
                  {formatCurrency(a)}
                </button>
              ))}
            </div>
          </div>
          <Input label="Or enter custom amount" type="number" icon={<WalletIcon size={16} />} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Payment Method</p>
            <div className="space-y-2">
              {[{ id: 'card', label: 'Debit/Credit Card', icon: <CreditCard size={18} /> }, { id: 'bank', label: 'Bank Transfer', icon: <Building size={18} /> }, { id: 'ussd', label: 'USSD', icon: <WalletIcon size={18} /> }].map(pm => (
                <button key={pm.id} onClick={() => setMethod(pm.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${method === pm.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <span className={`p-1.5 rounded-lg ${method === pm.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{pm.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Btn className="w-full" size="lg" loading={loading} onClick={handleFund}>
            Fund Wallet — {amount ? formatCurrency(Number(amount)) : 'Enter amount'}
          </Btn>
        </div>
      </Modal>
    </PageLayout>
  );
}
