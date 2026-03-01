"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CanvaEditor.module.css"

function CanvasEditor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [canvaUrl, setCanvaUrl] = useState(null)

  useEffect(() => {
    const checkCanvaAuth = async () => {
      const token = localStorage.getItem("canvaToken")
      const tokenDataStr = localStorage.getItem("canvaTokenData")

      if (!token) {
        navigate("/dashboard")
        return
      }

      if (tokenDataStr) {
        try {
          const tokenData = JSON.parse(tokenDataStr)
          if (tokenData.expires_at && tokenData.expires_at < Date.now()) {
            localStorage.removeItem("canvaToken")
            localStorage.removeItem("canvaTokenData")
            navigate("/dashboard")
            return
          }
        } catch (e) {}
      }

      try {
        // Verificar que el token sea válido
        const verifyResponse = await fetch("/api/canva/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const verifyData = await verifyResponse.json()

        if (!verifyData.valid) {
          localStorage.removeItem("canvaToken")
          localStorage.removeItem("canvaTokenData")
          navigate("/dashboard")
          return
        }

        // Obtener la URL del editor de Canva (debes implementar esto en tu backend si usas Canva Button)
        // Por ahora, puedes redirigir a la página principal de Canva o a un diseño específico
        setCanvaUrl("https://www.canva.com/") // O la URL que obtengas de tu backend
      } catch (error) {
        setError(error.message || "Error al cargar el editor de Canva")
      } finally {
        setLoading(false)
      }
    }

    checkCanvaAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="canvas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando el editor de Canva...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="canvas-error">
        <h2>Error al cargar el editor</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>Volver al Dashboard</button>
      </div>
    )
  }

  return (
    <div className="canvas-editor-container">
      {canvaUrl ? (
        <div>
          <h2>Editor de Canva</h2>
          <p>Haz clic en el botón para abrir Canva y editar tu diseño.</p>
          <a
            href={canvaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="canva-open-btn"
          >
            Abrir Canva
          </a>
        </div>
      ) : (
        <div className="canvas-fallback">
          <h2>No se pudo cargar el editor de Canva</h2>
          <p>Por favor, intenta nuevamente más tarde.</p>
          <button onClick={() => navigate("/dashboard")}>Volver al Dashboard</button>
        </div>
      )}
    </div>
  )
}

export default CanvasEditor
