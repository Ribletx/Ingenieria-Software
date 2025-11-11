# 🛰️ Ingenieria-Software
Proyecto para el curso de **Ingeniería de Software** — Sistema de Monitoreo de Sensores en Tiempo Real a lo largo de Chile

---

## 📖 Descripción

La empresa **Haag Equipamiento** trabaja con equipos de rescate en conjunto con **Bomberos**, los cuales requieren realizar mantenciones periódicas, pero actualmente **no existe un control automatizado** para ello.

El **Sistema de Monitoreo de Sensores** es una aplicación web desarrollada para la supervisión en tiempo real del estado de distintas centrales distribuidas en el territorio nacional.  
Permite visualizar de forma geográfica y dinámica la información de cada sensor mediante un **mapa interactivo** y **paneles de alerta** con indicadores de estado.

El sistema busca facilitar la **gestión, diagnóstico y análisis preventivo** en infraestructuras críticas, brindando una vista centralizada y moderna de los datos sensoriales.

---

## 🚀 Desarrollo

El proyecto fue diseñado bajo un enfoque **modular y escalable**, utilizando tecnologías web modernas.  
Su estructura se compone de **componentes reutilizables** y una **interfaz responsiva**, adaptable tanto a escritorio como a dispositivos móviles.

- 🧩 **Propósito:** Centralizar la información de sensores distribuidos en distintas regiones del país.  
- 🌐 **Interfaz:** Visualización mediante mapa dinámico y panel de estado.  
- 🧠 **Funcionalidad:** Muestra el estado del sensor en base a sus valores en tiempo real (*Normal, Advertencia, Crítico*).  
- 📈 **Diseño:** Totalmente responsivo para pantallas de escritorio y móviles.

---

## ⚙️ Ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/usuario/Ingenieria-Software.git
cd Ingenieria-Software
```

### 2️⃣ Instalar dependencias principales
```bash
npm install
```

3️⃣ Instalar dependencias adicionales necesarias
```bash
npm install react-leaflet@4.2.1 leaflet --legacy-peer-deps
```

4️⃣ Ejecutar el proyecto en modo desarrollo
```bash
npm start
```

El proyecto se abrirá en http://localhost:3000

### 🧰 Módulos y Tecnologías Usadas

El desarrollo del sistema se realizó utilizando las siguientes herramientas:

⚛️ React.js — Librería principal para la construcción de la interfaz.

🗺️ React-Leaflet / Leaflet — Implementación del mapa interactivo de Chile.

🎨 TailwindCSS — Framework CSS para estilos y diseño responsivo.

🧭 Framer Motion — Animaciones fluidas e interactivas.

🧩 Lucide React — Iconografía moderna para la UI.

Instalación completa de módulos usados:
```bash
npm install framer-motion lucide-react react-leaflet leaflet tailwindcss
```

### 📂 Estructura Principal del Proyecto
```bash
Ingenieria-Software/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ChileMap.jsx
│   │   ├── SensorAlerts.jsx
│   │   └── SensorDetail.jsx
│   ├── mock/
│   │   └── sensors.js
│   ├── App.js
│   ├── App.css
│   └── index.js
│
├── package.json
└── README.md
```

## Diagrama relacional:
|----------------------------------------------|
| sede (1) ───< (N) maquina (1) ───< (N) sensor|
|----------------------------------------------|

## Autores ✨

| Nombre                 | Usuario de GitHub |
|------------------------|-------------------|
| Cristóbal Salgado D    | [@Ribletx](https://github.com/Ribletx) |
|                        |                                         |