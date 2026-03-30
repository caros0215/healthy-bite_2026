"use client"

import { useRef, useState, useEffect } from "react"
import styles from "../MenuSlider/MenuSlider.module.css"

const imagen1 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620151/21_biljox.webp";
const imagen2 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620133/1_fvkwsy.webp";
const imagen3 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620147/18_ghcud8.webp";
const imagen4 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620134/2_gzl2jz.webp";
const imagen5 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620147/17_r0vqqz.webp";
const imagen6 = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620143/14_tkuhg7.webp";

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