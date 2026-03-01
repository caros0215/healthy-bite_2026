"use client"

import { useState } from "react"
import { Maximize2, X } from "lucide-react"

export function ImageZoomViewer({ src, alt }) {
  const [isZoomed, setIsZoomed] = useState(false)

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div className="image-zoom-container">
      {/* Imagen normal */}
      <div className="image-container">
        <img src={src || "/placeholder.svg"} alt={alt} className="menu-image" />
        <button onClick={toggleZoom} className="zoom-button" aria-label="Ampliar imagen">
          <Maximize2 className="zoom-icon" />
        </button>
      </div>

      {/* Modal de imagen ampliada */}
      {isZoomed && (
        <div className="zoom-overlay" onClick={toggleZoom}>
          <div className="zoomed-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={src || "/placeholder.svg"} alt={alt} className="zoomed-image" />
            <button onClick={toggleZoom} className="close-button" aria-label="Cerrar">
              <X className="close-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
