import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

const ADMIN_EMAILS = ['ozoemenapaschal09@gmail.com', 'admin@amplifiedlogistics.com']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    setError('')
    const { data, error: e } = await supabase.auth.signInWithPassword({ email, password })
    if (e) { setError(e.message); return false }
    if (!ADMIN_EMAILS.includes(data.user?.email)) {
      await supabase.auth.signOut()
      setError('Access denied. Admin accounts only.')
      return false
    }
    return true
  }

  const logout = () => supabase.auth.signOut()

  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
