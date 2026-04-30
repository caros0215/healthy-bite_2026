"use client"
import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import RoutesComponent from "./routes"
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import SplashScreen from "./components/pagina_principal/SplashScreen/SplashScreen"
import WelcomeOverlay from "./components/pagina_principal/WelcomeOverlay/WelcomeOverlay"

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)

  // 🔥 NUEVO: imagen global
  const [imagenGlobal, setImagenGlobal] = useState(null)

  // 🔥 FETCH TEMPRANO (mientras splash corre)
  useEffect(() => {
    const fetchImagen = async () => {
      try {
        const res = await fetch("https://backend-healthybite.up.railway.app/api/almuerzos/ultima-imagen/1")
        const data = await res.json()

        if (data.success && data.hasImage) {
          if (data.link_canva) {
            setImagenGlobal({
              url: data.link_canva,
              isCanva: true
            })
          } else if (data.imagen) {
            const base64 = data.imagen.startsWith("data:image")
              ? data.imagen
              : `data:image/png;base64,${data.imagen}`

            setImagenGlobal({
              url: base64,
              isCanva: false
            })
          }
        }
      } catch (e) {
        console.error("Error global fetch:", e)
      }
    }

    fetchImagen()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = isLoading ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)

    const currentPath = window.location.pathname
    const isMainPage = currentPath === '/' || currentPath === '/login' || currentPath === ''

    if (isMainPage) {
      setShowOverlay(true)
    }

    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 100)
  }

  const handleOverlayClose = () => {
    setShowOverlay(false)
  }

  return (
    <>
      {isLoading ? (
        <SplashScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <Router>
            <RoutesComponent />
          </Router>

          {/* 🔥 Overlay con imagen precargada */}
          {showOverlay && (
            <WelcomeOverlay
              onClose={handleOverlayClose}
              imagenGlobal={imagenGlobal}
            />
          )}
        </>
      )}
    </>
  )
}

export default App