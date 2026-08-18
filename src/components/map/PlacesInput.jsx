import { useState, useRef, useCallback, useEffect } from 'react'
import { MapPin, Search, Loader, Bookmark, X, ChevronRight, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react'

/* ── Nigerian States ─────────────────────────────────────── */
const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa',
  'Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti',
  'Enugu','FCT (Abuja)','Gombe','Imo','Jigawa','Kaduna','Kano',
  'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
]

/* ── Nominatim OSM search ───────────────────────────────── */
async function searchOSM(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('countrycodes', 'ng')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '6')
  url.searchParams.set('accept-language', 'en')
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'AmplifiedLogistics/1.0 (logistics@amplified.ng)' },
  })
  if (!res.ok) return []
  return await res.json()
}

/* ── Reverse geocode a manual address ─────────────────────── */
async function geocodeAddress(addressStr) {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', addressStr)
    url.searchParams.set('format', 'json')
    url.searchParams.set('countrycodes', 'ng')
    url.searchParams.set('limit', '1')
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'AmplifiedLogistics/1.0' },
    })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return { lat: null, lng: null }
}

/* ── Format OSM result to clean label ───────────────────── */
function formatResult(r) {
  const a = r.address || {}
  const parts = [
    a.amenity || a.building || a.shop || a.road || a.pedestrian,
    a.neighbourhood || a.suburb,
    a.city || a.town || a.village || a.county,
    a.state,
  ].filter(Boolean)
  return { main: parts[0] || r.display_name.split(',')[0], sub: parts.slice(1).join(', ') || r.display_name }
}

/* ── Manual Entry Form ──────────────────────────────────── */
function ManualEntryForm({ onConfirm, onCancel }) {
  const [state, setState]       = useState('')
  const [city, setCity]         = useState('')
  const [street, setStreet]     = useState('')
  const [landmark, setLandmark] = useState('')
  const [loading, setLoading]   = useState(false)

  const isReady = state && city && street

  const handleConfirm = async () => {
    if (!isReady) return
    setLoading(true)
    const parts  = [street, landmark, city, state, 'Nigeria'].filter(Boolean)
    const addr   = parts.join(', ')
    const coords = await geocodeAddress(addr)
    setLoading(false)
    onConfirm({ address: addr, landmark, state, city, ...coords })
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3 mt-2">
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle size={14} className="text-blue-500 flex-shrink-0" />
        <p className="text-xs font-bold text-blue-700">Enter address manually</p>
      </div>

      {/* State */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">State *</label>
        <div className="relative">
          <select value={state} onChange={e => setState(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 pr-8">
            <option value="">Select state</option>
            {NG_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* City/Town */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">City / Town *</label>
        <input value={city} onChange={e => setCity(e.target.value)}
          placeholder="e.g. Umuahia, Owerri, Enugu"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-400" />
      </div>

      {/* Street / Area */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Street / Area *</label>
        <input value={street} onChange={e => setStreet(e.target.value)}
          placeholder="e.g. 12 Warehouse Road, GRA"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-400" />
      </div>

      {/* Nearest Landmark */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Nearest Landmark</label>
        <input value={landmark} onChange={e => setLandmark(e.target.value)}
          placeholder="e.g. Beside First Bank, Opposite Police Station"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-400" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-semibold">
          Cancel
        </button>
        <button onClick={handleConfirm} disabled={!isReady || loading}
          className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 ${isReady ? 'bg-gray-900' : 'bg-gray-300'}`}>
          {loading
            ? <><Loader size={12} className="animate-spin" /> Finding...</>
            : <><CheckCircle size={12} /> Use This Address</>}
        </button>
      </div>
    </div>
  )
}

/* ── Main PlacesInput component ─────────────────────────── */
export function PlacesInput({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search address…',
  savedAddresses = [],
  className = '',
  autoFocus = false,
}) {
  const [query, setQuery]         = useState(value || '')
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [focused, setFocused]     = useState(false)
  const [notFound, setNotFound]   = useState(false)  // show manual entry trigger
  const [showManual, setShowManual] = useState(false)
  const [dropPos, setDropPos]     = useState(null)
  const wrapRef   = useRef(null)
  const inputRef  = useRef(null)
  const timerRef  = useRef(null)

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 80)
  }, [autoFocus])

  const updatePos = useCallback(() => {
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
  }, [])

  const doSearch = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setLoading(false); setNotFound(false); return }
    setLoading(true)
    try {
      const data = await searchOSM(q)
      setResults(data)
      setNotFound(data.length === 0)
    } catch {
      setResults([])
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange?.(v)
    setShowManual(false)
    setNotFound(false)
    updatePos()
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(v), 480) // respect Nominatim rate limit
  }

  const handleFocus = () => {
    setFocused(true)
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false)
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }, 260)
  }

  const handleSelect = (r) => {
    const fmt = formatResult(r)
    const addr = r.display_name
    setQuery(addr)
    setResults([])
    setFocused(false)
    onChange?.(addr)
    onSelect?.({ address: addr, lat: parseFloat(r.lat), lng: parseFloat(r.lon), shortName: fmt.main })
  }

  const handleSaved = (a) => {
    setQuery(a.address)
    setResults([])
    setFocused(false)
    onChange?.(a.address)
    onSelect?.({ address: a.address, lat: a.lat, lng: a.lng })
  }

  const handleManualConfirm = (data) => {
    setQuery(data.address)
    setShowManual(false)
    setFocused(false)
    onChange?.(data.address)
    onSelect?.(data)
  }

  const clearInput = () => {
    setQuery('')
    setResults([])
    setNotFound(false)
    setShowManual(false)
    onChange?.('')
    onSelect?.(null)
    inputRef.current?.focus()
  }

  const showDrop = focused && (loading || results.length > 0 || notFound ||
    (query.length === 0 && savedAddresses.length > 0))

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Search bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-800 focus:bg-white transition-all"
        />
        {loading && <Loader size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
        {!loading && query && (
          <button onMouseDown={e => { e.preventDefault(); clearInput() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
            <X size={9} className="text-white" />
          </button>
        )}
      </div>

      {/* Dropdown — fixed so it escapes overflow containers */}
      {showDrop && dropPos && (
        <div
          style={{ position:'fixed', top:dropPos.top, left:dropPos.left, width:dropPos.width, zIndex:9999 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Saved addresses (when input empty) */}
          {query.length === 0 && savedAddresses.length > 0 && (
            <div className="max-h-52 overflow-y-auto">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Saved Addresses</p>
              </div>
              {savedAddresses.map(a => (
                <button key={a.id} onMouseDown={e => { e.preventDefault(); handleSaved(a) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bookmark size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">{a.label}</p>
                    <p className="text-xs text-gray-400 truncate">{a.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* OSM results */}
          {results.length > 0 && (
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
              {results.map((r) => {
                const fmt = formatResult(r)
                return (
                  <button key={r.place_id}
                    onMouseDown={e => { e.preventDefault(); handleSelect(r) }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={12} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{fmt.main}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{fmt.sub}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-5 gap-2">
              <Loader size={14} className="animate-spin text-gray-400" />
              <span className="text-xs text-gray-400">Searching OpenStreetMap…</span>
            </div>
          )}

          {/* Not found → manual entry trigger */}
          {notFound && !loading && (
            <button
              onMouseDown={e => { e.preventDefault(); setFocused(false); setShowManual(true) }}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-orange-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-orange-700">Location not found on map</p>
                  <p className="text-xs text-orange-500">Add it manually with state, city & landmark</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-orange-400" />
            </button>
          )}
        </div>
      )}

      {/* Manual Entry Form (inline, below input) */}
      {showManual && (
        <ManualEntryForm
          onConfirm={handleManualConfirm}
          onCancel={() => setShowManual(false)}
        />
      )}
    </div>
  )
}
