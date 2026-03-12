"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import CookieConsent from "../../pagina_principal/CookieConsent/CookieConsent"
import WelcomeOverlayCursos from "../../pagina_principal/WelcomeOverlay/WelcomeOverlayCursos"
import styles from "./cursos.module.css"

// Importaciones de imágenes originales
import imagen_3 from "../../../assets/images/run_2.webp"
import image2 from "../../../assets/images/empresarial.webp"

export default function CursosPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const heroContentRef = useRef(null)
  const firstImageRef = useRef(null)
  const secondImageRef = useRef(null)
  const transparentSectionRef = useRef(null)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [cursosDesigns, setCursosDesigns] = useState([])
  const [cursosCanva, setCursosCanva] = useState([])
  const [loadingDesigns, setLoadingDesigns] = useState(false)
  const [errorDesigns, setErrorDesigns] = useState(null)

  const [hoveredDesign, setHoveredDesign] = useState(null)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [photoViewerImage, setPhotoViewerImage] = useState(null)
  const [showHoverModal, setShowHoverModal] = useState(false)
  const [hoveredDay, setHoveredDay] = useState(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  const userId = 1

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setPageLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const fetchCursosDesigns = useCallback(async () => {
    setLoadingDesigns(true)
    setErrorDesigns(null)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    console.log('🔍 Fetching diseños para:', { userId, year, month });

    try {
      // Fetch diseños (textos)
      const designsResponse = await fetch(`http://localhost:5000/api/cursos/obtener-disenos/${userId}/${year}/${month}`)
      if (!designsResponse.ok) {
        const errorText = await designsResponse.text()
        throw new Error(`HTTP error! status: ${designsResponse.status} - ${errorText}`)
      }
      const designsData = await designsResponse.json()

      console.log('📚 Respuesta de diseños:', designsData);

      if (designsData.success) {
        setCursosDesigns(designsData.diseños)
        console.log('✅ Diseños guardados en estado:', designsData.diseños);
      } else {
        setErrorDesigns(designsData.error || "Error al obtener diseños de cursos")
      }

      // Fetch imágenes (canva)
      const canvaResponse = await fetch(`http://localhost:5000/api/cursos/obtener-canva/${userId}/${year}/${month}`)
      if (canvaResponse.ok) {
        const canvaData = await canvaResponse.json()
        console.log('🖼️ Respuesta de canva:', canvaData);
        if (canvaData.success) {
          setCursosCanva(canvaData.imagenes || [])
        }
      }
    } catch (error) {
      console.error("Error fetching cursos data:", error)
      setErrorDesigns(`No se pudieron cargar los datos de cursos: ${error.message}`)
    } finally {
      setLoadingDesigns(false)
    }
  }, [currentDate, userId])

  useEffect(() => {
    if (pageLoaded) {
      fetchCursosDesigns()
    }
  }, [pageLoaded, fetchCursosDesigns])

  useEffect(() => {
    console.log('📊 Estado actual:', {
      totalDesigns: cursosDesigns.length,
      designs: cursosDesigns,
      totalImages: cursosCanva.length,
      images: cursosCanva,
      currentMonth: currentDate.getMonth() + 1,
      currentYear: currentDate.getFullYear()
    });
  }, [cursosDesigns, cursosCanva, currentDate]);

  useEffect(() => {
    if (!pageLoaded) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      if (heroContentRef.current) {
        const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5))
        heroContentRef.current.style.opacity = opacity
      }

      if (transparentSectionRef.current) {
        const transparentRect = transparentSectionRef.current.getBoundingClientRect()
        const isInTransparentSection = transparentRect.top < windowHeight && transparentRect.bottom > 0
        if (isInTransparentSection) {
          if (firstImageRef.current) firstImageRef.current.style.opacity = "0"
          if (secondImageRef.current) secondImageRef.current.style.opacity = "1"
          return
        }
      }

      const whiteSections = document.querySelectorAll(`.${styles.calendarSection}`)
      const isInWhiteSection = Array.from(whiteSections).some((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top < windowHeight && rect.bottom > 0
      })

      if (isInWhiteSection) {
        if (firstImageRef.current) firstImageRef.current.style.opacity = "0"
        if (secondImageRef.current) secondImageRef.current.style.opacity = "0"
      } else {
        if (firstImageRef.current) firstImageRef.current.style.opacity = "1"
        if (secondImageRef.current) secondImageRef.current.style.opacity = "0"
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pageLoaded])

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, design: null })
    }

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    console.log('📅 Generando calendario para:', { currentMonth, currentYear, totalDays: daysInMonth });

    for (let day = 1; day <= daysInMonth; day++) {
      const designForDay = cursosDesigns.find((design) => {
        const designDate = new Date(design.fecha);
        const designMonth = designDate.getMonth() + 1;
        const designYear = designDate.getFullYear();
        
        const match = design.dia === day && 
               designMonth === currentMonth && 
               designYear === currentYear;

        if (match) {
          console.log('✅ Diseño encontrado:', {
            dia: design.dia,
            dayBuscado: day,
            fecha: design.fecha,
            titulo: design.titulo
          });
        }

        return match;
      })

      days.push({ day: day, design: designForDay })
    }

    console.log('📅 Días generados con diseños:', days.filter(d => d.design).length);

    return days
  }

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  // 🔥 FUNCIÓN CLAVE: Relaciona imagen con diseño por fecha
  const getImageByDate = (fechaDiseno) => {
    if (!cursosCanva.length || !fechaDiseno) {
      console.log('❌ No hay imágenes o fecha:', { 
        canvaLength: cursosCanva.length, 
        fechaDiseno 
      });
      return null
    }

    // Normalizar la fecha del diseño (quitar hora)
    const disenoDate = new Date(fechaDiseno)
    const disenoDateString = disenoDate.toISOString().split('T')[0] // YYYY-MM-DD

    console.log('🔍 Buscando imagen para fecha:', disenoDateString);

    const canvaImage = cursosCanva.find((canva) => {
      if (!canva.fecha_evento) {
        return false
      }

      // Normalizar la fecha del canva (quitar hora)
      const canvaDate = new Date(canva.fecha_evento)
      const canvaDateString = canvaDate.toISOString().split('T')[0] // YYYY-MM-DD

      const match = canvaDateString === disenoDateString

      if (match) {
        console.log('✅ Imagen encontrada:', {
          fechaDiseno: disenoDateString,
          fechaCanva: canvaDateString,
          tieneImagen: !!canva.imagen_base64
        });
      }

      return match
    })

    if (canvaImage) {
      if (canvaImage.imagen_base64) {
        if (canvaImage.imagen_base64.startsWith("data:image")) {
          return canvaImage.imagen_base64
        } else {
          return `data:image/jpeg;base64,${canvaImage.imagen_base64}`
        }
      }

      if (canva.imagen) {
        return canvaImage.imagen
      }
    } else {
      console.log('⚠️ No se encontró imagen para fecha:', disenoDateString);
    }

    return null
  }

  const getElementsText = (elements) => {
    if (!elements) return "Sin descripción"
    if (typeof elements === "string") {
      return elements
    }
    if (Array.isArray(elements) && elements.length > 0) {
      return elements[0].text || elements[0].content || "Ver detalles"
    }
    if (typeof elements === "object" && elements !== null) {
      return elements.description || elements.text || "Ver detalles"
    }
    return "Ver detalles"
  }

  const handleDayClick = (dayData) => {
    if (dayData.day && dayData.design) {
      console.log('🖱️ Click en día:', {
        day: dayData.day,
        design: dayData.design
      });
      
      setHoveredDesign(dayData.design)
      setShowHoverModal(true)
      setHoveredDay(null) // Cerrar el hover preview al abrir el modal
    }
  }

  const handleDayMouseEnter = (dayData, event) => {
    if (dayData.day && dayData.design) {
      const imageUrl = getImageByDate(dayData.design.fecha)
      console.log('🖱️ Mouse enter en día:', {
        day: dayData.day,
        fecha: dayData.design.fecha,
        imageUrl: imageUrl ? 'Imagen encontrada' : 'No hay imagen'
      });
      
      if (imageUrl) {
        const rect = event.currentTarget.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        
        // Calcular posición para que no se salga de la pantalla
        let x = rect.right + 10
        let y = rect.top
        
        // Si se sale por la derecha, mostrar a la izquierda
        if (x + 320 > windowWidth) {
          x = rect.left - 330
        }
        
        // Si se sale por abajo, ajustar hacia arriba
        if (y + 320 > windowHeight) {
          y = windowHeight - 330
        }
        
        setHoverPosition({ x, y })
        setHoveredDay({ ...dayData, imageUrl })
      }
    }
  }

  const handleDayMouseLeave = () => {
    setHoveredDay(null)
  }

  const closeModal = () => {
    setShowHoverModal(false)
    setHoveredDesign(null)
  }

  const openPhotoViewer = (imageUrl, title) => {
    setPhotoViewerImage({ url: imageUrl, title })
    setShowPhotoViewer(true)
    setShowHoverModal(false)
  }

  const closePhotoViewer = () => {
    setShowPhotoViewer(false)
    setPhotoViewerImage(null)
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa reservar una plaza para el curso: ${hoveredDesign?.titulo || "Curso de cocina"}`,
    )
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank")
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showPhotoViewer) {
          closePhotoViewer()
        } else if (showHoverModal) {
          closeModal()
        }
      }
    }

    if (showHoverModal || showPhotoViewer) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showHoverModal, showPhotoViewer])

  return (
    <main className={styles.mainContainer}>
      {showWelcome && <WelcomeOverlayCursos onClose={() => setShowWelcome(false)} />}

      <div className={styles.backgroundLayer}>
        <img src="/images/background-main.webp" alt="Fondo principal" className={styles.backgroundLayerImage} />
      </div>

      <div className={styles.fixedLayer}>
        <div ref={firstImageRef} className={`${styles.fixedImageContainer} ${styles.firstFixedImage}`}>
          <img src={imagen_3 || "/placeholder.svg"} alt="Comunidad" className={styles.fixedImage} />
        </div>
        <div ref={secondImageRef} className={`${styles.fixedImageContainer} ${styles.secondFixedImage}`}>
          <img
            src={typeof image2 === "string" ? image2 : "/placeholder.svg?height=1000&width=1000&query=empresarial"}
            alt="Comida"
            className={styles.fixedImage}
          />
        </div>
      </div>

      <div className={styles.scrollLayer}>
        <section className={styles.videoSection}>
          <img
            src={imagen_3 || "/placeholder.svg?height=1080&width=1920&query=cursos_cocina"}
            alt="Cursos de Cocina"
            className={styles.backgroundImage}
          />
          <div className={styles.overlay} />
          <div ref={heroContentRef} className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              CURSOS DE
              <br />
              COCINA.
            </h1>
            <p className={styles.heroSubtitle}>Descubre el arte culinario</p>
          </div>
        </section>

        <div className={styles.greenMarqueeContainer}>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeContent}>
              <span>COCINA MEDITERRÁNEA AUTÉNTICA</span>
              <span className={styles.separator}>•</span>
              <span>TÉCNICAS PROFESIONALES</span>
              <span className={styles.separator}>•</span>
              <span>INGREDIENTES FRESCOS DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>RECETAS TRADICIONALES</span>
              <span className={styles.separator}>•</span>
              <span>CURSOS PRÁCTICOS Y TEÓRICOS</span>
              <span className={styles.separator}>•</span>
              <span>PARA TODOS LOS NIVELES</span>
              <span className={styles.separator}>•</span>
              <span>COCINA SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>EXPERIENCIAS GASTRONÓMICAS ÚNICAS</span>
            </div>
            <div className={styles.marqueeContent}>
              <span>COCINA MEDITERRÁNEA AUTÉNTICA</span>
              <span className={styles.separator}>•</span>
              <span>TÉCNICAS PROFESIONALES</span>
              <span className={styles.separator}>•</span>
              <span>INGREDIENTES FRESCOS DE TEMPORADA</span>
              <span className={styles.separator}>•</span>
              <span>RECETAS TRADICIONALES</span>
              <span className={styles.separator}>•</span>
              <span>CURSOS PRÁCTICOS Y TEÓRICOS</span>
              <span className={styles.separator}>•</span>
              <span>PARA TODOS LOS NIVELES</span>
              <span className={styles.separator}>•</span>
              <span>COCINA SOSTENIBLE</span>
              <span className={styles.separator}>•</span>
              <span>EXPERIENCIAS GASTRONÓMICAS ÚNICAS</span>
            </div>
          </div>
        </div>

        <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400 rounded-full blur-2xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-bold bg-gradient-to-r from-[#b8d15a] to-[#8c9200] bg-clip-text text-transparent mb-6 pt-2 text-balance">
                🍳 Calendario Gastronómico
              </h2>
              <p className="text-xl text-black-950 max-w-3xl mx-auto text-pretty leading-relaxed font-bold">
                ✨ Descubre experiencias culinarias únicas diseñadas para despertar tu pasión por la cocina. Cada día es
                una nueva aventura gastronómica esperándote.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#b8d15a] to-[#8c9200] to-teal-400 rounded-t-3xl"></div>

              <div className="flex items-center justify-between mb-8">
                <button
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#b8d15a] to-[#8c9200] text-white hover:from-[#b5be00] hover:to-[#b5be00] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  onClick={() => navigateMonth(-1)}
                >

                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h3 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>

                <button
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#b8d15a] to-[#8c9200] text-white hover:from-[#b5be00] hover:to-[#b5be00] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  onClick={() => navigateMonth(1)}
                >
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-6">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center py-4 font-bold text-black-950 text-lg bg-[rgba(184,209,90,0.5)] rounded-xl"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {loadingDesigns ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center gap-4 text-xl text-gray-700">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-200 border-t-green-500"></div>
                    <span className="font-semibold">🍽️ Cargando experiencias gastronómicas...</span>
                  </div>
                </div>
              ) : errorDesigns ? (
                <div className="text-center py-20 text-red-600 text-lg font-semibold bg-red-50 rounded-xl border border-red-200 mx-4">
                  ⚠️ {errorDesigns}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-4 relative">
                  {generateCalendar().map((dayData, index) => {
                    const hasImage = dayData.design ? !!getImageByDate(dayData.design.fecha) : false
                    const hasDesign = !!dayData.design

                    return (
                      <div
                        key={index}
                        className={`
                          relative min-h-[140px] p-4 rounded-2xl transition-all duration-300
                          ${
                            hasDesign
                              ? hasImage 
                                ? "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
                                : "bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
                              : dayData.day
                                ? "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
                                : "opacity-30 cursor-default"
                          }
                          ${!dayData.day ? "" : "group"}
                        `}
                        onClick={() => dayData.day && hasDesign && handleDayClick(dayData)}
                        onMouseEnter={(e) => hasDesign && handleDayMouseEnter(dayData, e)}
                        onMouseLeave={handleDayMouseLeave}
                      >
                        {dayData.day && (
                          <>
                            <div className="text-xl font-bold text-gray-800 mb-3">{dayData.day}</div>
                            {hasDesign ? (
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className={`text-sm font-bold mb-2 line-clamp-2 ${hasImage ? 'text-green-700' : 'text-blue-700'}`}>
                                    {hasImage ? '🍳' : '📝'} {dayData.design.titulo}
                                  </div>
                                  <div className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                                    {getElementsText(dayData.design.elementos)}
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex gap-1">
                                    <span className={`w-2 h-2 ${hasImage ? 'bg-green-400' : 'bg-blue-400'} rounded-full animate-pulse`}></span>
                                    <span className={`w-2 h-2 ${hasImage ? 'bg-emerald-400' : 'bg-sky-400'} rounded-full animate-pulse delay-100`}></span>
                                    <span className={`w-2 h-2 ${hasImage ? 'bg-teal-400' : 'bg-cyan-400'} rounded-full animate-pulse delay-200`}></span>
                                  </div>
                                  <span className={`text-xs font-semibold ${hasImage ? 'text-green-600 group-hover:text-green-700' : 'text-blue-600 group-hover:text-blue-700'}`}>
                                    {hasImage ? '🖼️ Hover para ver' : '📋 Ver detalles'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <div className="text-2xl mb-2 opacity-50">📅</div>
                                <div className="text-xs text-gray-600 font-medium">Sin eventos</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}

                  {/* 🔥 Hover Image Preview - Popup flotante */}
                  {hoveredDay && hoveredDay.imageUrl && (
                    <div 
                      className="fixed z-50 pointer-events-none transition-all duration-200"
                      style={{
                        left: `${hoverPosition.x}px`,
                        top: `${hoverPosition.y}px`,
                      }}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-400 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <img
                          src={hoveredDay.imageUrl}
                          alt={hoveredDay.design.titulo}
                          className="w-80 h-80 object-cover"
                          onError={(e) => {
                            console.error('Error cargando imagen hover');
                            e.target.src = "/curso-cocina.webp"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                          <p className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                            {hoveredDay.design.titulo}
                          </p>
                          <p className="text-white/90 text-sm mt-1">
                            📅 {new Date(hoveredDay.design.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

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

      {/* Modal de detalles completo */}
      {showHoverModal && hoveredDesign && (() => {
        const imageUrl = getImageByDate(hoveredDesign.fecha)

        return (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-all duration-300"
              onClick={closeModal}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] transition-all duration-300 scale-100 opacity-100">
              <div className="bg-white rounded-3xl shadow-2xl border border-green-200 p-8 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-t-3xl"></div>

                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 text-balance">
                    {hoveredDesign.titulo || "Información del día"}
                  </h3>
                  <div className="text-gray-600 text-lg leading-relaxed">
                    {getElementsText(hoveredDesign.elementos)}
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    📅 {new Date(hoveredDesign.fecha).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {imageUrl ? (
                  <div className="mb-6">
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
                      onClick={() => openPhotoViewer(imageUrl, hoveredDesign.titulo)}
                    >
                      <img
                        src={imageUrl}
                        alt={hoveredDesign.titulo || "Imagen del curso"}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Error cargando imagen en modal');
                          e.target.src = "/curso-cocina.webp"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 rounded-full p-4 transform scale-75 group-hover:scale-100">
                          <svg
                            className="w-8 h-8 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-3 font-medium">
                      🔍 Haz clic para ver en pantalla completa
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8 text-center border-2 border-blue-200">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600 font-medium">
                      Este curso aún no tiene imagen de portada
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Puedes agregar una imagen más tarde
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    Reservar Plaza
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      })()}

      {/* Visor de fotos en pantalla completa */}
      {showPhotoViewer && photoViewerImage && (
        <div
          className="fixed inset-0 bg-black z-[10000] flex items-center justify-center transition-all duration-300"
          onClick={closePhotoViewer}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePhotoViewer}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-2xl font-light hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              aria-label="Cerrar visor de fotos"
            >
              ×
            </button>

            <div className="relative">
              <img
                src={photoViewerImage.url}
                alt={photoViewerImage.title || "Imagen del curso"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error('Error cargando imagen en visor completo');
                  e.target.src = "/curso-cocina.webp"
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold text-white mb-2">{photoViewerImage.title || "Curso de Cocina"}</h3>
                <p className="text-gray-300 text-lg">Presiona ESC o haz clic fuera de la imagen para cerrar</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}