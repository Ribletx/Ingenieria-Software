import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const AddSensorButton = ({ onAddSensor, onCancel }) => {
  const [newSensor, setNewSensor] = useState({
    name: "",
    addressText: "",
    location: null,
    machines: [],
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [availableMachines, setAvailableMachines] = useState([]);

  // 🔹 Obtener lista de máquinas desde la base de datos
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch(`${API_URL}/api/maquinas`);
        if (!res.ok) throw new Error("Error al obtener máquinas");
        const data = await res.json();
        setAvailableMachines(data);
      } catch (err) {
        console.error("⚠️ No se pudieron obtener las máquinas:", err);
        setAvailableMachines([]);
      }
    };
    fetchMachines();
  }, []);

  // 🔹 Buscar direcciones (OpenStreetMap)
  const fetchSuggestions = async (q) => {
    if (!q || q.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
        q + ", Chile"
      )}`;
      const res = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = await res.json();
      const mapped = data.map((d) => ({
        display_name: d.display_name,
        lat: parseFloat(d.lat),
        lon: parseFloat(d.lon),
      }));
      setSuggestions(mapped);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddressInput = (text) => {
    setNewSensor((p) => ({ ...p, addressText: text, location: null }));
    fetchSuggestions(text);
  };

  const handleChooseSuggestion = (sugg) => {
    setNewSensor((p) => ({
      ...p,
      addressText: sugg.display_name,
      location: { latitude: sugg.lat, longitude: sugg.lon },
    }));
    setSuggestions([]);
  };

  const handleToggleMachine = (machineName) => {
    setNewSensor((prev) => {
      const alreadySelected = prev.machines.includes(machineName);
      return {
        ...prev,
        machines: alreadySelected
          ? prev.machines.filter((m) => m !== machineName)
          : [...prev.machines, machineName],
      };
    });
  };

  const handleSaveSensor = () => {
    if (!newSensor.name.trim() || !newSensor.addressText.trim()) {
      alert("Completa nombre y dirección.");
      return;
    }

    if (newSensor.machines.length === 0) {
      alert("Selecciona al menos una máquina.");
      return;
    }

    onAddSensor({
      name: newSensor.name,
      address: newSensor.addressText,
      location: newSensor.location,
      machines: newSensor.machines,
    });

    setNewSensor({ name: "", addressText: "", location: null, machines: [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-xl w-[92%] max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4 text-center">
          ➕ Agregar nueva sede
        </h3>

        {/* Nombre */}
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          value={newSensor.name}
          onChange={(e) =>
            setNewSensor((p) => ({ ...p, name: e.target.value }))
          }
          className="w-full border rounded p-2 mb-3"
          placeholder="Nombre de la sede"
        />

        {/* Dirección */}
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          value={newSensor.addressText}
          onChange={(e) => handleAddressInput(e.target.value)}
          className="w-full border rounded p-2 mb-1"
          placeholder="Escribe una dirección..."
        />

        {suggestions.length > 0 && (
          <div className="max-h-40 overflow-auto border rounded-md bg-white mb-3">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleChooseSuggestion(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        {/* Máquinas */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Máquinas disponibles
        </label>
        <div className="border rounded p-3 mb-4 space-y-2">
          {availableMachines.length > 0 ? (
            availableMachines.map((machine) => (
              <label
                key={machine.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={newSensor.machines.includes(machine.nombre)}
                  onChange={() => handleToggleMachine(machine.nombre)}
                />
                {machine.nombre} —{" "}
                <span className="text-gray-500 italic">
                  {machine.descripcion}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              No hay máquinas registradas en la base de datos.
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">
            Cancelar
          </button>
          <button
            onClick={handleSaveSensor}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSensorButton;
