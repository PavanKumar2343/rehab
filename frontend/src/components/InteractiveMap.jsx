import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Info } from 'lucide-react';

/**
 * Interactive Map Component with Geolocation auto-detection
 * and visual city grid coordinates mapping.
 * 
 * @param {Array} markers - Array of markers [{ lat, lng, type, label, onClick, id }]
 * @param {boolean} selectionMode - Allow clicking on map to capture coordinates
 * @param {Function} onLocationSelect - Callback when location is clicked/selected
 * @param {Array} routeCoordinates - Path to draw routing [ [lng, lat], [lng, lat] ]
 * @param {Object} center - Map center { lat, lng }
 */
const InteractiveMap = ({
  markers = [],
  selectionMode = false,
  onLocationSelect = null,
  routeCoordinates = null,
  center = null
}) => {
  const mapRef = useRef(null);
  const [gpsSimulating, setGpsSimulating] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Default coordinate boundaries (San Francisco Area)
  const BOUNDS = {
    minLng: -122.50,
    maxLng: -122.40,
    minLat: 37.74,
    maxLat: 37.80
  };

  // Convert GPS Coordinates to Screen Percentage X, Y
  const getScreenPos = (lat, lng) => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
    // Invert Y because screen starts at top (0)
    const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // Convert Screen Coordinates (px) to GPS coordinates
  const getGpsFromScreen = (clientX, clientY) => {
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const pxX = clientX - rect.left;
    const pxY = clientY - rect.top;

    const pctX = pxX / rect.width;
    const pctY = pxY / rect.height;

    const lng = BOUNDS.minLng + pctX * (BOUNDS.maxLng - BOUNDS.minLng);
    const lat = BOUNDS.minLat + (1 - pctY) * (BOUNDS.maxLat - BOUNDS.minLat);

    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6))
    };
  };

  const handleMapClick = (e) => {
    if (!selectionMode || !onLocationSelect) return;
    
    // Ignore clicks on markers directly
    if (e.target.closest('.map-marker')) return;

    const gps = getGpsFromScreen(e.clientX, e.clientY);
    if (gps) {
      setSelectedCoords(gps);
      onLocationSelect(gps);
    }
  };

  // Auto detect GPS Location using browser geolocation API
  const detectMyLocation = () => {
    setGpsSimulating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      // Fallback: mock geolocation
      setTimeout(() => {
        const mockGps = { lat: 37.7749, lng: -122.4194 };
        setSelectedCoords(mockGps);
        if (onLocationSelect) onLocationSelect(mockGps);
        setGpsSimulating(false);
      }, 1000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gps = {
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6))
        };
        
        // Ensure coordinates fit SF area simulation (clamp or fall back)
        if (gps.lat < BOUNDS.minLat || gps.lat > BOUNDS.maxLat || gps.lng < BOUNDS.minLng || gps.lng > BOUNDS.maxLng) {
          // coordinate out of SF bounds, set to city center SF downtown
          gps.lat = 37.7749;
          gps.lng = -122.4194;
        }

        setSelectedCoords(gps);
        if (onLocationSelect) onLocationSelect(gps);
        setGpsSimulating(false);
      },
      (error) => {
        console.warn('Geolocation error, simulating...', error);
        // Fallback simulation
        setTimeout(() => {
          const mockGps = { lat: 37.7749, lng: -122.4194 };
          setSelectedCoords(mockGps);
          if (onLocationSelect) onLocationSelect(mockGps);
          setGpsSimulating(false);
        }, 1000);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Build route details if coordinates provided
  let routePath = null;
  if (routeCoordinates && routeCoordinates.length >= 2) {
    const pt1 = getScreenPos(routeCoordinates[0][1], routeCoordinates[0][0]);
    const pt2 = getScreenPos(routeCoordinates[1][1], routeCoordinates[1][0]);
    routePath = { pt1, pt2 };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} /> 
          {selectionMode ? 'Click anywhere on the map to pinpoint animal coordinates' : 'Live Platform Map'}
        </span>
        <button
          type="button"
          onClick={detectMyLocation}
          disabled={gpsSimulating}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
        >
          <Compass size={14} className={gpsSimulating ? "animate-spin" : ""} />
          {gpsSimulating ? 'Locating...' : 'Auto-detect GPS'}
        </button>
      </div>

      <div
        ref={mapRef}
        onClick={handleMapClick}
        className="map-placeholder"
        style={{ cursor: selectionMode ? 'crosshair' : 'default' }}
      >
        {/* Draw Simulated City Blocks and Streets */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* Main Simulated Streets */}
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          
          {/* Diagonal avenues */}
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />

          {/* Draw Route Directions Line if Active */}
          {routePath && (
            <>
              <line
                x1={`${routePath.pt1.x}%`}
                y1={`${routePath.pt1.y}%`}
                x2={`${routePath.pt2.x}%`}
                y2={`${routePath.pt2.y}%`}
                stroke="var(--secondary)"
                strokeWidth="4"
                strokeDasharray="6,6"
                style={{ filter: 'drop-shadow(0px 0px 4px var(--secondary-glow))' }}
              />
              <circle cx={`${routePath.pt1.x}%`} cy={`${routePath.pt1.y}%`} r="6" fill="var(--secondary)" />
              <circle cx={`${routePath.pt2.x}%`} cy={`${routePath.pt2.y}%`} r="6" fill="var(--secondary)" />
            </>
          )}
        </svg>

        {/* Map Center Marker */}
        {center && (
          <div
            className="map-marker"
            style={{
              left: `${getScreenPos(center.lat, center.lng).x}%`,
              top: `${getScreenPos(center.lat, center.lng).y}%`
            }}
          >
            <div className="marker-pin" style={{ backgroundColor: '#10b981' }}>
              <Navigation size={12} style={{ transform: 'rotate(0deg)' }} />
            </div>
            <div className="marker-label">Centered View</div>
          </div>
        )}

        {/* Selection Marker Pin */}
        {selectionMode && selectedCoords && (
          <div
            className="map-marker"
            style={{
              left: `${getScreenPos(selectedCoords.lat, selectedCoords.lng).x}%`,
              top: `${getScreenPos(selectedCoords.lat, selectedCoords.lng).y}%`
            }}
          >
            <div className="marker-pin" style={{ backgroundColor: 'var(--primary)' }}>
              <MapPin size={12} />
            </div>
            <div className="marker-label" style={{ border: '1px solid var(--primary)' }}>
              Selected ({selectedCoords.lat}, {selectedCoords.lng})
            </div>
          </div>
        )}

        {/* Markers List */}
        {markers.map((marker, index) => {
          const pos = getScreenPos(marker.lat, marker.lng);
          
          // Color based on type
          let pinColor = '#3b82f6'; // Shelter default
          if (marker.type === 'reported') pinColor = '#f59e0b';
          if (marker.type === 'treatment') pinColor = '#8b5cf6';
          if (marker.type === 'available') pinColor = '#ec4899';
          if (marker.type === 'adopted') pinColor = '#10b981';

          return (
            <div
              key={marker.id || index}
              className="map-marker"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => marker.onClick && marker.onClick(marker)}
            >
              <div className="marker-pin" style={{ backgroundColor: pinColor }}>
                <MapPin size={12} />
              </div>
              <div className="marker-label">
                {marker.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lat Lng display logs */}
      {selectionMode && selectedCoords && (
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>Latitude: <strong style={{ color: 'white' }}>{selectedCoords.lat}</strong></div>
          <div>Longitude: <strong style={{ color: 'white' }}>{selectedCoords.lng}</strong></div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
