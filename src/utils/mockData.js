export const generateId = () => Math.random().toString(36).slice(2, 11);

export const MOCK_USERS = [
  { id: 'u1', name: 'Chima Ozoemena', email: 'customer@demo.com', password: 'password', role: 'customer', phone: '+234 803 123 4567', verified: true, walletBalance: 15000, referralCode: 'AMPCHIMA', savedAddresses: [{ id: 'a1', label: 'Home', address: '12 Umudike Rd, Umuahia' }, { id: 'a2', label: 'Office', address: '5 Market Street, Aba' }], rating: 4.9, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'u2', name: 'Emeka Rider', email: 'rider@demo.com', password: 'password', role: 'rider', phone: '+234 806 987 6543', verified: true, walletBalance: 32000, rating: 4.7, online: true, vehicleType: 'Motorcycle', plateNumber: 'ABA-234-XY', deliveriesCompleted: 342, createdAt: '2024-02-01T10:00:00Z' },
  { id: 'u3', name: 'Adaeze Business', email: 'merchant@demo.com', password: 'password', role: 'merchant', phone: '+234 809 456 7890', verified: true, walletBalance: 87000, businessName: 'AdaKing Stores', businessType: 'Retail', rating: 4.8, createdAt: '2024-01-20T10:00:00Z' },
  { id: 'u4', name: 'Admin User', email: 'admin@demo.com', password: 'password', role: 'admin', phone: '+234 800 000 0000', verified: true, walletBalance: 0, createdAt: '2024-01-01T10:00:00Z' },
];

export const MOCK_RIDERS = [
  { id: 'u2', name: 'Emeka Rider', phone: '+234 806 987 6543', rating: 4.7, online: true, vehicleType: 'Motorcycle', plateNumber: 'ABA-234-XY', deliveriesCompleted: 342, lat: 5.5264, lng: 7.4855 },
  { id: 'r2', name: 'Chukwudi Speed', phone: '+234 807 111 2222', rating: 4.5, online: true, vehicleType: 'Motorcycle', plateNumber: 'ABA-567-AB', deliveriesCompleted: 218, lat: 5.5300, lng: 7.4900 },
  { id: 'r3', name: 'Nkechi Express', phone: '+234 805 333 4444', rating: 4.9, online: false, vehicleType: 'Van', plateNumber: 'ABA-890-CD', deliveriesCompleted: 567, lat: 5.5200, lng: 7.4800 },
  { id: 'r4', name: 'Obinna Fast', phone: '+234 808 555 6666', rating: 4.6, online: true, vehicleType: 'Motorcycle', plateNumber: 'ABA-123-EF', deliveriesCompleted: 189, lat: 5.5350, lng: 7.4950 },
];

const now = Date.now();
export const MOCK_ORDERS = [
  { id: 'o1', trackingId: 'ALXK92P', customerId: 'u1', customerName: 'Chima Ozoemena', riderId: 'u2', riderName: 'Emeka Rider', riderPhone: '+234 806 987 6543', status: 'transit', packageType: 'Standard', weight: '2kg', description: 'Electronics', pickup: '12 Umudike Rd, Umuahia', dropoff: '45 Ngwa Road, Aba', price: 1800, distance: '12km', createdAt: new Date(now - 3600000).toISOString(), estimatedDelivery: new Date(now + 1800000).toISOString(), timeline: [{ status: 'pending', time: new Date(now - 3600000).toISOString(), label: 'Order placed' }, { status: 'accepted', time: new Date(now - 3400000).toISOString(), label: 'Rider accepted' }, { status: 'pickup', time: new Date(now - 2400000).toISOString(), label: 'Package picked up' }, { status: 'transit', time: new Date(now - 1800000).toISOString(), label: 'In transit' }], rating: null, proof: null, paymentMethod: 'wallet' },
  { id: 'o2', trackingId: 'ALMP71R', customerId: 'u1', customerName: 'Chima Ozoemena', riderId: 'r2', riderName: 'Chukwudi Speed', riderPhone: '+234 807 111 2222', status: 'delivered', packageType: 'Bulk', weight: '15kg', description: 'Groceries', pickup: '7 Market Street, Aba', dropoff: '22 Hospital Road, Umuahia', price: 3500, distance: '18km', createdAt: new Date(now - 86400000).toISOString(), estimatedDelivery: new Date(now - 82800000).toISOString(), timeline: [{ status: 'pending', time: new Date(now - 86400000).toISOString(), label: 'Order placed' }, { status: 'accepted', time: new Date(now - 85800000).toISOString(), label: 'Rider accepted' }, { status: 'pickup', time: new Date(now - 85200000).toISOString(), label: 'Package picked up' }, { status: 'transit', time: new Date(now - 84600000).toISOString(), label: 'In transit' }, { status: 'delivered', time: new Date(now - 82800000).toISOString(), label: 'Delivered!' }], rating: 5, ratingComment: 'Excellent service!', proof: null, paymentMethod: 'card' },
  { id: 'o3', trackingId: 'ALRS43T', customerId: 'u3', customerName: 'Adaeze Business', riderId: 'u2', riderName: 'Emeka Rider', riderPhone: '+234 806 987 6543', status: 'pending', packageType: 'Standard', weight: '1kg', description: 'Documents', pickup: 'AdaKing Stores, Aba', dropoff: '10 Factory Road, Ariaria', price: 800, distance: '5km', createdAt: new Date(now - 600000).toISOString(), estimatedDelivery: new Date(now + 2400000).toISOString(), timeline: [{ status: 'pending', time: new Date(now - 600000).toISOString(), label: 'Order placed' }], rating: null, proof: null, paymentMethod: 'cash' },
  { id: 'o4', trackingId: 'ALBT19U', customerId: 'u1', customerName: 'Chima Ozoemena', riderId: 'r4', riderName: 'Obinna Fast', riderPhone: '+234 808 555 6666', status: 'accepted', packageType: 'Heavy', weight: '50kg', description: 'Furniture', pickup: '3 New Market Rd, Umuahia', dropoff: '88 Port Harcourt Rd, Aba', price: 12000, distance: '35km', createdAt: new Date(now - 1200000).toISOString(), estimatedDelivery: new Date(now + 3600000).toISOString(), timeline: [{ status: 'pending', time: new Date(now - 1200000).toISOString(), label: 'Order placed' }, { status: 'accepted', time: new Date(now - 900000).toISOString(), label: 'Rider accepted' }], rating: null, proof: null, paymentMethod: 'bank' },
];

export const PACKAGE_TYPES = [
  { id: 'standard', name: 'Standard Package', icon: 'bike', desc: 'Lightweight items up to 5kg', maxWeight: 5, basePrice: 600, pricePerKm: 80, maxLocations: 3, color: '#F97316' },
  { id: 'bulk', name: 'Bulk Package', icon: 'package', desc: 'Fixed price, 4+ locations', maxWeight: 30, basePrice: 2000, pricePerKm: 120, maxLocations: 10, color: '#8B5CF6' },
  { id: 'heavy', name: 'Heavy & Relocation', icon: 'truck', desc: 'Big loads, furniture, home moves', maxWeight: 500, basePrice: 5000, pricePerKm: 200, maxLocations: 2, color: '#EC4899' },
  { id: 'interstate', name: 'Inter-State', icon: 'map', desc: 'Nationwide delivery, stress-free', maxWeight: 100, basePrice: 8000, pricePerKm: 60, maxLocations: 2, color: '#06B6D4' },
];

export const STATUS_LABELS = { pending: 'Pending', accepted: 'Accepted', pickup: 'Picked Up', transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };
export const STATUS_COLORS = { pending: 'status-pending', accepted: 'status-accepted', pickup: 'status-pickup', transit: 'status-transit', delivered: 'status-delivered', cancelled: 'status-cancelled' };

export const PROMO_CODES = [
  { code: 'FIRST50', discount: 50, type: 'percent', description: '50% off your first order' },
  { code: 'AMP200', discount: 200, type: 'flat', description: '₦200 off any delivery' },
  { code: 'NEWUSER', discount: 30, type: 'percent', description: '30% off for new users' },
];

export const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
