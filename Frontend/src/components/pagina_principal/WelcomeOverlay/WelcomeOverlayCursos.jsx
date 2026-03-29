"use client"
import { useState, useEffect, useRef } from "react"
import styles from "./WelcomeOverlayCursos.module.css"
import API_URL from "../../../config/api"

const DEFAULT_IMAGE = "https://res.cloudinary.com/dxh5zrylb/image/upload/artes_Mesa_de_trabajo_1_oytyhc.webp"

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
  const [sinCursos, setSinCursos] = useState(false)
  const imageRef = useRef(null)

  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        setImagePreloaded(true)
        resolve(img)
      }
      img.onerror = reject
      img.loading = "eager"
      img.decoding = "async"
      img.fetchPriority = "high"
      img.src = url
    })
  }

  useEffect(() => {
    loadCourseData()
  }, [usuario_id])

  useEffect(() => {
    if (imageUrl && !imagePreloaded) {
      preloadImage(imageUrl).catch(() => {
        // Si falla la imagen propia, caemos al default
        setImageUrl(DEFAULT_IMAGE)
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
      setSinCursos(false)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${API_URL}/api/cursos/ultima-imagen/${usuario_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=300",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error en la API`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "La API no devolvió datos exitosos")
      }

      // Si no hay imagen usamos la imagen por defecto y marcamos sinCursos
      if (!data.hasImage || !data.imagen) {
        setSinCursos(true)
        setImageUrl(DEFAULT_IMAGE)
        setMensaje("No hay cursos a la fecha")
      } else {
        setImageUrl(data.imagen)
        setSinCursos(false)
        setMensaje(data.mensaje || "Curso disponible")
      }

      if (data.fechaEvento) {
        setFechaEvento(data.fechaEvento)
        setEsFuturo(data.esFuturo || false)
      }

    } catch (err) {
      if (err.name === "AbortError") {
        setError("La carga tardó demasiado. Intenta de nuevo.")
      } else {
        console.error("Error loading course data:", err)
        setError(`Error al cargar el curso: ${err.message}`)
      }
      // Aunque haya error, mostramos la imagen por defecto
      setSinCursos(true)
      setImageUrl(DEFAULT_IMAGE)
      setMensaje("No hay cursos a la fecha")
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (e) => {
    // Si falla cualquier imagen, ponemos la por defecto
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE
    }
    setImageLoaded(true)
  }

  const handleImageLoad = () => {
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

    const mensajeWhatsApp = sinCursos
      ? `Hola! Me interesa inscribirme a un curso, ¿cuándo tienen disponibilidad?`
      : `Hola! Quiero inscribirme al curso del ${fechaFormateada}${esFuturo ? ` (en ${diasRestantes} días)` : ""}`

    const url = `https://wa.me/573147139843?text=${encodeURIComponent(mensajeWhatsApp)}`
    window.open(url, "_blank")
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

          {/* ===== LEFT — texto ===== */}
          <div className={styles.welcomeTextSection}>
            <h3 className={`${styles.welcomeTitle} ${esFuturo ? styles.futureEvent : ""}`}>
              {sinCursos ? "¡Próximamente!" : esFuturo ? "¡Próximo Curso!" : "¡Bienvenido!"}
            </h3>

            {mensaje && <p className={styles.courseTitle}>{mensaje}</p>}

            {!sinCursos && fechaEvento && (
              <p className={styles.eventDate}>
                <strong>{formatearFecha(fechaEvento)}</strong>
                {esFuturo && ` (en ${calcularDiasRestantes(fechaEvento)} días)`}
              </p>
            )}

            <p className={styles.welcomeText}>
              {sinCursos ? (
                <>
                  Estamos preparando nuevos cursos para ti.
                  <br />
                  <br />
                  Si deseas explorar el resto de la página dale click a la X,
                  <br />
                  o contáctanos para más información.
                </>
              ) : (
                <>
                  Si deseas explorar el resto de la página dale click a la X,
                  <br />
                  <br />
                  {esFuturo
                    ? "si deseas pedir este diseño para tu próximo curso, dale click al botón"
                    : "si deseas pedir este diseño para cursos, dale click al botón"}
                </>
              )}
            </p>

            <button
              onClick={handlePedirAhora}
              className={`${styles.pedirButton} ${esFuturo ? styles.futureEvent : ""}`}
              disabled={loading}
            >
              {loading
                ? "Cargando..."
                : sinCursos
                ? "Contáctanos"
                : esFuturo
                ? "Reservar Ahora"
                : "Inscríbete Ahora"}
            </button>

            {error && !sinCursos && (
              <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button onClick={loadCourseData} className={styles.retryButton}>
                  Reintentar
                </button>
              </div>
            )}
          </div>

          {/* ===== RIGHT — imagen ===== */}
          <div className={styles.welcomeImageSection}>
            {loading ? (
              <div className={styles.imageLoading}>
                <div className={styles.spinner}></div>
                <p>Cargando imagen...</p>
              </div>
            ) : (
              <div className={styles.imageWrapper}>

                {/* Skeleton mientras carga */}
                {!imageLoaded && (
                  <div className={styles.imageSkeleton}>
                    <div className={styles.skeletonContent}>
                      <div className={styles.skeletonShimmer}></div>
                    </div>
                  </div>
                )}

                {/* Siempre mostramos imagen — propia o DEFAULT_IMAGE */}
                <img
                  ref={imageRef}
                  src={imageUrl || DEFAULT_IMAGE}
                  alt={
                    sinCursos
                      ? "Próximos cursos"
                      : `Imagen del curso: ${mensaje || formatearFecha(fechaEvento)}`
                  }
                  className={`${styles.welcomeImage} ${imageLoaded ? styles.loaded : styles.loading}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  crossOrigin="anonymous"
                  style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />

                {/* Badge evento futuro */}
                {esFuturo && fechaEvento && imageLoaded && !sinCursos && (
                  <div className={styles.eventBadge}>
                    <span>{calcularDiasRestantes(fechaEvento)} días restantes</span>
                  </div>
                )}

                {/* Badge sin cursos */}
                {sinCursos && imageLoaded && (
                  <div
                    className={styles.eventBadge}
                    style={{ background: "rgba(181, 190, 0, 0.95)" }}
                  >
                    <span>¡Próximamente!</span>
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