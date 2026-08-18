import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Search, Loader, Clock, Bookmark, X } from 'lucide-react'

/**
 * Google Places Autocomplete input
 * Falls back to plain text input if Maps API not loaded
 */
export function PlacesInput({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Enter address',
  savedAddresses = [],
  className = '',
  autoFocus = false,
  restrictToNigeria = true,
}) {
  const [query, setQuery]         = useState(value)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading]     = useState(false)
  const [focused, setFocused]     = useState(false)
  const [mapsReady, setMapsReady] = useState(false)
  const inputRef  = useRef(null)
  const svcRef    = useRef(null)
  const timerRef  = useRef(null)

  // Check if Google Maps is loaded
  useEffect(() => {
    const check = () => {
      if (window.google?.maps?.places) {
        svcRef.current = new window.google.maps.places.AutocompleteService()
        setMapsReady(true)
      } else {
        setTimeout(check, 300)
      }
    }
    check()
  }, [])

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, [autoFocus])

  const fetchSuggestions = useCallback((q) => {
    if (!svcRef.current || q.length < 2) { setSuggestions([]); return }
    setLoading(true)
    const opts = { input: q }
    if (restrictToNigeria) opts.componentRestrictions = { country: 'ng' }
    svcRef.current.getPlacePredictions(opts, (preds, status) => {
      setLoading(false)
      if (status === 'OK' && preds) setSuggestions(preds.slice(0, 5))
      else setSuggestions([])
    })
  }, [restrictToNigeria])

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange?.(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fetchSuggestions(v), 300)
  }

  const handleSelect = (placeId, description) => {
    setQuery(description)
    setSuggestions([])
    onChange?.(description)

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location
        onSelect?.({
          address: description,
          lat: loc.lat(),
          lng: loc.lng(),
          placeId,
          shortName: results[0].address_components[0]?.short_name || description,
        })
      } else {
        onSelect?.({ address: description, lat: null, lng: null, placeId })
      }
    })
  }

  const handleSavedSelect = (saved) => {
    setQuery(saved.address)
    setSuggestions([])
    onChange?.(saved.address)
    onSelect?.({ address: saved.address, lat: saved.lat, lng: saved.lng })
  }

  const showDropdown = focused && (loading || suggestions.length > 0 || (query.length === 0 && savedAddresses.length > 0))

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-10 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white transition-all"
        />
        {loading && <Loader size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setSuggestions([]); onChange?.(''); onSelect?.(null) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
            <X size={10} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] overflow-hidden max-h-72 overflow-y-auto">
          {/* Saved addresses when empty */}
          {query.length === 0 && savedAddresses.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Saved Addresses</p>
              </div>
              {savedAddresses.map(a => (
                <button key={a.id} onClick={() => handleSavedSelect(a)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bookmark size={14} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.label}</p>
                    <p className="text-xs text-gray-400 truncate">{a.address}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Suggestions */}
          {suggestions.map(s => (
            <button key={s.place_id} onMouseDown={() => handleSelect(s.place_id, s.description)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={14} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {s.structured_formatting?.main_text || s.description.split(',')[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {s.structured_formatting?.secondary_text || s.description}
                </p>
              </div>
            </button>
          ))}

          {loading && (
            <div className="flex items-center justify-center py-4 gap-2">
              <Loader size={14} className="text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Searching...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
