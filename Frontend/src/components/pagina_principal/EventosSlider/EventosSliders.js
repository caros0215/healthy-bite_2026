"use client"

import { useRef, useState, useEffect } from "react"
import styles from "./EventosSliders.module.css"
import video1 from "../../../assets/images/video_21.mp4"
import video2 from "../../../assets/images/video_30.mp4"
import video4 from "../../../assets/images/video_20.mp4"
import video3 from "../../../assets/images/video_19.mp4"
import imagen5 from "../../../assets/images/imagen_3.webp"
import imagen6 from "../../../assets/images/imagen_5.webp"
import logo from "../../../assets/images/artes_Mesa de trabajo 1.webp"

const EventosSlider = () => {
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    // ✅ threshold muy bajo + rootMargin para que dispare apenas aparece en pantalla
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isMounted.current) setIsVisible(true)
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      isMounted.current = false
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const menuItems = [
    { id: 1, media: video1, title: "Eventos empresariales", icon: "→", type: "video" },
    { id: 2, media: video2, title: "Nuestra comunidad", icon: "→", type: "video" },
    { id: 3, media: video3, title: "Helados", icon: "→", type: "video" },
    { id: 4, media: video4, title: "Almuerzos", icon: "→", type: "video" },
    { id: 5, media: imagen5, title: "Cursos de cocina", icon: "→", type: "image" },
    { id: 6, media: imagen6, title: "Postres", icon: "→", type: "image" },
    { id: 7, media: imagen6, title: "Asesoría nutricional", icon: "→", type: "image" },
  ]

  const scrollLeft = () => containerRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  const scrollRight = () => containerRef.current?.scrollBy({ left: 300, behavior: "smooth" })

  return (
    <div ref={sectionRef} className={`${styles.menuslidersection} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.menuheader}>
        <div className={styles.splitContainer}>
          {/* Mitad izquierda: título */}
          <div className={`${styles.leftHalf} ${isVisible ? styles.filled : ""}`}>
            {isVisible && (
              <h2 className={`${styles.menutitle} ${isVisible ? styles.visible : ""}`}>
                VEN Y CONÓCENOS
              </h2>
            )}
          </div>
          {/* Mitad derecha: logo */}
          <div className={`${styles.rightHalf} ${isVisible ? styles.filled : ""}`}>
            {isVisible && (
              <img
                src={logo}
                alt="Logo"
                className={`${styles.logo} ${isVisible ? styles.visible : ""}`}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.menuitemscontainer} ref={containerRef}>
        {menuItems.map((item) => (
          <VideoCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.menucontrols}>
        <button className={styles.menucontrolbutton} onClick={scrollLeft}>←</button>
        <button className={styles.menucontrolbutton} onClick={scrollRight}>→</button>
      </div>
    </div>
  )
}

// ✅ Componente separado para cada card con hover/touch play
const VideoCard = ({ item }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Detectar móvil una vez al montar
  const isMobile = useRef(
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  )

  // ✅ Forzar carga del primer frame como thumbnail
  useEffect(() => {
    const video = videoRef.current
    if (!video || item.type !== "video") return
    video.load()
  }, [item])

  const safePlay = (video) => {
    if (!video) return
    video.muted = true
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "")
    video.play().catch(() => {})
  }

  // Solo desktop
  const handleMouseEnter = () => {
    if (item.type !== "video" || isMobile.current) return
    const video = videoRef.current
    if (video) { safePlay(video); setIsPlaying(true) }
  }

  const handleMouseLeave = () => {
    if (item.type !== "video" || isMobile.current) return
    const video = videoRef.current
    if (video) { video.pause(); video.currentTime = 0; setIsPlaying(false) }
  }

  // Solo móvil: tap para play/pause
  const handleTouch = (e) => {
    if (item.type !== "video") return
    e.preventDefault()
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
      video.currentTime = 0
      setIsPlaying(false)
    } else {
      safePlay(video)
      setIsPlaying(true)
    }
  }

  return (
    <div
      className={styles.menuitem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
    >
      <div className={styles.menuitemimagecontainer}>
        {item.type === "video" ? (
          <>
            <video
              ref={videoRef}
              src={item.media}
              muted
              loop
              playsInline
              preload="metadata"
              className={`${styles.menuitemvideo} ${isPlaying ? styles.playing : ""}`}
            />
            {!isPlaying && (
              <div className={styles.playOverlay}>
                <div className={styles.playIcon}>▶</div>
              </div>
            )}
          </>
        ) : (
          <img
            src={item.media || "/placeholder.svg"}
            alt={item.title}
            className={styles.menuitemimage}
          />
        )}
      </div>
      <div className={styles.menuitemfooter}>
        <h3 className={styles.menuitemtitle}>{item.title}</h3>
        <span className={styles.menuitemicon}>{item.icon}</span>
      </div>
    </div>
  )
}

export default EventosSlider