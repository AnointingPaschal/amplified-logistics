import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import LiveMap from '../../components/map/LiveMap';

export default function RiderMap() {
  const { user, riders } = useApp();
  return (
    <PageLayout title="Navigation Map" noPad>
      <div className="h-[calc(100dvh-120px)]">
        <LiveMap height="100%" riders={riders} center={[5.5264, 7.4855]} zoom={14} />
      </div>
    </PageLayout>
  );
}
