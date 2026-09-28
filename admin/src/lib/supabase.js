import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://nlrvkcebwzremhksjzwp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnZrY2Vid3pyZW1oa3NqendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjA2MTksImV4cCI6MjEwMjYzNjYxOX0.hBZ_WAXl1Q-NWmRQJ6nAiueQR_Cv8ZDqquQELN-6kVc'
)

export const fmt = (n) => '₦' + Number(n || 0).toLocaleString()
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'
export const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '??'
