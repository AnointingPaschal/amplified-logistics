import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

let L = null;

export default function LiveMap({ height = '280px', riders = [], pickupLocation, dropoffLocation, showRoute = false, center = [5.5264, 7.4855], zoom = 14 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    import('leaflet').then(leaflet => {
      L = leaflet.default;
      // Fix default icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null });
      if (mounted) setMapReady(true);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.control.attribution({ prefix: '© OpenStreetMap' }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;
    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }

    const createIcon = (color, emoji, size = 36) => L.divIcon({
      html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:${size * 0.45}px;line-height:1">${emoji}</span></div>`,
      className: '', iconSize: [size, size], iconAnchor: [size / 2, size],
    });

    const riderIcon = (online) => L.divIcon({
      html: `<div style="background:${online ? '#F97316' : '#94A3B8'};width:38px;height:38px;border-radius:50%;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:18px;${online ? 'animation:none' : ''}">🏍</div>`,
      className: '', iconSize: [38, 38], iconAnchor: [19, 19],
    });

    const bounds = [];

    // Pickup marker
    if (pickupLocation) {
      const m = L.marker(pickupLocation, { icon: createIcon('#22C55E', '📦') }).addTo(map).bindPopup('<b>Pickup</b>');
      markersRef.current.push(m);
      bounds.push(pickupLocation);
    }

    // Dropoff marker
    if (dropoffLocation) {
      const m = L.marker(dropoffLocation, { icon: createIcon('#EF4444', '📍') }).addTo(map).bindPopup('<b>Drop-off</b>');
      markersRef.current.push(m);
      bounds.push(dropoffLocation);
    }

    // Rider markers
    riders.forEach(rider => {
      const pos = [rider.lat || center[0] + (Math.random() - 0.5) * 0.02, rider.lng || center[1] + (Math.random() - 0.5) * 0.02];
      const m = L.marker(pos, { icon: riderIcon(rider.online) }).addTo(map)
        .bindPopup(`<div style="min-width:140px"><b>${rider.name}</b><br><small>${rider.vehicleType} · ⭐${rider.rating}</small><br><span style="color:${rider.online ? '#22C55E' : '#94A3B8'};font-size:11px;font-weight:600">${rider.online ? '● ONLINE' : '● OFFLINE'}</span></div>`);
      markersRef.current.push(m);
      bounds.push(pos);
    });

    // Draw route between pickup and dropoff
    if (showRoute && pickupLocation && dropoffLocation) {
      const midLat = (pickupLocation[0] + dropoffLocation[0]) / 2 + (Math.random() - 0.5) * 0.005;
      const midLng = (pickupLocation[1] + dropoffLocation[1]) / 2 + (Math.random() - 0.5) * 0.005;
      const routePoints = [pickupLocation, [midLat, midLng], dropoffLocation];
      routeRef.current = L.polyline(routePoints, { color: '#F97316', weight: 4, opacity: 0.8, dashArray: '8, 8' }).addTo(map);
    }

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) map.setView(bounds[0], zoom);
  }, [mapReady, riders, pickupLocation, dropoffLocation, showRoute]);

  // Animate riders
  useEffect(() => {
    if (!mapInstanceRef.current || !L || riders.length === 0) return;
    const interval = setInterval(() => {
      markersRef.current.forEach((marker, i) => {
        if (i >= (pickupLocation ? 1 : 0) + (dropoffLocation ? 1 : 0)) {
          const pos = marker.getLatLng();
          marker.setLatLng([pos.lat + (Math.random() - 0.5) * 0.0003, pos.lng + (Math.random() - 0.5) * 0.0003]);
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [mapReady, riders.length, pickupLocation, dropoffLocation]);

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height }}>
      {!mapReady && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-orange-400 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-orange-600 shadow flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        Live
      </div>
    </div>
  );
}
