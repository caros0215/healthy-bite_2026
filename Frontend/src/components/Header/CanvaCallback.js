"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

function CanvaCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState("Procesando tu inicio de sesión con Canva...")
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    // Extrae los parámetros de la URL
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search)
      return {
        code: params.get("code"),
        error: params.get("error"),
        error_description: params.get("error_description"),
        state: params.get("state"),
      }
    }

    // Intercambia el código por el token de acceso
    const exchangeCodeForToken = async (code) => {
      try {
        if (!isMounted) return
        setStatus("Intercambiando código por token de acceso...")

        // Recupera el code_verifier del localStorage
        const codeVerifier = localStorage.getItem("canva_code_verifier")
        if (!codeVerifier) {
          setError("No se encontró el code_verifier en localStorage")
          setStatus("Error: Falta code_verifier")
          setTimeout(() => navigate("/dashboard"), 2000)
          return
        }

        // Recupera el usuario (opcional)
        const usuarioData = localStorage.getItem("usuario")
        let usuario_id = null
        if (usuarioData) {
          try {
            if (usuarioData.startsWith("{")) {
              const userData = JSON.parse(usuarioData)
              usuario_id = userData.id
            }
          } catch (e) {
            // Si no es JSON, ignora
          }
        }

        // Llama a tu backend para intercambiar el código por el token
        const response = await fetch("http://localhost:5000/api/canva/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            usuario_id,
            code_verifier: codeVerifier,
          }),
        })

        if (!isMounted) return

        if (!response.ok) {
          const errorText = await response.text()
          setError(`Error al intercambiar el código: ${errorText}`)
          setStatus("Error al intercambiar el código")
          setTimeout(() => navigate("/dashboard"), 2000)
          return
        }

        const data = await response.json()

        if (data.access_token) {
          // Guarda el token y su expiración
          const tokenData = {
            access_token: data.access_token,
            expires_at: Date.now() + (data.expires_in || 3600) * 1000,
            token_type: data.token_type,
          }
          localStorage.setItem("canvaToken", data.access_token)
          localStorage.setItem("canvaTokenData", JSON.stringify(tokenData))
          localStorage.removeItem("canva_code_verifier")

          setTimeout(() => {
            if (isMounted) {
              setStatus("Autenticación exitosa. Redirigiendo al editor...")
              navigate("/canvas")
            }
          }, 500)
        } else {
          setError("No se recibió un token de acceso válido")
          setStatus("Error: No se recibió un token de acceso válido")
          setTimeout(() => navigate("/dashboard"), 2000)
        }
      } catch (error) {
        if (!isMounted) return
        setError(error.message)
        setStatus(`Error: ${error.message}`)
        setTimeout(() => navigate("/dashboard"), 2000)
      }
    }

    // Maneja el callback de Canva OAuth
    const handleCallback = async () => {
      const { code, error, error_description, state } = getQueryParams()
      const savedState = localStorage.getItem("canva_auth_state")

      if (state && savedState && state !== savedState) {
        setError("Error de seguridad: El estado no coincide")
        setStatus("Error de seguridad: Solicitud inválida")
        setTimeout(() => navigate("/dashboard"), 2000)
        return
      }
      localStorage.removeItem("canva_auth_state")

      if (error) {
        setError(error_description || error)
        setStatus(`Error de autenticación: ${error_description || error}`)
        setTimeout(() => navigate("/dashboard"), 2000)
        return
      }

      if (code) {
        await exchangeCodeForToken(code)
      } else {
        setError("No se recibió código de autorización")
        setStatus("Error: No se recibió código de autorización")
        setTimeout(() => navigate("/dashboard"), 2000)
      }
    }

    // Verifica si ya hay un token válido
    const checkExistingToken = async () => {
      const existingToken = localStorage.getItem("canvaToken")
      const tokenDataStr = localStorage.getItem("canvaTokenData")
      if (existingToken && tokenDataStr) {
        try {
          const tokenData = JSON.parse(tokenDataStr)
          if (tokenData.expires_at && tokenData.expires_at > Date.now()) {
            // Opcional: verifica el token con el backend
            try {
              const response = await fetch("http://localhost:5000/api/canva/verify-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: existingToken }),
              })
              const data = await response.json()
              if (data.valid) {
                navigate("/canvas")
                return true
              }
            } catch (error) {
              // Si falla la verificación, sigue con el flujo normal
            }
          }
        } catch (error) {
          // Si falla el parseo, sigue con el flujo normal
        }
      }
      localStorage.removeItem("canvaToken")
      localStorage.removeItem("canvaTokenData")
      return false
    }

    // Flujo principal
    checkExistingToken().then((isValid) => {
      if (!isValid) handleCallback()
    })

    return () => { isMounted = false }
  }, [navigate, location])

  return (
    <div className="canva-callback-container">
      <div className="callback-content">
        <h2>{status}</h2>
        <div className="loading-spinner"></div>
        <p>Por favor espera mientras completamos el proceso de autenticación.</p>
        {error && (
          <div className="error-container">
            <h3>Error:</h3>
            <p>{error}</p>
            <p>
              Verifica que el servidor esté ejecutándose en http://localhost:5000 y que las rutas de API estén correctamente configuradas.
            </p>
            <button onClick={() => navigate("/dashboard")}>Volver al Dashboard</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CanvaCallback
