import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/ui';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Notifications from './pages/Notifications';

import CustomerDashboard from './pages/customer/Dashboard';
import CreateOrder from './pages/customer/CreateOrder';
import TrackOrder from './pages/customer/TrackOrder';
import Orders from './pages/customer/Orders';
import CustomerWallet from './pages/customer/Wallet';
import CustomerProfile from './pages/customer/Profile';

import RiderDashboard from './pages/rider/Dashboard';
import RiderDeliveries from './pages/rider/Deliveries';
import RiderMap from './pages/rider/RiderMap';
import RiderEarnings from './pages/rider/Earnings';
import RiderProfile from './pages/rider/RiderProfile';

import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantOrders from './pages/merchant/Orders';
import MerchantAnalytics from './pages/merchant/Analytics';
import MerchantWallet from './pages/merchant/MerchantWallet';
import MerchantProfile from './pages/merchant/MerchantProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMap from './pages/admin/AdminMap';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function ProtectedRoute({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function AppRoutes() {
  const { toast } = useApp();
  return (
    <div className="app-container">
      <Toast toast={toast} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/:role/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/create" element={<ProtectedRoute role="customer"><CreateOrder /></ProtectedRoute>} />
        <Route path="/customer/track" element={<ProtectedRoute role="customer"><TrackOrder /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
        <Route path="/customer/orders/:id" element={<ProtectedRoute role="customer"><TrackOrder /></ProtectedRoute>} />
        <Route path="/customer/wallet" element={<ProtectedRoute role="customer"><CustomerWallet /></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} />

        <Route path="/rider" element={<ProtectedRoute role="rider"><RiderDashboard /></ProtectedRoute>} />
        <Route path="/rider/deliveries" element={<ProtectedRoute role="rider"><RiderDeliveries /></ProtectedRoute>} />
        <Route path="/rider/map" element={<ProtectedRoute role="rider"><RiderMap /></ProtectedRoute>} />
        <Route path="/rider/earnings" element={<ProtectedRoute role="rider"><RiderEarnings /></ProtectedRoute>} />
        <Route path="/rider/profile" element={<ProtectedRoute role="rider"><RiderProfile /></ProtectedRoute>} />

        <Route path="/merchant" element={<ProtectedRoute role="merchant"><MerchantDashboard /></ProtectedRoute>} />
        <Route path="/merchant/orders" element={<ProtectedRoute role="merchant"><MerchantOrders /></ProtectedRoute>} />
        <Route path="/merchant/orders/create" element={<ProtectedRoute role="merchant"><MerchantOrders /></ProtectedRoute>} />
        <Route path="/merchant/analytics" element={<ProtectedRoute role="merchant"><MerchantAnalytics /></ProtectedRoute>} />
        <Route path="/merchant/wallet" element={<ProtectedRoute role="merchant"><MerchantWallet /></ProtectedRoute>} />
        <Route path="/merchant/profile" element={<ProtectedRoute role="merchant"><MerchantProfile /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/map" element={<ProtectedRoute role="admin"><AdminMap /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
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
