import { useEffect, useRef, useState } from "react"
import CookieConsent from "../../pagina_principal/CookieConsent/CookieConsent"
import styles from "./catering.module.css"
import imagen_1 from "../../../assets/images/portada_2.jpg"
import image2 from "../../../assets/images/empresarial.jpeg"
import Corporativo from "./Corporativo"
import ServiciosCorporativos from "./wellness-services"
import MenuSlider3 from "./Menuslider_3"
import Pedido from "./pedido"
import Verde from "./verde"

export default function CantinaPage() {
  const heroContentRef = useRef(null)
  const firstImageRef = useRef(null)
  const secondImageRef = useRef(null)
  const transparentSectionRef = useRef(null)
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
      const documentHeight = document.body.scrollHeight

      // Control de la opacidad del contenido del hero
      if (heroContentRef.current) {
        const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5))
        heroContentRef.current.style.opacity = opacity
      }

      // Detectar si estamos en la sección transparente
      if (transparentSectionRef.current) {
        const transparentRect = transparentSectionRef.current.getBoundingClientRect()
        const isInTransparentSection = transparentRect.top < windowHeight && transparentRect.bottom > 0

        // Si estamos en la sección transparente, mostrar la segunda imagen
        if (isInTransparentSection) {
          firstImageRef.current.style.opacity = "0"
          secondImageRef.current.style.opacity = "1"
          return
        }
      }

      // Detectar si estamos en alguna sección blanca
      const whiteSections = document.querySelectorAll(
        `.${styles.whiteSection}, .${styles.whiteSection3}, .${styles.whiteSection4}`,
      )

      const isInWhiteSection = Array.from(whiteSections).some((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top < windowHeight && rect.bottom > 0
      })

      // Si estamos en una sección blanca, ocultar ambas imágenes
      if (isInWhiteSection) {
        firstImageRef.current.style.opacity = "0"
        secondImageRef.current.style.opacity = "0"
      } else {
        // En cualquier otro caso (como el hero), mostrar la primera imagen
        firstImageRef.current.style.opacity = "1"
        secondImageRef.current.style.opacity = "0"
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
          <img
            src={typeof image2 === "string" ? image2 : "/images/healthy_10.jpeg"}
            alt="Comida"
            className={styles.fixedImage}
          />
        </div>
      </div>

      <div className={styles.scrollLayer}>
        <section className={styles.videoSection}>
          <img src={imagen_1 || "/placeholder.svg"} alt="Real Food Revolution" className={styles.backgroundImage} />
          <div className={styles.overlay} />

          <div ref={heroContentRef} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              REAL FOOD
              <br />
              REVOLUTION.
            </h1>
            <p className={styles.heroSubtitle}>Descubre nuestros valores</p>
          </div>
        </section>

        {/* Línea verde con marquee */}
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
              <Corporativo />
            </div>
          </div>
        </section>

        

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <MenuSlider3 />
          </div>
        </section>

         {/* NUEVO: Sección de Servicios Corporativos */}
        <ServiciosCorporativos />

        {/* Sección transparente */}
        <section ref={transparentSectionRef} className={styles.transparentSection}>
          <div className={styles.contentContainer}>
            <div className={styles.transparentContent}>
              <h1 className={styles.transparentTitle}>
                DISFRUTA
                <br />
                COMER SANO.
              </h1>
            </div>
          </div>
        </section>
      </div>

      {/* <CookieConsent /> */}
    </main>
  )
}