import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// 🏥 Import your hospital icon (ensure file is inside: src/assets/hospital-icon.png)
import hospitalIconImg from "./assets/hospital-icon.png";

// 🏥 Custom Hospital Icon (your uploaded PNG)
const hospitalIcon = new L.Icon({
  iconUrl: hospitalIconImg,
  iconSize: [40, 40],     // Adjust the size here if needed
  iconAnchor: [20, 40],   // Center-bottom alignment
  popupAnchor: [0, -35],
});

// 🚨 Incident Icon (red pin)
const incidentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
});

// 🔄 Auto fit the map to include all points
function AutoFitMap({ points }) {
  const map = useMap();
  useEffect(() => {
    const validPoints = points.filter(
      (p) => Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])
    );
    if (validPoints.length > 0) {
      map.fitBounds(validPoints, { padding: [60, 60] });
    }
  }, [points, map]);
  return null;
}

function MapDisplay({ incident, assignments }) {
  const [routes, setRoutes] = useState([]);
  const defaultPosition = [19.076, 72.8777]; // Mumbai default center
  const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY; // from .env file

  // Fetch driving routes from incident → each hospital
  useEffect(() => {
    if (!incident?.lat || !incident?.lon || !assignments?.length) return;

    async function fetchRoutes() {
      const fetchedRoutes = [];

      for (const h of assignments) {
        if (!h.lat || !h.lon) continue;

        try {
          const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${incident.lon},${incident.lat}&end=${h.lon},${h.lat}`
          );
          const data = await response.json();

          if (data.features && data.features[0]?.geometry?.coordinates) {
            const coords = data.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
            fetchedRoutes.push({ id: h.hospital_id, coords });
          }
        } catch (err) {
          console.error("Routing error:", err);
        }
      }

      setRoutes(fetchedRoutes);
    }

    fetchRoutes();
  }, [incident, assignments, ORS_API_KEY]);

  // Combine all coordinates for auto-zoom
  const allPoints = [
    ...(incident.lat && incident.lon ? [[incident.lat, incident.lon]] : []),
    ...assignments.filter((h) => h.lat && h.lon).map((h) => [h.lat, h.lon]),
  ];

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 0 12px rgba(0,0,0,0.2)",
      }}
    >
      <MapContainer center={defaultPosition} zoom={12} style={{ height: "100%", width: "100%" }}>
        {/* 🌍 Base Map Layer */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🚨 Incident Marker */}
        {incident?.lat && incident?.lon && (
          <Marker position={[incident.lat, incident.lon]} icon={incidentIcon}>
            <Popup>
              🚨 <b>Incident Location</b>
              <br />
              {incident.name}
            </Popup>
          </Marker>
        )}

        {/* 🏥 Hospital Markers (your custom icon) */}
        {assignments?.map(
          (h, i) =>
            h.lat &&
            h.lon && (
              <Marker key={i} position={[h.lat, h.lon]} icon={hospitalIcon}>
                <Popup>
                  <b>{h.hospital_name}</b>
                  <br />
                  Critical: {h.assigned_critical} | Stable: {h.assigned_stable}
                  <br />
                  Distance: {h.distance_km?.toFixed(2)} km
                  <br />
                  ETA: {h.travel_min?.toFixed(1)} min
                </Popup>
              </Marker>
            )
        )}

        {/* 🚗 Routes from Incident → Hospitals */}
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.coords}
            color="#e11d48"   // red lines for clear visibility
            weight={3}
            opacity={0.8}
          />
        ))}

        <AutoFitMap points={allPoints} />
      </MapContainer>
    </div>
  );
}

export default MapDisplay;
