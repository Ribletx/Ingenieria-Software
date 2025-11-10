import React from "react";

const SensorDetail = ({ sensor, onClose }) => {
  if (!sensor) return null;

  const { name, region, value, lastUpdate, machine } = sensor;
  const { type, inactivityHours, components } = machine || {};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Contenedor centrado */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg h-[80vh] overflow-y-auto relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
          title="Cerrar"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 mt-2">{name}</h2>
        <p className="text-gray-600 mb-2">{region}</p>
        <p className="text-gray-500 text-sm mb-4">
          Última actualización: {new Date(lastUpdate).toLocaleString()}
        </p>

        <div className="border-t pt-3 mb-4">
          <h3 className="text-lg font-semibold mb-2">Tipo de máquina:</h3>
          <p className="text-gray-700 mb-1">{type || "No especificado"}</p>
          <p className="text-gray-600">
            Horas de inactividad: <strong>{inactivityHours ?? "0"}</strong> h
          </p>
        </div>

        {components ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Componentes</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(components).map(([key, comp]) => {
                const percent = Math.min(
                  (comp.hoursUsed / comp.maxHours) * 100,
                  100
                );
                const formattedKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div
                    key={key}
                    className="border rounded-xl p-3 bg-gray-50 shadow-sm"
                  >
                    <h4 className="font-semibold">{formattedKey}</h4>
                    <p className="text-sm text-gray-600">
                      Horas usadas: {comp.hoursUsed} / {comp.maxHours}
                    </p>
                    <p className="text-sm text-gray-600">
                      Último cambio: {comp.lastChange}
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                      <div
                        className={`h-2 rounded ${
                          percent > 90
                            ? "bg-red-500"
                            : percent > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">
            No hay datos de componentes para esta máquina.
          </p>
        )}
      </div>
    </div>
  );
};

export default SensorDetail;
