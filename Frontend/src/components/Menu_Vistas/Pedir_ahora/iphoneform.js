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
  })
  const [showMessage, setShowMessage] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Array simple con las imágenes del menú
  const menuImages = [
    menu1,
    menu2,
    menu3,
    menu4,
    menu5,
    menu6,
    menu7,
    menu8,
    menu9,
    menu10,
  ];

  // Opciones del menú con precios
  const opcionesMenu = [
    { nombre: "Mini Waffles de Pandebono", precio: 8500 },
    { nombre: "Arepa de Chócolo", precio: 7000 },
    { nombre: "Desayuno Healthy Bite", precio: 12000 },
    { nombre: "Huevos Napolitanos", precio: 9500 },
    { nombre: "Tartines de Wafflebono", precio: 10000 },
    { nombre: "Calentado de Mauro", precio: 11000 },
    { nombre: "Bowl de avena caliente", precio: 8000 },
    { nombre: "Ensalada Verde", precio: 9000 },
    { nombre: "Smoothie Bowl", precio: 10500 },
    { nombre: "Wrap Saludable", precio: 11500 },
  ]

  // Precios de domicilio por barrio - Lista actualizada completa
  const preciosDomicilio = [
    { barrio: "ALAMOS", precio: 5000 },
    { barrio: "ALHAMBRA", precio: 8000 },
    { barrio: "ALTA SUIZA/COLSEGUROS", precio: 4000 },
    { barrio: "ALTO TABLAZO", precio: 11000 },
    { barrio: "ALTOS DE CAPRI", precio: 5500 },
    { barrio: "ARANJUEZ", precio: 6500 },
    { barrio: "ARBOLEDA", precio: 4500 },
    { barrio: "ARENLLO (Hotel Búho)", precio: 10000 },
    { barrio: "ARRAYANES", precio: 6000 },
    { barrio: "ASTURIAS", precio: 8000 },
    { barrio: "ARGENTINA", precio: 4500 },
    { barrio: "ASUNCION", precio: 4500 },
    { barrio: "AMERICAS", precio: 6000 },
    { barrio: "AGUSTINOS/SAN ANTONIO", precio: 5500 },
    { barrio: "ALCAZARES/FRANCIA", precio: 7000 },
    { barrio: "AUTONOMA", precio: 5000 },
    { barrio: "AMARELLO/EXPOFERIAS", precio: 5000 },
    { barrio: "ALFEREZ REAL", precio: 7000 },
    { barrio: "BAJA SUIZA", precio: 4500 },
    { barrio: "BAJO TABLAZO", precio: 14000 },
    { barrio: "BELEN", precio: 4000 },
    { barrio: "BELLA MONTANA/MORICHAL", precio: 9000 },
    { barrio: "BENGALA", precio: 6000 },
    { barrio: "BOSQUE", precio: 6500 },
    { barrio: "BOSQUES DE NIZA", precio: 4500 },
    { barrio: "BOSQUES DEL NORTE", precio: 6000 },
    { barrio: "BARRIO 20 DE JULIO", precio: 6000 },
    { barrio: "CAMBULOS/CASTILLA", precio: 7500 },
    { barrio: "CAMILO TORRES", precio: 6000 },
    { barrio: "CAMPIN", precio: 4500 },
    { barrio: "CENTENARIO/CASTELLANA", precio: 6500 },
    { barrio: "CENTRO", precio: 5000 },
    { barrio: "CERVANTES/CAMPO AMOR", precio: 5000 },
    { barrio: "CHIPRE/CAMPO HERMOSO", precio: 6500 },
    { barrio: "COLOMBIA", precio: 5000 },
    { barrio: "COLON", precio: 6000 },
    { barrio: "CONJUNTO TORREAR", precio: 4500 },
    { barrio: "COMUNEROS", precio: 6000 },
    { barrio: "CAROLA/A DE GRANADA", precio: 4500 },
    { barrio: "CC CABLE PLAZA/SANCANCIO", precio: 5000 },
    { barrio: "CC FUNDADORES/VUL PLAZA", precio: 5500 },
    { barrio: "CERRO DE ORO AVION", precio: 4500 },
    { barrio: "ALBERGUE", precio: 6000 },
    { barrio: "MARQUESA", precio: 8000 },
    { barrio: "CC PARQUE CALDAS", precio: 6000 },
    { barrio: "CUMBRE/VILLALUZ", precio: 5000 },
    { barrio: "COLINAS", precio: 6000 },
    { barrio: "CEDROS", precio: 5000 },
    { barrio: "CARIBE", precio: 5000 },
    { barrio: "CARMEN", precio: 6000 },
    { barrio: "ALBANIA", precio: 7000 },
    { barrio: "ESTACION URIBE", precio: 10000 },
    { barrio: "ESTACION URIBE (TU y yo)", precio: 12000 },
    { barrio: "ESTAMBUL", precio: 9000 },
    { barrio: "EL PALMAR", precio: 5000 },
    { barrio: "EUCALIPTUS", precio: 6000 },
    { barrio: "ENEA", precio: 6000 },
    { barrio: "BOSQUES ENEA", precio: 7000 },
    { barrio: "ESTRELLA/BELEN", precio: 4000 },
    { barrio: "FANNY GONZALES", precio: 5000 },
    { barrio: "FATIMA/BETANIA", precio: 4500 },
    { barrio: "FUNDADORES/DELICIAS", precio: 5000 },
    { barrio: "FLORIDA", precio: 7000 },
    { barrio: "RETIRO", precio: 8000 },
    { barrio: "FLORIDA P. DE LA SALUD", precio: 8000 },
    { barrio: "GALERIA", precio: 6000 },
    { barrio: "GUAMAL", precio: 6000 },
    { barrio: "ISABELLA", precio: 6000 },
    { barrio: "LAURELES/RAMBLA", precio: 4000 },
    { barrio: "LEONORA", precio: 4000 },
    { barrio: "LIBORIO", precio: 6000 },
    { barrio: "LINDA", precio: 15000 },
    { barrio: "LLERAS", precio: 4500 },
    { barrio: "LUSITANIA", precio: 6500 },
    { barrio: "MALHABAR", precio: 5500 },
    { barrio: "MALMABAR BAJO", precio: 6000 },
    { barrio: "MALTERIA (CAI)", precio: 8000 },
    { barrio: "MALTERIA (Progel – Trululu)", precio: 10000 },
    { barrio: "MIRADOR SANCANCIO", precio: 4500 },
    { barrio: "MIRADOR VILLAPILAR", precio: 8000 },
    { barrio: "MILAN/CAMELIA", precio: 4000 },
    { barrio: "MINITAS/VIVEROS", precio: 4500 },
    { barrio: "MORROGACHO", precio: 10000 },
    { barrio: "MOLINOS", precio: 8000 },
    { barrio: "NEVADO", precio: 6000 },
    { barrio: "NOGALES", precio: 7500 },
    { barrio: "ONDAS DE OTÚN", precio: 5000 },
    { barrio: "PALERMO/PALOGRANDE", precio: 4000 },
    { barrio: "PALONEGRO", precio: 5500 },
    { barrio: "PANORAMA", precio: 7500 },
    { barrio: "PARQUE DEL AGUA", precio: 6000 },
    { barrio: "PRADO ALTO/MEDIO", precio: 5500 },
    { barrio: "PRADO BAJO", precio: 6000 },
    { barrio: "PERALONSO", precio: 5000 },
    { barrio: "PERSIA/PARAISO", precio: 6000 },
    { barrio: "A PERSIA ALTO/GONZALES", precio: 5500 },
    { barrio: "PORVENIR", precio: 5000 },
    { barrio: "PUERTAS DEL SOL", precio: 7500 },
    { barrio: "PIO XII", precio: 5000 },
    { barrio: "RAMBLA/RESIDENCIAS", precio: 4000 },
    { barrio: "ROSALES", precio: 4000 },
    { barrio: "RESERVA CAMPESTRE", precio: 7500 },
    { barrio: "RINCON DE LA FRANCIA", precio: 8000 },
    { barrio: "SAENZ/AUTONOMA", precio: 5000 },
    { barrio: "SAMARIA/SOLFERINO", precio: 6000 },
    { barrio: "SANTOS", precio: 6000 },
    { barrio: "SAN CAYETANO", precio: 5500 },
    { barrio: "SAN JOAQUIN", precio: 5000 },
    { barrio: "SAN JORGE/SOL", precio: 4500 },
    { barrio: "SAN JOSE", precio: 5500 },
    { barrio: "SAN MARCEL", precio: 5000 },
    { barrio: "SAN SEDASTIAN", precio: 7000 },
    { barrio: "SANTA HELENA", precio: 5000 },
    { barrio: "SINAI", precio: 5500 },
    { barrio: "SULTANA", precio: 4000 },
    { barrio: "SULTANA LA FINCA", precio: 4500 },
    { barrio: "TORRES SAN VICENTE", precio: 6000 },
    { barrio: "TERRAZAS DEL RIO", precio: 5000 },
    { barrio: "TOSCANA", precio: 4000 },
    { barrio: "TOPACIO", precio: 8000 },
    { barrio: "TREBOL/TEJARES", precio: 4500 },
    { barrio: "URIBE AV PARALELA", precio: 5000 },
    { barrio: "VELEZ", precio: 5000 },
    { barrio: "VERSALLES", precio: 4500 },
    { barrio: "VILLA CARMENZA/FUENTE", precio: 6000 },
    { barrio: "VILLAHERMOSA", precio: 5000 },
    { barrio: "VILLA JULIA", precio: 6500 },
    { barrio: "VILLA PILAR/SACATIN", precio: 7000 },
    { barrio: "VILLAMARIA PRADERA/TURIN", precio: 10000 },
    { barrio: "VINA/VILLA DEL RIO", precio: 5000 }
  ];

  // Función para calcular el total
  const calcularTotal = () => {
    let subtotal = 0;
    
    if (formData.tipoComida === "Almuerzo del día") {
      subtotal = 25000; // Precio fijo del almuerzo del día
    } else if (formData.tipoComida === "Comida del menú" && formData.platoSeleccionado) {
      const platoSeleccionado = opcionesMenu.find(plato => 
        `${plato.nombre} - ${plato.precio.toLocaleString()}` === formData.platoSeleccionado
      );
      if (platoSeleccionado) {
        subtotal = platoSeleccionado.precio;
      }
    }
    
    const empaque = 1500;
    let domicilio = 0;
    
    // Calcular precio del domicilio si hay barrio seleccionado
    if (formData.barrio) {
      const barrioSeleccionado = preciosDomicilio.find(item => item.barrio === formData.barrio);
      if (barrioSeleccionado) {
        domicilio = barrioSeleccionado.precio;
      }
    }
    
    return subtotal + empaque + domicilio;
  }

  // Función para obtener precio del domicilio
  const getPrecioDomicilio = () => {
    if (formData.barrio) {
      const barrioSeleccionado = preciosDomicilio.find(item => item.barrio === formData.barrio);
      return barrioSeleccionado ? barrioSeleccionado.precio : 0;
    }
    return 0;
  }

  // Efecto parallax
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

  // Control del zoom
  useEffect(() => {
    document.body.style.overflow = isZoomed ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isZoomed])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowMessage(true)

    // Información adicional basada en el tipo de pago
    let infoAdicional = `

♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️`

    // Si es transferencia, agregar información bancaria
    if (formData.tipoPago === "Transferencia") {
      const total = calcularTotal();
      infoAdicional = `

🏦 **SI ELIGES TRANSFERENCIA RECUERDA:**
1- Solo recibimos de Bancolombia o Davivienda. (Otros bancos no)

📱 **DATOS BANCARIOS:**
🟢 Bancolombia ahorros: 37300002343
🔵 Davivienda ahorros: 85670011494

💰 **TOTAL A TRANSFERIR: ${total.toLocaleString()}**
(Incluye $1,500 del empaque biodegradable)

♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️

📸 **IMPORTANTE:** Después de realizar la transferencia, envía el pantallazo del comprobante a este WhatsApp para terminar el proceso.

El total de tu pedido se confirmará una vez que nos envíes esta información.

¡Esperamos tu respuesta para preparar y enviar tu pedido lo antes posible! ¡Gracias por elegir HEALTHYBITE! 🍎 🍏`
    } else {
      infoAdicional += `

♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️

¡Gracias por elegir HEALTHYBITE! 🍎 🍏`
    }

    const mensaje = `🥗 **NUEVO PEDIDO - COMIDA SALUDABLE** 🥗
👤 **Nombre:** ${formData.nombre}
📧 **Correo:** ${formData.correo}
📱 **Teléfono:** ${formData.telefono}
📍 **Dirección:** ${formData.direccion}
🏠 **Barrio:** ${formData.barrio}
🍽️ **Tipo de Pedido:** ${formData.tipoComida}
${formData.platoSeleccionado ? `🥘 **Plato Seleccionado:** ${formData.platoSeleccionado}` : ""}
💳 **Tipo de Pago:** ${formData.tipoPago}
💰 **TOTAL CALCULADO:** $${calcularTotal().toLocaleString()}
📝 **Observación:** ${formData.observacion}${infoAdicional}
---
Pedido realizado desde pagina Healthybite manizales`

    const numeroWhatsApp = "3245075452"
    const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`

    setTimeout(() => {
      window.open(whatsappURL, "_blank")
      setFormData({
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
      })
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    }, 2000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % menuImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + menuImages.length) % menuImages.length)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div className={styles.container}>
      {/* Elementos decorativos de fondo general */}
      <div className={styles.backgroundDecorations}>
        <div 
          className={`${styles.bgShape} ${styles.bgShape1}`}
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div 
          className={`${styles.bgShape} ${styles.bgShape2}`}
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        <div 
          className={`${styles.bgShape} ${styles.bgShape3}`}
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
        <div 
          className={`${styles.bgShape} ${styles.bgShape4}`}
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * 0.012}px)`,
          }}
        />
      </div>

      {/* Grid principal - Tres columnas */}
      <div className={styles.mainGrid}>
        
        {/* iPhone Section - Columna 1 */}
        <div className={styles.iphoneSection}>
          {/* Elementos decorativos solo para el iPhone */}
          <div className={styles.iphoneDecorations}>
            {/* Hojas flotantes con efecto burbuja */}
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble1}`} style={{top: '15%', left: '-10%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble2}`} style={{top: '25%', right: '-15%'}}>🌿</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble3}`} style={{bottom: '30%', left: '-20%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble4}`} style={{bottom: '15%', right: '-10%'}}>🌱</div>
            
            {/* Frutas con efecto burbuja */}
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble5}`} style={{top: '35%', left: '-25%'}}>🥑</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble6}`} style={{top: '45%', right: '-25%'}}>🥕</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble7}`} style={{bottom: '40%', left: '-15%'}}>🥒</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble8}`} style={{bottom: '25%', right: '-20%'}}>🍅</div>
            
            {/* Partículas brillantes con efecto burbuja */}
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble9}`} style={{top: '20%', left: '-5%'}}>✨</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble10}`} style={{top: '60%', right: '-8%'}}>⭐</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble11}`} style={{bottom: '45%', left: '-12%'}}>💫</div>
          </div>

          <div className={styles.iphoneContainer}>
            <div className={styles.iphoneWrapper}>
              <div className={styles.iphoneImage}>
                <img src={imagen1} alt="iPhone" />
              </div>
              
              {/* Isla dinámica del iPhone */}
              <div className={styles.dynamicIsland}>
                <div className={styles.islandDot1}></div>
                <div className={styles.islandDot2}></div>
              </div>

              {/* Formulario sobrepuesto */}
              <div className={styles.formOverlay}>
                {/* Status Bar simulado */}
                <div className={styles.statusBar}>
                  <span className={styles.statusTime}>9:41</span>
                  <div className={styles.statusIcons}>
                    <img 
                      src={imagen3} 
                      alt="Logo Status" 
                      className={styles.statusLogo}
                    />
                  </div>
                </div>

                {/* Contenido de la app */}
                <div className={styles.appContent}>
                  {!showMessage ? (
                    <>
                      {/* Header */}
                      <div className={styles.formHeader}>
                        <div className={styles.headerLogo}>
                          <div className={styles.logoImage} >
                            <img 
                              src={imagen4} 
                              alt="Logo"
                            />
                          </div>
                        </div>
                        <h1 className={styles.headerTitle}>Hacer Pedido</h1>
                        <p className={styles.headerSubtitle}>Comida saludable a domicilio</p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className={styles.orderForm}>
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Nombre completo"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className={styles.formInput}
                        />
                        <input
                          type="email"
                          name="correo"
                          placeholder="Correo electrónico"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                          className={styles.formInput}
                        />
                        <input
                          type="tel"
                          name="telefono"
                          placeholder="Teléfono"
                          value={formData.telefono}
                          onChange={handleChange}
                          required
                          className={styles.formInput}
                        />
                        <input
                          type="text"
                          name="direccion"
                          placeholder="Dirección de entrega"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                          className={styles.formInput}
                        />
                        
                        <select
                          name="barrio"
                          value={formData.barrio}
                          onChange={handleChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Selecciona tu barrio</option>
                          {preciosDomicilio.map((item, index) => (
                            <option key={index} value={item.barrio}>
                              {item.barrio} - ${item.precio.toLocaleString()}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          name="tipoComida"
                          value={formData.tipoComida}
                          onChange={handleChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Selecciona tipo de pedido</option>
                          <option value="Almuerzo del día">Almuerzo del día - $25.000</option>
                          <option value="Comida del menú">Comida del menú</option>
                        </select>

                        {formData.tipoComida === "Comida del menú" && (
                          <select
                            name="platoSeleccionado"
                            value={formData.platoSeleccionado}
                            onChange={handleChange}
                            required
                            className={styles.formSelect}
                          >
                            <option value="">Selecciona un plato del menú</option>
                            {opcionesMenu.map((plato, index) => (
                              <option key={index} value={`${plato.nombre} - ${plato.precio.toLocaleString()}`}>
                                {plato.nombre} - ${plato.precio.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        )}

                        <select
                          name="tipoPago"
                          value={formData.tipoPago}
                          onChange={handleChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Selecciona tipo de pago</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                        </select>

                        {/* Información para Efectivo */}
                        {formData.tipoPago === "Efectivo" && (
                          <div className={styles.cashInfo}>
                            <h3 className={styles.cashTitle}>💵 PAGO EN EFECTIVO</h3>
                            <div className={styles.cashContent}>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>💰 TOTAL A PAGAR:</h4>
                                <div className={styles.totalAmount}>
                                  ${calcularTotal().toLocaleString()}
                                </div>
                                <p className={styles.totalNote}>
                                  (Incluye $1,500 del empaque biodegradable + domicilio)
                                </p>
                              </div>

                              <div className={styles.ecoMessage}>
                                <p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p>
                              </div>

                              <div className={styles.instructions}>
                                <p>💡 <strong>IMPORTANTE:</strong> Ten listo el dinero exacto o cambio para facilitar la entrega.</p>
                              </div>

                              <div className={styles.thankYou}>
                                <p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Información de transferencia */}
                        {formData.tipoPago === "Transferencia" && (
                          <div className={styles.transferInfo}>
                            <h3 className={styles.transferTitle}>🏦 INFORMACIÓN DE TRANSFERENCIA</h3>
                            <div className={styles.transferContent}>
                              <p className={styles.transferWarning}>
                                ⚠️ Solo recibimos de Bancolombia o Davivienda (Otros bancos NO)
                              </p>
                              
                              <div className={styles.bankData}>
                                <h4 className={styles.bankTitle}>📱 DATOS BANCARIOS:</h4>
                                <div className={styles.bankItem}>
                                  <span className={styles.bankIcon}>🟢</span>
                                  <span>Bancolombia ahorros: 37300002343</span>
                                </div>
                                <div className={styles.bankItem}>
                                  <span className={styles.bankIcon}>🔵</span>
                                  <span>Davivienda ahorros: 85670011494</span>
                                </div>
                              </div>

                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>💰 TOTAL A TRANSFERIR:</h4>
                                <div className={styles.totalAmount}>
                                  ${calcularTotal().toLocaleString()}
                                </div>
                                <p className={styles.totalNote}>
                                  (Incluye $1,500 del empaque biodegradable + domicilio)
                                </p>
                              </div>

                              <div className={styles.ecoMessage}>
                                <p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p>
                              </div>

                              <div className={styles.instructions}>
                                <p>📸 <strong>IMPORTANTE:</strong> Después de realizar la transferencia, envía el pantallazo del comprobante a WhatsApp para terminar el proceso.</p>
                              </div>

                              <div className={styles.thankYou}>
                                <p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Resumen del pedido - Mostrar siempre cuando hay datos */}
                        {(formData.tipoComida || formData.barrio) && (
                          <div className={styles.orderSummary}>
                            <h3 className={styles.summaryTitle}>📋 RESUMEN DEL PEDIDO</h3>
                            <div className={styles.summaryContent}>
                              {formData.tipoComida && (
                                <div className={styles.summaryItem}>
                                  <span>🍽️ Pedido:</span>
                                  <span>
                                    {formData.tipoComida === "Almuerzo del día" ? "Almuerzo del día - $25,000" : 
                                     formData.platoSeleccionado || "Selecciona un plato"}
                                  </span>
                                </div>
                              )}
                              
                              {formData.barrio && (
                                <div className={styles.summaryItem}>
                                  <span>🚚 Domicilio:</span>
                                  <span>{formData.barrio} - ${getPrecioDomicilio().toLocaleString()}</span>
                                </div>
                              )}
                              
                              <div className={styles.summaryItem}>
                                <span>📦 Empaque biodegradable:</span>
                                <span>$1,500</span>
                              </div>
                              
                              {(formData.tipoComida || formData.barrio) && (
                                <div className={styles.summaryTotal}>
                                  <span>💰 TOTAL:</span>
                                  <span className={styles.totalPrice}>${calcularTotal().toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className={styles.ecoMessageSummary}>
                              <p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p>
                              <p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p>
                            </div>
                          </div>
                        )}

                        <div className={styles.checkboxContainer}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="recargoNocturno"
                              checked={formData.recargoNocturno}
                              onChange={(e) => setFormData({...formData, recargoNocturno: e.target.checked})}
                              className={styles.checkbox}
                            />
                            Pedido después de 11 PM (recargo $500)
                          </label>
                        </div>

                        <textarea
                          name="observacion"
                          placeholder="Observaciones: Si deseas algo adicional o modificaciones, especifícalo aquí"
                          value={formData.observacion}
                          onChange={handleChange}
                          rows="2"
                          className={styles.formTextarea}
                        />

                        <button 
                          type="submit" 
                          className={styles.submitButton}
                        >
                          GUARDAR PEDIDO
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className={styles.confirmationMessage}>
                      <div className={styles.confirmationIcon}>✅</div>
                      <h2 className={styles.confirmationTitle}>¡Pedido Guardado!</h2>
                      <p className={styles.confirmationText}>Te dirigiremos a WhatsApp para terminar el proceso</p>
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

            {/* iPhone Decoración - Badges flotantes */}
            <div className={`${styles.floatingBadge} ${styles.iphoneBadge1} ${styles.bubbleAnimation} ${styles.bubble12}`}>
              <span className={styles.badgeIcon}>🌱</span>
              <span>100% Natural</span>
            </div>
            <div className={`${styles.floatingBadge} ${styles.iphoneBadge2} ${styles.bubbleAnimation} ${styles.bubble13}`}>
              <span className={styles.badgeIcon}>🥗</span>
              <span>Fresco</span>
            </div>
          </div>
        </div>

        {/* Center Content - Columna 2 */}
        <div className={styles.centerContent}>
          <div className={styles.mainTitle}>
            <div className={styles.titleIcon}>🍃</div>
            <h1 className={styles.titleText}>
              Real Food Revolution
            </h1>
            <div className={`${styles.titleIcon} ${styles.titleIcon2}`}>🍃</div>
          </div>
          <p className={styles.subtitle}>Comida saludable directo a tu puerta</p>

          <div className={styles.iconRow}>
            <div className={`${styles.bubbleAnimation} ${styles.bubble14}`}>🥑</div>
            <div className={`${styles.bubbleAnimation} ${styles.bubble15}`}>🥕</div>
            <div className={`${styles.bubbleAnimation} ${styles.bubble16}`}>🥬</div>
          </div>

          <div className={styles.stepsContainer}>
            {[
              {
                number: "1",
                title: "Explora nuestro menú en la tablet",
                text: "Desliza las imágenes para ver todas nuestras opciones"
              },
              {
                number: "2", 
                title: "Completa tu pedido en el móvil",
                text: 'Si deseas algo diferente al almuerzo del día, selecciona "Comida del menú"'
              },
              {
                number: "3",
                title: "Verifica en la lista desplegable", 
                text: "Selecciona el plato que deseas del menú disponible"
              },
              {
                number: "4",
                title: "Agrega observaciones",
                text: "Si deseas algo adicional, agrégalo en la observación"
              },
              {
                number: "5",
                title: "Para terminar el pago",
                text: "Se te redirigirá a WhatsApp para confirmar tu pedido"
              }
            ].map((step, index) => (
              <div key={index} className={styles.stepItem}>
                <div className={styles.stepNumber}>
                  {step.number}
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.motivationalQuote}>
            <div className={styles.quoteIcon}>💚</div>
            <p className={styles.quoteText}>"Tu salud es nuestra prioridad"</p>
          </div>
        </div>

        {/* Tablet Section - Columna 3 */}
        <div className={styles.tabletSection}>
          {/* Elementos decorativos solo para el tablet */}
          <div className={styles.tabletDecorations}>
            {/* Hojas flotantes con efecto burbuja */}
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble17}`} style={{top: '10%', left: '-15%'}}>🌿</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble18}`} style={{top: '30%', right: '-10%'}}>🍃</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble1}`} style={{bottom: '25%', left: '-20%'}}>🌱</div>
            <div className={`${styles.decorativeElement} ${styles.bubbleAnimation} ${styles.bubble2}`} style={{bottom: '15%', right: '-15%'}}>🍃</div>
            
            {/* Frutas con efecto burbuja */}
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble3}`} style={{top: '20%', left: '-25%'}}>🥬</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble4}`} style={{top: '50%', right: '-25%'}}>🫐</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble5}`} style={{bottom: '35%', left: '-15%'}}>🥝</div>
            <div className={`${styles.decorativeElementSmall} ${styles.bubbleAnimation} ${styles.bubble6}`} style={{bottom: '45%', right: '-20%'}}>🍇</div>
            
            {/* Partículas brillantes con efecto burbuja */}
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble7}`} style={{top: '25%', left: '-8%'}}>⭐</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble8}`} style={{top: '55%', right: '-5%'}}>✨</div>
            <div className={`${styles.decorativeElementTiny} ${styles.bubbleAnimation} ${styles.bubble9}`} style={{bottom: '30%', left: '-10%'}}>💫</div>
          </div>

          <div className={styles.tabletContainer}>
            <div className={styles.tabletWrapper}>
              <div className={styles.tabletImage}>
                <img src={imagen2} alt="Tablet" />
              </div>
              
              {/* Slider sobrepuesto */}
              <div className={styles.sliderOverlay}>
                <div 
                  className={styles.sliderContainer}
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${menuImages.length * 100}%`
                  }}
                >
                  {menuImages.map((image, index) => (
                    <div key={index} className={styles.sliderSlide}>
                      <img 
                        src={image} 
                        alt={`Menú página ${index + 1}`} 
                        className={styles.sliderImage}
                      />
                    </div>
                  ))}
                </div>

                {/* Botones de navegación */}
                <button 
                  onClick={prevSlide} 
                  className={`${styles.navButton} ${styles.prevButton}`}
                >
                  ←
                </button>
                <button 
                  onClick={nextSlide} 
                  className={`${styles.navButton} ${styles.nextButton}`}
                >
                  →
                </button>

                {/* Botón de zoom */}
                <button 
                  onClick={toggleZoom} 
                  className={styles.zoomButton}
                >
                  <div className={styles.zoomIcon}>
                    <span className={styles.zoomCorner1}></span>
                    <span className={styles.zoomCorner2}></span>
                  </div>
                </button>
              </div>
            </div>

            {/* Controles del slider */}
            <div className={styles.sliderControls}>
              <span className={styles.slideCounter}>
                {currentSlide + 1} / {menuImages.length}
              </span>
            </div>

            {/* Tablet Decoración - Badges flotantes */}
            <div className={`${styles.floatingBadge} ${styles.tabletBadge1} ${styles.bubbleAnimation} ${styles.bubble10}`}>
              <span className={styles.badgeIcon}>🌿</span>
              <span>Orgánico</span>
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
              <span 
                key={index} 
                className={`${styles.bubbleAnimation} ${styles[`bubble${12 + index}`]}`}
              >
                {icon}
              </span>
            ))}
          </div>
          <p className={styles.footerText}>Alimentando tu bienestar, un plato a la vez</p>
        </div>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div className={styles.zoomModal} onClick={toggleZoom}>
          <div className={styles.zoomModalContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={menuImages[currentSlide]}
              alt={`Menú página ${currentSlide + 1} ampliada`}
              className={styles.zoomedImage}
            />
            <button 
              className={styles.closeButton} 
              onClick={toggleZoom}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// EXPORTACIÓN CORRECTA - ESTO ES CRUCIAL
export default RealFoodRevolution