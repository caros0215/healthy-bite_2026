"use client"
import { useState, useEffect } from "react"
import styles from "./WelcomeOverlayRunning.module.css"

const WelcomeOverlayRunning = ({ onClose, usuario_id = 1 }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fechaEvento, setFechaEvento] = useState(null)
  const [esFuturo, setEsFuturo] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [imageLoadError, setImageLoadError] = useState(false)

  useEffect(() => {
    loadRunningData()
  }, [usuario_id])

  const loadRunningData = async () => {
    try {
      setLoading(true)
      setError(null)
      setImageLoadError(false)

      console.log(`Cargando datos de running del usuario: ${usuario_id}`)
      
      // URL corregida para coincidir con tu API Express - RUNNING
      const response = await fetch(`http://localhost:5000/api/running/ultima-imagen/${usuario_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log(`Response status: ${response.status}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error en la API`)
      }
      
      const data = await response.json()
      console.log('Datos de running recibidos:', data)

      // Verificar la estructura de respuesta de tu API
      if (!data.success) {
        throw new Error(data.message || "La API no devolvió datos exitosos")
      }
      
      if (!data.hasImage) {
        throw new Error("No hay imagen disponible para este usuario")
      }

      // Procesar los datos recibidos de tu API
      if (data.imagen) {
        setImageUrl(data.imagen)
      }
      
      if (data.fechaEvento) {
        setFechaEvento(data.fechaEvento)
        setEsFuturo(data.esFuturo || false)
      }
      
      // Usar el mensaje que viene del backend
      setMensaje(data.mensaje || "Evento de running disponible")
      
    } catch (err) {
      console.error("Error loading running data:", err)
      setError(`Error al cargar el evento de running: ${err.message}`)
      setImageLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    console.error("Error al cargar la imagen:", imageUrl)
    setImageLoadError(true)
    setError("Error al mostrar la imagen - verifique el formato")
  }

  const handleImageLoad = () => {
    console.log("Imagen cargada correctamente")
    setImageLoadError(false)
    setError(null)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ""
    const fechaObj = new Date(fecha)
    return fechaObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calcularDiasRestantes = (fechaEvento) => {
    if (!fechaEvento) return 0
    const hoy = new Date()
    const evento = new Date(fechaEvento)
    const diferencia = evento - hoy
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
  }

  const handlePedirAhora = () => {
    const fechaFormateada = formatearFecha(fechaEvento)
    const diasRestantes = calcularDiasRestantes(fechaEvento)
    const mensajeWhatsApp = `Hola! Me interesa este diseño para el evento de running del ${fechaFormateada}${esFuturo ? ` (en ${diasRestantes} días)` : ""}. Te envío la imagen por separado.`

    console.log("Mensaje para WhatsApp:", mensajeWhatsApp)
    onClose()
  }

  return (
    <div className={styles.welcomeOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.welcomeModal}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.welcomeContentWrapper}>
          {/* Left side - Text content */}
          <div className={styles.welcomeTextSection}>
            <h3 className={`${styles.welcomeTitle} ${esFuturo ? styles.futureEvent : ""}`}>
              {esFuturo ? "¡Próximo Running!" : "¡Bienvenido al Running!"}
            </h3>

            {mensaje && <p className={styles.courseTitle}>{mensaje}</p>}

            {fechaEvento && (
              <p className={styles.eventDate}>
                <strong>{formatearFecha(fechaEvento)}</strong>
                {esFuturo && ` (en ${calcularDiasRestantes(fechaEvento)} días)`}
              </p>
            )}

            <p className={styles.welcomeText}>
              Si deseas explorar el resto de la página dale click a la X,
              <br />
              <br />
              {esFuturo
                ? "si deseas pedir este diseño para tu próximo evento de running, dale click al botón"
                : "si deseas pedir este diseño para eventos de running, dale click al botón"}
            </p>

            <button
              onClick={handlePedirAhora}
              className={`${styles.pedirButton} ${esFuturo ? styles.futureEvent : ""}`}
              disabled={imageLoadError || loading || !imageUrl}
            >
              {loading ? "Cargando..." : esFuturo ? "Reservar Ahora" : "Pedir Ahora"}
            </button>

            {error && (
              <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button onClick={loadRunningData} className={styles.retryButton}>
                  Reintentar
                </button>
              </div>
            )}
          </div>

          {/* Right side - Image */}
          <div className={styles.welcomeImageSection}>
            {loading ? (
              <div className={styles.imageLoading}>
                <div className={styles.spinner}></div>
                <p>Cargando imagen...</p>
              </div>
            ) : (
              <div className={styles.imageWrapper}>
                {!imageLoadError && imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={`Imagen del evento de running: ${mensaje || formatearFecha(fechaEvento)}`}
                      className={styles.welcomeImage}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                    {esFuturo && fechaEvento && (
                      <div className={styles.eventBadge}>
                        <span>🏃‍♂️ {calcularDiasRestantes(fechaEvento)} días restantes</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.imageError}>
                    <h3>No hay imagen disponible</h3>
                    <p>No se encontró una imagen para mostrar.</p>
                    <button onClick={loadRunningData} className={styles.retryButton}>
                      Reintentar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeOverlayRunning