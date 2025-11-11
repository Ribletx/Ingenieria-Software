import React from "react";

const SensorAlerts = ({ sensors, onSelectSensor, onAddSensor, onClose }) => {
  const formatDate = (d) =>
    new Date(d).toLocaleString("es-CL", { hour12: false });

  const categories = {
    critical: { title: "Críticas", color: "red", icon: "⚠️" },
    warning: { title: "Advertencias", color: "yellow", icon: "🟡" },
    normal: { title: "Normales", color: "green", icon: "✅" },
  };

  return (
    <div className="fade-in">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🔔 Alertas
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddSensor}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm shadow"
            title="Agregar"
          >
            + Agregar
          </button>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold px-2"
            title="Cerrar panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Listado de alertas por categoría */}
      {Object.entries(categories).map(([status, info]) => {
        const filtered = sensors.filter((s) => s.status === status);
        if (filtered.length === 0) return null;
        return (
          <div
            key={status}
            className={`mb-6 p-4 bg-${info.color}-50 border border-${info.color}-200 rounded-xl`}
          >
            <h3 className={`text-xl font-semibold text-${info.color}-600 mb-3`}>
              {info.icon} {info.title}
            </h3>

            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSensor(s)}
                className={`bg-${info.color}-100 border border-${info.color}-300 rounded-lg p-3 mb-2 cursor-pointer hover:bg-${info.color}-200`}
              >
                <p className={`font-bold text-${info.color}-700`}>
                  {s.name || "Sin nombre"}
                </p>
                <p className={`text-${info.color}-600 text-sm`}>
                  Nivel: {s.value ?? "?"}%
                </p>
                <p className={`text-xs text-${info.color}-500`}>
                  Última actualización: {formatDate(s.lastUpdate)}
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SensorAlerts;
