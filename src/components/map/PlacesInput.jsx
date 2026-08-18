import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Search, Loader, Bookmark, X } from 'lucide-react'

/**
 * Google Places Autocomplete with fixed-positioned dropdown
 * (avoids overflow:hidden clipping in scroll containers)
 */
export function PlacesInput({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Enter address',
  savedAddresses = [],
  restrictToNigeria = true,
  autoFocus = false,
  className = '',
}) {
  const [query, setQuery]           = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading]       = useState(false)
  const [focused, setFocused]       = useState(false)
  const [dropPos, setDropPos]       = useState(null)
  const inputRef  = useRef(null)
  const wrapRef   = useRef(null)
  const svcRef    = useRef(null)
  const timerRef  = useRef(null)
  const isFocused = useRef(false)

  // Wait for Google Maps to load
  useEffect(() => {
    const waitForMaps = () => {
      if (window.google?.maps?.places) {
        svcRef.current = new window.google.maps.places.AutocompleteService()
      } else {
        setTimeout(waitForMaps, 500)
      }
    }
    waitForMaps()
  }, [])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [autoFocus])

  // Update dropdown position to match input (fixed, escapes overflow)
  const updatePos = useCallback(() => {
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
  }, [])

  const fetchSuggestions = useCallback((q) => {
    if (!svcRef.current || q.length < 2) { setSuggestions([]); setLoading(false); return }
    setLoading(true)
    const req = { input: q }
    if (restrictToNigeria) req.componentRestrictions = { country: 'ng' }
    svcRef.current.getPlacePredictions(req, (preds, status) => {
      setLoading(false)
      if (status === 'OK' && preds) setSuggestions(preds.slice(0, 6))
      else setSuggestions([])
    })
  }, [restrictToNigeria])

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange?.(v)
    updatePos()
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fetchSuggestions(v), 280)
  }

  const handleFocus = () => {
    isFocused.current = true
    setFocused(true)
    updatePos()
    window.addEventListener('scroll', updatePos, true)
  }

  const handleBlur = () => {
    // Delay so clicks on suggestions register first
    setTimeout(() => {
      isFocused.current = false
      setFocused(false)
      window.removeEventListener('scroll', updatePos, true)
    }, 250)
  }

  const handleSelectSuggestion = (placeId, description) => {
    setQuery(description)
    setSuggestions([])
    setFocused(false)
    onChange?.(description)

    if (!window.google?.maps) { onSelect?.({ address: description }); return }
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location
        onSelect?.({
          address: description,
          lat: loc.lat(),
          lng: loc.lng(),
          placeId,
          shortName: results[0].address_components?.[0]?.short_name || '',
        })
      } else {
        onSelect?.({ address: description, lat: null, lng: null })
      }
    })
  }

  const handleSaved = (saved) => {
    setQuery(saved.address)
    setSuggestions([])
    setFocused(false)
    onChange?.(saved.address)
    onSelect?.({ address: saved.address, lat: saved.lat, lng: saved.lng })
  }

  const showDrop = focused && (loading || suggestions.length > 0 || (query.length === 0 && savedAddresses.length > 0))

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Input field */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-800 focus:bg-white transition-all"
        />
        {loading && <Loader size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
        {!loading && query && (
          <button
            onMouseDown={e => { e.preventDefault(); setQuery(''); setSuggestions([]); onChange?.(''); onSelect?.(null) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <X size={9} className="text-white" />
          </button>
        )}
      </div>

      {/* Fixed dropdown — escapes overflow containers */}
      {showDrop && dropPos && (
        <div
          style={{ position:'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Saved addresses when query empty */}
          {query.length === 0 && savedAddresses.length > 0 && (
            <div className="max-h-56 overflow-y-auto">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</p>
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

          {/* Google suggestions */}
          {suggestions.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button key={s.place_id}
                  onMouseDown={e => { e.preventDefault(); handleSelectSuggestion(s.place_id, s.description) }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left ${i < suggestions.length-1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={12} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                      {s.structured_formatting?.main_text || s.description.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {s.structured_formatting?.secondary_text || s.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-4 gap-2 text-gray-400">
              <Loader size={13} className="animate-spin" />
              <span className="text-xs">Searching...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
