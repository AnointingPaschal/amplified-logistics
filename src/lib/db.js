import { supabase } from './supabase'

// ── AUTH ────────────────────────────────────────
export async function signUp({ email, password, name, phone, role = 'customer' }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, phone, role } }
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ── PROFILE ─────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  if (error) throw error
  return data
}

// ── WALLET ──────────────────────────────────────
export async function getWallet(userId) {
  const { data, error } = await supabase.from('wallets').select('*').eq('user_id', userId).single()
  if (error) throw error
  return data
}

export async function getTransactions(userId, limit = 20) {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ── ORDERS ──────────────────────────────────────
function genTrackingId() {
  return 'AMP-' + Date.now().toString(36).toUpperCase()
}

export async function createOrder(userId, orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...orderData, customer_id: userId, tracking_id: genTrackingId() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getMyOrders(userId, limit = 30) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function cancelOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── NOTIFICATIONS ───────────────────────────────
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}

export async function markNotifsRead(userId) {
  await supabase.from('notifications').update({ read: true }).eq('user_id', userId)
}

// ── SAVED ADDRESSES ─────────────────────────────
export async function getSavedAddresses(userId) {
  const { data, error } = await supabase
    .from('saved_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
