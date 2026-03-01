"use client"
import { useState, useEffect, useRef } from "react"
import styles from "./WelcomeOverlayCursos.module.css"

const WelcomeOverlayCursos = ({ onClose, usuario_id = 1 }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fechaEvento, setFechaEvento] = useState(null)
  const [esFuturo, setEsFuturo] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [imageLoadError, setImageLoadError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imagePreloaded, setImagePreloaded] = useState(false)
  const imageRef = useRef(null)

  // Precargar imagen tan pronto como tengamos la URL
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        setImagePreloaded(true)
        resolve(img)
      }
      img.onerror = reject
      // Optimizaciones para carga más rápida
      img.loading = 'eager' // Carga inmediata
      img.decoding = 'async' // Decodificación asíncrona
      img.fetchPriority = 'high' // Alta prioridad
      img.src = url
    })
  }

  useEffect(() => {
    loadCourseData()
  }, [usuario_id])

  // Precargar imagen cuando tengamos la URL
  useEffect(() => {
    if (imageUrl && !imagePreloaded) {
      preloadImage(imageUrl)
        .then(() => {
          console.log('Imagen precargada exitosamente')
        })
        .catch((err) => {
          console.error('Error precargando imagen:', err)
          setImageLoadError(true)
        })
    }
  }, [imageUrl, imagePreloaded])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      setError(null)
      setImageLoadError(false)
      setImageLoaded(false)
      setImagePreloaded(false)

      console.log(`Cargando datos del usuario: ${usuario_id}`)
      
      // Usar AbortController para cancelar requests si es necesario
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`http://localhost:5000/api/cursos/ultima-imagen/${usuario_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Headers para optimizar cache
          'Cache-Control': 'max-age=300', // 5 minutos de cache
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log(`Response status: ${response.status}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error en la API`)
      }
      
      const data = await response.json()
      console.log('Datos recibidos:', data)

      if (!data.success) {
        throw new Error(data.message || "La API no devolvió datos exitosos")
      }
      
      if (!data.hasImage) {
        throw new Error("No hay imagen disponible para este usuario")
      }

      // Procesar los datos y configurar la imagen para precarga
      if (data.imagen) {
        setImageUrl(data.imagen)
      }
      
      if (data.fechaEvento) {
        setFechaEvento(data.fechaEvento)
        setEsFuturo(data.esFuturo || false)
      }
      
      setMensaje(data.mensaje || "Curso disponible")
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error("Request timeout")
        setError("La carga tardó demasiado. Intenta de nuevo.")
      } else {
        console.error("Error loading course data:", err)
        setError(`Error al cargar el curso: ${err.message}`)
      }
      setImageLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    console.error("Error al cargar la imagen:", imageUrl)
    setImageLoadError(true)
    setImageLoaded(false)
    setError("Error al mostrar la imagen - verifique el formato")
  }

  const handleImageLoad = () => {
    console.log("Imagen cargada correctamente")
    setImageLoadError(false)
    setImageLoaded(true)
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
    const mensajeWhatsApp = `Hola! Me interesa este diseño para el curso del ${fechaFormateada}${esFuturo ? ` (en ${diasRestantes} días)` : ""}. Te envío la imagen por separado.`

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
              {esFuturo ? "¡Próximo Curso!" : "¡Bienvenido!"}
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
                ? "si deseas pedir este diseño para tu próximo curso, dale click al botón"
                : "si deseas pedir este diseño para cursos, dale click al botón"}
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
                <button onClick={loadCourseData} className={styles.retryButton}>
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
                    {/* Skeleton/Placeholder mientras carga la imagen */}
                    {!imageLoaded && (
                      <div className={styles.imageSkeleton}>
                        <div className={styles.skeletonContent}>
                          <div className={styles.skeletonShimmer}></div>
                        </div>
                      </div>
                    )}
                    
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt={`Imagen del curso: ${mensaje || formatearFecha(fechaEvento)}`}
                      className={`${styles.welcomeImage} ${imageLoaded ? styles.loaded : styles.loading}`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      // Optimizaciones HTML para carga rápida
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      // Preconnect hint para dominios externos (si aplica)
                      crossOrigin="anonymous"
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                    
                    {esFuturo && fechaEvento && imageLoaded && (
                      <div className={styles.eventBadge}>
                        <span>{calcularDiasRestantes(fechaEvento)} días restantes</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.imageError}>
                    <h3>No hay imagen disponible</h3>
                    <p>No se encontró una imagen para mostrar.</p>
                    <button onClick={loadCourseData} className={styles.retryButton}>
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

export default WelcomeOverlayCursos