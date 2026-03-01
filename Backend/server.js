require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const sharp = require("sharp");

const app = express();
const port = 5000;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthybite",
  waitForConnections: true,
  connectionLimit: 10,
});

const tablaCanvaMap = {
  almuerzos: "almuerzos_Canva",
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

function limpiarImagenesAlmuerzo(usuario_id) {
  const q = `
    DELETE FROM almuerzos_Canva
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id FROM almuerzos_Canva
        WHERE usuario_id = ? AND fecha_guardado <= NOW()
        ORDER BY fecha_guardado DESC
        LIMIT 5
      ) AS top5
    ) AND usuario_id = ?;
  `;
  db.query(q, [usuario_id, usuario_id], (err, r) => {
    if (!err) console.log(`Almuerzo: ${r.affectedRows} eliminadas`);
    else console.error(`Error al limpiar almuerzos: ${err.message}`);
  });
}

function limpiarMesesAnterioresModulosMensuales(tabla, usuario_id) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const q = `
    DELETE FROM ${tabla}
    WHERE usuario_id = ? AND (
      YEAR(fecha_evento) < ? OR 
      (YEAR(fecha_evento) = ? AND MONTH(fecha_evento) < ?)
    );
  `;
  db.query(q, [usuario_id, currentYear, currentYear, currentMonth], (err, r) => {
    if (!err) console.log(`Limpieza en ${tabla}: ${r.affectedRows} eventos eliminados`);
    else console.error(`Error al limpiar ${tabla}: ${err.message}`);
  });
}

function limpiarMesAnterior(tabla, usuario_id) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const q = `
    DELETE FROM ${tabla}
    WHERE usuario_id = ? AND (YEAR(fecha) < ? OR (YEAR(fecha) = ? AND MONTH(fecha) < ?));
  `;
  db.query(q, [usuario_id, currentYear, currentYear, currentMonth], (err, r) => {
    if (!err) console.log(`Limpieza en ${tabla}: ${r.affectedRows} eliminadas`);
    else console.error(`Error al limpiar ${tabla}: ${err.message}`);
  });
}

// ========== ENDPOINT DE AUTENTICACIÓN ==========
app.post("/api/auth/login", (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({
      success: false,
      message: "Usuario y contraseña son requeridos"
    });
  }

  const query = `
   SELECT id, nombre_usuario, nombre_completo, email
  FROM usuarios
  WHERE nombre_usuario = ? AND contraseña = ?
  LIMIT 1
  `;

  db.query(query, [usuario, contraseña], (err, results) => {
    if (err) {
      console.error('Error en consulta de login:', err);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    const usuarioData = results[0];

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuarioData.id,
        usuario: usuarioData.usuario,
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        tipo_usuario: usuarioData.tipo_usuario
      }
    });
  });
});

// ========== ENDPOINT PARA PRUEBA DE BASE DE DATOS ==========
app.get("/api/db-test", (req, res) => {
  db.query("SELECT 1 as test", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Error de conexión a la base de datos",
        details: err.message
      });
    }
    res.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      timestamp: new Date().toISOString()
    });
  });
});

// ========== ENDPOINTS PRINCIPALES ==========
app.post("/api/:modulo/guardar-diseno", (req, res) => {
  const { modulo } = req.params;
  const { usuario_id, fecha, elementos, titulo, fondo } = req.body;

  let tabla = tablaDisenosMap[modulo] || tablaCanvaMap[modulo];
  if (!tabla) return res.status(400).json({ error: `Módulo no válido para diseños: ${modulo}` });
  if (!usuario_id || !fecha || !elementos) return res.status(400).json({ error: "Datos faltantes" });

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj)) return res.status(400).json({ error: "Fecha inválida" });

  const elementosJson = typeof elementos === "string" ? elementos : JSON.stringify(elementos);

  if (Object.values(tablaCanvaMap).includes(tabla)) {
    db.query(`SELECT id FROM ${tabla} WHERE usuario_id = ? AND fecha_evento = ?`, [usuario_id, fecha], (err, results) => {
      if (err) return res.status(500).json({ error: "Error verificando existencia" });

      const guardar = (query, params, updated) => {
        db.query(query, params, (err, result) => {
          if (err) return res.status(500).json({ error: `Error al guardar enlace: ${err.message}` });

          if (modulo === "almuerzos") limpiarImagenesAlmuerzo(usuario_id);
          else if (modulosConLogicaMensual.includes(modulo)) limpiarMesesAnterioresModulosMensuales(tabla, usuario_id);
          else limpiarMesAnterior(tabla, usuario_id);

          res.json({
            success: true,
            message: updated ? "Enlace actualizado exitosamente" : "Enlace guardado exitosamente",
            id: updated ? results[0].id : result.insertId,
          });
        });
      };

      if (results.length > 0) {
        const q = `UPDATE ${tabla} SET link_canva=?, fecha_guardado=NOW() WHERE usuario_id=? AND fecha_evento=?`;
        guardar(q, [elementosJson, usuario_id, fecha], true);
      } else {
        const q = `INSERT INTO ${tabla} (usuario_id, fecha_evento, link_canva, fecha_guardado) VALUES (?, ?, ?, NOW())`;
        guardar(q, [usuario_id, fecha, elementosJson], false);
      }
    });
  } else {
    const q = `INSERT INTO ${tabla} (usuario_id, fecha, elementos, titulo, fondo) VALUES (?, ?, ?, ?, ?)`;
    db.query(q, [usuario_id, fecha, elementosJson, titulo || "", fondo || ""], (err, result) => {
      if (err) {
        console.error(`Error al guardar diseño en ${tabla}:`, err);
        return res.status(500).json({ error: `Error al guardar diseño: ${err.message}` });
      }

      console.log(`✅ Diseño guardado exitosamente en ${tabla}:`, {
        id: result.insertId,
        usuario_id,
        fecha,
        titulo
      });

      limpiarMesAnterior(tabla, usuario_id);
      res.json({ success: true, message: "Diseño guardado exitosamente", id: result.insertId });
    });
  }
});

app.get("/api/:modulo/ultima-imagen/:usuario_id", (req, res) => {
  const { modulo, usuario_id } = req.params;
  const tabla = tablaCanvaMap[modulo];
  const userId = Number.parseInt(usuario_id);

  if (!tabla) return res.status(400).json({ success: false, error: `Módulo no válido: ${modulo}` });
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const fechaHoy = new Date().toISOString().split("T")[0];

  if (modulo === "almuerzos") {
    db.query(
      `SELECT * FROM ${tabla} WHERE usuario_id = ? ORDER BY fecha_guardado DESC LIMIT 1`,
      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
        if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imágenes guardadas" });

        let imagenValidada = null;
        try {
          imagenValidada = validarYLimpiarBase64(results[0].imagen, false);
        } catch {
          imagenValidada = results[0].imagen;
        }

        res.json({
          success: true,
          hasImage: !!imagenValidada,
          imagen: imagenValidada,
          fechaEvento: results[0].fecha_evento,
          esFuturo: false,
          mensaje: `Última imagen de almuerzo: ${results[0].fecha_evento}`,
        });
      }
    );
    return;
  }

  if (modulosConLogicaMensual.includes(modulo)) {
    limpiarMesesAnterioresModulosMensuales(tabla, userId);

    const añoActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;

    const query = `
      SELECT * FROM ${tabla} 
      WHERE usuario_id = ? 
      AND (
        YEAR(fecha_evento) > ? OR 
        (YEAR(fecha_evento) = ? AND MONTH(fecha_evento) >= ?)
      )
      AND imagen IS NOT NULL AND imagen != ''
      ORDER BY 
        CASE WHEN DATE(fecha_evento) >= ? THEN 0 ELSE 1 END,
        fecha_evento ASC
      LIMIT 1
    `;

    db.query(query, [userId, añoActual, añoActual, mesActual, fechaHoy], (err, results) => {
      if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
      if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay eventos con imagen" });

      const resultado = results[0];
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

      res.json({
        success: true,
        hasImage: true,
        imagen: imagenValidada,
        fechaEvento: resultado.fecha_evento,
        esFuturo,
        mensaje,
      });
    });
    return;
  }

  const query = `
    (
      SELECT *, 'futuro' as tipo_busqueda
      FROM ${tabla} 
      WHERE usuario_id = ? AND DATE(fecha_evento) >= ?
      ORDER BY fecha_evento ASC
      LIMIT 1
    )
    UNION ALL
    (
      SELECT *, 'pasado' as tipo_busqueda
      FROM ${tabla} 
      WHERE usuario_id = ? AND DATE(fecha_evento) < ?
      ORDER BY fecha_guardado DESC
      LIMIT 1
    )
    LIMIT 1
  `;

  db.query(query, [userId, fechaHoy, userId, fechaHoy], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imágenes guardadas" });

    const resultado = results[0];
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
  });
});

// ========== ENDPOINTS DE ALMUERZOS ==========
app.post("/api/almuerzos/guardar-imagen", (req, res) => {
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

  const checkQuery = `SELECT id FROM almuerzos_Canva WHERE usuario_id = ? AND fecha_evento = ?`;

  db.query(checkQuery, [userId, fecha_evento], (err, results) => {
    if (err) {
      console.error('Error al verificar existencia:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error al verificar existencia en base de datos" 
      });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE almuerzos_Canva 
        SET imagen = ?, fecha_guardado = NOW() 
        WHERE usuario_id = ? AND fecha_evento = ?
      `;

      db.query(updateQuery, [imagenFinal, userId, fecha_evento], (err, result) => {
        if (err) {
          console.error('Error al actualizar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al actualizar imagen: ${err.message}` 
          });
        }

        limpiarImagenesAlmuerzo(userId);

        res.json({
          success: true,
          message: "Imagen de almuerzo actualizada exitosamente",
          id: results[0].id,
          fecha_evento: fecha_evento
        });
      });
    } else {
      const insertQuery = `
        INSERT INTO almuerzos_Canva (usuario_id, fecha_evento, imagen, fecha_guardado) 
        VALUES (?, ?, ?, NOW())
      `;

      db.query(insertQuery, [userId, fecha_evento, imagenFinal], (err, result) => {
        if (err) {
          console.error('Error al insertar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al guardar imagen: ${err.message}` 
          });
        }

        limpiarImagenesAlmuerzo(userId);

        res.json({
          success: true,
          message: "Imagen de almuerzo guardada exitosamente",
          id: result.insertId,
          fecha_evento: fecha_evento
        });
      });
    }
  });
});

app.get("/api/almuerzos/obtener-canva/:usuario_id/:year/:month", (req, res) => {
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
      DAY(fecha_evento) as dia
    FROM almuerzos_Canva 
    WHERE usuario_id = ? 
    AND YEAR(fecha_evento) = ? 
    AND MONTH(fecha_evento) = ?
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  db.query(query, [userId, yearNum, monthNum], (err, results) => {
    if (err) {
      console.error('Error al obtener imágenes de almuerzos_Canva:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error en la base de datos", 
        debug: err.message 
      });
    }

    const imagenesProcessed = results.map(canva => {
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
  });
});

app.get("/api/almuerzos/imagen/:usuario_id/:fecha_evento", (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);
  
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM almuerzos_Canva 
    WHERE usuario_id = ? AND fecha_evento = ?
    LIMIT 1
  `;

  db.query(query, [userId, fecha_evento], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este almuerzo" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(results[0].imagen, false);
    } catch {
      imagenValidada = results[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: results[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  });
});

// ========== ENDPOINTS DE CURSOS ==========
app.post("/api/cursos/guardar-imagen", (req, res) => {
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

  const checkQuery = `SELECT id FROM cursos_canva WHERE usuario_id = ? AND fecha_evento = ?`;

  db.query(checkQuery, [userId, fecha_evento], (err, results) => {
    if (err) {
      console.error('Error al verificar existencia:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error al verificar existencia en base de datos" 
      });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE cursos_canva 
        SET imagen = ?, fecha_guardado = NOW() 
        WHERE usuario_id = ? AND fecha_evento = ?
      `;

      db.query(updateQuery, [imagenFinal, userId, fecha_evento], (err, result) => {
        if (err) {
          console.error('Error al actualizar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al actualizar imagen: ${err.message}` 
          });
        }

        limpiarMesesAnterioresModulosMensuales('cursos_canva', userId);

        res.json({
          success: true,
          message: "Imagen de curso actualizada exitosamente",
          id: results[0].id,
          fecha_evento: fecha_evento
        });
      });
    } else {
      const insertQuery = `
        INSERT INTO cursos_canva (usuario_id, fecha_evento, imagen, fecha_guardado) 
        VALUES (?, ?, ?, NOW())
      `;

      db.query(insertQuery, [userId, fecha_evento, imagenFinal], (err, result) => {
        if (err) {
          console.error('Error al insertar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al guardar imagen: ${err.message}` 
          });
        }

        limpiarMesesAnterioresModulosMensuales('cursos_canva', userId);

        res.json({
          success: true,
          message: "Imagen de curso guardada exitosamente",
          id: result.insertId,
          fecha_evento: fecha_evento
        });
      });
    }
  });
});

app.get("/api/cursos/obtener-disenos/:usuario_id/:year/:month", (req, res) => {
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
      DAY(fecha) as dia,
      MONTH(fecha) as mes,
      YEAR(fecha) as año
    FROM cursos_disenos 
    WHERE usuario_id = ? 
    AND YEAR(fecha) = ? 
    AND MONTH(fecha) = ?
    ORDER BY fecha ASC
  `;

  db.query(query, [userId, yearNum, monthNum], (err, results) => {
    if (err) {
      console.error('Error en query de cursos:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error en la base de datos", 
        debug: err.message 
      });
    }

    console.log(`📚 Diseños de cursos encontrados:`, results.length);
    if (results.length > 0) {
      console.log('Ejemplo de diseño:', results[0]);
    }

    const diseñosProcessed = results.map(curso => {
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
  });
});

app.get("/api/cursos/imagen/:usuario_id/:fecha_evento", (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM cursos_canva 
    WHERE usuario_id = ? AND fecha_evento = ?
    LIMIT 1
  `;

  db.query(query, [userId, fecha_evento], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este curso" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(results[0].imagen, false);
    } catch {
      imagenValidada = results[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: results[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  });
});

app.get("/api/cursos/obtener-canva/:usuario_id/:year/:month", (req, res) => {
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
      DAY(fecha_evento) as dia
    FROM cursos_canva 
    WHERE usuario_id = ? 
    AND YEAR(fecha_evento) = ? 
    AND MONTH(fecha_evento) = ?
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  db.query(query, [userId, yearNum, monthNum], (err, results) => {
    if (err) {
      console.error('Error al obtener imágenes de cursos_canva:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error en la base de datos", 
        debug: err.message 
      });
    }

    const imagenesProcessed = results.map(canva => {
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
  });
});

// ========== ENDPOINTS DE RUNNING ==========
app.post("/api/running/guardar-imagen", (req, res) => {
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

  const checkQuery = `SELECT id FROM running_canva WHERE usuario_id = ? AND fecha_evento = ?`;

  db.query(checkQuery, [userId, fecha_evento], (err, results) => {
    if (err) {
      console.error('Error al verificar existencia:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error al verificar existencia en base de datos" 
      });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE running_canva 
        SET imagen = ?, fecha_guardado = NOW() 
        WHERE usuario_id = ? AND fecha_evento = ?
      `;

      db.query(updateQuery, [imagenFinal, userId, fecha_evento], (err, result) => {
        if (err) {
          console.error('Error al actualizar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al actualizar imagen: ${err.message}` 
          });
        }

        limpiarMesesAnterioresModulosMensuales('running_canva', userId);

        res.json({
          success: true,
          message: "Imagen de running actualizada exitosamente",
          id: results[0].id,
          fecha_evento: fecha_evento
        });
      });
    } else {
      const insertQuery = `
        INSERT INTO running_canva (usuario_id, fecha_evento, imagen, fecha_guardado) 
        VALUES (?, ?, ?, NOW())
      `;

      db.query(insertQuery, [userId, fecha_evento, imagenFinal], (err, result) => {
        if (err) {
          console.error('Error al insertar imagen:', err);
          return res.status(500).json({ 
            success: false, 
            error: `Error al guardar imagen: ${err.message}` 
          });
        }

        limpiarMesesAnterioresModulosMensuales('running_canva', userId);

        res.json({
          success: true,
          message: "Imagen de running guardada exitosamente",
          id: result.insertId,
          fecha_evento: fecha_evento
        });
      });
    }
  });
});

app.get("/api/running/obtener-disenos/:usuario_id/:year/:month", (req, res) => {
  const { usuario_id, year, month } = req.params;
  const userId = Number.parseInt(usuario_id);
  
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT *, DAY(fecha) as dia 
    FROM running_disenos 
    WHERE usuario_id = ? 
    AND YEAR(fecha) = ? 
    AND MONTH(fecha) = ?
    ORDER BY fecha ASC
  `;

  db.query(query, [userId, year, month], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos", debug: err.message });

    const diseñosProcessed = results.map(running => {
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
  });
});

app.get("/api/running/obtener-canva/:usuario_id/:year/:month", (req, res) => {
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
      DAY(fecha_evento) as dia
    FROM running_canva 
    WHERE usuario_id = ? 
    AND YEAR(fecha_evento) = ? 
    AND MONTH(fecha_evento) = ?
    AND (imagen IS NOT NULL OR link_canva IS NOT NULL)
    ORDER BY fecha_evento ASC
  `;

  db.query(query, [userId, yearNum, monthNum], (err, results) => {
    if (err) {
      console.error('Error al obtener imágenes de running_canva:', err);
      return res.status(500).json({ 
        success: false, 
        error: "Error en la base de datos", 
        debug: err.message 
      });
    }

    const imagenesProcessed = results.map(canva => {
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
  });
});

app.get("/api/running/imagen/:usuario_id/:fecha_evento", (req, res) => {
  const { usuario_id, fecha_evento } = req.params;
  const userId = Number.parseInt(usuario_id);
  
  if (!usuario_id || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: "ID de usuario requerido y válido" });
  }

  const query = `
    SELECT imagen, fecha_evento FROM running_canva 
    WHERE usuario_id = ? AND fecha_evento = ?
    LIMIT 1
  `;

  db.query(query, [userId, fecha_evento], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, hasImage: false, message: "No hay imagen para este evento de running" });

    let imagenValidada = null;
    try {
      imagenValidada = validarYLimpiarBase64(results[0].imagen, false);
    } catch {
      imagenValidada = results[0].imagen;
    }

    if (!imagenValidada) return res.json({ success: false, hasImage: false, message: "Imagen corrupta" });

    res.json({
      success: true,
      hasImage: true,
      imagen: imagenValidada,
      fechaEvento: results[0].fecha_evento,
      debug: {
        imagenLength: imagenValidada.length,
        tipoImagen: "base64"
      }
    });
  });
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
server.listen(port, () => {
  console.log(`Backend + WebSocket corriendo en http://localhost:${port}`);
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
  console.log(`WebSocket disponible en: ws://localhost:${port}/ws`);
});