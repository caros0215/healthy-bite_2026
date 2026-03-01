"use client"

import { useState } from "react"
import "../../../styles/cookie-consent.css"

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <h3 className="cookie-title">¿ALGUIEN DIJO... COOKIES?</h3>
        <p className="cookie-text">
          Honest Greens® y sus colaboradores utilizan cookies para ofrecerte un servicio mejor, más seguro y más rápido,
          y para respetar nuestro negocio. Nuestras cookies son necesarias para utilizar nuestros servicios, mejorarlos
          y asegurarnos de que funcionen correctamente.
        </p>
      </div>
      <div className="cookie-buttons">
        <button className="cookie-button" onClick={() => setIsVisible(false)}>
          Aceptar cookies
        </button>
        <button className="cookie-button" onClick={() => setIsVisible(false)}>
          Rechazar
        </button>
        <button className="cookie-button">Saber más</button>
      </div>
    </div>
  )
}

export default CookieConsent
