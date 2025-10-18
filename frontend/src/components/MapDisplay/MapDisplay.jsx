import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import hospitalIconImg from "../../assets/hospital-icon.png";

// 🏥 Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: hospitalIconImg || "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -30],
});

// 🚨 Incident icon
const incidentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -35],
});

// 🔄 Automatically fit map bounds
function AutoFitMap({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) map.fitBounds(points, { padding: [80, 80] });
  }, [points, map]);
  return null;
}

export default function MapDisplay({ incident = {}, assignments = [] }) {
  const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
  const fallback = [19.076, 72.8777]; // Mumbai center

  const [routes, setRoutes] = useState([]);
  const [incidentCoords, setIncidentCoords] = useState({
    lat: incident.lat || null,
    lon: incident.lon || null,
  });

  const [processed, setProcessed] = useState([]);

  // 🧭 Step 1: Geocode incident if coordinates missing
  useEffect(() => {
    if (incident.lat && incident.lon) return;

    (async () => {
      try {
        const query = incident.name || "Bandra, Mumbai, India";
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&viewbox=72.775,19.300,72.990,18.850&bounded=1&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();

        if (data && data[0]) {
          setIncidentCoords({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        } else {
          setIncidentCoords({ lat: fallback[0], lon: fallback[1] });
        }
      } catch {
        setIncidentCoords({ lat: fallback[0], lon: fallback[1] });
      }
    })();
  }, [incident]);

  // 🏥 Step 2: Process hospital assignments
  // 🏥 Step 2: Process hospital assignments
useEffect(() => {
  (async () => {
    const results = [];
    const MUMBAI_BOX = {
      minLat: 18.85,
      maxLat: 19.30,
      minLon: 72.77,
      maxLon: 72.99,
    };

    for (const h of assignments) {
      const name = h.hospital_name;
      let lat = h.lat;
      let lon = h.lon;

      // 🌍 Try to geocode if coords missing
      if (!lat || !lon) {
        const q = encodeURIComponent(name + " Mumbai India");
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${q}`;
        try {
          const res = await fetch(url);
          const data = await res.json();

          if (data && data[0]) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);
          }
        } catch (err) {
          console.error("❌ Geocode failed for", name, err);
        }
      }

      // 🧭 Validate coordinates → keep only Mumbai area
      if (
        !lat ||
        !lon ||
        lat < MUMBAI_BOX.minLat ||
        lat > MUMBAI_BOX.maxLat ||
        lon < MUMBAI_BOX.minLon ||
        lon > MUMBAI_BOX.maxLon
      ) {
        console.warn(`⚠️ ${name} returned invalid location, using fallback near Bandra`);
        lat = 19.076 + (Math.random() - 0.5) * 0.02; // small offset
        lon = 72.8777 + (Math.random() - 0.5) * 0.02;
      }

      results.push({
        ...h,
        lat,
        lon,
      });
    }

    // 👀 Optional: verify in console
    console.table(
      results.map((r) => ({
        Hospital: r.hospital_name,
        Lat: r.lat.toFixed(4),
        Lon: r.lon.toFixed(4),
      }))
    );

    setProcessed(results);
  })();
}, [assignments]);

  // 🚗 Step 3: Fetch precise routes
  useEffect(() => {
    async function getRoutes() {
      if (!incidentCoords.lat || !incidentCoords.lon || !processed.length) return;

      const lines = [];
      for (const h of processed) {
        try {
          try {
  const start = `${incidentCoords.lon},${incidentCoords.lat}`;
  const end = `${h.lon},${h.lat}`;

  const res = await fetch(
    `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`
  );
  const data = await res.json();

  // ✅ Ensure we reverse coords properly for Leaflet (which uses [lat, lon])
  if (data?.features?.[0]?.geometry?.coordinates) {
    const coords = data.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    lines.push({
      name: h.hospital_name,
      coords,
    });
  } else {
    console.warn("No route data found for:", h.hospital_name);
  }
} catch (err) {
  console.error("Routing error for", h.hospital_name, err);
}

        } catch {
          console.warn("Route fetch failed for", h.hospital_name);
        }
      }

      setRoutes(lines);
    }

    getRoutes();
  }, [incidentCoords, processed, ORS_API_KEY]);

  // 📍 Step 4: Combine all map points
  const allPoints = [
    ...(incidentCoords.lat && incidentCoords.lon ? [[incidentCoords.lat, incidentCoords.lon]] : []),
    ...processed.map((h) => [h.lat, h.lon]),
  ];

  if (!incidentCoords.lat || !incidentCoords.lon) {
    return <div style={{ textAlign: "center", padding: "1rem" }}>🧭 Locating incident...</div>;
  }

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 0 12px rgba(0,0,0,0.15)",
        marginTop: "1rem",
      }}
    >
      <MapContainer
        center={[incidentCoords.lat, incidentCoords.lon]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🚨 Incident Marker */}
        <Marker position={[incidentCoords.lat, incidentCoords.lon]} icon={incidentIcon}>
          <Popup>
            🚨 <b>Incident Location</b>
            <br />
            {incident.name || "Unknown Location"}
          </Popup>
        </Marker>

        {/* 🏥 Hospital Markers */}
        {processed.map((h, i) => (
          <Marker key={i} position={[h.lat, h.lon]} icon={hospitalIcon}>
            <Popup>
              🏥 <b>{h.hospital_name}</b>
              <br />
              Critical: {h.assigned_critical || 0} | Stable: {h.assigned_stable || 0}
            </Popup>
          </Marker>
        ))}

        {/* 🚗 Routes */}
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.coords}
            color="#e11d48"
            weight={4}
            opacity={0.9}
            dashArray="6,10"
          />
        ))}

        <AutoFitMap points={allPoints} />
      </MapContainer>
    </div>
  );
}
