import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, MapPin, Clock, ChevronRight, Bike, Truck, Globe, Box, Zap, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Avatar, Btn } from '../../components/ui';
import { formatCurrency, timeAgo } from '../../utils/mockData';
import LiveMap from '../../components/map/LiveMap';

const SERVICES = [
  { id: 'standard', icon: <Bike size={20} />, label: 'Standard', sub: 'Up to 5kg', color: 'bg-orange-100 text-orange-600', to: '/customer/create?type=standard' },
  { id: 'bulk', icon: <Box size={20} />, label: 'Bulk', sub: '4+ stops', color: 'bg-purple-100 text-purple-600', to: '/customer/create?type=bulk' },
  { id: 'heavy', icon: <Truck size={20} />, label: 'Heavy', sub: 'Furniture', color: 'bg-pink-100 text-pink-600', to: '/customer/create?type=heavy' },
  { id: 'interstate', icon: <Globe size={20} />, label: 'Interstate', sub: 'Nationwide', color: 'bg-cyan-100 text-cyan-600', to: '/customer/create?type=interstate' },
];

export default function CustomerDashboard() {
  const { user, myOrders, riders, wallet } = useApp();
  const navigate = useNavigate();

  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const recentOrders = myOrders.slice(0, 3);
  const onlineRiders = riders.filter(r => r.online);

  return (
    <PageLayout>
      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 -mt-3 px-5 pt-5 pb-8 mb-4 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-500/10 rounded-full" />
        <div className="flex items-center justify-between mb-5 relative">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size={42} />
            <div>
              <p className="text-slate-400 text-xs">Good morning</p>
              <h2 className="text-white font-bold text-base">{user?.name?.split(' ')[0]}</h2>
            </div>
          </div>
          <Link to="/customer/wallet" className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Zap size={14} className="text-orange-400" />
            <span className="text-white text-sm font-bold">{formatCurrency(wallet.balance)}</span>
          </Link>
        </div>

        {/* Active order quick status */}
        {activeOrders.length > 0 && (
          <Link to="/customer/track" className="block bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Active Order</span>
              <StatusBadge status={activeOrders[0].status} />
            </div>
            <p className="text-white font-semibold text-sm mb-1">#{activeOrders[0].trackingId}</p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <MapPin size={12} /> {activeOrders[0].dropoff}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-orange-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Track live →
            </div>
          </Link>
        )}
      </div>

      {/* Services Grid */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">Send a Package</h3>
          <Link to="/customer/create" className="text-xs text-orange-500 font-semibold">See all →</Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SERVICES.map(s => (
            <Link key={s.id} to={s.to} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all active:scale-95">
              <div className={`p-2.5 rounded-xl ${s.color}`}>{s.icon}</div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-700">{s.label}</div>
                <div className="text-[10px] text-slate-400">{s.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Map */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">Riders Near You</h3>
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">{onlineRiders.length} online</span>
        </div>
        <LiveMap height="200px" riders={riders} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/customer/create" className="flex items-center gap-3 bg-orange-500 text-white rounded-2xl p-4 hover:bg-orange-600 active:scale-95 transition-all">
          <div className="p-2 bg-white/20 rounded-xl"><Plus size={18} /></div>
          <div>
            <div className="font-bold text-sm">New Order</div>
            <div className="text-xs opacity-75">Book delivery</div>
          </div>
        </Link>
        <Link to="/customer/track" className="flex items-center gap-3 bg-slate-900 text-white rounded-2xl p-4 hover:bg-slate-800 active:scale-95 transition-all">
          <div className="p-2 bg-white/20 rounded-xl"><MapPin size={18} /></div>
          <div>
            <div className="font-bold text-sm">Track Order</div>
            <div className="text-xs opacity-75">Live tracking</div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">Recent Orders</h3>
          <Link to="/customer/orders" className="text-xs text-orange-500 font-semibold">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No orders yet. Start your first delivery!</p>
            <Btn className="mt-4 mx-auto" size="sm" onClick={() => navigate('/customer/create')}>Book Now</Btn>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <Link key={order.id} to={`/customer/orders/${order.id}`}>
                <Card className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${order.status === 'delivered' ? 'bg-green-100' : order.status === 'cancelled' ? 'bg-red-100' : 'bg-orange-100'}`}>
                    <Package size={18} className={order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-500' : 'text-orange-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">#{order.trackingId}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{order.dropoff}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400">{timeAgo(order.createdAt)}</span>
                      <span className="text-xs font-bold text-slate-700">{formatCurrency(order.price)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold opacity-80 mb-1">NEW USER OFFER</div>
          <div className="font-black text-lg">50% OFF</div>
          <div className="text-xs opacity-80">Use code: FIRST50</div>
        </div>
        <div className="text-5xl opacity-30">🎁</div>
      </div>

      {/* Referral */}
      <Card className="p-4 border-orange-100 bg-orange-50 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Invite friends, earn ₦500</p>
            <p className="text-xs text-slate-500 mt-0.5">Your code: <strong className="text-orange-600">{user?.referralCode}</strong></p>
          </div>
          <Btn variant="outline" size="sm" onClick={() => navigator.share?.({ title: 'Amplified Logistics', text: `Use my code ${user?.referralCode} for 50% off!` })}>Share</Btn>
        </div>
      </Card>
    </PageLayout>
  );
}
