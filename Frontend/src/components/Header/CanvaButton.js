// No changes needed in the JSX file
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./CanvaButton.css"
import imagen1 from "../../assets/images/canva.png" // Asegúrate de que la ruta sea correcta

export default function CanvaIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("")
  const [userId, setUserId] = useState("1") // Por defecto usamos ID 1, deberías obtenerlo de tu sistema de autenticación

  // Función para abrir Canva directamente
  const openCanva = () => {
    // URL a la página principal de Canva
    window.open("https://www.canva.com/", "_blank")
  }

  // Función para guardar el diseño en la base de datos
  const saveDesignToDatabase = async (designUrl) => {
    if (!designUrl || !designUrl.includes("canva.com")) {
      setSaveStatus("error")
      setErrorMessage("Por favor, ingresa un enlace válido de Canva.")
      return false
    }

    setIsLoading(true)
    setSaveStatus(null)

    try {
      // Llamada a tu API existente
      const response = await axios.post("http://localhost:5000/api/canva/guardar-diseno", {
        usuario_id: userId,
        designUrl: designUrl,
      })

      console.log("✅ Respuesta del servidor:", response.data)

      if (response.data.success) {
        setSaveStatus("success")
        return true
      } else {
        setSaveStatus("error")
        setErrorMessage(response.data.error || "Error al guardar el diseño")
        return false
      }
    } catch (error) {
      console.error("❌ Error al guardar el diseño:", error)
      setSaveStatus("error")
      setErrorMessage(error.response?.data?.error || "Error al conectar con el servidor. Verifica tu conexión.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const input = document.getElementById("design-url-input")
    const url = input?.value?.trim()

    const success = await saveDesignToDatabase(url)

    if (success) {
      // Limpiar el input si se guardó correctamente
      if (input) input.value = ""
    }
  }

  // Función para obtener el ID de usuario actual
  useEffect(() => {
    // Aquí deberías obtener el ID del usuario autenticado
    // Por ejemplo, desde localStorage, contexto de autenticación, etc.
    const getUserId = () => {
      // Ejemplo: obtener de localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData && userData.id) {
            setUserId(userData.id)
          }
        } catch (e) {
          console.error("Error al parsear datos de usuario:", e)
        }
      }
    }

    getUserId()
  }, [])

  return (
    <div className="canva-integration-wrapper">
      <h2 className="main-title">Crea y guarda tus diseños con Canva</h2>

      {/* Contenedor de dos columnas */}
      <div className="two-column-layout">
        {/* Columna izquierda: Diseña con Canva */}
        <div className="column left-column">
          <div className="card">
            <h3>Diseña con Canva</h3>
            <p>Crea diseños profesionales en minutos con la plataforma líder en diseño gráfico online.</p>

            <div className="canva-button-container">
              <button className="canva-animated-button" onClick={openCanva}>
                <img
                  src={imagen1}
                  alt="Logo de Canva"
                  className="canva-logo"
                />
                <span className="ir">Ir a Canva</span>
              </button>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">Haz clic en el botón para ir a Canva</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">Elige el tipo de diseño que deseas crear</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">Personaliza tu diseño con las herramientas de Canva</div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Guardar diseño */}
        <div className="column right-column">
          <div className="card">
            <h3>Guarda tu diseño</h3>
            <p>Cuando termines tu diseño en Canva, guárdalo en nuestra plataforma para acceder a él fácilmente.</p>

            <div className="save-instructions">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">En Canva, haz clic en "Compartir" en la esquina superior derecha</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">Selecciona "Copiar enlace" para copiar la URL de tu diseño</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">
                  Pega el enlace en el campo a continuación y haz clic en "Guardar diseño"
                </div>
              </div>
            </div>

            <form className="save-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Pega el enlace de tu diseño aquí"
                className="design-url-input"
                id="design-url-input"
                disabled={isLoading}
                required
              />
              <button type="submit" className="save-animated-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span className="save-icon">💾</span>
                    <span>Guardar diseño</span>
                  </>
                )}
              </button>
            </form>

            {/* Mensajes de estado */}
            {saveStatus === "success" && (
              <div className="status-message success">
                <p>✅ ¡Diseño guardado correctamente!</p>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="status-message error">
                <p>❌ {errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Espacio para información adicional */}
      <div className="additional-info">
        <h3>¿Por qué usar Canva para tus diseños?</h3>
        <div className="benefits">
          <div className="benefit">
            <div className="benefit-icon">🎨</div>
            <h4>Diseños profesionales</h4>
            <p>Crea diseños de aspecto profesional sin necesidad de experiencia en diseño gráfico.</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">⚡</div>
            <h4>Rápido y sencillo</h4>
            <p>Interfaz intuitiva que te permite crear diseños impresionantes en minutos.</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">📱</div>
            <h4>Acceso desde cualquier dispositivo</h4>
            <p>Trabaja en tus diseños desde tu computadora, tablet o teléfono móvil.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
