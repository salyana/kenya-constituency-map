# Kenya Constituency Map

## Build & Deploy

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Build for production:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with the production build.
3. **Deploy to Netlify:**
   - Drag and drop the `dist` folder into Netlify's deploy interface, or
   - Connect your repo and set the build command to `npm run build` and publish directory to `dist`.

## Google Maps API Key
- Replace `YOUR_API_KEY` in `src/App.jsx` with your actual Google Maps API key before deploying.

## Data Files
- Ensure `public/Constituency_Data_Kenya.csv.csv` and `public/kml_to_geoj.geojson` are present in the `public` folder.
