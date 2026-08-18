import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/ui';

// Pages - Landing & Auth
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Pages - Customer
import CustomerDashboard from './pages/customer/Dashboard';
import CreateOrder from './pages/customer/CreateOrder';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerOrders from './pages/customer/Orders';
import CustomerWallet from './pages/customer/Wallet';
import CustomerProfile from './pages/customer/Profile';
import OrderDetail from './pages/customer/OrderDetail';

// Pages - Rider
import RiderDashboard from './pages/rider/Dashboard';
import RiderDeliveries from './pages/rider/Deliveries';
import RiderEarnings from './pages/rider/Earnings';
import RiderMap from './pages/rider/RiderMap';
import RiderProfile from './pages/rider/RiderProfile';

// Pages - Merchant
import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantOrders from './pages/merchant/Orders';
import MerchantAnalytics from './pages/merchant/Analytics';
import MerchantWallet from './pages/merchant/MerchantWallet';
import MerchantProfile from './pages/merchant/MerchantProfile';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMap from './pages/admin/AdminMap';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';

// Pages - Shared
import Notifications from './pages/Notifications';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
}

function RoleRedirect() {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  const roleHome = {
    customer: '/customer',
    rider: '/rider',
    merchant: '/merchant',
    admin: '/admin',
  };
  return <Navigate to={roleHome[user.role] || '/'} replace />;
}

function ToastWrapper() {
  const { toast } = useApp();
  return toast ? <Toast message={toast.message} type={toast.type} /> : null;
}

function AppRoutes() {
  return (
    <>
      <ToastWrapper />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<RoleRedirect />} />

        {/* Customer */}
        {/* Dashboard & create order — guests can browse, login required at submit */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/orders/create" element={<CreateOrder />} />
        <Route path="/customer/orders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerOrders />
          </ProtectedRoute>
        } />
        <Route path="/customer/orders/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path="/customer/track/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <TrackOrder />
          </ProtectedRoute>
        } />
        <Route path="/customer/track" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <TrackOrder />
          </ProtectedRoute>
        } />
        <Route path="/customer/wallet" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerWallet />
          </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        } />

        {/* Rider */}
        <Route path="/rider" element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/rider/deliveries" element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderDeliveries />
          </ProtectedRoute>
        } />
        <Route path="/rider/earnings" element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderEarnings />
          </ProtectedRoute>
        } />
        <Route path="/rider/map" element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderMap />
          </ProtectedRoute>
        } />
        <Route path="/rider/profile" element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderProfile />
          </ProtectedRoute>
        } />

        {/* Merchant */}
        <Route path="/merchant" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/merchant/orders" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantOrders />
          </ProtectedRoute>
        } />
        <Route path="/merchant/orders/create" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CreateOrder />
          </ProtectedRoute>
        } />
        <Route path="/merchant/analytics" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/merchant/wallet" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantWallet />
          </ProtectedRoute>
        } />
        <Route path="/merchant/profile" element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantProfile />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/map" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMap />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />

        {/* Shared */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
