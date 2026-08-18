import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import * as db from '../lib/db'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [profile, setProfile]             = useState(null)
  const [wallet, setWallet]               = useState(null)
  const [orders, setOrders]               = useState([])
  const [notifications, setNotifs]        = useState([])
  const [toast, setToast]                 = useState(null)
  const [loading, setLoading]             = useState(true)
  const [sidebarOpen, setSidebarOpen]     = useState(false)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  /* ── Bootstrap: load all user data after login ────── */
  async function bootstrapUser(authUser) {
    try {
      setUser(authUser)
      const [prof, wal, ords, notifs] = await Promise.allSettled([
        db.getProfile(authUser.id),
        db.getWallet(authUser.id),
        db.getMyOrders(authUser.id),
        db.getNotifications(authUser.id),
      ])
      if (prof.status === 'fulfilled')   setProfile(prof.value)
      if (wal.status === 'fulfilled')    setWallet(wal.value)
      if (ords.status === 'fulfilled')   setOrders(ords.value || [])
      if (notifs.status === 'fulfilled') setNotifs(notifs.value || [])
    } catch (e) {
      console.error('bootstrapUser error:', e)
    } finally {
      setLoading(false)
    }
  }

  /* ── Auth session listener ──────────────────────── */
  useEffect(() => {
    let mounted = true

    // Get initial session safely
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) { console.warn('getSession error:', error.message); setLoading(false); return }
        if (data?.session?.user) bootstrapUser(data.session.user)
        else setLoading(false)
      })
      .catch(err => {
        if (mounted) { console.warn('getSession failed:', err.message); setLoading(false) }
      })

    // Listen for auth changes
    const { data: listenerData } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) bootstrapUser(session.user)
      else {
        setUser(null); setProfile(null); setWallet(null)
        setOrders([]); setNotifs([]); setLoading(false)
      }
    })

    return () => {
      mounted = false
      listenerData?.subscription?.unsubscribe?.()
    }
  }, [])

  /* ── Auth actions ──────────────────────────────── */
  const login = useCallback(async (email, password) => {
    const data = await db.signIn({ email, password })
    return data
  }, [])

  const signup = useCallback(async (fields) => {
    const data = await db.signUp(fields)
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await db.signOut() } catch {}
    setUser(null); setProfile(null); setWallet(null)
    setOrders([]); setNotifs([])
  }, [])

  /* ── Order actions ─────────────────────────────── */
  const submitOrder = useCallback(async (orderData) => {
    if (!user) throw new Error('Not logged in')
    const order = await db.createOrder(user.id, orderData)
    setOrders(prev => [order, ...prev])
    return order
  }, [user])

  const refreshOrders = useCallback(async () => {
    if (!user) return
    try {
      const ords = await db.getMyOrders(user.id)
      setOrders(ords)
    } catch {}
  }, [user])

  const doCancel = useCallback(async (orderId) => {
    try {
      const updated = await db.cancelOrder(orderId)
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
      showToast('Order cancelled', 'success')
    } catch { showToast('Could not cancel order', 'error') }
  }, [showToast])

  /* ── Notification actions ──────────────────────── */
  const markAllRead = useCallback(async () => {
    if (!user) return
    try { await db.markNotifsRead(user.id) } catch {}
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    // State
    user, profile, wallet, orders,
    notifications, unreadCount,
    toast, loading,
    sidebarOpen,

    // Actions
    showToast,
    openSidebar:  () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false),
    login, signup, logout,
    submitOrder, refreshOrders,
    cancelOrder: doCancel,
    markAllRead,
    setWallet,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
