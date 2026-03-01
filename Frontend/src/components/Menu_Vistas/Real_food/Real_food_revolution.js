"use client"

import { useEffect, useRef, useState } from "react"
import CookieConsent from "../../pagina_principal/CookieConsent/CookieConsent"
import LogoColor from "../../../assets/images/logo_verde.png"
import LogoWhite from "../../../assets/images/logo_blanco.png"
import styles from "./Real_food_revolution.module.css"
import imagen_1 from "../../../assets/images/platos_2.jpg"
import Proposito from "./Proposito"
import MenuSlider2 from "../Real_food/MenuSliderFood"
import Frases2 from "../Real_food/Frases2"

export default function CantinaPage() {
  const heroContentRef = useRef(null)
  const firstImageRef = useRef(null)
  const secondImageRef = useRef(null)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setPageLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!pageLoaded) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      if (heroContentRef.current) {
        const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5))
        heroContentRef.current.style.opacity = opacity
      }

      // Control de imágenes fijas
      const sections = document.querySelectorAll(`.${styles.transparentSection}`)
      if (sections.length >= 2) {
        const [firstSection, secondSection] = sections
        const firstRect = firstSection.getBoundingClientRect()
        const secondRect = secondSection.getBoundingClientRect()

        firstImageRef.current.style.opacity = firstRect.top < windowHeight && firstRect.bottom > 0 ? "1" : "0"
        secondImageRef.current.style.opacity = secondRect.top < windowHeight && secondRect.bottom > 0 ? "1" : "0"
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pageLoaded])

 
  return (
    <main className={styles.mainContainer}>
      <div className={styles.fixedLayer}>
        <div ref={firstImageRef} className={`${styles.fixedImageContainer} ${styles.firstFixedImage}`}>
          <img src="/images/plato_2.jpeg" alt="Comunidad" className={styles.fixedImage} />
        </div>
        <div ref={secondImageRef} className={`${styles.fixedImageContainer} ${styles.secondFixedImage}`}>
          <img src="/images/plato_3.jpeg" alt="Comida" className={styles.fixedImage} />
        </div>
      </div>

      <div className={styles.scrollLayer}>
        <section className={styles.videoSection}>
          {/* Reemplazado el video por una imagen */}
          <img 
            src={imagen_1} 
            alt="Real Food Revolution" 
            className={styles.backgroundImage} 
          />
          <div className={styles.overlay} />
          
          <div ref={heroContentRef} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>REAL FOOD<br />REVOLUTION.</h1>
            <p className={styles.heroSubtitle}>Descubre nuestros valores</p>
          </div>
        </section>

        {/* Línea verde con marquee de nombres de comidas */}
        <div className={styles.greenMarqueeContainer}>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeContent}>
              <span>IMPULSADO POR LA COCINA MEDITERRÁNEA</span>
              <span className={styles.separator}>•</span>
              <span>CERVEZA ARTESANAL</span>
              <span className={styles.separator}>•</span>
              <span>PRODUCTO DE ORIGEN RESPONSABLE</span>
              <span className={styles.separator}>•</span>
              <span>POSTRES VEGANOS</span>
              <span className={styles.separator}>•</span>
              <span>COCINA SALUDABLE IMPULSADA POR EL CHEF</span>
              <span className={styles.separator}>•</span>
              <span>DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>ABASTECIMIENTO SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>PLATOS PERSONALIZADOS</span>
            </div>
            {/* Duplicamos el contenido para crear el efecto de marquee infinito */}
            <div className={styles.marqueeContent}>
              <span>IMPULSADO POR LA COCINA MEDITERRÁNEA</span>
              <span className={styles.separator}>•</span>
              <span>CERVEZA ARTESANAL</span>
              <span className={styles.separator}>•</span>
              <span>PRODUCTO DE ORIGEN RESPONSABLE</span>
              <span className={styles.separator}>•</span>
              <span>POSTRES VEGANOS</span>
              <span className={styles.separator}>•</span>
              <span>COCINA SALUDABLE IMPULSADA POR EL CHEF</span>
              <span className={styles.separator}>•</span>
              <span>DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>ABASTECIMIENTO SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>PLATOS PERSONALIZADOS</span>
            </div>
          </div>
        </div>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <div className={styles.sectionHeading}>
              <Proposito />
            </div>
           
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <MenuSlider2/> 
          </div>
        </section>



      </div>

      {/* <CookieConsent /> */}
    </main>
  )
}