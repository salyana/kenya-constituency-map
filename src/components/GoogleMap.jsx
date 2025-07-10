import React, { useEffect, useState, useCallback } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import manIcon from '../assets/man.png';
import womanIcon from '../assets/woman.png';

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
      top: 52,
      right: 20,
      width: 210,
      maxHeight: 320,
      background: 'rgba(255,255,255,0.97)',
      borderRadius: 6,
      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
      overflowY: 'auto',
      zIndex: 10,
      padding: 0,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      border: '1.5px solid #e3e8ee',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        fontWeight: 800,
        fontSize: 15,
        padding: '12px 14px 8px 14px',
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(90deg, #e3f0ff 0%, #dbeafe 100%)',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        letterSpacing: 0.2,
        color: '#1a237e',
        textShadow: '0 1px 2px #fff',
      }}>
        Constituencies - Kenya
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {features.map((f, i) => (
          <li
            key={i}
            onClick={() => onSelect(f.properties.id)}
            style={{
              padding: '7px 14px',
              margin: '1px 0',
              borderRadius: 8,
              background: selectedId === f.properties.id
                ? 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)'
                : 'transparent',
              cursor: 'pointer',
              fontWeight: selectedId === f.properties.id ? 700 : 500,
              color: selectedId === f.properties.id ? '#d32f2f' : '#222',
              boxShadow: selectedId === f.properties.id ? '0 2px 8px 0 rgba(255,111,97,0.10)' : 'none',
              transition: 'background 0.2s, color 0.2s',
              border: selectedId === f.properties.id ? '1.5px solid #ff6f61' : '1.5px solid transparent',
              fontSize: 14,
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

function MaleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#f5f5f5"/><path d="M20 22c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 2c-4 0-12 2-12 6v2h24v-2c0-4-8-6-12-6z" fill="#888"/></svg>
  );
}
function FemaleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#f5f5f5"/><path d="M20 22c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 2c-4 0-12 2-12 6v2h7v2h2v-2h7v-2c0-4-8-6-12-6z" fill="#43b97f"/></svg>
  );
}

function PopulationRing({ value }) {
  // Calculate dynamic size based on text length
  const valueText = value.toLocaleString();
  const textLength = valueText.length;
  const baseSize = 70;
  const additionalSize = Math.max(0, (textLength - 4) * 7);
  const size = baseSize + additionalSize;
  
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Half circle for each color
  const halfCircumference = circumference / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> 
      {/* Green semicircle (right half) */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#22a06b"
        strokeWidth={stroke}
        strokeDasharray={`${halfCircumference} ${halfCircumference}`}
        strokeDashoffset={0}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Gray semicircle (left half) */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#d1d5db"
        strokeWidth={stroke}
        strokeDasharray={`${halfCircumference} ${halfCircumference}`}
        strokeDashoffset={-halfCircumference}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Population number */}
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        fontSize={textLength > 6 ? "12" : textLength > 4 ? "14" : "16"}
        fontWeight="600"
        fill="#444"
      >
        {valueText}
      </text>
      {/* Label - First line */}
      <text
        x={center}
        y={center + 10}
        textAnchor="middle"
        fontSize="9"
        fill="#888"
      >
        Population
      </text>
      {/* Label - Second line */}
      <text
        x={center}
        y={center + 21}
        textAnchor="middle"
        fontSize="9"
        fill="#888"
      >
        Estimate
      </text>
    </svg>
  );
}

function InfoBox({ properties }) {
  if (!properties) return null;
  // Calculate percentages
  const total = properties.Total || 0;
  const male = properties.Male || 0;
  const female = properties.Female || 0;
  const malePct = total ? Math.round((male / total) * 100) : 0;
  const femalePct = total ? Math.round((female / total) * 100) : 0;
  // Median age (mocked, as not in your data)
  const maleAge = properties.Male_Age || 38;
  const femaleAge = properties.Female_Age || 40;
  return (
    <div style={{
      position: 'absolute',
      left: 18,
      bottom: 18,
      width: 310,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
      padding: 0,
      zIndex: 10,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      border: '1px solid #e3e8ee',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 17,
        padding: '10px 12px 0 12px',
        color: '#222',
        letterSpacing: 0.1,
        textAlign: 'left',
      }}>
        {properties.Constituency} Constituency
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 12px 0 12px' }}>
        {/* Male */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={manIcon} alt="male" style={{ width: 26, height: 26, marginBottom: 2, opacity: 0.7 }} />
          <div style={{ fontWeight: 600, fontSize: 14, color: '#888', marginTop: 2 }}>{malePct}%</div>
          <div style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>male</div>
          <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>Avg. Median Age</div>
          <div style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{maleAge}</div>
        </div>
        {/* Population ring */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <PopulationRing value={total} />
        </div>
        {/* Female */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={womanIcon} alt="female" style={{ width: 26, height: 26, marginBottom: 2, opacity: 0.7 }} />
          <div style={{ fontWeight: 600, fontSize: 14, color: '#22a06b', marginTop: 2 }}>{femalePct}%</div>
          <div style={{ fontSize: 11, color: '#22a06b', fontWeight: 400 }}>female</div>
          <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>Avg. Median Age</div>
          <div style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{femaleAge}</div>
        </div>
      </div>
      {/* Dotted line separator */}
      <div style={{ borderBottom: '1px dotted #bbb', margin: '6px 0 0 0' }} />
      {/* Bottom stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#444', padding: '4px 12px 8px 12px', fontWeight: 400 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#444' }}>Households</div>
          <div style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{properties.Households?.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px dotted #bbb', borderRight: '1px dotted #bbb' }}>
          <div style={{ fontWeight: 600, color: '#444' }}>Area in Sq. Km.</div>
          <div style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{properties['Area in Sq. Km.']?.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#444' }}>Density</div>
          <div style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{properties.Density}</div>
        </div>
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