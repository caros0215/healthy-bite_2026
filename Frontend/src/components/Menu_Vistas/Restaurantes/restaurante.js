{/*
"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./LandingPage.module.css"
import CookieConsent from "../CookieConsent/CookieConsent"
import miVideo from "../../../assets/images/video_1.mp4"
import LogoColor from "../../../assets/images/logo_verde.webp"
import LogoWhite from "../../../assets/images/logo_blanco.webp"
import MenuSlider from "../MenuSlider/MenuSlider"
import EventosSlider from "../EventosSlider/EventosSlider"
import TieredCollapsible from "../TieredCollapsible/TieredCollapsible"
import Frases from "../Frases/Frases"
import GridSections from "../GridSections/GridSections"
import phoneImage from "../../../assets/images/phone_14_01-Photoroom.webp"
import phoneImage2 from "../../../assets/images/diagonal_2.webp"
import { menuImages } from "../../../data/menuImages"

export default function CantinaPage() {
  const headerRef = useRef(null)
  const heroContentRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
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

      if (headerRef.current) {
        const shouldScrolled = scrollY > 70
        headerRef.current.classList.toggle(styles.headerWhite, shouldScrolled)
        setScrolled(shouldScrolled)
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

  const handleSlide = (direction) => {
    setCurrentSlide(prev => Math.max(0, Math.min(menuImages.length - 1, prev + direction)))
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.fixedLayer}>
        <div ref={firstImageRef} className={`${styles.fixedImageContainer} ${styles.firstFixedImage}`}>
          <img src="/images/plato_2.webp" alt="Comunidad" className={styles.fixedImage} />
        </div>
        <div ref={secondImageRef} className={`${styles.fixedImageContainer} ${styles.secondFixedImage}`}>
          <img src="/images/plato_3.webp" alt="Comida" className={styles.fixedImage} />
        </div>
      </div>

      <div className={styles.scrollLayer}>
        <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.headerWhite : ""}`}>
          <div className={styles.logoNavContainer}>
            <a href="/" className={styles.logo}>
              <img 
                src={scrolled ? LogoColor : LogoWhite} 
                alt="Honest Greens" 
                width="150"
              />
            </a>
            <nav className={styles.navigation}>
              <a href="#" className={styles.navLink}>Real Food Revolution</a>
              <a href="#" className={styles.navLink}>Restaurantes</a>
              <a href="#" className={styles.navLink}>Catering</a>
              <a href="#" className={styles.navLink}>Cantina</a>
              <a href="#" className={styles.navLink}>Nuestra historia</a>
              <a href="#" className={styles.navLink}>Honest Beans</a>
            </nav>
          </div>
          <a href="#" className={styles.orderButton}>
            PIDE AHORA <span className={styles.arrowIcon}>→</span>
          </a>
        </header>

        <section className={styles.videoSection}>
          <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
            <source src={miVideo} type="video/mp4" />
          </video>
          <div className={styles.overlay} />
          
          <div ref={heroContentRef} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>TU VIDA<br />SALUDABLE.</h1>
            <p className={styles.heroSubtitle}>Descubre nuestros valores</p>
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionLead}>EXPLORA NUESTRO MENÚ</p>
            </div>
            <MenuSlider />
          </div>
        </section>

        <section className={styles.transparentSection}>
          <div className={styles.contentContainer}>
            <div className={styles.transparentContent}>
              <h1 className={styles.transparentTitle}>JOIN THE<br />COMMUNITY.</h1>
              <p className={styles.transparentText}>
                Únete a Honest People y obtén acceso privilegiado
              </p>
              <button className={styles.downloadButton}>Descarga la App</button>
            </div>
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <TieredCollapsible />
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <GridSections />
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <EventosSlider />
          </div>
        </section>

        <section className={styles.transparentSection}>
          <div className={styles.splitLayout}>
            <div className={styles.transparentContent}>
              <h1 className={styles.transparentTitle}>COMIDA<br />REAL.</h1>
              <button className={styles.menuButton}>Ver Menú</button>
            </div>
            
            <div className={styles.phonesContainer}>
              <div className={styles.phoneContainer}>
                <div className={styles.phoneFrameWrapper}>
                  <img src={phoneImage} alt="iPhone" className={styles.phoneFrame} />
                  <div className={styles.menuSliderContainer}>
                    <div 
                      className={styles.menuSlides} 
                      style={{ transform: `translateX(-${currentSlide * 10}%)` }}
                    >
                      {menuImages.map((img, index) => (
                        <div key={index} className={styles.menuSlideWrapper}>
                          <img src={img} alt={`Menú ${index + 1}`} className={styles.menuSlide} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={styles.sliderControls}>
                  <button 
                    onClick={() => handleSlide(-1)}
                    className={styles.sliderButton}
                    disabled={currentSlide === 0}
                  >
                    ←
                  </button>
                  <span className={styles.slideInfo}>
                    {currentSlide + 1} / {menuImages.length}
                  </span>
                  <button 
                    onClick={() => handleSlide(1)}
                    className={styles.sliderButton}
                    disabled={currentSlide === menuImages.length - 1}
                  >
                    →
                  </button>
                </div>
              </div>

              <div className={styles.staticPhoneContainer}>
                <img src={phoneImage2} alt="iPhone" className={styles.phoneFrame} />
                <div className={styles.staticContent}>
                  <img src={LogoColor} alt="Logo" className={styles.phoneLogo} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.whiteSection}>
          <div className={styles.contentContainer}>
            <Frases />
          </div>
        </section>

        <section className={`${styles.whiteSection} ${styles.footerSection}`}>
          <div className={styles.contentContainer}>
            <h2 className={styles.sectionTitle}>CONTACTO</h2>
            <button className={styles.contactButton}>Contáctanos</button>
          </div>
        </section>
      </div>

      {/* <CookieConsent /> */}
    </main>
  )
}
*/}
