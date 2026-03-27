"use client"

import { useRef } from "react"
import "./MenuSlider.css"
const imagen1 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620151/21_biljox.webp";
const imagen2 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620133/1_fvkwsy.webp";
const imagen3 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620147/18_ghcud8.webp";
const imagen4 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620134/2_gzl2jz.webp";
const imagen5 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620147/17_r0vqqz.webp";
const imagen6 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620143/14_tkuhg7.webp";

const MenuSlider = () => {
  const containerRef = useRef(null)

  // ✅ Variables para swipe touch
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const menuItems = [
    { id: 1, image: imagen1, title: "Para Compartir", icon: "→" },
    { id: 2, image: imagen2, title: "Torre pancakes", icon: "→" },
    { id: 3, image: imagen3, title: "parfait", icon: "→" },
    { id: 4, image: imagen4, title: "huevos napolitanos", icon: "→" },
    { id: 5, image: imagen5, title: "tostada de aguacate", icon: "→" },
    { id: 6, image: imagen6, title: "Bebidas", icon: "→" },
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

  // ✅ Handlers de swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(diff) >= minSwipeDistance) {
      if (diff > 0) {
        // Swipe izquierda → siguiente
        scrollRight()
      } else {
        // Swipe derecha → anterior
        scrollLeft()
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className="menu-slider-section">
      <div className="menu-header">
        <h2 className="menu-title">
          COMES BIEN
          <br />
          TE SIENTES <br />
          BIEN.
        </h2>
        <div className="menu-controls">
          <button className="menu-control-button" onClick={scrollLeft}>
            ←
          </button>
          <button className="menu-control-button" onClick={scrollRight}>
            →
          </button>
        </div>
      </div>

      {/* ✅ Agregar handlers de touch al contenedor */}
      <div
        className="menu-items-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-image-container">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="menu-item-image" />
            </div>
            <div className="menu-item-footer">
              <h3 className="menu-item-title">{item.title}</h3>
              <span className="menu-item-icon">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuSlider