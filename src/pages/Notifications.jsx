import { Package, MapPin, CheckCircle, Bell, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageLayout } from '../components/layout/AppShell';
import { Card, EmptyState } from '../components/ui';

const NOTIF_ICONS = {
  order: <Package size={18} className="text-orange-500" />,
  rider: <MapPin size={18} className="text-blue-500" />,
  success: <CheckCircle size={18} className="text-green-500" />,
  info: <Info size={18} className="text-slate-500" />,
};

export default function Notifications() {
  const { notifications, markAllRead } = useApp();

  return (
    <PageLayout title="Notifications" back>
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="No notifications" desc="You'll see order updates and alerts here" />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <Card key={n.id} className={`p-4 flex items-start gap-3 ${!n.read ? 'bg-orange-50 border-orange-100' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-orange-100' : 'bg-slate-100'}`}>
                {NOTIF_ICONS[n.type] || <Bell size={18} />}
              </div>
              <div className="flex-1">
                <p className={`text-sm leading-relaxed ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
