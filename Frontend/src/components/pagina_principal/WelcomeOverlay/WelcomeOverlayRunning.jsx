"use client"
import { useState, useEffect } from "react"
import "./WelcomeOverlay.css"
import API_URL from "../../../config/api"

const loaderGif = "https://ik.imagekit.io/b4rykldk3/logo_oscillate.gif?updatedAt=1777044898795"
const DEFAULT_IMAGE = "https://ik.imagekit.io/b4rykldk3/artes-01.webp?updatedAt=1777044887103"

const WelcomeOverlayRunning = ({ onClose, usuario_id = 1 }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [noImage, setNoImage] = useState(false)
  const [fechaEvento, setFechaEvento] = useState(null)
  const [esFuturo, setEsFuturo] = useState(false)
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    loadRunningData()
  }, [usuario_id])

  const loadRunningData = async () => {
    try {
      setLoading(true)
      setError(null)
      setNoImage(false)

      const response = await fetch(`${API_URL}/api/running/ultima-imagen/${usuario_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}: Error en la API`)

      const data = await response.json()

      if (!data.success) throw new Error(data.message || "La API no devolvió datos exitosos")

      if (data.hasImage && data.imagen) {
        const img = data.imagen.startsWith("data:image")
          ? data.imagen
          : data.imagen.startsWith("http")
          ? data.imagen
          : `data:image/jpeg;base64,${data.imagen}`
        setImageUrl(img)
        setNoImage(false)
      } else {
        setNoImage(true)
        setImageUrl(DEFAULT_IMAGE)
      }

      if (data.fechaEvento) {
        setFechaEvento(data.fechaEvento)
        setEsFuturo(data.esFuturo || false)
      }

      setMensaje(data.mensaje || "")
    } catch (err) {
      console.error("Error loading running data:", err)
      setNoImage(true)
      setImageUrl(DEFAULT_IMAGE)
      setError("No hay eventos de running disponibles en este momento")
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE
    }
    setNoImage(true)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ""
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })
  }

  const calcularDiasRestantes = (fecha) => {
    if (!fecha) return 0
    return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
  }

  const handlePedirAhora = () => {
    const mensajeWA = noImage
      ? `Hola! Me interesa inscribirme a un evento de running, ¿cuándo tienen disponibilidad?`
      : `Hola! Quiero inscribirme al evento de running${
          fechaEvento
            ? ` del ${formatearFecha(fechaEvento)}${esFuturo ? ` (en ${calcularDiasRestantes(fechaEvento)} días)` : ""}`
            : ""
        }`

    window.open(
      `https://wa.me/573147139843?text=${encodeURIComponent(mensajeWA)}`,
      "_blank"
    )
    onClose()
  }

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="welcome-overlay" onClick={handleBackgroundClick}>
      <div className="welcome-main-container">

        {/* ===== IZQUIERDA / ARRIBA en móvil — imagen ===== */}
        <div className="welcome-content">
          <button onClick={onClose} className="close-button" aria-label="Cerrar">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="image-container">
            {loading ? (
              <div className="image-loading">
                <div className="spinner">
                  <img src={loaderGif} alt="Cargando..." className="loading-gif" />
                </div>
              </div>
            ) : (
              <div className="image-wrapper">
                <img
                  src={imageUrl || DEFAULT_IMAGE}
                  alt={noImage ? "Próximos eventos de running" : `Evento: ${mensaje || formatearFecha(fechaEvento)}`}
                  className="welcome-image"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />

                {/* Badge días restantes */}
                {esFuturo && fechaEvento && !noImage && (
                  <div className="canva-badge">
                    <span>🏃‍♂️ {calcularDiasRestantes(fechaEvento)} días</span>
                  </div>
                )}

                {/* Badge sin eventos */}
                {noImage && (
                  <div className="canva-badge" style={{ background: "rgba(181,190,0,0.95)" }}>
                    <span>¡Próximamente!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== DERECHA / ABAJO en móvil — texto y botón ===== */}
        <div className="welcome-text-content">
          <h3 className="welcome-title">
            {noImage ? "¡Próximamente!" : esFuturo ? "¡Próximo Running!" : "¡Bienvenido!"}
          </h3>

          {mensaje && !noImage && (
            <p style={{ color: "#fff", fontWeight: 600, marginBottom: "0.5rem", textAlign: "center" }}>
              {mensaje}
            </p>
          )}

          {fechaEvento && !noImage && (
            <p style={{ color: "#b5be00", fontWeight: 700, marginBottom: "0.75rem", textAlign: "center", fontSize: "0.9rem" }}>
              📅 {formatearFecha(fechaEvento)}
              {esFuturo && ` · ${calcularDiasRestantes(fechaEvento)} días`}
            </p>
          )}

          <p className="welcome-text">
            {noImage ? (
              <>
                Estamos preparando nuevos eventos de running para ti.
                <br /><br />
                Si deseas explorar el resto de la página dale click a la X,
                <br />
                o contáctanos para más información.
              </>
            ) : (
              <>
                Si deseas explorar el resto de la página dale click a la X,
                <br /><br />
                {esFuturo
                  ? "si deseas reservar tu cupo, dale click al botón"
                  : "si deseas inscribirte dale click al botón"}
              </>
            )}
          </p>

          <button onClick={handlePedirAhora} className="pedir-button">
            {noImage ? "Contáctanos" : esFuturo ? "Reservar Ahora" : "Inscríbete Ahora"}
          </button>

          {error && (
            <div className="error-container">
              <p className="error-message">⚠️ {error}</p>
              <button onClick={loadRunningData} className="retry-button">
                Reintentar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default WelcomeOverlayRunning