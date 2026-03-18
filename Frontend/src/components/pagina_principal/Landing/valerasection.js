import { useRef, useState } from "react"
import styles from "./valerasection.module.css"
import videoValera from "../../../assets/images/video_104.mp4"

export default function ValeraSection() {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.muted = true
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* IZQUIERDA: Video */}
        <div
          className={styles.videoWrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            src={videoValera}
            className={styles.video}
            loop
            muted
            playsInline
            autoPlay
          />
          <div className={styles.videoOverlay}>
            <span className={styles.playHint}>🔊 Pasa el cursor para escuchar</span>
          </div>
        </div>

        {/* DERECHA: Tarjeta valera */}
        <div className={styles.card}>
          <p className={styles.question}>¿Te <strong>GUSTÓ</strong> el almuerzo?</p>

          <div className={styles.divider} />

          <p className={styles.subtitle}>Sistema de valera</p>

          <div className={styles.badge}>paga por adelantado</div>

          <div className={styles.priceBlock}>
            <p className={styles.priceMain}>
              <span className={styles.number}>15</span> Almuerzos
            </p>
            <p className={styles.priceValue}>$418.500</p>
            <p className={styles.savings}>(Ahorras $3.100 en cada uno)</p>
          </div>

          <div className={styles.notes}>
            <p>* Sin fecha de vencimiento</p>
            <p>* El domi tiene un valor adicional</p>
          </div>

          <div className={styles.logo}>hb<span className={styles.dot}>®</span></div>
        </div>

      </div>
    </section>
  )
}