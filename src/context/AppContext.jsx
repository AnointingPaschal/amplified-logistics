import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import * as db from '../lib/db'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]                 = useState(null)
  const [profile, setProfile]           = useState(null)
  const [wallet, setWallet]             = useState(null)
  const [orders, setOrders]             = useState([])
  const [notifications, setNotifications] = useState([])
  const [toast, setToast]               = useState(null)
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [loading, setLoading]           = useState(true)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ── Bootstrap session ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) bootstrapUser(session.user)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) bootstrapUser(session.user)
      else { setUser(null); setProfile(null); setWallet(null); setOrders([]); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function bootstrapUser(authUser) {
    try {
      setUser(authUser)
      const [prof, wal, ords, notifs] = await Promise.all([
        db.getProfile(authUser.id).catch(() => null),
        db.getWallet(authUser.id).catch(() => ({ balance: 0 })),
        db.getMyOrders(authUser.id).catch(() => []),
        db.getNotifications(authUser.id).catch(() => []),
      ])
      setProfile(prof)
      setWallet(wal)
      setOrders(ords)
      setNotifications(notifs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ── AUTH ──
  const login = useCallback(async (email, password) => {
    const data = await db.signIn({ email, password })
    return data
  }, [])

  const signup = useCallback(async ({ email, password, name, phone, role }) => {
    const data = await db.signUp({ email, password, name, phone, role })
    return data
  }, [])

  const logout = useCallback(async () => {
    await db.signOut()
    setUser(null); setProfile(null); setWallet(null); setOrders([])
  }, [])

  // ── ORDERS ──
  const submitOrder = useCallback(async (orderData) => {
    if (!user) throw new Error('Not authenticated')
    const order = await db.createOrder(user.id, orderData)
    setOrders(prev => [order, ...prev])
    return order
  }, [user])

  const refreshOrders = useCallback(async () => {
    if (!user) return
    const ords = await db.getMyOrders(user.id)
    setOrders(ords)
  }, [user])

  const doCancel = useCallback(async (orderId) => {
    const updated = await db.cancelOrder(orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
    showToast('Order cancelled', 'success')
  }, [showToast])

  // ── NOTIFICATIONS ──
  const markAllRead = useCallback(async () => {
    if (!user) return
    await db.markNotifsRead(user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    user, profile, wallet, orders, notifications, unreadCount, toast,
    loading, showToast,
    sidebarOpen, openSidebar: () => setSidebarOpen(true), closeSidebar: () => setSidebarOpen(false),
    login, signup, logout,
    submitOrder, refreshOrders, cancelOrder: doCancel, markAllRead,
    setWallet,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
