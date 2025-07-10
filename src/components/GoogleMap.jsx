import React, { useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";

function ConstituencyBoundaries() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    // Load GeoJSON from public folder
    map.data.loadGeoJson("/Constituency_with_geometry.geojson");
    // Style the boundaries
    map.data.setStyle(feature => ({
      fillColor: '#1976d2',
      fillOpacity: 0.2,
      strokeColor: '#1976d2',
      strokeWeight: 2
    }));
  }, [map]);
  return null;
}

export default function GoogleMap() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        defaultCenter={{ lat: 0.0236, lng: 37.9062 }} // Center of Kenya
        defaultZoom={6}
        style={{ width: "100%", height: "100%" }}
        onCameraChanged={ev => {
          console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom);
        }}
      >
        <ConstituencyBoundaries />
      </Map>
    </div>
  );
}