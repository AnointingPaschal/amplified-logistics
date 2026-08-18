import { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { Toast } from './components/ui'
import Sidebar from './components/layout/Sidebar'

/* ── Error Boundary ──────────────────────────────── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(err) { return { error: err } }
  componentDidCatch(err) { console.error('App Error:', err) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', maxWidth: 430, margin: '0 auto' }}>
          <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ background: '#fee2e2', padding: 12, borderRadius: 8, fontSize: 11, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack?.slice(0, 500)}
          </pre>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            style={{ marginTop: 16, padding: '8px 20px', background: '#0A1628', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/* ── Lazy-loaded pages (prevents one bad page killing everything) ── */
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

/* ── Safe wrappers for pages that may use old context keys ── */
function SafePage({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

/* ── Auth guard ─────────────────────────────────── */
function Protected({ children, roles }) {
  const { user, loading } = useApp()
  const location = useLocation()
  if (loading) return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"/>
    </div>
  )
  if (!user) return <Navigate to={`/login?return=${encodeURIComponent(location.pathname)}`} replace/>
  if (roles && !roles.includes(user.user_metadata?.role || 'customer')) return <Navigate to="/"/>
  return children
}

/* ── Global overlay components ─────────────────── */
function GlobalOverlays() {
  const { toast, sidebarOpen, closeSidebar } = useApp()
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type}/>}
      <Sidebar open={sidebarOpen} onClose={closeSidebar}/>
    </>
  )
}

/* ── All Routes ─────────────────────────────────── */
function AppRoutes() {
  const { user } = useApp()
  const role = user?.user_metadata?.role || 'customer'
  return (
    <>
      <GlobalOverlays/>
      <Routes>
        {/* Public */}
        <Route path="/" element={<CustomerDashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={<Navigate to={`/${role}`} replace/>}/>

        {/* Customer — public */}
        <Route path="/customer" element={<CustomerDashboard/>}/>
        <Route path="/customer/orders/create" element={<SafePage><CreateOrder/></SafePage>}/>
        <Route path="/customer/track/:id" element={<SafePage><TrackOrder/></SafePage>}/>
        <Route path="/customer/track" element={<SafePage><TrackOrder/></SafePage>}/>
        <Route path="/customer/support" element={<SafePage><Support/></SafePage>}/>

        {/* Customer — auth required */}
        <Route path="/customer/orders" element={<Protected><SafePage><CustomerOrders/></SafePage></Protected>}/>
        <Route path="/customer/orders/:id" element={<Protected><SafePage><OrderDetail/></SafePage></Protected>}/>
        <Route path="/customer/wallet" element={<Protected><SafePage><CustomerWallet/></SafePage></Protected>}/>
        <Route path="/customer/profile" element={<Protected><SafePage><CustomerProfile/></SafePage></Protected>}/>
        <Route path="/customer/addresses" element={<Protected><SafePage><AddressBook/></SafePage></Protected>}/>
        <Route path="/customer/referral" element={<Protected><SafePage><Referral/></SafePage></Protected>}/>
        <Route path="/customer/promo" element={<Protected><SafePage><Referral/></SafePage></Protected>}/>
        <Route path="/customer/disputes" element={<SafePage><Support/></SafePage>}/>

        {/* Rider */}
        <Route path="/rider" element={<Protected roles={['rider']}><SafePage><RiderDashboard/></SafePage></Protected>}/>
        <Route path="/rider/deliveries" element={<Protected roles={['rider']}><SafePage><RiderDeliveries/></SafePage></Protected>}/>
        <Route path="/rider/earnings" element={<Protected roles={['rider']}><SafePage><RiderEarnings/></SafePage></Protected>}/>
        <Route path="/rider/map" element={<Protected roles={['rider']}><SafePage><RiderMap/></SafePage></Protected>}/>
        <Route path="/rider/profile" element={<Protected roles={['rider']}><SafePage><RiderProfile/></SafePage></Protected>}/>

        {/* Merchant */}
        <Route path="/merchant" element={<Protected roles={['merchant']}><SafePage><MerchantDashboard/></SafePage></Protected>}/>
        <Route path="/merchant/orders" element={<Protected roles={['merchant']}><SafePage><MerchantOrders/></SafePage></Protected>}/>
        <Route path="/merchant/analytics" element={<Protected roles={['merchant']}><SafePage><MerchantAnalytics/></SafePage></Protected>}/>
        <Route path="/merchant/wallet" element={<Protected roles={['merchant']}><SafePage><MerchantWallet/></SafePage></Protected>}/>
        <Route path="/merchant/profile" element={<Protected roles={['merchant']}><SafePage><MerchantProfile/></SafePage></Protected>}/>

        {/* Admin */}
        <Route path="/admin" element={<Protected roles={['admin']}><SafePage><AdminDashboard/></SafePage></Protected>}/>
        <Route path="/admin/map" element={<Protected roles={['admin']}><SafePage><AdminMap/></SafePage></Protected>}/>
        <Route path="/admin/orders" element={<Protected roles={['admin']}><SafePage><AdminOrders/></SafePage></Protected>}/>
        <Route path="/admin/users" element={<Protected roles={['admin']}><SafePage><AdminUsers/></SafePage></Protected>}/>
        <Route path="/admin/analytics" element={<Protected roles={['admin']}><SafePage><AdminAnalytics/></SafePage></Protected>}/>

        {/* Shared */}
        <Route path="/notifications" element={<Protected><SafePage><Notifications/></SafePage></Protected>}/>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes/>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
