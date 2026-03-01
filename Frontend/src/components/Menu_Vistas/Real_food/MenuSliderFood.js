"use client"

import { useRef, useState } from "react"
import styles from "./MenuSliderFood.module.css"
import imagen1 from "../../../assets/images/plato_4.jpeg"
import imagen2 from "../../../assets/images/plato_5.jpeg"
import imagen3 from "../../../assets/images/plato_6.jpeg"
import imagen4 from "../../../assets/images/plato_7.jpeg"
import imagen5 from "../../../assets/images/plato_8.jpeg"
import imagen6 from "../../../assets/images/plato_9.jpeg"

const MenuSlider = () => {
  const containerRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  const menuItems = [
    { id: 1, image: imagen1, title: "Para Compartir", description: "Deliciosas opciones para disfrutar juntos", icon: "→" },
    { id: 2, image: imagen2, title: "Market Plates", description: "Ingredientes frescos y de temporada", icon: "→" },
    { id: 3, image: imagen3, title: "Garden Bowls", description: "Sabores naturales y balanceados", icon: "→" },
    { id: 4, image: imagen4, title: "Salsas", description: "Explora una variedad de salsas artesanales", icon: "→" },
    { id: 5, image: imagen5, title: "Sweet Corner", description: "Postres irresistibles y saludables", icon: "→" },
    { id: 6, image: imagen6, title: "Bebidas", description: "Refrescantes opciones naturales", icon: "→" },
  ]
  
  const scrollLeft = () => {
    if (containerRef.current) {
      // Calcula el ancho de un elemento para desplazamiento preciso
      const itemWidth = containerRef.current.firstChild.offsetWidth + 32; // Ancho + gap
      const newScrollPosition = Math.max(scrollPosition - itemWidth, 0);
      
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
      
      setScrollPosition(newScrollPosition);
    }
  }
  
  const scrollRight = () => {
    if (containerRef.current) {
      // Calcula el ancho de un elemento para desplazamiento preciso
      const itemWidth = containerRef.current.firstChild.offsetWidth + 32; // Ancho + gap
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const newScrollPosition = Math.min(scrollPosition + itemWidth, maxScroll);
      
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
      
      setScrollPosition(newScrollPosition);
    }
  }
  
  // Añadir manejador para actualizar la posición del scroll
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  return (
    <div className={styles.menuSliderSection}>
      <div className={styles.menuHeader}>
        <h2 className={styles.menuTitle}>
          UNCOMPROMISING 
          <br />
          TASTE.
        </h2>
        <div className={styles.menuControls}>
          <button 
            className={styles.menuControlButton} 
            onClick={scrollLeft}
            disabled={scrollPosition <= 0}
          >
            ←
          </button>
          <button 
            className={styles.menuControlButton} 
            onClick={scrollRight}
            disabled={containerRef.current && scrollPosition >= containerRef.current.scrollWidth - containerRef.current.clientWidth}
          >
            →
          </button>
        </div>
      </div>
      
      <div 
        className={styles.menuItemsContainer} 
        ref={containerRef}
        onScroll={handleScroll}
      >
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            <div className={styles.menuItemImageContainer}>
              <h3 className={styles.imageTitle}>{item.title}</h3>
              <img src={item.image} alt={item.title} className={styles.menuItemImage} />
              <p className={styles.imageDescription}>{item.description}</p>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuSlider