import { useState, useEffect } from "react"
import styles from './IPhoneForm.module.css'
import imagen1 from '../../../assets/images/phone_14_01-Photoroom-1.webp';
import imagen2 from '../../../assets/images/ipad21_2.webp';
import imagen3 from '../../../assets/images/senal_3.webp';
import imagen4 from '../../../assets/images/artes-04.webp';
import menu1 from '../../../assets/images/2026 MENU HEALTHYBITE-1.webp';
import menu2 from '../../../assets/images/2026 MENU HEALTHYBITE-2.webp';
import menu3 from '../../../assets/images/2026 MENU HEALTHYBITE-3.webp';
import menu4 from '../../../assets/images/2026 MENU HEALTHYBITE-4.webp';
import menu5 from '../../../assets/images/2026 MENU HEALTHYBITE-5.webp';
import menu6 from '../../../assets/images/2026 MENU HEALTHYBITE-6.webp';
import menu7 from '../../../assets/images/2026 MENU HEALTHYBITE-7.webp';
import menu8 from '../../../assets/images/2026 MENU HEALTHYBITE-8.webp';
import menu9 from '../../../assets/images/2026 MENU HEALTHYBITE-9.webp';
import menu10 from '../../../assets/images/2026 MENU HEALTHYBITE-10.webp';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

const RealFoodRevolution = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    barrio: "",
    tipoPago: "",
    tipoComida: "",
    platoSeleccionado: "",
    observacion: "",
    recargoNocturno: false,
    usaDatafono: false,
    prestaMaleta: false,
  })
  const [showMessage, setShowMessage] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [adicionalesSeleccionados, setAdicionalesSeleccionados] = useState([])
  const [showScrollHint, setShowScrollHint] = useState(true)

  const [opcionesMenu, setOpcionesMenu] = useState([])
  const [preciosDomicilio, setPreciosDomicilio] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [errorData, setErrorData] = useState(null)

  const menuImages = [menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9, menu10]

  const adicionales = [
    { nombre: "Leche de almendras", precio: 4000 },
    { nombre: "Leche A2", precio: 4000 },
    { nombre: "Pollo", precio: 10000 },
    { nombre: "Res", precio: 12000 },
    { nombre: "Huevo", precio: 6000 },
    { nombre: "Carbohidrato", precio: 9000 },
    { nombre: "Fruta", precio: 9000 },
    { nombre: "Aderezos", precio: 5000 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      setErrorData(null)
      try {
        const [menuRes, domiciliosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/menu`),
          fetch(`${API_BASE_URL}/api/precios-domicilio`),
        ])

        if (!menuRes.ok) throw new Error(`Error al cargar el menu: ${menuRes.status}`)
        if (!domiciliosRes.ok) throw new Error(`Error al cargar los precios de domicilio: ${domiciliosRes.status}`)

        const menuData = await menuRes.json()
        const domiciliosData = await domiciliosRes.json()

        setOpcionesMenu(menuData)
        setPreciosDomicilio(domiciliosData)
      } catch (err) {
        console.error("Error cargando datos:", err)
        setErrorData(err.message)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Ocultar el hint de scroll despues de 5 segundos o al hacer scroll
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleScroll = () => {
    setShowScrollHint(false)
  }

  const handleAdicionalChange = (e) => {
    const selectedValue = e.target.value
    if (selectedValue && !adicionalesSeleccionados.includes(selectedValue)) {
      setAdicionalesSeleccionados(prev => [...prev, selectedValue])
    }
    e.target.value = "" // Reset select
  }

  const removeAdicional = (nombre) => {
    setAdicionalesSeleccionados(prev => prev.filter(a => a !== nombre))
  }

  const getTotalAdicionales = () =>
    adicionalesSeleccionados.reduce((sum, nombre) => {
      const found = adicionales.find(a => a.nombre === nombre)
      return sum + (found ? found.precio : 0)
    }, 0)

  const getPrecioDomicilio = () => {
    if (!formData.barrio) return 0
    const found = preciosDomicilio.find(i => i.barrio === formData.barrio)
    return found ? found.precio : 0
  }

  const getRecargoDatafono = () => Math.round(getPrecioDomicilio() * 0.5)

  const calcularTotal = () => {
    let subtotal = 0
    if (formData.tipoComida === "Almuerzo del dia") {
      subtotal = 31000
    } else if (formData.tipoComida === "Comida del menu" && formData.platoSeleccionado) {
      const plato = opcionesMenu.find(p =>
        `${p.nombre} - ${p.precio.toLocaleString()}` === formData.platoSeleccionado
      )
      if (plato) subtotal = plato.precio
    }
    const empaque   = 2000
    const domicilio = getPrecioDomicilio()
    const nocturno  = formData.recargoNocturno ? 500 : 0
    const datafono  = formData.usaDatafono ? getRecargoDatafono() : 0
    const maleta    = formData.prestaMaleta ? 2000 : 0
    const adics     = getTotalAdicionales()
    return subtotal + empaque + domicilio + nocturno + datafono + maleta + adics
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isZoomed ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [isZoomed])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowMessage(true)

    const total = calcularTotal()
    const extrasLineas = [
      formData.recargoNocturno ? `Recargo nocturno (despues 10 PM): $500` : null,
      formData.usaDatafono    ? `Recargo datafono (50% domicilio): $${getRecargoDatafono().toLocaleString()}` : null,
      formData.prestaMaleta   ? `Prestamo de maleta: $2.000` : null,
    ].filter(Boolean).join("\n")

    const adicsLineas = adicionalesSeleccionados.length > 0
      ? adicionalesSeleccionados.map(nombre => {
          const found = adicionales.find(a => a.nombre === nombre)
          return `  - ${nombre}: $${found ? found.precio.toLocaleString() : 0}`
        }).join("\n")
      : ""

    let infoAdicional = ""
    if (formData.tipoPago === "Transferencia") {
      infoAdicional = `

**SI ELIGES TRANSFERENCIA RECUERDA:**
1- Solo recibimos de Bancolombia o Davivienda. (Otros bancos no)

**DATOS BANCARIOS:**
Bancolombia ahorros: 37300002343
Davivienda ahorros: 85670011494

**TOTAL A TRANSFERIR: $${total.toLocaleString()}**
(Incluye $2,000 del empaque biodegradable)

Recuerda que cobramos $2,000 por el empaque biodegradable, contribuyendo asi a cuidar nuestro planeta.

**IMPORTANTE:** Despues de realizar la transferencia, envia el pantallazo del comprobante a este WhatsApp para terminar el proceso.

Esperamos tu respuesta para preparar y enviar tu pedido lo antes posible! Gracias por elegir HEALTHYBITE!`
    } else {
      infoAdicional = `

Recuerda que cobramos $2,000 por el empaque biodegradable, contribuyendo asi a cuidar nuestro planeta.

Gracias por elegir HEALTHYBITE!`
    }

    const mensaje = `**NUEVO PEDIDO - COMIDA SALUDABLE**
**Nombre:** ${formData.nombre}
**Correo:** ${formData.correo}
**Telefono:** ${formData.telefono}
**Direccion:** ${formData.direccion}
**Barrio:** ${formData.barrio}
**Tipo de Pedido:** ${formData.tipoComida}
${formData.platoSeleccionado ? `**Plato Seleccionado:** ${formData.platoSeleccionado}` : ""}
${adicsLineas ? `**Adicionales:**\n${adicsLineas}` : ""}
**Tipo de Pago:** ${formData.tipoPago}
${extrasLineas ? `\n**Extras:**\n${extrasLineas}` : ""}
**TOTAL CALCULADO:** $${total.toLocaleString()}
**Observacion:** ${formData.observacion}${infoAdicional}
---
Pedido realizado desde pagina Healthybite manizales`

    const numeroWhatsApp = "3147139843"
    const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`

    setTimeout(() => {
      window.open(whatsappURL, "_blank")
      setFormData({
        nombre: "", correo: "", telefono: "", direccion: "",
        barrio: "", tipoPago: "", tipoComida: "", platoSeleccionado: "",
        observacion: "", recargoNocturno: false, usaDatafono: false, prestaMaleta: false,
      })
      setAdicionalesSeleccionados([])
      setTimeout(() => setShowMessage(false), 3000)
    }, 2000)
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % menuImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + menuImages.length) % menuImages.length)
  const toggleZoom = () => setIsZoomed(!isZoomed)

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>

        {/* iPhone Section - Columna 1 */}
        <div className={styles.iphoneSection}>
          <div className={styles.iphoneDecorations}>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble1}`} style={{top: '15%', left: '-10%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble2}`} style={{top: '25%', right: '-15%'}}>🌿</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble3}`} style={{bottom: '30%', left: '-20%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble4}`} style={{bottom: '15%', right: '-10%'}}>🌱</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble5}`} style={{top: '35%', left: '-25%'}}>🥑</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble6}`} style={{top: '45%', right: '-25%'}}>🥕</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble7}`} style={{bottom: '40%', left: '-15%'}}>🥒</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble8}`} style={{bottom: '25%', right: '-20%'}}>🍅</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble9}`} style={{top: '20%', left: '-5%'}}>✨</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble10}`} style={{top: '60%', right: '-8%'}}>⭐</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble11}`} style={{bottom: '45%', left: '-12%'}}>💫</div>
          </div>

          <div className={styles.iphoneContainer}>
            <div className={styles.iphoneWrapper}>
              <div className={styles.iphoneImage}>
                <img src={imagen1} alt="iPhone" />
              </div>

              <div className={styles.dynamicIsland}>
                <div className={styles.islandDot1}></div>
                <div className={styles.islandDot2}></div>
              </div>

              <div className={styles.formOverlay}>
                <div className={styles.statusBar}>
                  <span className={styles.statusTime}>9:41</span>
                  <div className={styles.statusIcons}>
                    <img src={imagen3} alt="Logo Status" className={styles.statusLogo} />
                  </div>
                </div>

                <div className={styles.appContent} onScroll={handleScroll}>
                  {/* Mensaje de scroll */}
                  {showScrollHint && !showMessage && (
                    <div className={styles.scrollHint}>
                      <div className={styles.scrollHintIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12l7 7 7-7"/>
                        </svg>
                      </div>
                      <span>Desliza hacia abajo para completar el formulario</span>
                    </div>
                  )}

                  {!showMessage ? (
                    <>
                      <div className={styles.formHeader}>
                        <div className={styles.headerLogo}>
                          <div className={styles.logoImage}>
                            <img src={imagen4} alt="Logo" />
                          </div>
                        </div>
                        <h1 className={styles.headerTitle}>Hacer Pedido</h1>
                        <p className={styles.headerSubtitle}>Comida saludable a domicilio</p>
                      </div>

                      {errorData && (
                        <div className={styles.errorBanner}>
                          No se pudieron cargar los datos. Revisa tu conexion o contacta soporte.
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className={styles.orderForm}>
                        <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required className={styles.formInput} />
                        <input type="email" name="correo" placeholder="Correo electronico" value={formData.correo} onChange={handleChange} required className={styles.formInput} />
                        <input type="tel" name="telefono" placeholder="Telefono" value={formData.telefono} onChange={handleChange} required className={styles.formInput} />
                        <input type="text" name="direccion" placeholder="Direccion de entrega" value={formData.direccion} onChange={handleChange} required className={styles.formInput} />

                        <select name="barrio" value={formData.barrio} onChange={handleChange} required className={styles.formSelect} disabled={loadingData}>
                          <option value="">
                            {loadingData ? "Cargando barrios..." : "Selecciona tu barrio"}
                          </option>
                          {preciosDomicilio.map((item) => (
                            <option key={item.id ?? item.barrio} value={item.barrio}>
                              {item.barrio} - ${item.precio.toLocaleString()}
                            </option>
                          ))}
                        </select>

                        <select name="tipoComida" value={formData.tipoComida} onChange={handleChange} required className={styles.formSelect}>
                          <option value="">Selecciona tipo de pedido</option>
                          <option value="Almuerzo del dia">Almuerzo del dia - $31.000</option>
                          <option value="Comida del menu">Comida del menu</option>
                        </select>

                        {formData.tipoComida === "Comida del menu" && (
                          <select name="platoSeleccionado" value={formData.platoSeleccionado} onChange={handleChange} required className={styles.formSelect} disabled={loadingData}>
                            <option value="">
                              {loadingData ? "Cargando menu..." : "Selecciona un plato del menu"}
                            </option>
                            {opcionesMenu.map((plato) => (
                              <option key={plato.id ?? plato.nombre} value={`${plato.nombre} - ${plato.precio.toLocaleString()}`}>
                                {plato.nombre} - ${plato.precio.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        )}

                        <select name="tipoPago" value={formData.tipoPago} onChange={handleChange} required className={styles.formSelect}>
                          <option value="">Selecciona tipo de pago</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Datafono">Datafono</option>
                        </select>

                        {formData.tipoPago === "Efectivo" && (
                          <div className={styles.cashInfo}>
                            <h3 className={styles.cashTitle}>PAGO EN EFECTIVO</h3>
                            <div className={styles.cashContent}>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>TOTAL A PAGAR:</h4>
                                <div className={styles.totalAmount}>${calcularTotal().toLocaleString()}</div>
                                <p className={styles.totalNote}>(Incluye $2,000 del empaque biodegradable + domicilio)</p>
                              </div>
                              <div className={styles.ecoMessage}><p>Recuerda que cobramos $2,000 por el empaque biodegradable, contribuyendo asi a cuidar nuestro planeta.</p></div>
                              <div className={styles.instructions}><p><strong>IMPORTANTE:</strong> Ten listo el dinero exacto o cambio para facilitar la entrega.</p></div>
                              <div className={styles.thankYou}><p>Gracias por elegir HEALTHYBITE!</p></div>
                            </div>
                          </div>
                        )}

                        {formData.tipoPago === "Transferencia" && (
                          <div className={styles.transferInfo}>
                            <h3 className={styles.transferTitle}>INFORMACION DE TRANSFERENCIA</h3>
                            <div className={styles.transferContent}>
                              <p className={styles.transferWarning}>Solo recibimos de Bancolombia o Davivienda (Otros bancos NO)</p>
                              <div className={styles.bankData}>
                                <h4 className={styles.bankTitle}>DATOS BANCARIOS:</h4>
                                <div className={styles.bankItem}><span className={styles.bankIcon}>Bancolombia</span><span>ahorros: 37300002343</span></div>
                                <div className={styles.bankItem}><span className={styles.bankIcon}>Davivienda</span><span>ahorros: 85670011494</span></div>
                              </div>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>TOTAL A TRANSFERIR:</h4>
                                <div className={styles.totalAmount}>${calcularTotal().toLocaleString()}</div>
                                <p className={styles.totalNote}>(Incluye $2,000 del empaque biodegradable + domicilio)</p>
                              </div>
                              <div className={styles.ecoMessage}><p>Recuerda que cobramos $2,000 por el empaque biodegradable, contribuyendo asi a cuidar nuestro planeta.</p></div>
                              <div className={styles.instructions}><p><strong>IMPORTANTE:</strong> Despues de realizar la transferencia, envia el pantallazo del comprobante a WhatsApp para terminar el proceso.</p></div>
                              <div className={styles.thankYou}><p>Gracias por elegir HEALTHYBITE!</p></div>
                            </div>
                          </div>
                        )}

                        {formData.tipoPago === "Datafono" && (
                          <div className={styles.transferInfo}>
                            <h3 className={styles.transferTitle}>USO DEL DATAFONO</h3>
                            <div className={styles.transferContent}>
                              <p className={styles.transferWarning}>
                                El uso del datafono tiene un recargo del <strong>50% del valor del domicilio</strong>
                              </p>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>TOTAL A PAGAR:</h4>
                                <div className={styles.totalAmount}>${calcularTotal().toLocaleString()}</div>
                                <p className={styles.totalNote}>(Incluye recargo datafono + empaque + domicilio)</p>
                              </div>
                              <div className={styles.thankYou}><p>Gracias por elegir HEALTHYBITE!</p></div>
                            </div>
                          </div>
                        )}

                        {/* SECCION DE ADICIONALES */}
                        <div className={styles.adicionalesSection}>
                          <h3 className={styles.adicionalesTitle}>ADICIONALES (Opcional)</h3>
                          <select 
                            className={styles.formSelect} 
                            onChange={handleAdicionalChange}
                            value=""
                          >
                            <option value="">Selecciona adicionales...</option>
                            {adicionales
                              .filter(a => !adicionalesSeleccionados.includes(a.nombre))
                              .map((adicional) => (
                                <option key={adicional.nombre} value={adicional.nombre}>
                                  {adicional.nombre} - ${adicional.precio.toLocaleString()}
                                </option>
                              ))}
                          </select>

                          {/* Tags de adicionales seleccionados */}
                          {adicionalesSeleccionados.length > 0 && (
                            <div className={styles.adicionalesTags}>
                              {adicionalesSeleccionados.map((nombre) => {
                                const adicional = adicionales.find(a => a.nombre === nombre)
                                return (
                                  <div key={nombre} className={styles.adicionalTag}>
                                    <span>{nombre}</span>
                                    <span className={styles.adicionalPrice}>
                                      ${adicional?.precio.toLocaleString()}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeAdicional(nombre)}
                                      className={styles.adicionalRemove}
                                      aria-label={`Quitar ${nombre}`}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              })}
                              <div className={styles.adicionalesTotal}>
                                <strong>Total adicionales:</strong> ${getTotalAdicionales().toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>

                        <textarea name="observacion" placeholder="Observaciones adicionales (opcional)" value={formData.observacion} onChange={handleChange} className={styles.formTextarea} rows={3}></textarea>

                        {/* Resumen del total */}
                        {(formData.tipoComida || adicionalesSeleccionados.length > 0) && (
                          <div className={styles.totalResumen}>
                            <div className={styles.totalResumenTitle}>TOTAL DE TU PEDIDO</div>
                            <div className={styles.totalResumenAmount}>${calcularTotal().toLocaleString()}</div>
                          </div>
                        )}

                        <button type="submit" className={styles.submitButton} disabled={loadingData}>
                          {loadingData ? "Cargando..." : "Enviar Pedido por WhatsApp"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className={styles.confirmationMessage}>
                      <div className={styles.confirmationIcon}>✓</div>
                      <h2 className={styles.confirmationTitle}>Pedido Enviado!</h2>
                      <p className={styles.confirmationText}>Redirigiendo a WhatsApp...</p>
                      <div className={styles.loadingDots}>
                        <span className={styles.loadingDot}></span>
                        <span className={styles.loadingDot}></span>
                        <span className={styles.loadingDot}></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.floatingBadge} ${styles.iphoneBadge1} ${styles.bubbleAnimation} ${styles.bubble12}`}>
              <span className={styles.badgeIcon}>✓</span>
              <span>100% Natural</span>
            </div>
            <div className={`${styles.floatingBadge} ${styles.iphoneBadge2} ${styles.bubbleAnimation} ${styles.bubble13}`}>
              <span className={styles.badgeIcon}>♥</span>
              <span>Hecho con Amor</span>
            </div>
          </div>
        </div>

        {/* Center Content - Columna 2 */}
        <div className={styles.centerContent}>
          <div className={styles.mainTitle}>
            <span className={styles.titleIcon}>🥗</span>
            <h2 className={styles.titleText}>HEALTHYBITE</h2>
            <span className={styles.titleIcon}>🥗</span>
          </div>
          <p className={styles.subtitle}>Tu comida saludable favorita, ahora a un clic de distancia</p>

          <div className={styles.iconRow}>
            <div className={`${styles.bubbleAnimation} ${styles.bubble14}`}>🥑</div>
            <div className={`${styles.bubbleAnimation} ${styles.bubble15}`}>🥕</div>
            <div className={`${styles.bubbleAnimation} ${styles.bubble16}`}>🥬</div>
          </div>

          <div className={styles.stepsContainer}>
            {[
              { number: "1", title: "Explora nuestro menu en la tablet", text: "Desliza las imagenes para ver todas nuestras opciones" },
              { number: "2", title: "Completa tu pedido en el movil", text: "Si deseas algo diferente al almuerzo del dia, selecciona \"Comida del menu\"" },
              { number: "3", title: "Verifica en la lista desplegable", text: "Selecciona el plato que deseas del menu disponible" },
              { number: "4", title: "Agrega observaciones", text: "Si deseas algo adicional, agregalo en la observacion" },
              { number: "5", title: "Para terminar el pago", text: "Se te redirigira a WhatsApp para confirmar tu pedido" },
            ].map((step, index) => (
              <div key={index} className={styles.stepItem}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.motivationalQuote}>
            <div className={styles.quoteIcon}>♥</div>
            <p className={styles.quoteText}>"Tu salud es nuestra prioridad"</p>
          </div>
        </div>

        {/* Tablet Section - Columna 3 */}
        <div className={styles.tabletSection}>
          <div className={styles.tabletDecorations}>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble17}`} style={{top: '10%', left: '-15%'}}>🌿</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble18}`} style={{top: '30%', right: '-10%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble1}`} style={{bottom: '25%', left: '-20%'}}>🌱</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble2}`} style={{bottom: '15%', right: '-15%'}}>🍃</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble3}`} style={{top: '20%', left: '-25%'}}>🥬</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble4}`} style={{top: '50%', right: '-25%'}}>🫐</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble5}`} style={{bottom: '35%', left: '-15%'}}>🥝</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble6}`} style={{bottom: '45%', right: '-20%'}}>🍇</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble7}`} style={{top: '25%', left: '-8%'}}>⭐</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble8}`} style={{top: '55%', right: '-5%'}}>✨</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble9}`} style={{bottom: '30%', left: '-10%'}}>💫</div>
          </div>

          <div className={styles.tabletContainer}>
            <div className={styles.tabletWrapper}>
              <div className={styles.tabletImage}>
                <img src={imagen2} alt="Tablet" />
              </div>

              <div className={styles.sliderOverlay}>
                <div
                  className={styles.sliderContainer}
                  style={{ transform: `translateX(-${currentSlide * (100 / menuImages.length)}%)` }}
                >
                  {menuImages.map((image, index) => (
                    <div key={index} className={styles.sliderSlide}>
                      <img src={image} alt={`Menu pagina ${index + 1}`} className={styles.sliderImage} />
                    </div>
                  ))}
                </div>

                <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`} aria-label="Anterior">←</button>
                <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`} aria-label="Siguiente">→</button>

                <button onClick={toggleZoom} className={styles.zoomButton} aria-label="Ampliar imagen">
                  <div className={styles.zoomIcon}>
                    <span className={styles.zoomCorner1}></span>
                    <span className={styles.zoomCorner2}></span>
                  </div>
                </button>
              </div>
            </div>

            <div className={styles.sliderControls}>
              <span className={styles.slideCounter}>{currentSlide + 1} / {menuImages.length}</span>
            </div>

            <div className={`${styles.floatingBadge} ${styles.tabletBadge1} ${styles.bubbleAnimation} ${styles.bubble10}`}>
              <span className={styles.badgeIcon}>🌿</span>
              <span>Organico</span>
            </div>
            <div className={`${styles.floatingBadge} ${styles.tabletBadge2} ${styles.bubbleAnimation} ${styles.bubble11}`}>
              <span className={styles.badgeIcon}>💪</span>
              <span>Rico en Vitaminas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className={styles.footer}>
        <div className={styles.footerTop}></div>
        <div className={styles.footerContent}>
          <div className={styles.footerIcons}>
            {['🥗', '🥑', '🥕', '🥬', '🍅'].map((icon, index) => (
              <span key={index} className={`${styles.bubbleAnimation} ${styles[`bubble${12 + index}`]}`}>{icon}</span>
            ))}
          </div>
          <p className={styles.footerText}>Alimentando tu bienestar, un plato a la vez</p>
        </div>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div className={styles.zoomModal} onClick={toggleZoom}>
          <div className={styles.zoomModalContent} onClick={(e) => e.stopPropagation()}>
            <img src={menuImages[currentSlide]} alt={`Menu pagina ${currentSlide + 1} ampliada`} className={styles.zoomedImage} />
            <button className={styles.closeButton} onClick={toggleZoom} aria-label="Cerrar">×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealFoodRevolution