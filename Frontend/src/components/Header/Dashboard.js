"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardHeader from "./DashboardHeader"
import image2 from "../../assets/images/artes-04.webp" // Asegúrate de que la ruta sea correcta
import "./Dashboard.css"

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("canvas")
  const navigate = useNavigate()

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const usuario = localStorage.getItem("usuario")
    if (!usuario) {
      // Si no hay usuario en localStorage, redirigir al inicio
      navigate("/")
    }
  }, [navigate])

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      
      <main className="dashboard-content">
        {activeMenu === "canvas" ? (
          <div className="canvas-section">
          <img src={image2 || "/placeholder.svg"} alt="Logo" />
          </div>
        ) : (
          <div className="calendario-section">
            <h1>Calendario</h1>
            <p>Bienvenido al área de Calendario. Aquí puedes ver y gestionar tus eventos.</p>
            <div className="calendar-placeholder">
              <div className="calendar-header">
                <h3>Mayo 2025</h3>
              </div>
              <div className="calendar-grid">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className="calendar-day">
                    <span className="day-number">{i + 1}</span>
                    {i === 4 && <div className="event">Reunión</div>}
                    {i === 10 && <div className="event">Entrega</div>}
                    {i === 15 && <div className="event">Presentación</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard