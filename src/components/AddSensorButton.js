import React from "react";

const AddSensorButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 
        bg-blue-600 hover:bg-blue-700 
        text-white rounded-full shadow-2xl
        w-14 h-14 flex items-center justify-center 
        text-3xl font-bold transition-all duration-300
      "
      title="Agregar nueva sede"
    >
      +
    </button>
  );
};

export default AddSensorButton;
