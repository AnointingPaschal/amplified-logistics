import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Phone, MessageCircle, Star, Clock, CheckCircle, Truck, Navigation, ArrowLeft, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageLayout } from '../../components/layout/AppShell';
import { Card, StatusBadge, Btn, StarRating } from '../../components/ui';
import { formatCurrency, formatDate, timeAgo, MOCK_ORDERS, MOCK_RIDERS } from '../../utils/mockData';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: <Package size={14} /> },
  { key: 'accepted', label: 'Rider Assigned', icon: <CheckCircle size={14} /> },
  { key: 'pickup', label: 'Picked Up', icon: <Navigation size={14} /> },
  { key: 'transit', label: 'In Transit', icon: <Truck size={14} /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={14} /> },
];

const STATUS_ORDER = ['pending', 'accepted', 'pickup', 'transit', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders: myOrders = [], showToast, cancelOrder } = useApp();

  const allOrders = myOrders?.length ? myOrders : MOCK_ORDERS;
  const order = allOrders.find(o => o.id === id || o.trackingId === id) || MOCK_ORDERS[0];
  const rider = MOCK_RIDERS.find(r => r.id === order?.riderId) || MOCK_RIDERS[0];

  if (!order) {
    return (
      <PageLayout title="Order Details">
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-700 mb-1">Order not found</h3>
          <Btn onClick={() => navigate('/customer/orders')} className="mt-4">Back to Orders</Btn>
        </div>
      </PageLayout>
    );
  }

  const currentStep = STATUS_ORDER.indexOf(order.status);
  const isActive = ['pending', 'accepted', 'pickup', 'transit'].includes(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const copyTracking = () => {
    navigator.clipboard?.writeText(order.trackingId).catch(() => {});
    showToast(`Tracking ID copied: ${order.trackingId}`, 'success');
  };

  return (
    <PageLayout
      title="Order Details"
      right={
        <button onClick={copyTracking} className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
          <Copy size={13} /> Copy ID
        </button>
      }
    >
      {/* Status Banner */}
      <div className={`rounded-2xl p-4 mb-5 text-white ${
        isDelivered ? 'bg-gradient-to-r from-green-500 to-green-600' :
        isCancelled ? 'bg-gradient-to-r from-red-500 to-red-600' :
        'bg-gradient-to-r from-orange-500 to-orange-600'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-sm font-bold opacity-90">{order.trackingId}</span>
          <StatusBadge status={order.status} className="!bg-white/20 !text-white border-white/30" />
        </div>
        <p className="text-white/80 text-xs">
          {isDelivered ? 'Your package has been delivered successfully!' :
           isCancelled ? 'This order has been cancelled.' :
           'Your package is on its way.'}
        </p>
        <p className="text-white/60 text-xs mt-1">Placed {timeAgo(order.createdAt)}</p>
      </div>

      {/* Progress Steps */}
      {!isCancelled && (
        <Card className="p-4 mb-4">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Delivery Progress</h3>
          <div className="space-y-3">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    done ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${done ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-xs text-orange-500 font-medium animate-pulse">In progress...</p>
                    )}
                  </div>
                  {done && i < currentStep && (
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  )}
                  {active && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Rider Info */}
      {['accepted', 'pickup', 'transit', 'delivered'].includes(order.status) && rider && (
        <Card className="p-4 mb-4">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">Your Rider</h3>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0">
              {rider.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">{rider.name}</p>
              <p className="text-xs text-slate-500">{rider.vehicle} · {rider.plateNumber}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-slate-700">{rider.rating}</span>
                <span className="text-xs text-slate-400">({rider.totalDeliveries} deliveries)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${rider.phone}`}
                className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 active:scale-95"
              >
                <Phone size={16} />
              </a>
              <button
                onClick={() => navigate(`/customer/track/${order.id}`)}
                className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 active:scale-95"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Route Info */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">Route Details</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="w-0.5 h-8 bg-slate-200 my-1" />
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin size={14} className="text-orange-500" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Pickup</p>
                <p className="text-sm font-semibold text-slate-800">{order.pickupAddress}</p>
                <p className="text-xs text-slate-500">{order.senderName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Drop-off</p>
                <p className="text-sm font-semibold text-slate-800">{order.dropoffAddress}</p>
                <p className="text-xs text-slate-500">{order.recipientName} · {order.recipientPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Package Info */}
      <Card className="p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">Package Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Package Type</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">{order.packageType}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Weight</p>
            <p className="text-sm font-semibold text-slate-800">{order.weight || '2'} kg</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Payment</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">{order.paymentMethod || 'Wallet'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Amount</p>
            <p className="text-sm font-bold text-orange-500">{formatCurrency(order.price)}</p>
          </div>
        </div>
        {order.note && (
          <div className="mt-3 bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">Delivery Note</p>
            <p className="text-sm text-slate-700">{order.note}</p>
          </div>
        )}
      </Card>

      {/* Rating (delivered) */}
      {isDelivered && (
        <Card className="p-4 mb-4">
          <h3 className="font-bold text-slate-800 mb-1 text-sm">Rate This Delivery</h3>
          <p className="text-xs text-slate-500 mb-3">How was your experience?</p>
          {order.rating ? (
            <div className="flex items-center gap-2">
              <StarRating rating={order.rating} readonly />
              <span className="text-sm text-slate-600">You rated {order.rating}/5</span>
            </div>
          ) : (
            <Btn onClick={() => navigate(`/customer/track/${order.id}`)}>
              <Star size={16} /> Rate Delivery
            </Btn>
          )}
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-2 pb-4">
        {isActive && (
          <Btn
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/customer/track/${order.id}`)}
          >
            <Truck size={16} /> Track Live
          </Btn>
        )}
        {order.status === 'pending' && (
          <Btn
            variant="danger"
            className="w-full"
            onClick={() => { cancelOrder?.(order.id); navigate('/customer/orders'); }}
          >
            Cancel Order
          </Btn>
        )}
        <Btn
          variant="ghost"
          className="w-full"
          onClick={() => showToast('Support ticket created', 'success')}
        >
          Contact Support
        </Btn>
      </div>
    </PageLayout>
  );
}
