"use client"

import { useEffect, useRef, useState } from "react"
import "../../../styles/globals.css"
import "../../../styles/home.css"
import miVideo from "../../../assets/images/Healthy Principal.webm"
import MenuSlider from "../MenuSlider/MenuSlider"
import EventosSlider from "../EventosSlider/EventosSliders"
import GridSections from "../GridSections/GridSections"
import FrasesSections from "../frases_2/frases_2"
import "../MenuSlider/MenuSlider.css"
import "../EventosSlider/EventosSliders.module.css"
import imagen1 from "../../../assets/images/plato_2.webp"
import imagen2 from "../../../assets/images/plato_3.webp"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { pdfjs } from "react-pdf"
import phoneImage from "../../../assets/images/ipad21.webp"
import menu1 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0001.webp"
import menu2 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0002.webp"
import menu3 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0003.webp"
import menu4 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0004.webp"
import menu5 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0005.webp"
import menu6 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0006.webp"
import menu7 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0007.webp"
import menu8 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0008.webp"
import menu9 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0009.webp"
import menu10 from "../../../assets/images/2025 MENU HEALTHYBITE (1)_page-0010.webp"
import AnimatedValues from "./AnimatedValues"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

function LandingPpage() {
  const heroContentRef = useRef(null)
  const firstImageRef = useRef(null)
  const secondImageRef = useRef(null)
  const videoRef = useRef(null)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // ✅ NUEVO: ref e estado para el tooltip del iPad
  const ipadSectionRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimerRef = useRef(null)

  const menuImages = [menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9, menu10]

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  // ✅ Fix iOS Safari: autoplay sin error al desmontar
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let isMounted = true

    video.muted = true
    video.playsInline = true
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "")

    const tryPlay = async () => {
      if (!isMounted) return
      try {
        await video.play()
      } catch (err) {
        if (!isMounted) return
        const handleFirstTouch = async () => {
          if (!isMounted) return
          try { await video.play() } catch (e) { }
        }
        document.addEventListener("touchstart", handleFirstTouch, { once: true })
      }
    }

    if (video.readyState >= 2) {
      tryPlay()
    } else {
      video.addEventListener("canplay", tryPlay, { once: true })
    }

    return () => {
      isMounted = false
      video.removeEventListener("canplay", tryPlay)
      try { video.pause() } catch (e) { }
    }
  }, [])

  // Force header to be transparent initially
  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!pageLoaded) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      if (heroContentRef.current) {
        const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5))
        heroContentRef.current.style.opacity = opacity.toString()
      }

      const sections = document.querySelectorAll(".transparent-section")
      if (sections.length >= 2 && firstImageRef.current && secondImageRef.current) {
        const firstSection = sections[0]
        const secondSection = sections[1]
        const firstRect = firstSection.getBoundingClientRect()
        const secondRect = secondSection.getBoundingClientRect()

        if (firstRect.top < windowHeight && firstRect.bottom > 0) {
          firstImageRef.current.style.opacity = "1"
          secondImageRef.current.style.opacity = "0"
        } else if (secondRect.top < windowHeight && secondRect.bottom > 0) {
          firstImageRef.current.style.opacity = "0"
          secondImageRef.current.style.opacity = "1"
        } else {
          firstImageRef.current.style.opacity = "0"
          secondImageRef.current.style.opacity = "0"
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.scrollTo(0, 0)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [pageLoaded])

  // ✅ NUEVO: IntersectionObserver para el tooltip del iPad - solo en móvil
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Cancelar timer previo si existe
          if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)

          // Resetear para forzar re-render de la animación
          setShowTooltip(false)
          tooltipTimerRef.current = setTimeout(() => {
            setShowTooltip(true)
          }, 300)
        } else {
          // Al salir de pantalla, ocultar
          setShowTooltip(false)
        }
      },
      { threshold: 0.4 }
    )

    if (ipadSectionRef.current) observer.observe(ipadSectionRef.current)

    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
      if (ipadSectionRef.current) observer.unobserve(ipadSectionRef.current)
    }
  }, [])

  const nextSlide = () => {
    if (currentSlide < menuImages.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isZoomed])

  return (
    <main className="main-container">
      <div className="fixed-layer">
        <div ref={firstImageRef} className="fixed-image-container first-fixed-image">
          <img src={imagen1 || "/placeholder.svg"} alt="Comunidad" className="fixed-image" />
        </div>
        <div ref={secondImageRef} className="fixed-image-container second-fixed-image">
          <img src={imagen2 || "/placeholder.svg"} alt="Comida" className="fixed-image" />
        </div>
      </div>

      <div className="scroll-layer">

        {/* Video Section */}
        <section className="video-section">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="background-video"
          >
            <source src={miVideo} type="video/webm" />
          </video>
          <div className="overlay"></div>
          <div ref={heroContentRef} className="hero-content">
            <h1 className="hero-title">
              TU VIDA
              <br />
              SALUDABLE.
            </h1>
            <AnimatedValues
              values={[
                "Creemos en una forma de vivir más consciente, más natural y más honesta.",
                "Porque estar bien no es una moda, es una decisión diaria.",
                "No queremos cambiar tu cuerpo, queremos transformar tu relación con lo que comes, con que piensas y con lo que sientes.",
                "Este no es solo un restaurante: es un movimiento hacia una vida más plena, más libre y sobre todo más sana.",
              ]}
            />
          </div>
        </section>

        {/* Menu Section */}
        <section className="white-section">
          <div className="content-container">
            <div className="section-heading">
              <p className="section-lead">EXPLORA NUESTRO MENÚ</p>
            </div>
            <MenuSlider />
          </div>
        </section>

        {/* Community Section */}
        <section className="transparent-section">
          <div className="content-container">
            <div className="transparent-content">
              <h1 className="transparent-title">
                QUE ES
                <br />
                HEALTHYBITE.
              </h1>
              <p className="transparent-text">
                ESTE NO ES SOLO UN RESTAURANTE: ES UN MOVIMIENTO HACIA UNA VIDA MÁS PLENA, MÁS LIBRE Y SOBRE TODO MÁS
                SANA.
              </p>
            </div>
          </div>
          <FrasesSections />
        </section>

        {/* Grid Section */}
        <section className="white-section3">
          <div className="content-container3">
            <GridSections />
          </div>
        </section>

        {/* Events Section - sin content-container para que ocupe todo el ancho */}
        <section className="white-section4" id="conocenos">
          <EventosSlider />
        </section>

        {/* Second transparent section - iPad menú */}
        <section className="transparent-section" ref={ipadSectionRef}>
          <div className="content-container10 horizontal-layout">
            <div className="transparent-content2">
              <h1 className="transparent-title">
                Aqui se cocina
                <br />
                con amor.
              </h1>
              <p className="transparent-text">
                Ingredientes frescos y de temporada seleccionados cuidadosamente para ofrecerte lo mejor. Nuestro
                compromiso es con la calidad y la sostenibilidad en cada plato que servimos.
              </p>
            </div>

            <div className="phone-container">
              <div className="menu-slider-container">
                <div
                  className="menu-slides"
                  style={{
                    transform: `translateX(-${currentSlide * 10}%)`,
                  }}
                >
                  {menuImages.map((image, index) => (
                    <div key={index} className="menu-slide-wrapper">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Menú página ${index + 1}`}
                        className="menu-slide"
                      />
                    </div>
                  ))}
                </div>

                <button onClick={prevSlide} className="slider-button1" disabled={currentSlide === 0}>
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="slider-button2"
                  disabled={currentSlide === menuImages.length - 1}
                >
                  →
                </button>
                <button
                  onClick={toggleZoom}
                  className="zoom-button"
                  style={{ position: "absolute", zIndex: 9999, bottom: "20%", right: "36%" }}
                >
                  <div className="zoom-icon">
                    <span className="zoom-arrow zoom-arrow-tl"></span>
                    <span className="zoom-arrow zoom-arrow-br"></span>
                  </div>
                </button>

                {/* ✅ Tooltip flotante - solo visible en móvil cuando showTooltip=true */}
                {showTooltip && (
                  <div className="zoom-tooltip tooltip-visible">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                    Toca para ampliar
                  </div>
                )}
              </div>

              <div className="phone-frame-wrapper">
                <img src={phoneImage || "/placeholder.svg"} alt="iPad frame" className="phone-frame" />
              </div>
              <div className="slider-controls">
                <span className="slide-info">
                  {currentSlide + 1} / {menuImages.length}
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div className="zoom-modal" onClick={toggleZoom}>
          <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={menuImages[currentSlide] || "/placeholder.svg"}
              alt={`Menú página ${currentSlide + 1} ampliada`}
              className="zoom-modal-image"
            />
            <button className="zoom-close-button" onClick={toggleZoom}>
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default LandingPpage