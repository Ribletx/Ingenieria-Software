import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// 🔧 Corregir íconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ChileMap = ({ sensors, onSelectSensor, onAddSensor }) => {
  const [hoveredSensor, setHoveredSensor] = useState(null);

  // 📍 Control de vista del mapa (animación opcional)
  const MapViewUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) map.flyTo(center, 5.5, { duration: 1 });
    }, [center]);
    return null;
  };

  // 🗺️ Límites ampliados de Chile
  const chileBounds = [
    [-60.0, -85.0],
    [-15.0, -60.0],
  ];

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[-35.6751, -71.543]}
        zoom={4.7}
        minZoom={3.8}
        maxZoom={18}
        style={{ width: "100%", height: "100vh", zIndex: 0 }}
        worldCopyJump={true}
        maxBounds={chileBounds}
        maxBoundsViscosity={0.9}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {sensors.map((s) => (
          <Marker
            key={s.id}
            position={[s.location.latitude, s.location.longitude]}
            eventHandlers={{
              click: () => onSelectSensor({ id: s.id, name: s.name }),
              mouseover: () => setHoveredSensor(s.id),
              mouseout: () => setHoveredSensor(null),
            }}
          >
            {hoveredSensor === s.id && (
              <Popup autoClose={false} closeButton={false}>
                <div className="text-sm">
                  <strong>{s.name}</strong>
                  <br />
                  Estado:{" "}
                  <span
                    className={`font-semibold ${
                      s.status === "critical"
                        ? "text-red-600"
                        : s.status === "warning"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {s.status.toUpperCase()}
                  </span>
                  <br />
                  Nivel: {s.value}%
                  <br />
                  <button
                    onClick={onAddSensor}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                  >
                    ➕ Agregar sede
                  </button>
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        <MapViewUpdater />
      </MapContainer>
    </div>
  );
};

export default ChileMap;
