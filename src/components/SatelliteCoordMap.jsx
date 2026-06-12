import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Info, RefreshCw } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function SatelliteCoordMap({ currentPlant, lang = 'ko' }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [showPopup, setShowPopup] = useState(true);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Plant specifications (Real Coordinates with localized text)
  const plantDetails = {
    solar: {
      name: t.solarName,
      location: t.solarLoc,
      capacity: t.solarCap,
      essCapacity: t.solarEss,
      area: t.solarArea,
      coords: '34.6766° N, 126.4038° E',
      lng: 126.4038,
      lat: 34.6766,
      description: t.solarDesc,
      color: '#ff7a00'
    },
    wind: {
      name: t.windName,
      location: t.windLoc,
      capacity: t.windCap,
      essCapacity: t.windEss,
      area: t.windArea,
      coords: '34.8207° N, 126.7584° E',
      lng: 126.7584091,
      lat: 34.8207149,
      description: t.windDesc,
      color: '#0c8'
    }
  };

  const activePlant = plantDetails[currentPlant];

  // 1. Initialize Map
  useEffect(() => {
    if (mapRef.current) return; // Initialize only once

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Esri, Maxar'
          }
        },
        layers: [
          {
            id: 'esri-satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 18
          }
        ]
      },
      center: [126.58, 34.75], // Optimized center to display Haenam Sanggong-ri and Yeongam Yeonso-ri together
      zoom: 9.0, // Zoom out slightly to cover the wider area
      attributionControl: false
    });

    mapRef.current = map;

    // Add navigation control
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    // Create markers for both plants
    Object.keys(plantDetails).forEach(key => {
      const details = plantDetails[key];
      
      // Wrapper HTML element (MapLibre positions this wrapper via transform)
      const wrapper = document.createElement('div');
      wrapper.className = `custom-map-marker-wrapper marker-${key}`;
      wrapper.style.width = '24px';
      wrapper.style.height = '24px';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.cursor = 'pointer';

      // Inner dot HTML element (this does the CSS pulse scale animation)
      const inner = document.createElement('div');
      inner.style.width = '12px';
      inner.style.height = '12px';
      inner.style.borderRadius = '50%';
      inner.style.backgroundColor = details.color;
      inner.style.border = '2px solid #ffffff';
      inner.style.boxShadow = `0 0 10px ${details.color}`;
      inner.style.animation = 'marker-pulse 2s infinite ease-in-out';
      
      wrapper.appendChild(inner);

      // Create Popup
      const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
        .setHTML(`
          <div style="font-family: Pretendard, sans-serif; font-size: 11px; padding: 2px;">
            <strong style="color: ${details.color}; font-size: 12px;">${details.name}</strong><br/>
            ${t.popupCapacity}: ${details.capacity}<br/>
            ${t.coordsLabel}: ${details.coords}
          </div>
        `);

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([details.lng, details.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current[key] = marker;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Focus and fly to active plant coordinates on switcher change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const target = plantDetails[currentPlant];
    map.flyTo({
      center: [target.lng, target.lat],
      zoom: 11.2,
      essential: true,
      duration: 1500
    });

    // Automatically trigger popup for active marker
    const timer = setTimeout(() => {
      const activeMarker = markersRef.current[currentPlant];
      if (activeMarker) {
        // Close other popups first
        Object.keys(markersRef.current).forEach(k => {
          const m = markersRef.current[k];
          if (m && m.getPopup()) {
            m.getPopup().remove();
          }
        });
        activeMarker.togglePopup();
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [currentPlant]);

  // 3. Update popup HTML when language changes to prevent frozen translation on map markers
  useEffect(() => {
    Object.keys(markersRef.current).forEach(key => {
      const marker = markersRef.current[key];
      const details = plantDetails[key];
      if (marker && marker.getPopup()) {
        marker.getPopup().setHTML(`
          <div style="font-family: Pretendard, sans-serif; font-size: 11px; padding: 2px;">
            <strong style="color: ${details.color}; font-size: 12px;">${details.name}</strong><br/>
            ${t.popupCapacity}: ${details.capacity}<br/>
            ${t.coordsLabel}: ${details.coords}
          </div>
        `);
      }
    });
  }, [lang]);

  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [126.58, 34.75],
      zoom: 9.0,
      duration: 1200
    });
  };

  return (
    <div className="glass-card" style={{
      border: '1px solid var(--border-color)',
      padding: '12px',
      position: 'relative',
      height: '320px',
      background: 'rgba(5, 8, 13, 0.9)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
    }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold' }}>
          <MapPin size={13} color="var(--accent-color)" />
          <span style={{ wordBreak: 'keep-all' }}>{t.gisTitle}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleResetView}
            title={t.resetView}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={12} />
          </button>
          <button 
            onClick={() => setShowPopup(p => !p)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* WebGL Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '260px', 
          borderRadius: '4px', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }} 
      />

      {/* Plant Specification Panel */}
      {showPopup && (
        <div 
          className="glass-card"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '10px 12px',
            background: 'rgba(3, 11, 20, 0.94)',
            border: '1px solid rgba(26, 117, 255, 0.25)',
            borderRadius: '4px',
            fontSize: '11px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.85)',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <strong style={{ color: currentPlant === 'solar' ? 'var(--color-orange)' : 'var(--color-emerald)', fontSize: '12px', wordBreak: 'keep-all' }}>
              {activePlant.name}
            </strong>
            <span style={{ fontSize: '9px', color: 'var(--color-text-darker)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {activePlant.coords}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', color: 'var(--color-text-muted)' }}>
            <div style={{ wordBreak: 'keep-all' }}>• {t.addressLabel}: <span style={{ color: '#ffffff' }}>{activePlant.location}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ wordBreak: 'keep-all' }}>• {t.capacityLabel}: <strong style={{ color: '#ffffff' }}>{activePlant.capacity}</strong></span>
              {currentPlant === 'solar' && <span style={{ wordBreak: 'keep-all' }}>• {t.essLabel}: <strong style={{ color: '#ffffff' }}>{activePlant.essCapacity}</strong></span>}
            </div>
            <div style={{ wordBreak: 'keep-all' }}>• {t.featureLabel}: <span style={{ color: '#ffffff' }}>{activePlant.description}</span></div>
          </div>
        </div>
      )}

      {/* Marker Animation and Popup Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.25); opacity: 1; }
        }
        .maplibregl-popup-content {
          background: rgba(3, 11, 20, 0.95) !important;
          border: 1px solid rgba(26, 117, 255, 0.3) !important;
          color: #f7fbff !important;
          border-radius: 4px !important;
          font-family: Pretendard, 'Noto Sans KR', sans-serif !important;
          font-size: 11px !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.7) !important;
          padding: 8px 12px !important;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: rgba(26, 117, 255, 0.3) !important;
        }
        .maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-bottom-color: rgba(26, 117, 255, 0.3) !important;
        }
        .maplibregl-popup-anchor-left .maplibregl-popup-tip {
          border-right-color: rgba(26, 117, 255, 0.3) !important;
        }
        .maplibregl-popup-anchor-right .maplibregl-popup-tip {
          border-left-color: rgba(26, 117, 255, 0.3) !important;
        }
      `}} />
    </div>
  );
}
