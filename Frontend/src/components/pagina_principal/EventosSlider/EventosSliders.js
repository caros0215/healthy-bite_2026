"use client"

import { useRef, useState, useEffect } from "react"
import styles from "./EventosSliders.module.css"
  import video1 from "../../../assets/images/video_21.mp4"
  import video2 from "../../../assets/images/video_30.mp4"
import video4 from "../../../assets/images/video_20.mp4"
import imagen2 from "../../../assets/images/imagen_3.jpeg"
import video3 from "../../../assets/images/video_19.mp4"
import imagen4 from "../../../assets/images/imagen_5.jpeg"
import imagen5 from "../../../assets/images/imagen_3.jpeg"
import imagen6 from "../../../assets/images/imagen_5.jpeg"
import logo from "../../../assets/images/artes_Mesa de trabajo 1.png"

const EventosSlider = () => {
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [startVideos, setStartVideos] = useState(false)
  const videoRefs = useRef({})
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  
  // Identificamos los índices de items que son videos
  const videoIndices = [0, 2] // Basado en los IDs 1 y 3 del array menuItems

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          
          // Programar la reproducción de videos después de que las animaciones de fondo terminen
          // La animación más larga es de 2.5s para el logo, así que iniciamos videos a los 3s
          setTimeout(() => {
            setStartVideos(true)
          }, 3000)
        }
      },
      { threshold: 0.3 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Efecto para iniciar la reproducción del primer video cuando startVideos cambie a true
  useEffect(() => {
    if (startVideos && videoRefs.current[videoIndices[0]]) {
      videoRefs.current[videoIndices[0]].play()
    }
  }, [startVideos])

  // Efecto para manejar la reproducción secuencial
  useEffect(() => {
    if (!startVideos) return; // No configurar eventos si aún no iniciamos videos
    
    const handleVideoEnd = () => {
      // Encontrar el siguiente índice de video
      const currentIndexInArray = videoIndices.indexOf(currentVideoIndex)
      const nextIndexInArray = (currentIndexInArray + 1) % videoIndices.length
      const nextVideoIndex = videoIndices[nextIndexInArray]
      
      // Pausar el video actual
      if (videoRefs.current[currentVideoIndex]) {
        videoRefs.current[currentVideoIndex].pause()
        // Reiniciar el video actual para futuras reproducciones
        videoRefs.current[currentVideoIndex].currentTime = 0
      }
      
      // Reproducir el próximo video
      if (videoRefs.current[nextVideoIndex]) {
        videoRefs.current[nextVideoIndex].play()
        setCurrentVideoIndex(nextVideoIndex)
      }
    }

    // Asignar el manejador de eventos al video actual
    const currentVideo = videoRefs.current[currentVideoIndex]
    if (currentVideo) {
      currentVideo.addEventListener('ended', handleVideoEnd)
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [currentVideoIndex, startVideos])

  const menuItems = [
    { id: 1, media: video1, title: "Eventos empresariales", icon: "→", type: "video" },
    { id: 2, media: video2, title: "⁠Nuestra comunidad ", icon: "→", type: "video" },
    { id: 3, media: video3, title: "⁠Helados", icon: "→", type: "video" },
    { id: 4, media: video4, title: "⁠Almuerzos", icon: "→", type: "video" },
    { id: 5, media: imagen5, title: "⁠Cursos de cocina", icon: "→", type: "image" },
    { id: 6, media: imagen6, title: "Postres ", icon: "→", type: "image" },
    { id: 7, media: imagen6, title: "⁠Asesoría nutricional ", icon: "→", type: "image" },
  ]

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div ref={sectionRef} className={`${styles.menuslidersection} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.menuheader}>
        <div className={styles.splitContainer}>
          <div className={`${styles.leftHalf} ${isVisible ? styles.filled : ""}`}>
            {isVisible && <h2 className={`${styles.menutitle} ${isVisible ? styles.visible : ""}`}>VEN Y CONÓCENOS</h2>}
          </div>
          <div className={`${styles.rightHalf} ${isVisible ? styles.filled : ""}`}>
            {isVisible && <img src={logo} alt="Logo" className={`${styles.logo} ${isVisible ? styles.visible : ""}`} />}
          </div>
        </div>
      </div>
      
      <div className={styles.menuitemscontainer} ref={containerRef}>
        {menuItems.map((item, index) => (
          <div key={item.id} className={styles.menuitem}>
            <div className={styles.menuitemimagecontainer}>
              {item.type === "video" ? (
                <video
                  ref={el => {
                    videoRefs.current[index] = el
                  }}
                  src={item.media}
                  muted
                  loop={false} // Cambiado a false para que no se repita
                  playsInline
                  className={styles.menuitemvideo}
                />
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
        ))}
      </div>
      
      <div className={styles.menucontrols}>
        <button className={styles.menucontrolbutton} onClick={scrollLeft}>←</button>
        <button className={styles.menucontrolbutton} onClick={scrollRight}>→</button>
      </div>
    </div>
  )
}

export default EventosSlider