import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { Toast } from './components/ui'

// Auth
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Customer
import CustomerDashboard from './pages/customer/Dashboard'
import CreateOrder from './pages/customer/CreateOrder'
import TrackOrder from './pages/customer/TrackOrder'
import CustomerOrders from './pages/customer/Orders'
import CustomerWallet from './pages/customer/Wallet'
import CustomerProfile from './pages/customer/Profile'
import OrderDetail from './pages/customer/OrderDetail'
import AddressBook from './pages/customer/AddressBook'
import Referral from './pages/customer/Referral'
import Support from './pages/customer/Support'

// Rider
import RiderDashboard from './pages/rider/Dashboard'
import RiderDeliveries from './pages/rider/Deliveries'
import RiderEarnings from './pages/rider/Earnings'
import RiderMap from './pages/rider/RiderMap'
import RiderProfile from './pages/rider/RiderProfile'

// Merchant
import MerchantDashboard from './pages/merchant/Dashboard'
import MerchantOrders from './pages/merchant/Orders'
import MerchantAnalytics from './pages/merchant/Analytics'
import MerchantWallet from './pages/merchant/MerchantWallet'
import MerchantProfile from './pages/merchant/MerchantProfile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMap from './pages/admin/AdminMap'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/Users'
import AdminAnalytics from './pages/admin/Analytics'

// Shared
import Notifications from './pages/Notifications'
import Sidebar from './components/layout/Sidebar'

function Protected({ children, roles }) {
  const { user, loading } = useApp()
  const location = useLocation()
  if (loading) return <div className="min-h-dvh flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"/></div>
  if (!user) return <Navigate to={`/login?return=${location.pathname}`} replace/>
  if (roles && !roles.includes(user.user_metadata?.role || 'customer')) return <Navigate to="/"/>
  return children
}

function RoleHome() {
  const { user } = useApp()
  const role = user?.user_metadata?.role || 'customer'
  return <Navigate to={`/${role}`} replace/>
}

function ToastLayer() {
  const { toast } = useApp()
  return toast ? <Toast message={toast.message} type={toast.type}/> : null
}

function GlobalSidebar() {
  const { sidebarOpen, closeSidebar } = useApp()
  return <Sidebar open={sidebarOpen} onClose={closeSidebar}/>
}

function AppRoutes() {
  return (
    <>
      <ToastLayer/>
      <GlobalSidebar/>
      <Routes>
        {/* Public / Guest */}
        <Route path="/" element={<CustomerDashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={<RoleHome/>}/>

        {/* Customer (dashboard + create order = guest-accessible) */}
        <Route path="/customer" element={<CustomerDashboard/>}/>
        <Route path="/customer/orders/create" element={<CreateOrder/>}/>
        <Route path="/customer/track/:id" element={<TrackOrder/>}/>
        <Route path="/customer/track" element={<TrackOrder/>}/>

        {/* Customer (auth required) */}
        <Route path="/customer/orders" element={<Protected><CustomerOrders/></Protected>}/>
        <Route path="/customer/orders/:id" element={<Protected><OrderDetail/></Protected>}/>
        <Route path="/customer/wallet" element={<Protected><CustomerWallet/></Protected>}/>
        <Route path="/customer/profile" element={<Protected><CustomerProfile/></Protected>}/>
        <Route path="/customer/addresses" element={<Protected><AddressBook/></Protected>}/>
        <Route path="/customer/referral" element={<Protected><Referral/></Protected>}/>
        <Route path="/customer/support" element={<Support/>}/>
        <Route path="/customer/promo" element={<Protected><Referral/></Protected>}/>
        <Route path="/customer/disputes" element={<Support/>}/>

        {/* Rider */}
        <Route path="/rider" element={<Protected roles={['rider']}><RiderDashboard/></Protected>}/>
        <Route path="/rider/deliveries" element={<Protected roles={['rider']}><RiderDeliveries/></Protected>}/>
        <Route path="/rider/earnings" element={<Protected roles={['rider']}><RiderEarnings/></Protected>}/>
        <Route path="/rider/map" element={<Protected roles={['rider']}><RiderMap/></Protected>}/>
        <Route path="/rider/profile" element={<Protected roles={['rider']}><RiderProfile/></Protected>}/>

        {/* Merchant */}
        <Route path="/merchant" element={<Protected roles={['merchant']}><MerchantDashboard/></Protected>}/>
        <Route path="/merchant/orders" element={<Protected roles={['merchant']}><MerchantOrders/></Protected>}/>
        <Route path="/merchant/analytics" element={<Protected roles={['merchant']}><MerchantAnalytics/></Protected>}/>
        <Route path="/merchant/wallet" element={<Protected roles={['merchant']}><MerchantWallet/></Protected>}/>
        <Route path="/merchant/profile" element={<Protected roles={['merchant']}><MerchantProfile/></Protected>}/>

        {/* Admin */}
        <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard/></Protected>}/>
        <Route path="/admin/map" element={<Protected roles={['admin']}><AdminMap/></Protected>}/>
        <Route path="/admin/orders" element={<Protected roles={['admin']}><AdminOrders/></Protected>}/>
        <Route path="/admin/users" element={<Protected roles={['admin']}><AdminUsers/></Protected>}/>
        <Route path="/admin/analytics" element={<Protected roles={['admin']}><AdminAnalytics/></Protected>}/>

        {/* Shared */}
        <Route path="/notifications" element={<Protected><Notifications/></Protected>}/>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes/>
      </AppProvider>
    </BrowserRouter>
  )
}
