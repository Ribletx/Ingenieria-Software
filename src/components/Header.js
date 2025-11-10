import React, { useState } from "react";
import { Search } from "lucide-react"; // Usa Lucide para el ícono

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // 🔍 Envía el término de búsqueda al componente padre
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm gap-2 md:gap-4">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
          Sistema de Monitoreo de Sensores
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Visualiza el estado de tus centrales en tiempo real.
        </p>
      </div>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2 w-full md:w-80">
        <Search className="text-gray-500 mr-2" size={20} />
        <input
          type="text"
          placeholder="Buscar sede..."
          value={query}
          onChange={handleSearch}
          className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
      </div>
    </header>
  );
};

export default Header;
