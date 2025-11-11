import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChileMap from "./components/ChileMap";
import SensorAlerts from "./components/SensorAlerts";
import SensorDetail from "./components/SensorDetail";
import AddSensorButton from "./components/AddSensorButton";
import { defaultSensors } from "./mock/sensors";
import "./App.css";

// Determina el estado según valor
const determineStatus = (value) => {
  if (value < 30) return "critical";
  if (value < 60) return "warning";
  return "normal";
};

const applyStatusToSensors = (sensorList) =>
  sensorList.map((s) => ({ ...s, status: determineStatus(s.value) }));

const App = () => {
  const [sensors, setSensors] = useState(applyStatusToSensors(defaultSensors));
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro seguro (previene undefined)
  const filteredSensors = sensors.filter((s) =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (query) => setSearchTerm(query);

  // Agregar nueva sede
  const handleAddSensor = (sensorData) => {
    const id = Date.now().toString();
    const sensor = {
      id,
      ...sensorData,
      value: 50,
      lastUpdate: new Date().toISOString(),
      status: determineStatus(50),
    };
    setSensors((prev) => [...prev, sensor]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-none z-30">
        <Header onSearch={handleSearch} />
      </div>

      {/* Contenido principal */}
      <div className="relative flex-1 overflow-hidden">
        <ChileMap sensors={filteredSensors} onSelectSensor={setSelectedSensor} />

        {/* Panel lateral de alertas */}
        {showAlerts && (
          <div
            className="
              absolute right-4 md:right-6 
              top-[10px] bottom-[10px]
              z-20 w-[90%] md:w-96 
              bg-white/90 backdrop-blur-md 
              rounded-2xl shadow-2xl border border-gray-300 
              overflow-y-auto
              p-4 md:p-6
            "
          >
            <SensorAlerts
              sensors={filteredSensors}
              onSelectSensor={setSelectedSensor}
              onAddSensor={() => setShowAddForm(true)}
              onClose={() => setShowAlerts(false)}
            />
          </div>
        )}

        {/* Botón hamburguesa */}
        {!showAlerts && (
          <button
            onClick={() => setShowAlerts(true)}
            className="absolute top-[10px] right-6 z-30 bg-white border border-gray-300 rounded-xl shadow-lg p-3 hover:bg-gray-100 transition-all"
            title="Mostrar panel de alertas"
          >
            ☰
          </button>
        )}

        {/* Detalle del sensor */}
        {selectedSensor && (
          <SensorDetail
            sensor={selectedSensor}
            onClose={() => setSelectedSensor(null)}
          />
        )}

        {/* Formulario para agregar nueva sede */}
        {showAddForm && (
          <AddSensorButton
            onAddSensor={(data) => {
              handleAddSensor(data);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex-none z-30">
        <Footer />
      </div>
    </div>
  );
};

export default App;
