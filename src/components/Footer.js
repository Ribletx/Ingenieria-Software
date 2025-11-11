import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black/70 backdrop-blur-sm border-t border-gray-200 py-4 text-center text-white text-sm">
      <p>
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.haagequipamiento.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-semibold"
        >
          Haag Equipamiento
        </a>
        . Todos los derechos reservados.
      </p>
      <p className="mt-1">
        <a
          href="mailto:enrique@haagequipamiento.com"
          className="text-blue-600 hover:underline"
        >
          enrique@haagequipamiento.com
        </a>{" "}
        | Av. del Valle Sur 570, Huechuraba, Santiago, Región Metropolitana, Chile
      </p>
    </footer>
  );
};

export default Footer;
