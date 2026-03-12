"use client"
import { useState, useEffect } from "react"
import "./SplashScreen.css"
import imagen1 from "../../../assets/images/artes_Mesa de trabajo 1.webp"
import imagen2 from "../../../assets/images/artes-04.webp"

function SplashScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isPaused, setIsPaused] = useState(false) // Nuevo estado para pausar
  
  // Controles manuales del splash
  const SPLASH_ENABLED = true
  const AUTO_PROGRESS = true
  const FIXED_PROGRESS = 0
  const PAUSE_SPLASH = false // Cambia a true para pausar, false para funcionar normal

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!SPLASH_ENABLED) return
    
    if (!AUTO_PROGRESS) {
      setProgress(FIXED_PROGRESS)
      return
    }

    // Solo progresa si NO está pausado y PAUSE_SPLASH está en false
    if (isPaused || PAUSE_SPLASH) return

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setIsFading(true)
          return 100
        }
        const newProgress = Math.min(oldProgress + 1, 100)
        return newProgress
      })
    }, 30)

    return () => {
      clearInterval(timer)
    }
  }, [SPLASH_ENABLED, AUTO_PROGRESS, FIXED_PROGRESS, isPaused]) // Agregamos isPaused como dependencia

  useEffect(() => {
    if (isFading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      })

      const notifyTimeout = setTimeout(() => {
        onLoadingComplete()
      }, 500)

      const hideTimeout = setTimeout(() => {
        setIsHidden(true)
      }, 1500)

      return () => {
        clearTimeout(notifyTimeout)
        clearTimeout(hideTimeout)
      }
    }
  }, [isFading, onLoadingComplete])

  if (isHidden || !SPLASH_ENABLED) return null

  return (
    <div className={`splash-screen ${isFading ? "fade-out" : ""}`}>
      <div className="splash-content">
        <div className="logo-container">
          <img src={imagen1 || "/placeholder.svg"} alt="Logo" className="logo1" />
          <div className="subtitle">
            Te nutrimos de adentro hacia afuera,
            <br />
            Por que cuando comes bien te sientes bien. 2021
          </div>
        </div>
        <div className="progress-number">{progress}</div>
        
        {/* Botones de control */}
        {/* <div className="controls" style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            style={{
              padding: '10px 20px',
              backgroundColor: isPaused ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isPaused ? 'Reanudar' : 'Pausar'}
          </button>
          
          <button 
            onClick={() => {
              setIsFading(true)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Saltar
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default SplashScreen