import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import GoogleMap from "./components/GoogleMap";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


function App() {
  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log("Maps API has loaded.")}>
      <GoogleMap />
    </APIProvider>
  );
}

export default App;