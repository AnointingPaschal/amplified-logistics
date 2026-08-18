import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card } from '../../components/ui';
import LiveMap from '../../components/map/LiveMap';
import { Truck, Package } from 'lucide-react';

export default function AdminMap() {
  const { riders, orders } = useApp();
  const [selected, setSelected] = useState(null);
  const onlineRiders = riders.filter(r => r.online);

  return (
    <PageLayout title="Live Delivery Map" noPad>
      <div className="px-4 pt-2 pb-2">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
            <Truck size={14} className="text-green-600" />
            <span className="text-xs font-bold text-green-700">{onlineRiders.length} online</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl">
            <Package size={14} className="text-orange-600" />
            <span className="text-xs font-bold text-orange-700">{orders.filter(o => !['delivered','cancelled'].includes(o.status)).length} active</span>
          </div>
        </div>
      </div>
      <LiveMap height="420px" riders={riders} center={[5.5264, 7.4855]} zoom={13} />
      {/* Rider List */}
      <div className="px-4 pt-4">
        <h3 className="font-bold text-slate-800 mb-3">All Riders</h3>
        <div className="space-y-2 pb-24">
          {riders.map(rider => (
            <Card key={rider.id} className="p-3 flex items-center gap-3" onClick={() => setSelected(rider)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${rider.online ? 'bg-orange-500' : 'bg-slate-400'}`}>
                {rider.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{rider.name}</p>
                <p className="text-xs text-slate-500">{rider.vehicleType} · ⭐{rider.rating} · {rider.deliveriesCompleted} deliveries</p>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${rider.online ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {rider.online ? '● Online' : '● Offline'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
