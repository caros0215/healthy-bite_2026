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

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = isLoading ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    
    // Verificar si estamos en la página principal (no en dashboard u otras rutas internas)
    const currentPath = window.location.pathname
    const isMainPage = currentPath === '/' || currentPath === '/login' || currentPath === ''
    
    // Solo mostrar overlay si estamos en página principal
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
          {/* Overlay que aparece solo en páginas principales */}
          {showOverlay && <WelcomeOverlay onClose={handleOverlayClose} />}
        </>
      )}
    </>
  )
}

export default App