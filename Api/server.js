import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// 🧩 Conexión a Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_aV4Yqcwj1Wlo@ep-crimson-pond-ahza7qpz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 🔹 RUTAS PRINCIPALES
// =====================================================

// ✅ Obtener todas las sedes con sus máquinas y equipos
app.get("/api/sedes", async (req, res) => {
  try {
    const sedeQuery = await pool.query(`
      SELECT s.id AS sede_id, s.nombre AS sede_nombre, s.region, s.latitud, s.longitud,
             m.id AS maquina_id, m.nombre AS maquina_nombre, m.descripcion,
             e.id AS equipo_id, e.nombre AS equipo_nombre, e.max_horas, e.horas_usadas
      FROM sede s
      LEFT JOIN maquina m ON m.sede_id = s.id
      LEFT JOIN equipo e ON e.maquina_id = m.id
      ORDER BY s.id, m.id, e.id;
    `);

    // Transformar a estructura jerárquica
    const sedesMap = new Map();

    sedeQuery.rows.forEach((row) => {
      if (!sedesMap.has(row.sede_id)) {
        sedesMap.set(row.sede_id, {
          id: row.sede_id,
          nombre: row.sede_nombre,
          region: row.region,
          latitud: row.latitud,
          longitud: row.longitud,
          maquinas: [],
        });
      }

      const sede = sedesMap.get(row.sede_id);
      let maquina = sede.maquinas.find((m) => m.id === row.maquina_id);

      if (!maquina && row.maquina_id) {
        maquina = {
          id: row.maquina_id,
          nombre: row.maquina_nombre,
          descripcion: row.descripcion,
          equipos: [],
        };
        sede.maquinas.push(maquina);
      }

      if (maquina && row.equipo_id) {
        maquina.equipos.push({
          id: row.equipo_id,
          nombre: row.equipo_nombre,
          max_horas: row.max_horas,
          horas_usadas: row.horas_usadas,
        });
      }
    });

    res.json(Array.from(sedesMap.values()));
  } catch (err) {
    console.error("❌ Error al obtener sedes:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Crear nueva sede con máquinas existentes
app.post("/api/sedes", async (req, res) => {
  const { nombre, region, latitud, longitud, maquinas } = req.body;

  if (!nombre || !maquinas || maquinas.length === 0) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Crear sede
    const sedeResult = await client.query(
      `INSERT INTO sede (nombre, region, latitud, longitud)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nombre, region || null, latitud || null, longitud || null]
    );

    const sedeId = sedeResult.rows[0].id;

    // Asociar máquinas seleccionadas
    for (const maquinaNombre of maquinas) {
      const maquinaResult = await client.query(
        `INSERT INTO maquina (nombre, descripcion, sede_id)
         VALUES ($1, $2, $3) RETURNING id`,
        [maquinaNombre, `Máquina registrada automáticamente`, sedeId]
      );

      const maquinaId = maquinaResult.rows[0].id;

      // Añadir equipos por defecto según máquina
      const equiposPorDefecto = [
        { nombre: "Filtro 1", max_horas: 100 },
        { nombre: "Filtro Papel", max_horas: 10 },
        { nombre: "Aceite", max_horas: 1000 },
        { nombre: "Filtro 2", max_horas: 25 },
      ];

      for (const eq of equiposPorDefecto) {
        await client.query(
          `INSERT INTO equipo (nombre, max_horas, horas_usadas, maquina_id)
           VALUES ($1, $2, 0, $3)`,
          [eq.nombre, eq.max_horas, maquinaId]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Sede creada correctamente", sedeId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error al crear sede:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    client.release();
  }
});

// ✅ Actualizar horas usadas de un equipo (simulación del sensor)
app.put("/api/equipos/:id", async (req, res) => {
  const { id } = req.params;
  const { horas_usadas } = req.body;

  if (typeof horas_usadas !== "number") {
    return res.status(400).json({ error: "horas_usadas debe ser un número" });
  }

  try {
    await pool.query(`UPDATE equipo SET horas_usadas = $1 WHERE id = $2`, [
      horas_usadas,
      id,
    ]);
    res.json({ message: "Equipo actualizado" });
  } catch (err) {
    console.error("❌ Error al actualizar equipo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Eliminar una sede
app.delete("/api/sedes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM sede WHERE id = $1`, [id]);
    res.json({ message: "Sede eliminada" });
  } catch (err) {
    console.error("❌ Error al eliminar sede:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// ✅ Obtener lista de máquinas disponibles (para selección en el formulario)
app.get("/api/maquinas", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nombre, descripcion FROM maquina ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener máquinas:", err);
    res.status(500).json({ error: "Error al obtener máquinas" });
  }
});

// =====================================================
// 🔹 Servidor
// =====================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`);
});
