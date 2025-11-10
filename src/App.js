import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChileMap from "./components/ChileMap";
import SensorAlerts from "./components/SensorAlerts";
import SensorDetail from "./components/SensorDetail";
import { defaultSensors } from "./mock/sensors";
import "./App.css";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSensors = sensors.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (query) => setSearchTerm(query);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* 🧭 Header con buscador */}
      <div className="flex-none z-30">
        <Header onSearch={handleSearch} />
      </div>

      {/* 🗺️ Contenido central */}
      <div className="relative flex-1 overflow-hidden">
        <ChileMap
          sensors={filteredSensors}
          onSelectSensor={setSelectedSensor}
          onAddSensor={() => setShowAddForm(true)}
        />

        {/* 🔔 Panel lateral de alertas */}
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
              animate-slide-in
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

        {/* ☰ Botón hamburguesa (mostrar panel) */}
        {!showAlerts && (
          <button
            onClick={() => setShowAlerts(true)}
            className="
              absolute top-[10px] right-6 z-30 
              bg-white border border-gray-300 
              rounded-xl shadow-lg p-3
              hover:bg-gray-100 transition-all
            "
            title="Mostrar panel de alertas"
          >
            ☰
          </button>
        )}

        {/* Modal detalle */}
        {selectedSensor && (
          <SensorDetail
            sensor={selectedSensor}
            onClose={() => setSelectedSensor(null)}
          />
        )}
      </div>

      {/* 🧭 Footer */}
      <div className="flex-none z-30">
        <Footer />
      </div>
    </div>
  );
};

export default App;
