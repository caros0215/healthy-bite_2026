"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./pedir.module.css"
import CookieConsent from "../../pagina_principal/CookieConsent/CookieConsent"
// Importar estilos CSS correctamente
import iphoneFormStyles from "../Pedir_ahora/IPhoneForm.module.css"
// Importar el componente IPhoneForm correctamente
import IPhoneForm from "../Pedir_ahora/iphoneform"

import Corporativo from "../catering/Corporativo"
import Pedido from "../catering/pedido"
import Verde from "../catering/verde"

// Importar las imágenes directamente
const image1 = "https://ik.imagekit.io/b4rykldk3/plato_2.webp?updatedAt=1777063127446";
const image2 = "https://ik.imagekit.io/b4rykldk3/portada_2.webp";
const imagen_1 = "https://ik.imagekit.io/b4rykldk3/1.webp?updatedAt=1777044892924";
const imagenAlimentacion = "https://ik.imagekit.io/b4rykldk3/16.webp";

// Debug: verificar imágenes importadas
const debugImages = () => {
  console.log('image1 (plato_2.webp):', image1)
  console.log('image2 (healthy_10.webp):', image2)  
  console.log('imagen_1 (placeholder.svg):', imagen_1)
  console.log('imagenAlimentacion (11.webp):', imagenAlimentacion)
}

export default function CantinaPage() {
  const heroContentRef = useRef(null)
  const firstImageRef = useRef(null)
  const secondImageRef = useRef(null)
  const transparentSectionRef = useRef(null)
  const videoTextSectionRef = useRef(null)
  const iphoneSectionRef = useRef(null)

  const [pageLoaded, setPageLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setPageLoaded(true), 200)
    
    // Debug: verificar imágenes importadas
    debugImages()
    
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

      let showSecondImage = false

      if (transparentSectionRef.current) {
        const transparentRect = transparentSectionRef.current.getBoundingClientRect()
        const isInTransparentSection = transparentRect.top < windowHeight && transparentRect.bottom > 0

        if (isInTransparentSection) {
          showSecondImage = true
        }
      }

      const whiteSections = [
        videoTextSectionRef.current,
        iphoneSectionRef.current,
        document.querySelector(`.${styles.whiteSection}`),
        document.querySelector(`.${styles.whiteSection3}`),
        document.querySelector(`.${styles.whiteSection4}`),
      ].filter(Boolean)

      const isInWhiteSection = whiteSections.some((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top < windowHeight && rect.bottom > 0
      })

      if (isInWhiteSection) {
        if (firstImageRef.current) firstImageRef.current.style.opacity = "0"
        if (secondImageRef.current) secondImageRef.current.style.opacity = "0"
      } else if (showSecondImage) {
        if (firstImageRef.current) firstImageRef.current.style.opacity = "0"
        if (secondImageRef.current) secondImageRef.current.style.opacity = "1"
      } else {
        if (firstImageRef.current) firstImageRef.current.style.opacity = "1"
        if (secondImageRef.current) secondImageRef.current.style.opacity = "0"
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
          <img 
            src={image1} 
            alt="Comunidad" 
            className={styles.fixedImage} 
            onLoad={() => console.log('✅ image1 cargada correctamente')}
            onError={(e) => {
              console.error('❌ Error cargando image1:', e.target.src)
            }}
          />
        </div>
        <div ref={secondImageRef} className={`${styles.fixedImageContainer} ${styles.secondFixedImage}`}>
          <img
            src={image2}
            alt="Comida"
            className={styles.fixedImage}
            onLoad={() => console.log('✅ healthy_10.webp cargada correctamente')}
            onError={(e) => {
              console.error('❌ Error cargando healthy_10.webp:', e.target.src)
            }}
          />
        </div>
      </div>

      <div className={styles.scrollLayer}>
        <section className={styles.videoSection}>
          <img 
            src={imagen_1} 
            alt="Real Food Revolution" 
            className={styles.backgroundImage}
            onLoad={() => console.log('✅ imagen_1 cargada correctamente')}
            onError={(e) => {
              console.error('❌ Error cargando imagen_1:', e.target.src)
            }}
          />
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

        <div className={styles.greenMarqueeContainer}>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeContent}>
              <span className={styles.separator}>•</span>
              <span>PRODUCTO DE ORIGEN RESPONSABLE</span>
              <span className={styles.separator}>•</span>
              <span>POSTRES VEGANOS</span>
              <span className={styles.separator}>•</span>
              <span>DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>ABASTECIMIENTO SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>PLATOS PERSONALIZADOS</span>
            </div>
            <div className={styles.marqueeContent}>
              <span className={styles.separator}>•</span>
              <span>PRODUCTO DE ORIGEN RESPONSABLE</span>
              <span className={styles.separator}>•</span>
              <span>POSTRES VEGANOS</span>
              <span className={styles.separator}>•</span>
              <span>DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>ABASTECIMIENTO SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>PLATOS PERSONALIZADOS</span>
            </div>
          </div>
        </div>

        <section ref={videoTextSectionRef} className={styles.videoTextSection}>
          <div className={styles.videoTextContainer}>
            <div className={styles.videoContainer}>
              <img
                src={imagenAlimentacion}
                alt="Alimentación Consciente"
                className={styles.sectionVideo}
                onLoad={() => console.log('✅ 11.webp cargada correctamente')}
                onError={(e) => console.error('❌ Error cargando 11.webp:', e.target.src)}
              />
            </div>

            <div className={styles.textContainer}>
              <h2 className={styles.sectionTitle}>
                ALIMENTACIÓN
                <br />
                CONSCIENTE
              </h2>
              <p className={styles.sectionDescription}>
                Creemos que una buena alimentación es la base de una vida plena. Por eso, preparamos cada plato con
                ingredientes frescos, naturales y llenos de nutrientes que tu cuerpo necesita.
              </p>
              <p className={styles.sectionDescription}>
                Desde ensaladas vibrantes hasta bowls energéticos, cada comida está diseñada para nutrir tu cuerpo y
                satisfacer tu paladar. ¡Haz tu pedido y descubre el sabor de lo saludable!
              </p>
            </div>
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <div className={styles.sectionHeading}>
              <Corporativo />
            </div>
          </div>
        </section>

        <section ref={iphoneSectionRef} className={styles.iphoneSection}>
          <div className={styles.iphoneContentContainer}>
            <div className={styles.iphoneSectionHeader}>
              <h2 className={styles.iphoneSectionTitle}>HAZ TU PEDIDO</h2>
              <p className={styles.iphoneSectionSubtitle}>
                Completa el formulario y nos pondremos en contacto contigo por WhatsApp
              </p>
            </div>
            <IPhoneForm />
          </div>
        </section>

        <section className={styles.whiteSection3}>
          <div className={styles.contentContainer3}>
            <Pedido />
          </div>
        </section>

      </div>

      {/* <CookieConsent /> */}
    </main>
  )
}