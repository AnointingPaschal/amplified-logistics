import React from 'react'

export function Card({ children, style, ...p }) {
  return <div style={{ background:'#fff', borderRadius:16, border:'1px solid var(--border)', padding:20, ...style }} {...p}>{children}</div>
}

export function Badge({ color = 'blue', children }) {
  const colors = {
    green:  { bg:'#DCFCE7', color:'#15803D' },
    red:    { bg:'#FEE2E2', color:'#DC2626' },
    amber:  { bg:'#FEF3C7', color:'#92400E' },
    blue:   { bg:'#DBEAFE', color:'#1D4ED8' },
    navy:   { bg:'#E0E7FF', color:'#3730A3' },
    gray:   { bg:'#F3F4F6', color:'#4B5563' },
    orange: { bg:'#FED7AA', color:'#C2410C' },
  }
  const c = colors[color] || colors.gray
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:.3, background:c.bg, color:c.color }}>
      {children}
    </span>
  )
}

export function Stat({ label, value, icon: Icon, color = '#2563EB', sub, trend }) {
  return (
    <Card>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={20} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize:12, fontWeight:700, color: trend >= 0 ? '#16A34A' : '#DC2626', background: trend >= 0 ? '#DCFCE7' : '#FEE2E2', padding:'3px 8px', borderRadius:20 }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div style={{ fontSize:28, fontWeight:900, color:'var(--navy)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:13, color:'var(--text-mid)', marginTop:6 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-light)', marginTop:4 }}>{sub}</div>}
    </Card>
  )
}

export function Table({ cols, rows, emptyMsg = 'No records found' }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'2px solid var(--border)' }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:.5, whiteSpace:'nowrap' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding:40, textAlign:'center', color:'var(--text-light)', fontSize:14 }}>{emptyMsg}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:'1px solid var(--border)', transition:'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              {cols.map(c => (
                <td key={c.key} style={{ padding:'12px 14px', fontSize:13, color:'var(--text)', whiteSpace: c.wrap ? 'normal' : 'nowrap' }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Btn({ children, onClick, variant='primary', size='md', loading, style, ...p }) {
  const base = { display:'inline-flex', alignItems:'center', gap:8, borderRadius:10, fontWeight:700, fontFamily:'inherit', cursor:'pointer', border:'none', transition:'all .15s' }
  const sizes = { sm:{ padding:'6px 14px', fontSize:12 }, md:{ padding:'10px 20px', fontSize:13 }, lg:{ padding:'13px 28px', fontSize:14 } }
  const variants = {
    primary:  { background:'var(--navy)', color:'#fff' },
    blue:     { background:'#2563EB', color:'#fff' },
    green:    { background:'#16A34A', color:'#fff' },
    red:      { background:'#DC2626', color:'#fff' },
    ghost:    { background:'var(--bg)', color:'var(--text-mid)', border:'1px solid var(--border)' },
    outline:  { background:'transparent', color:'var(--navy)', border:'1.5px solid var(--navy)' },
  }
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], opacity:loading?0.7:1, ...style }} {...p}>
      {loading ? <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .6s linear infinite' }} /> : null}
      {children}
    </button>
  )
}

export function Modal({ open, onClose, title, children, width=560 }) {
  if (!open) return null
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent:'center', padding: isMobile ? 0 : 16 }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius: isMobile ? '20px 20px 0 0' : 20, width:'100%', maxWidth: isMobile ? '100%' : width, maxHeight: isMobile ? '92vh' : '90vh', overflow:'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid var(--border)', position:'sticky', top:0, background:'#fff', zIndex:1 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--navy)' }}>{title}</h3>
          <button onClick={onClose} style={{ fontSize:22, color:'var(--text-light)', lineHeight:1, padding:'0 4px' }}>×</button>
        </div>
        <div style={{ padding: isMobile ? '16px 16px 32px' : 24 }}>{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text-mid)', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>{label}</label>
      {children}
    </div>
  )
}

export function Input({ ...p }) {
  return <input style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 12px', fontSize:13, color:'var(--text)', outline:'none', fontFamily:'inherit' }} {...p} />
}

export function Select({ children, ...p }) {
  return <select style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 12px', fontSize:13, color:'var(--text)', outline:'none', fontFamily:'inherit', background:'#fff' }} {...p}>{children}</select>
}

export function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
      <div>
        <h1 style={{ fontSize:20, fontWeight:900, color:'var(--navy)' }}>{title}</h1>
        {sub && <p style={{ fontSize:12, color:'var(--text-light)', marginTop:3 }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink:0 }}>{action}</div>}
    </div>
  )
}

// inject spin keyframes once
if (typeof document !== 'undefined' && !document.getElementById('ui-spin')) {
  const s = document.createElement('style')
  s.id = 'ui-spin'
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'
  document.head.appendChild(s)
}
