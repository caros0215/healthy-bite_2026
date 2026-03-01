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
import image1 from "../../../assets/images/plato_2.jpeg"  // Ajusta la ruta según tu estructura
import image2 from "../../../assets/images/portada_2.jpg"
import imagen_1 from "../../../assets/images/1.jpeg"

// Debug: verificar imágenes importadas
const debugImages = () => {
  console.log('image1 (plato_2.jpeg):', image1)
  console.log('image2 (healthy_10.jpeg):', image2)  
  console.log('imagen_1 (placeholder.svg):', imagen_1)
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
            onLoad={() => console.log('✅ healthy_10.jpeg cargada correctamente')}
            onError={(e) => {
              console.error('❌ Error cargando healthy_10.jpeg:', e.target.src)
              console.log('Intentando rutas alternativas...')
              const alternatives = [
                '/images/healthy_10.jpg',
                '/images/healthy10.jpeg',
                '/images/Healthy_10.jpeg'
              ]
              
              if (alternatives[0]) {
                e.target.src = alternatives[0]
              }
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

        <section ref={videoTextSectionRef} className={styles.videoTextSection}>
          <div className={styles.videoTextContainer}>
            <div className={styles.videoContainer}>
              <video className={styles.sectionVideo} autoPlay muted loop playsInline>
                <source src="/videos/comida-saludable.mp4" type="video/mp4" />
                <img src="/images/comida-saludable.jpg" alt="Comida Saludable" />
              </video>
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