const express = require("express")
const axios = require("axios")
const router = express.Router()

/**
 * Endpoint para intercambiar el código de autorización por un token de acceso
 * POST /api/canva/exchange-token
 */
router.post("/exchange-token", async (req, res) => {
  console.log("🔄 Recibida solicitud en /api/canva/exchange-token")
  console.log("📦 Cuerpo de la solicitud:", req.body)

  try {
    const { code, code_verifier } = req.body

    if (!code) {
      console.log("❌ Se requiere el código de autorización")
      return res.status(400).json({ error: "Se requiere el código de autorización" })
    }

    console.log(`🔑 Recibido código de autorización: ${code.substring(0, 10)}...`)
    console.log(`🔐 Code verifier recibido: ${code_verifier ? "✅ Sí" : "❌ No"}`)

    // IMPORTANTE: Asegúrate de que estos valores coincidan exactamente con los configurados en Canva
    const clientId = process.env.CANVA_CLIENT_ID || "OC-AZbHRDPO55sD"
    const clientSecret = process.env.CANVA_CLIENT_SECRET || "cnvcaLYYTqea1Pxm_eFgRxKUthYMIiPYLJyGTow7ue1pqudg49a630ca"
    const redirectUri = process.env.CANVA_REDIRECT_URI || "http://127.0.0.1:5000/oauth/redirect"

    console.log("🔑 Usando las siguientes credenciales:")
    console.log("- Client ID:", clientId)
    console.log("- Client Secret:", clientSecret ? "✅ Configurado" : "❌ No configurado")
    console.log("- Redirect URI:", redirectUri)

    // Datos para la solicitud a Canva
    const tokenData = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }

    // Si tenemos code_verifier, lo incluimos para PKCE
    if (code_verifier) {
      tokenData.code_verifier = code_verifier
    }

    console.log("🚀 Enviando solicitud a Canva para obtener token...")
    console.log("📦 Datos de la solicitud:", JSON.stringify(tokenData, null, 2))

    // SOLUCIÓN: Añadimos más información de depuración y manejamos mejor los errores
    try {
      // Hacer la solicitud a la API de Canva
      const response = await axios.post("https://api.canva.com/oauth/token", tokenData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("✅ Respuesta de Canva recibida:", response.status)
      console.log("📦 Datos de la respuesta:", response.data)

      // Guardar el token en la base de datos (opcional)
      const usuario_id = req.body.usuario_id || null
      if (usuario_id && req.app.locals.db) {
        try {
          const db = req.app.locals.db

          // Verificar si la tabla existe
          const checkTableQuery = `
            SELECT COUNT(*) as count FROM information_schema.tables 
            WHERE table_schema = 'healthybite' 
            AND table_name = 'canva_tokens';
          `

          db.query(checkTableQuery, async (err, result) => {
            if (err) {
              console.error("❌ Error al verificar la existencia de la tabla:", err)
            } else {
              const tableExists = result[0].count > 0

              if (!tableExists) {
                console.log("📝 La tabla canva_tokens no existe, creándola...")

                const createTableQuery = `
                  CREATE TABLE canva_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT NOT NULL,
                    access_token TEXT NOT NULL,
                    expires_in INT NOT NULL,
                    created_at DATETIME NOT NULL,
                    UNIQUE KEY (usuario_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                  )
                `

                db.query(createTableQuery, (err, result) => {
                  if (err) {
                    console.error("❌ Error al crear la tabla:", err)
                  } else {
                    console.log("✅ Tabla canva_tokens creada con éxito")
                    saveTokenToDB()
                  }
                })
              } else {
                saveTokenToDB()
              }
            }
          })

          function saveTokenToDB() {
            // Ahora guardamos el token
            const saveTokenQuery = `
              INSERT INTO canva_tokens (usuario_id, access_token, expires_in, created_at)
              VALUES (?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE 
                access_token = VALUES(access_token), 
                expires_in = VALUES(expires_in), 
                created_at = NOW()
            `

            db.query(
              saveTokenQuery,
              [usuario_id, response.data.access_token, response.data.expires_in],
              (err, result) => {
                if (err) {
                  console.error("❌ Error al guardar token en BD:", err)
                } else {
                  console.log("✅ Token guardado en BD para usuario:", usuario_id)
                }
              },
            )
          }
        } catch (dbError) {
          console.error("❌ Error al acceder a la base de datos:", dbError)
        }
      }

      // Devolver el token de acceso al frontend
      return res.json({
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
      })
    } catch (apiError) {
      console.error("❌ Error en la respuesta de Canva:", apiError.message)

      // Información detallada del error para depuración
      if (apiError.response) {
        console.error("📝 Detalles del error:")
        console.error("- Status:", apiError.response.status)
        console.error("- Headers:", apiError.response.headers)
        console.error("- Data:", JSON.stringify(apiError.response.data, null, 2))

        return res.status(apiError.response.status).json({
          error: "Error al intercambiar el código",
          details: apiError.response.data,
          status: apiError.response.status,
        })
      } else {
        return res.status(500).json({
          error: "Error al conectar con Canva",
          message: apiError.message,
        })
      }
    }
  } catch (error) {
    console.error("❌ Error general en el proceso:", error.message)
    return res.status(500).json({
      error: "Error al procesar la autenticación",
      message: error.message,
    })
  }
})

/**
 * Endpoint para verificar la validez de un token
 * POST /api/canva/verify-token
 */
router.post("/verify-token", async (req, res) => {
  console.log("🔍 Recibida solicitud en /api/canva/verify-token")

  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ error: "Se requiere un token" })
    }

    const response = await axios.get("https://api.canva.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.json({ valid: true, user: response.data })
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message)

    if (error.response && [401, 403].includes(error.response.status)) {
      return res.json({ valid: false })
    }

    return res.status(500).json({
      error: "Error al verificar el token",
      details: error.response?.data || error.message,
    })
  }
})

/**
 * Endpoint para obtener la URL del editor de Canva
 * GET /api/canva/editor-url
 */
router.get("/editor-url", async (req, res) => {
  console.log("🎨 Recibida solicitud en /api/canva/editor-url")

  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Se requiere un token de autenticación" })
    }

    // Llamada a la API de Canva para obtener la URL del editor
    const response = await axios.get("https://api.canva.com/v1/editor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.json(response.data)
  } catch (error) {
    console.error("❌ Error al obtener URL del editor:", error.response?.data || error.message)

    return res.status(error.response?.status || 500).json({
      error: "Error al obtener la URL del editor",
      details: error.response?.data || error.message,
    })
  }
})

// Ruta de prueba para verificar que las rutas de Canva están registradas
router.get("/test", (req, res) => {
  res.json({ message: "✅ Las rutas de Canva están funcionando correctamente" })
})

module.exports = router
