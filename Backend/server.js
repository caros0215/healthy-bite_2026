require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const sharp = require("sharp");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// ========== CONEXIÓN POSTGRESQL ==========
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function connectWithRetry() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Conectado a PostgreSQL");
  } catch (err) {
    console.error("❌ PostgreSQL no listo, reintentando en 3s...");
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();

const tablaCanvaMap = {
  almuerzos: "almuerzos_canva",
  cursos: "cursos_canva",
  running: "running_canva",
};

const tablaDisenosMap = {
  cursos: "cursos_disenos",
  running: "running_disenos",
};

const modulosConLogicaMensual = ["cursos", "running"];

function validarYLimpiarBase64(imagen_base64, esModoEstricto = false) {
  try {
    let cleanBase64 = imagen_base64.trim().replace(/\s/g, "");
    if (!cleanBase64.startsWith("data:image/")) {
      cleanBase64 = `data:image/png;base64,${cleanBase64}`;
    }
    if (esModoEstricto) {
      const base64Data = cleanBase64.split(",")[1];
      if (!base64Data || base64Data.length === 0) throw new Error("Cadena base64 vacía");
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64Data)) throw new Error("Caracteres inválidos en base64");
      if (base64Data.length % 4 !== 0) {
        cleanBase64 += "=".repeat(4 - (base64Data.length % 4));
      }
      Buffer.from(base64Data, "base64");
    }
    return cleanBase64;
  } catch (error) {
    console.error("Error procesando base64:", error.message);
    return esModoEstricto ? null : imagen_base64;
  }
}

function comprimirBase64SiEsNecesario(base64String) {
  const sizeMB = (base64String.length * 3) / (4 * 1024 * 1024);
  if (sizeMB > 5) console.log(`Imagen grande detectada: ${sizeMB.toFixed(2)}MB`);
  return base64String;
}

// Borra imágenes cuya fecha_evento ya pasó (ayer o antes)
async function limpiarImagenesAlmuerzo(usuario_id) {
  const q = `
    DELETE FROM almuerzos_canva
    WHERE usuario_id = $1
    AND fecha_evento < CURRENT_DATE
  `;
  try {
    const r = await db.query(q, [usuario_id]);
    console.log(`Almuerzo: ${r.rowCount} imágenes eliminadas (fecha pasada)`);
  } catch (err) {
    console.error(`Error al limpiar almuerzos: ${err.message}`);
  }
}

async function limpiarMesesAnterioresModulosMensuales(tabla, usuario_id) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const q = `
    DELETE FROM ${tabla}
    WHERE usuario_id = $1 AND (
      EXTRACT(YEAR FROM fecha_evento) < $2 OR 
      (EXTRACT(YEAR FROM fecha_evento) = $2 AND EXTRACT(MONTH FROM fecha_evento) < $3)
    )
  `;
  try {
    const r = await db.query(q, [usuario_id, currentYear, currentMonth]);
    console.log(`Limpieza en ${tabla}: ${r.rowCount} eventos eliminados`);
  } catch (err) {
    console.error(`Error al limpiar ${tabla}: ${err.message}`);
  }
}

async function limpiarMesAnterior(tabla, usuario_id) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const q = `
    DELETE FROM ${tabla}
    WHERE usuario_id = $1 AND (
      EXTRACT(YEAR FROM fecha) < $2 OR 
      (EXTRACT(YEAR FROM fecha) = $2 AND EXTRACT(MONTH FROM fecha) < $3)
    )
  `;
  try {
    const r = await db.query(q, [usuario_id, currentYear, currentMonth]);
    console.log(`Limpieza en ${tabla}: ${r.rowCount} eliminadas`);
  } catch (err) {
    console.error(`Error al limpiar ${tabla}: ${err.message}`);
  }
}

// ========== ENDPOINT DE AUTENTICACIÓN ==========
app.post("/api/auth/login", async (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({
      success: false,
      message: "Usuario y contraseña son requeridos"
    });
  }

  const query = `
    SELECT id, nombre_usuario, nombre_completo, email, tipo_usuario
    FROM usuarios
    WHERE nombre_usuario = $1 AND contraseña = $2
    LIMIT 1
  `;

  try {
    const result = await db.query(query, [usuario, contraseña]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    const usuarioData = result.rows[0];

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuarioData.id,
        usuario: usuarioData.nombre_usuario,
        nombre: usuarioData.nombre_completo,
        email: usuarioData.email,
        tipo_usuario: usuarioData.tipo_usuario
      }
    });
  } catch (err) {
    console.error('Error en consulta de login:', err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// ========== ENDPOINT PARA PRUEBA DE BASE DE DATOS ==========
app.get("/api/db-test", async (req, res) => {
  try {
    await db.query("SELECT 1 as test");
    res.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error de conexión a la base de datos",
      details: err.message
    });
  }
});

// ========== ENDPOINTS PRINCIPALES ==========
app.post("/api/:modulo/guardar-diseno", async (req, res) => {
  const { modulo } = req.params;
  const { usuario_id, fecha, elementos, titulo, fondo } = req.body;

  let tabla = tablaDisenosMap[modulo] || tablaCanvaMap[modulo];
  if (!tabla) return res.status(400).json({ error: `Módulo no válido para diseños: ${modulo}` });
  if (!usuario_id || !fecha || !elementos) return res.status(400).json({ error: "Datos faltantes" });

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj)) return res.status(400).json({ error: "Fecha inválida" });

  const elementosJson = typeof elementos === "string" ? elementos : JSON.stringify(elementos);

  try {
    if (Object.values(tablaCanvaMap).includes(tabla)) {
      const check = await db.query(
        `SELECT id FROM ${tabla} WHERE usuario_id = $1 AND fecha_evento = $2`,
        [usuario_id, fecha]
      );

      if (check.rows.length > 0) {
        await db.query(
          `UPDATE ${tabla} SET link_canva=$1, fecha_guardado=NOW() WHERE usuario_id=$2 AND fecha_evento=$3`,
          [elementosJson, usuario_id, fecha]
        );

        if (modulo === "almuerzos") limpiarImagenesAlmuerzo(usuario_id);
        else if (modulosConLogicaMensual.includes(modulo)) limpiarMesesAnterioresModulosMensuales(tabla, usuario_id);
        else limpiarMesAnterior(tabla, usuario_id);

        return res.json({
          success: true,
          message: "Enlace actualizado exitosamente",
          id: check.rows[0].id,
        });
      } else {
        const ins = await db.query(
          `INSERT INTO ${tabla} (usuario_id, fecha_evento, link_canva, fecha_guardado) VALUES ($1, $2, $3, NOW()) RETURNING id`,
          [usuario_id, fecha, elementosJson]
        );

        if (modulo === "almuerzos") limpiarImagenesAlmuerzo(usuario_id);
        else if (modulosConLogicaMensual.includes(modulo)) limpiarMesesAnterioresModulosMensuales(tabla, usuario_id);
        else limpiarMesAnterior(tabla, usuario_id);

        return res.json({
          success: true,
          message: "Enlace guardado exitosamente",
          id: ins.rows[0].id,
        });
      }
    } else {
      const ins = await db.query(
        `INSERT INTO ${tabla} (usuario_id, fecha, elementos, titulo, fondo) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [usuario_id, fecha, elementosJson, titulo || "", fondo || ""]
      );

      console.log(`✅ Diseño guardado exitosamente en ${tabla}:`, {
        id: ins.rows[0].id,
        usuario_id,
        fecha,
        titulo
      });

      limpiarMesAnterior(tabla, usuario_id);
      return res.json({ success: true, message: "Diseño guardado exitosamente", id: ins.rows[0].id });
    }
  } catch (err) {
    console.error(`Error al guardar diseño en ${tabla}:`, err);
    return res.status(500).json({ error: `Error al guardar diseño: ${err.message}` });
  }
});

app.get("/api/:modulo/ultima-imagen/:usuario_id", async (req, res) => {
  const { modulo, usuario_id } = req.params;
  const tabla = tablaCanvaMap[modulo];
  const userId = Number.parseInt(usuario_id);

  if (!tabla) return res.status(400).json({ success: false, error: `Módulo no válido: ${modulo}` });
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const fechaHoy = new Date().toISOString().split("T")[0];

  try {
    if (modulo === "almuerzos") {
      const r = await db.query(
        `SELECT * FROM ${tabla} WHERE usuario_id = $1 AND fecha_evento >= CURRENT_DATE ORDER BY fecha_evento ASC LIMIT 1`,
        [userId]
      );

      if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para hoy" });

      let imagenValidada = null;
      try {
        imagenValidada = validarYLimpiarBase64(r.rows[0].imagen, false);
      } catch {
        imagenValidada = r.rows[0].imagen;
      }

      return res.json({
        success: true,
        hasImage: !!imagenValidada,
        imagen: imagenValidada,
        fechaEvento: r.rows[0].fecha_evento,
        esFuturo: false,
        mensaje: `Menú de hoy: ${r.rows[0].fecha_evento}`,
      });
    }

    if (modulosConLogicaMensual.includes(modulo)) {
      limpiarMesesAnterioresModulosMensuales(tabla, userId);

      const añoActual = new Date().getFullYear();
      const mesActual = new Date().getMonth() + 1;

      const query = `
        SELECT * FROM ${tabla} 
        WHERE usuario_id = $1 
        AND (
          EXTRACT(YEAR FROM fecha_evento) > $2 OR 
          (EXTRACT(YEAR FROM fecha_evento) = $2 AND EXTRACT(MONTH FROM fecha_evento) >= $3)
        )
        AND imagen IS NOT NULL AND imagen != ''
        ORDER BY 
          CASE WHEN fecha_evento >= $4::date THEN 0 ELSE 1 END,
          fecha_evento ASC
        LIMIT 1
      `;

      const r = await db.query(query, [userId, añoActual, mesActual, fechaHoy]);

      if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay eventos con imagen" });

      const resultado = r.rows[0];
      let imagenValidada = null;
      try {
        imagenValidada = validarYLimpiarBase64(resultado.imagen, false);
      } catch {
        imagenValidada = resultado.imagen;
      }

      const esFuturo = resultado.fecha_evento >= fechaHoy;
      const mensaje = esFuturo
        ? `Próximo ${modulo}: ${resultado.fecha_evento}`
        : `${modulo} de este mes: ${resultado.fecha_evento}`;

      return res.json({
        success: true,
        hasImage: true,
        imagen: imagenValidada,
        fechaEvento: resultado.fecha_evento,
        esFuturo,
        mensaje,
      });
    }

    const query = `
      (
        SELECT *, 'futuro' as tipo_busqueda
        FROM ${tabla} 
        WHERE usuario_id = $1 AND fecha_evento >= $2::date
        ORDER BY fecha_evento ASC
        LIMIT 1
      )
      UNION ALL
      (
        SELECT *, 'pasado' as tipo_busqueda
        FROM ${tabla} 
        WHERE usuario_id = $1 AND fecha_evento < $2::date
        ORDER BY fecha_guardado DESC
        LIMIT 1
      )
      LIMIT 1
    `;

    const r = await db.query(query, [userId, fechaHoy]);

    if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imágenes guardadas" });

    const resultado = r.rows[0];
    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(resultado.imagen, false);
    } catch {
      imagenValidada = resultado.imagen;
    }

    const esFuturo = resultado.tipo_busqueda === "futuro";
    const mensaje = esFuturo
      ? `Próximo evento: ${resultado.fecha_evento}`
      : `Última imagen guardada: ${resultado.fecha_evento}`;

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: resultado.fecha_evento,
      esFuturo,
      mensaje,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
});

// ========== ENDPOINTS DE ALMUERZOS ==========
app.post("/api/almuerzos/guardar-imagen", async (req, res) => {
  const { usuario_id, fecha_evento, imagen_base64 } = req.body;

  if (!usuario_id || !fecha_evento || !imagen_base64) {
    return res.status(400).json({
      success: false,
      error: "Datos faltantes: se requiere usuario_id, fecha_evento e imagen_base64"
    });
  }

  const userId = Number.parseInt(usuario_id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario debe ser un número válido"
    });
  }

  const imagenLimpia = validarYLimpiarBase64(imagen_base64, true);
  if (!imagenLimpia) {
    return res.status(400).json({
      success: false,
      error: "Imagen base64 inválida o corrupta"
    });
  }

  const base64SizeKB = Buffer.byteLength(imagenLimpia, 'utf8') / 1024;
  console.log("📦 Tamaño base64 original (Almuerzo):", base64SizeKB.toFixed(2), "KB");

  const imagenFinal = base64SizeKB > 1024
    ? comprimirBase64SiEsNecesario(imagenLimpia)
    : imagenLimpia;

  try {
    const check = await db.query(
      `SELECT id FROM almuerzos_canva WHERE usuario_id = $1 AND fecha_evento = $2`,
      [userId, fecha_evento]
    );

    if (check.rows.length > 0) {
      await db.query(
        `UPDATE almuerzos_canva SET imagen = $1, fecha_guardado = NOW() WHERE usuario_id = $2 AND fecha_evento = $3`,
        [imagenFinal, userId, fecha_evento]
      );

      limpiarImagenesAlmuerzo(userId);

      return res.json({
        success: true,
        message: "Imagen de almuerzo actualizada exitosamente",
        id: check.rows[0].id,
        fecha_evento: fecha_evento
      });
    } else {
      const ins = await db.query(
        `INSERT INTO almuerzos_canva (usuario_id, fecha_evento, imagen, fecha_guardado) VALUES ($1, $2, $3, NOW()) RETURNING id`,
        [userId, fecha_evento, imagenFinal]
      );

      limpiarImagenesAlmuerzo(userId);

      return res.json({
        success: true,
        message: "Imagen de almuerzo guardada exitosamente",
        id: ins.rows[0].id,
        fecha_evento: fecha_evento
      });
    }
  } catch (err) {
    console.error('Error al guardar imagen almuerzo:', err);
    return res.status(500).json({
      success: false,
      error: `Error al guardar imagen: ${err.message}`
    });
  }
});

app.get("/api/almuerzos/obtener-canva/:usuario_id/:year/:month", async (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario requerido y válido"
    });
  }

  const yearNum = Number.parseInt(year);
  const monthNum = Number.parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      error: "Año y mes deben ser números válidos"
    });
  }

  const query = `
    SELECT 
      id,
      fecha_evento,
      imagen,
      link_canva,
      fecha_guardado,
      EXTRACT(DAY FROM fecha_evento) as dia
    FROM almuerzos_canva 
    WHERE usuario_id = $1 
    AND EXTRACT(YEAR FROM fecha_evento) = $2 
    AND EXTRACT(MONTH FROM fecha_evento) = $3
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  try {
    const r = await db.query(query, [userId, yearNum, monthNum]);

    const imagenesProcessed = r.rows.map(canva => {
      const canvaProcessed = { ...canva };

      if (canva.imagen) {
        try {
          canvaProcessed.imagen_base64 = validarYLimpiarBase64(canva.imagen, false);
        } catch (error) {
          console.warn(`Error procesando imagen para fecha ${canva.fecha_evento}:`, error.message);
          canvaProcessed.imagen_base64 = null;
        }
      }

      if (canva.link_canva) {
        try {
          canvaProcessed.link_canva_parsed = JSON.parse(canva.link_canva);
        } catch {
          canvaProcessed.link_canva_parsed = canva.link_canva;
        }
      }

      return canvaProcessed;
    });

    res.json({
      success: true,
      imagenes: imagenesProcessed,
      count: imagenesProcessed.length,
      debug: {
        año: yearNum,
        mes: monthNum,
        usuario_id: userId
      }
    });
  } catch (err) {
    console.error('Error al obtener imágenes de almuerzos_canva:', err);
    return res.status(500).json({
      success: false,
      error: "Error en la base de datos",
      debug: err.message
    });
  }
});

app.get("/api/almuerzos/imagen/:usuario_id/:fecha_evento", async (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM almuerzos_canva 
    WHERE usuario_id = $1 AND fecha_evento = $2
    LIMIT 1
  `;

  try {
    const r = await db.query(query, [userId, fecha_evento]);

    if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este almuerzo" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(r.rows[0].imagen, false);
    } catch {
      imagenValidada = r.rows[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: r.rows[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
});

// ========== ENDPOINTS DE CURSOS ==========
app.post("/api/cursos/guardar-imagen", async (req, res) => {
  const { usuario_id, fecha_evento, imagen_base64 } = req.body;

  if (!usuario_id || !fecha_evento || !imagen_base64) {
    return res.status(400).json({
      success: false,
      error: "Datos faltantes: se requiere usuario_id, fecha_evento e imagen_base64"
    });
  }

  const userId = Number.parseInt(usuario_id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario debe ser un número válido"
    });
  }

  const imagenLimpia = validarYLimpiarBase64(imagen_base64, true);
  if (!imagenLimpia) {
    return res.status(400).json({
      success: false,
      error: "Imagen base64 inválida o corrupta"
    });
  }

  const base64SizeKB = Buffer.byteLength(imagenLimpia, 'utf8') / 1024;
  console.log("📦 Tamaño base64 original (Cursos):", base64SizeKB.toFixed(2), "KB");

  const imagenFinal = base64SizeKB > 1024
    ? comprimirBase64SiEsNecesario(imagenLimpia)
    : imagenLimpia;

  try {
    const check = await db.query(
      `SELECT id FROM cursos_canva WHERE usuario_id = $1 AND fecha_evento = $2`,
      [userId, fecha_evento]
    );

    if (check.rows.length > 0) {
      await db.query(
        `UPDATE cursos_canva SET imagen = $1, fecha_guardado = NOW() WHERE usuario_id = $2 AND fecha_evento = $3`,
        [imagenFinal, userId, fecha_evento]
      );

      limpiarMesesAnterioresModulosMensuales('cursos_canva', userId);

      return res.json({
        success: true,
        message: "Imagen de curso actualizada exitosamente",
        id: check.rows[0].id,
        fecha_evento: fecha_evento
      });
    } else {
      const ins = await db.query(
        `INSERT INTO cursos_canva (usuario_id, fecha_evento, imagen, fecha_guardado) VALUES ($1, $2, $3, NOW()) RETURNING id`,
        [userId, fecha_evento, imagenFinal]
      );

      limpiarMesesAnterioresModulosMensuales('cursos_canva', userId);

      return res.json({
        success: true,
        message: "Imagen de curso guardada exitosamente",
        id: ins.rows[0].id,
        fecha_evento: fecha_evento
      });
    }
  } catch (err) {
    console.error('Error al guardar imagen cursos:', err);
    return res.status(500).json({
      success: false,
      error: `Error al guardar imagen: ${err.message}`
    });
  }
});

app.get("/api/cursos/obtener-disenos/:usuario_id/:year/:month", async (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const yearNum = Number.parseInt(year);
  const monthNum = Number.parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      error: "Año y mes deben ser números válidos"
    });
  }

  const query = `
    SELECT 
      id,
      usuario_id,
      fecha,
      elementos,
      titulo,
      fondo,
      EXTRACT(DAY FROM fecha) as dia,
      EXTRACT(MONTH FROM fecha) as mes,
      EXTRACT(YEAR FROM fecha) as año
    FROM cursos_disenos 
    WHERE usuario_id = $1 
    AND EXTRACT(YEAR FROM fecha) = $2 
    AND EXTRACT(MONTH FROM fecha) = $3
    ORDER BY fecha ASC
  `;

  try {
    const r = await db.query(query, [userId, yearNum, monthNum]);

    const diseñosProcessed = r.rows.map(curso => {
      const diseñoProcessed = { ...curso };
      try {
        diseñoProcessed.elementos = JSON.parse(curso.elementos);
      } catch {
        diseñoProcessed.elementos = curso.elementos;
      }
      return diseñoProcessed;
    });

    res.json({
      success: true,
      diseños: diseñosProcessed,
      count: diseñosProcessed.length,
      debug: {
        año: yearNum,
        mes: monthNum,
        usuario: userId
      }
    });
  } catch (err) {
    console.error('Error en query de cursos:', err);
    return res.status(500).json({
      success: false,
      error: "Error en la base de datos",
      debug: err.message
    });
  }
});

app.get("/api/cursos/imagen/:usuario_id/:fecha_evento", async (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM cursos_canva 
    WHERE usuario_id = $1 AND fecha_evento = $2
    LIMIT 1
  `;

  try {
    const r = await db.query(query, [userId, fecha_evento]);

    if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este curso" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(r.rows[0].imagen, false);
    } catch {
      imagenValidada = r.rows[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: r.rows[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
});

app.get("/api/cursos/obtener-canva/:usuario_id/:year/:month", async (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario requerido y válido"
    });
  }

  const yearNum = Number.parseInt(year);
  const monthNum = Number.parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      error: "Año y mes deben ser números válidos"
    });
  }

  const query = `
    SELECT 
      id,
      fecha_evento,
      imagen,
      link_canva,
      fecha_guardado,
      EXTRACT(DAY FROM fecha_evento) as dia
    FROM cursos_canva 
    WHERE usuario_id = $1 
    AND EXTRACT(YEAR FROM fecha_evento) = $2 
    AND EXTRACT(MONTH FROM fecha_evento) = $3
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  try {
    const r = await db.query(query, [userId, yearNum, monthNum]);

    const imagenesProcessed = r.rows.map(canva => {
      const canvaProcessed = { ...canva };

      if (canva.imagen) {
        try {
          canvaProcessed.imagen_base64 = validarYLimpiarBase64(canva.imagen, false);
        } catch (error) {
          console.warn(`Error procesando imagen para fecha ${canva.fecha_evento}:`, error.message);
          canvaProcessed.imagen_base64 = null;
        }
      }

      if (canva.link_canva) {
        try {
          canvaProcessed.link_canva_parsed = JSON.parse(canva.link_canva);
        } catch {
          canvaProcessed.link_canva_parsed = canva.link_canva;
        }
      }

      return canvaProcessed;
    });

    res.json({
      success: true,
      imagenes: imagenesProcessed,
      count: imagenesProcessed.length,
      debug: {
        año: yearNum,
        mes: monthNum,
        usuario_id: userId
      }
    });
  } catch (err) {
    console.error('Error al obtener imágenes de cursos_canva:', err);
    return res.status(500).json({
      success: false,
      error: "Error en la base de datos",
      debug: err.message
    });
  }
});

// ========== ENDPOINTS DE RUNNING ==========
app.post("/api/running/guardar-imagen", async (req, res) => {
  const { usuario_id, fecha_evento, imagen_base64 } = req.body;

  if (!usuario_id || !fecha_evento || !imagen_base64) {
    return res.status(400).json({
      success: false,
      error: "Datos faltantes: se requiere usuario_id, fecha_evento e imagen_base64"
    });
  }

  const userId = Number.parseInt(usuario_id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario debe ser un número válido"
    });
  }

  const imagenLimpia = validarYLimpiarBase64(imagen_base64, true);
  if (!imagenLimpia) {
    return res.status(400).json({
      success: false,
      error: "Imagen base64 inválida o corrupta"
    });
  }

  const base64SizeKB = Buffer.byteLength(imagenLimpia, 'utf8') / 1024;
  console.log("📦 Tamaño base64 original (Running):", base64SizeKB.toFixed(2), "KB");

  const imagenFinal = base64SizeKB > 1024
    ? comprimirBase64SiEsNecesario(imagenLimpia)
    : imagenLimpia;

  try {
    const check = await db.query(
      `SELECT id FROM running_canva WHERE usuario_id = $1 AND fecha_evento = $2`,
      [userId, fecha_evento]
    );

    if (check.rows.length > 0) {
      await db.query(
        `UPDATE running_canva SET imagen = $1, fecha_guardado = NOW() WHERE usuario_id = $2 AND fecha_evento = $3`,
        [imagenFinal, userId, fecha_evento]
      );

      limpiarMesesAnterioresModulosMensuales('running_canva', userId);

      return res.json({
        success: true,
        message: "Imagen de running actualizada exitosamente",
        id: check.rows[0].id,
        fecha_evento: fecha_evento
      });
    } else {
      const ins = await db.query(
        `INSERT INTO running_canva (usuario_id, fecha_evento, imagen, fecha_guardado) VALUES ($1, $2, $3, NOW()) RETURNING id`,
        [userId, fecha_evento, imagenFinal]
      );

      limpiarMesesAnterioresModulosMensuales('running_canva', userId);

      return res.json({
        success: true,
        message: "Imagen de running guardada exitosamente",
        id: ins.rows[0].id,
        fecha_evento: fecha_evento
      });
    }
  } catch (err) {
    console.error('Error al guardar imagen running:', err);
    return res.status(500).json({
      success: false,
      error: `Error al guardar imagen: ${err.message}`
    });
  }
});

app.get("/api/running/obtener-disenos/:usuario_id/:year/:month", async (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT *, EXTRACT(DAY FROM fecha) as dia 
    FROM running_disenos 
    WHERE usuario_id = $1 
    AND EXTRACT(YEAR FROM fecha) = $2 
    AND EXTRACT(MONTH FROM fecha) = $3
    ORDER BY fecha ASC
  `;

  try {
    const r = await db.query(query, [userId, year, month]);

    const diseñosProcessed = r.rows.map(running => {
      const diseñoProcessed = { ...running };
      try {
        diseñoProcessed.elementos = JSON.parse(running.elementos);
      } catch {
        diseñoProcessed.elementos = running.elementos;
      }
      return diseñoProcessed;
    });

    res.json({
      success: true,
      diseños: diseñosProcessed,
      count: diseñosProcessed.length,
      debug: { año: year, mes: month }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en la base de datos", debug: err.message });
  }
});

app.get("/api/running/obtener-canva/:usuario_id/:year/:month", async (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      error: "ID de usuario requerido y válido"
    });
  }

  const yearNum = Number.parseInt(year);
  const monthNum = Number.parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      error: "Año y mes deben ser números válidos"
    });
  }

  const query = `
    SELECT 
      id,
      fecha_evento,
      imagen,
      link_canva,
      fecha_guardado,
      EXTRACT(DAY FROM fecha_evento) as dia
    FROM running_canva 
    WHERE usuario_id = $1 
    AND EXTRACT(YEAR FROM fecha_evento) = $2 
    AND EXTRACT(MONTH FROM fecha_evento) = $3
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  try {
    const r = await db.query(query, [userId, yearNum, monthNum]);

    const imagenesProcessed = r.rows.map(canva => {
      const canvaProcessed = { ...canva };

      if (canva.imagen) {
        try {
          canvaProcessed.imagen_base64 = validarYLimpiarBase64(canva.imagen, false);
        } catch (error) {
          console.warn(`Error procesando imagen para fecha ${canva.fecha_evento}:`, error.message);
          canvaProcessed.imagen_base64 = null;
        }
      }

      if (canva.link_canva) {
        try {
          canvaProcessed.link_canva_parsed = JSON.parse(canva.link_canva);
        } catch {
          canvaProcessed.link_canva_parsed = canva.link_canva;
        }
      }

      return canvaProcessed;
    });

    res.json({
      success: true,
      imagenes: imagenesProcessed,
      count: imagenesProcessed.length,
      debug: {
        año: yearNum,
        mes: monthNum,
        usuario_id: userId
      }
    });
  } catch (err) {
    console.error('Error al obtener imágenes de running_canva:', err);
    return res.status(500).json({
      success: false,
      error: "Error en la base de datos",
      debug: err.message
    });
  }
});

app.get("/api/running/imagen/:usuario_id/:fecha_evento", async (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);

  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM running_canva 
    WHERE usuario_id = $1 AND fecha_evento = $2
    LIMIT 1
  `;

  try {
    const r = await db.query(query, [userId, fecha_evento]);

    if (r.rows.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este evento de running" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(r.rows[0].imagen, false);
    } catch {
      imagenValidada = r.rows[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: r.rows[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
});

// ===== MENU PARA DROPDOWN =====
app.get("/api/menu", async (req, res) => {
  try {
    const r = await db.query("SELECT id, nombre, precio FROM menu WHERE activo = 1 ORDER BY nombre");
    res.json(r.rows);
  } catch (err) {
    console.error("Error obteniendo menú:", err);
    return res.status(500).json({ success: false, error: "Error en base de datos" });
  }
});

app.get("/api/precios-domicilio", async (req, res) => {
  try {
    const r = await db.query(`SELECT id, barrio, precio FROM precios_domicilio WHERE activo = 1 ORDER BY barrio`);
    res.json(r.rows);
  } catch (err) {
    console.error("Error obteniendo domicilios:", err);
    return res.status(500).json({ success: false, error: "Error en base de datos" });
  }
});

// ========== WEBSOCKET SETUP ==========
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Cliente WebSocket conectado");
  ws.send("¡Conexión WebSocket activa!");

  ws.on("message", (msg) => {
    console.log("Mensaje recibido:", msg);
    ws.send(`Eco: ${msg}`);
  });

  ws.on("close", () => {
    console.log("Cliente WebSocket desconectado");
  });
});

// ========== INICIAR SERVIDOR ==========
server.listen(port, '0.0.0.0', () => {
  console.log(`Backend + WebSocket corriendo en http://0.0.0.0:${port}`);
  console.log(`Endpoints disponibles:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/db-test`);
  console.log(`   POST /api/:modulo/guardar-diseno`);
  console.log(`   GET  /api/:modulo/ultima-imagen/:usuario_id`);
  console.log(`   POST /api/almuerzos/guardar-imagen`);
  console.log(`   GET  /api/almuerzos/obtener-canva/:usuario_id/:year/:month`);
  console.log(`   GET  /api/almuerzos/imagen/:usuario_id/:fecha_evento`);
  console.log(`   POST /api/cursos/guardar-imagen`);
  console.log(`   GET  /api/cursos/obtener-disenos/:usuario_id/:year/:month`);
  console.log(`   GET  /api/cursos/obtener-canva/:usuario_id/:year/:month`);
  console.log(`   GET  /api/cursos/imagen/:usuario_id/:fecha_evento`);
  console.log(`   POST /api/running/guardar-imagen`);
  console.log(`   GET  /api/running/obtener-disenos/:usuario_id/:year/:month`);
  console.log(`   GET  /api/running/obtener-canva/:usuario_id/:year/:month`);
  console.log(`   GET  /api/running/imagen/:usuario_id/:fecha_evento`);
  console.log(`WebSocket disponible en: ws://0.0.0.0:${port}/ws`);
});