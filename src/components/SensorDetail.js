import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const SensorDetail = ({ sensor, onClose }) => {
  const [sede, setSede] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sensor?.id) return;
    const fetchSede = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sedes`);
        const data = await res.json();
        const found = data.find((s) => s.id === sensor.id);
        setSede(found || null);
      } catch (err) {
        console.error("❌ Error al obtener detalle de la sede:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSede();
  }, [sensor]);

  if (!sensor) return null;

  // Función segura para mostrar coordenadas
  const renderCoordenadas = (lat, lon) => {
    if (lat == null || lon == null || lat === "" || lon === "") {
      return "No disponible";
    }
    const latNum = Number(lat);
    const lonNum = Number(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return "No disponible";
    }

    return `${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl h-[85vh] overflow-y-auto relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
          title="Cerrar"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-gray-500 italic text-center mt-10">
            Cargando información...
          </p>
        ) : sede ? (
          <>
            <h2 className="text-2xl font-bold mb-2 mt-2">{sede.nombre}</h2>
            <p className="text-gray-600 mb-2">
              Región: {sede.region || "No especificada"}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Coordenadas: {renderCoordenadas(sede.latitud, sede.longitud)}
            </p>

            {sede.maquinas && sede.maquinas.length > 0 ? (
              sede.maquinas.map((m) => (
                <div
                  key={m.id}
                  className="border rounded-xl p-4 mb-4 bg-gray-50 shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-1">{m.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {m.descripcion || "Sin descripción"}
                  </p>

                  {m.equipos && m.equipos.length > 0 ? (
                    <div className="space-y-3">
                      {m.equipos.map((e) => {
                        const percent = Math.min(
                          (e.horas_usadas / e.max_horas) * 100,
                          100
                        );
                        return (
                          <div key={e.id} className="bg-white rounded-lg p-3 border">
                            <p className="font-semibold">{e.nombre}</p>
                            <p className="text-sm text-gray-600">
                              {e.horas_usadas} / {e.max_horas} horas usadas
                            </p>
                            <div className="w-full bg-gray-200 h-2 rounded mt-1">
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
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Sin equipos registrados.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No hay máquinas registradas en esta sede.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic text-center mt-10">
            No se encontró información de esta sede.
          </p>
        )}
      </div>
    </div>
  );
};

export default SensorDetail;
