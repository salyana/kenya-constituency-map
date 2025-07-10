import React, { useEffect, useState, useCallback } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";

function ConstituencyBoundaries({ features, selectedId, onSelect }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !features) return;
    map.data.forEach(f => map.data.remove(f)); // Clear previous
    map.data.addGeoJson({ type: 'FeatureCollection', features });
    map.data.setStyle(feature => {
      const isSelected = feature.getProperty('id') === selectedId;
      return {
        fillColor: isSelected ? '#ff6f61' : '#1976d2',
        fillOpacity: isSelected ? 0.45 : 0.18,
        strokeColor: isSelected ? '#ff6f61' : '#1976d2',
        strokeWeight: isSelected ? 3 : 2,
      };
    });
    // Click handler
    const listener = map.data.addListener('click', e => {
      const id = e.feature.getProperty('id');
      onSelect(id);
    });
    return () => listener.remove();
  }, [map, features, selectedId, onSelect]);
  return null;
}

function Sidebar({ features, selectedId, onSelect }) {
  return (
    <div style={{
      position: 'absolute',
      top: 28,
      right: 28,
      width: 300,
      maxHeight: 480,
      background: 'rgba(255,255,255,0.97)',
      borderRadius: 18,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      overflowY: 'auto',
      zIndex: 10,
      padding: 0,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      border: '1.5px solid #e3e8ee',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        padding: '18px 20px 10px 20px',
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(90deg, #e3f0ff 0%, #f8fafc 100%)',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        letterSpacing: 0.2,
      }}>
        Constituencies - Kenya
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {features.map((f, i) => (
          <li
            key={i}
            onClick={() => onSelect(f.properties.id)}
            style={{
              padding: '13px 20px',
              margin: '2px 0',
              borderRadius: 12,
              background: selectedId === f.properties.id
                ? 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)'
                : 'transparent',
              cursor: 'pointer',
              fontWeight: selectedId === f.properties.id ? 700 : 500,
              color: selectedId === f.properties.id ? '#d32f2f' : '#222',
              boxShadow: selectedId === f.properties.id ? '0 2px 8px 0 rgba(255,111,97,0.10)' : 'none',
              transition: 'background 0.2s, color 0.2s',
              border: selectedId === f.properties.id ? '1.5px solid #ff6f61' : '1.5px solid transparent',
            }}
            onMouseOver={e => {
              if (selectedId !== f.properties.id) e.currentTarget.style.background = '#f3f6fa';
            }}
            onMouseOut={e => {
              if (selectedId !== f.properties.id) e.currentTarget.style.background = 'transparent';
            }}
          >
            {f.properties.Constituency}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoBox({ properties }) {
  if (!properties) return null;
  return (
    <div style={{
      position: 'absolute',
      left: 32,
      bottom: 32,
      width: 370,
      background: 'rgba(255,255,255,0.98)',
      borderRadius: 20,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      padding: 0,
      zIndex: 10,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      border: '1.5px solid #e3e8ee',
      backdropFilter: 'blur(4px)',
      overflow: 'hidden',
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 22,
        padding: '18px 24px 8px 24px',
        background: 'linear-gradient(90deg, #e3f0ff 0%, #f8fafc 100%)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        color: '#1976d2',
        letterSpacing: 0.2,
      }}>
        {properties.Constituency} Constituency
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px 10px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#1976d2', marginBottom: 2 }}>{properties.Total.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: '#888' }}>Population Estimate</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 18, color: '#555', marginBottom: 2 }}><span style={{ color: '#1976d2', fontWeight: 700 }}>{properties.Male.toLocaleString()}</span> <span style={{ color: '#888', fontSize: 13 }}>male</span></div>
          <div style={{ fontSize: 18, color: '#555' }}><span style={{ color: '#d32f2f', fontWeight: 700 }}>{properties.Female.toLocaleString()}</span> <span style={{ color: '#888', fontSize: 13 }}>female</span></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#555', padding: '16px 24px 18px 24px' }}>
        <div><b>Households:</b> <span style={{ color: '#1976d2' }}>{properties.Households.toLocaleString()}</span></div>
        <div><b>Area:</b> <span style={{ color: '#1976d2' }}>{properties['Area in Sq. Km.'].toLocaleString()}</span> km²</div>
        <div><b>Density:</b> <span style={{ color: '#1976d2' }}>{properties.Density}</span></div>
      </div>
    </div>
  );
}

export default function GoogleMap() {
  const [features, setFeatures] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [featureProps, setFeatureProps] = useState({});

  // Load GeoJSON and extract features
  useEffect(() => {
    fetch("/Constituency_with_geometry.geojson")
      .then(res => res.json())
      .then(data => {
        // Add an 'id' property to each feature for easy selection
        const feats = data.features.map((f, i) => ({
          ...f,
          properties: { ...f.properties, id: i },
        }));
        setFeatures(feats);
        // Map id to properties for quick lookup
        const propsMap = {};
        feats.forEach((f, i) => {
          propsMap[i] = f.properties;
        });
        setFeatureProps(propsMap);
      });
  }, []);

  const handleSelect = useCallback(id => setSelectedId(id), []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Map
        defaultCenter={{ lat: 0.0236, lng: 37.9062 }} // Center of Kenya
        defaultZoom={6}
        style={{ width: "100%", height: "100%" }}
        onCameraChanged={ev => {
          console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom);
        }}
      >
        {features && (
          <ConstituencyBoundaries
            features={features}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}
      </Map>
      {features && (
        <Sidebar features={features} selectedId={selectedId} onSelect={handleSelect} />
      )}
      {selectedId !== null && featureProps[selectedId] && (
        <InfoBox properties={featureProps[selectedId]} />
      )}
    </div>
  );
}