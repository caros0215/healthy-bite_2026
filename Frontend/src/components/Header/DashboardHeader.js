"use client"
import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "./Header.css"
import "./DashboardHeader.css"
import logoColor from "../../assets/images/artes_Mesa de trabajo 1.1.png"

function DashboardHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determinar el menú activo basado en la ruta actual
  const getActiveMenu = () => {
    if (location.pathname.includes("calendario")) return "calendario"
    if (location.pathname.includes("canva")) return "canva-button"
    return "canva-button" // default
  }

  const [activeMenu, setActiveMenu] = useState(getActiveMenu())

  // Actualizar el menú activo cuando cambie la ruta
  useEffect(() => {
    setActiveMenu(getActiveMenu())
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    localStorage.removeItem("canvaToken")
    localStorage.removeItem("canvaTokenData")
    localStorage.removeItem("canva_code_verifier")
    navigate("/")
  }

  const handleMenuClick = (menu) => {
    setActiveMenu(menu)
    
    if (menu === "calendario") {
      navigate("/calendario-creator")
    } else if (menu === "canva-button") {
      navigate("/canva-button")
    }
  }

  const getUserDisplayName = () => {
    const usuarioData = localStorage.getItem("usuario")
    if (!usuarioData) return "Usuario"
    try {
      if (usuarioData.startsWith("{")) {
        const userData = JSON.parse(usuarioData)
        return userData.nombre || userData.username || "Usuario"
      } else {
        return usuarioData
      }
    } catch {
      return usuarioData
    }
  }

  return (
    <header className="header header-white dashboard-header">
      <div className="logo-nav-container">
        <Link to="/dashboard" className="logo">
          <img src={logoColor} width="150" />
        </Link>
        <nav className="dashboard-navigation">
          <button
            className={`menu-option ${activeMenu === "canva-button" ? "active" : ""}`}
            type="button"
            onClick={() => handleMenuClick("canva-button")}
          >
            Canva Design
          </button>
          
          <button
            className={`menu-option ${activeMenu === "calendario" ? "active" : ""}`}
            onClick={() => handleMenuClick("calendario")}
          >
            Calendario
          </button>
        </nav>
      </div>
      <div className="user-actions">
        <span className="username">Hola, {getUserDisplayName()}</span>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader