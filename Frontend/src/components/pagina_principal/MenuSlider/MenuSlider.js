"use client"

import { useRef, useState, useEffect } from "react"
import styles from "../../pagina_principal/MenuSlider/MenuSlider.module.css"

const imagen1 = "https://ik.imagekit.io/b4rykldk3/21.webp?updatedAt=1777044905513";
const imagen2 = "https://ik.imagekit.io/b4rykldk3/1.webp?updatedAt=1777044892924";
const imagen3 = "https://ik.imagekit.io/b4rykldk3/18.webp?updatedAt=1777044901471";
const imagen4 = "https://ik.imagekit.io/b4rykldk3/2.webp?updatedAt=1777044900772";
const imagen5 = "https://ik.imagekit.io/b4rykldk3/17.webp?updatedAt=1777044897995";
const imagen6 = "https://ik.imagekit.io/b4rykldk3/14.webp?updatedAt=1777044898865";

const MenuSlider = () => {
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isMounted.current) setIsVisible(true)
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      isMounted.current = false
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const menuItems = [
    { id: 1, image: imagen1, title: "Para Compartir", icon: "→" },
    { id: 2, image: imagen2, title: "Torre pancakes", icon: "→" },
    { id: 3, image: imagen3, title: "Parfait", icon: "→" },
    { id: 4, image: imagen4, title: "Huevos napolitanos", icon: "→" },
    { id: 5, image: imagen5, title: "Tostada de aguacate", icon: "→" },
    { id: 6, image: imagen6, title: "Bebidas", icon: "→" },
  ]

  const scrollLeft = () => containerRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  const scrollRight = () => containerRef.current?.scrollBy({ left: 300, behavior: "smooth" })

  return (
    <div ref={sectionRef} className={`${styles.menuslidersection} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.menuheader}>
        <h2 className={`${styles.menutitle} ${isVisible ? styles.visible : ""}`}>
          COMES BIEN
          <br />
          TE SIENTES <br />
          BIEN.
        </h2>
        <div className={styles.menucontrols}>
          <button className={styles.menucontrolbutton} onClick={scrollLeft}>←</button>
          <button className={styles.menucontrolbutton} onClick={scrollRight}>→</button>
        </div>
      </div>

      <div className={styles.menuitemscontainer} ref={containerRef}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuitem}>
            <div className={styles.menuitemimagecontainer}>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className={styles.menuitemimage}
              />
            </div>
            <div className={styles.menuitemfooter}>
              <h3 className={styles.menuitemtitle}>{item.title}</h3>
              <span className={styles.menuitemicon}>{item.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuSlider