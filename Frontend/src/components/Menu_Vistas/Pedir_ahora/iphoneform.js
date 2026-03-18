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
    // ── Cuadro azul ──
    recargoNocturno: false,   // 10 PM
    usaDatafono: false,       // 50% del domicilio
    prestaMaleta: false,      // $2.000
  })
  const [showMessage, setShowMessage] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // ── Adicionales seleccionados ──
  const [adicionalesSeleccionados, setAdicionalesSeleccionados] = useState([])

  const menuImages = [menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9, menu10]

  // ── Lista de adicionales ──
  const adicionales = [
    { nombre: "Leche de almendras", precio: 4000 },
    { nombre: "Leche A2", precio: 4000 },
    { nombre: "Pollo adicional", precio: 10000 },
    { nombre: "Res adicional", precio: 12000 },
    { nombre: "Huevo adicional", precio: 6000 },
    { nombre: "Carbohidrato", precio: 9000 },
    { nombre: "Fruta", precio: 9000 },
    { nombre: "Aderezos", precio: 5000 },
  ]

  const toggleAdicional = (nombre) => {
    setAdicionalesSeleccionados(prev =>
      prev.includes(nombre)
        ? prev.filter(a => a !== nombre)
        : [...prev, nombre]
    )
  }

  const getTotalAdicionales = () =>
    adicionalesSeleccionados.reduce((sum, nombre) => {
      const found = adicionales.find(a => a.nombre === nombre)
      return sum + (found ? found.precio : 0)
    }, 0)

  const opcionesMenu = [
    // ── MAÑANAS Y TARDES ──
    { nombre: "Mini Waffles de Pandebono", precio: 20000 },
    { nombre: "Arepa de Chócolo", precio: 14500 },
    { nombre: "Desayuno Healthy Bite", precio: 29000 },
    { nombre: "Huevos Napolitanos", precio: 29000 },
    { nombre: "Tartines de Wafflebono", precio: 31000 },
    { nombre: "Calentado de Mauro", precio: 29000 },
    { nombre: "Bowl de avena caliente", precio: 29000 },
    { nombre: "Envoltini de huevo", precio: 25000 },
    { nombre: "Envoltini de pollo", precio: 25000 },
    { nombre: "Tostada de aguacate", precio: 29000 },
    { nombre: "Tostada de queso", precio: 29000 },
    { nombre: "Tostadas francesas", precio: 31000 },
    { nombre: "Torre de pancakes", precio: 32500 },
    // ── ESPECIALIDADES ──
    { nombre: "Ensalada César", precio: 31000 },
    { nombre: "Ensalada Verde", precio: 31000 },
    // ── BOWLS CALIENTES ──
    { nombre: "Bowl Arriero", precio: 31000 },
    { nombre: "Bowl Mexicano", precio: 31000 },
    { nombre: "Bowl Hawaiano", precio: 31000 },
    { nombre: "Taco Bowl", precio: 31000 },
    // ── POSTRES ──
    { nombre: "Waffle con helado", precio: 31000 },
    { nombre: "Helado de proteína", precio: 14000 },
    { nombre: "Brownie de la casa", precio: 13000 },
    { nombre: "Affogato Healthy", precio: 20000 },
    { nombre: "Oblea Healthy", precio: 19000 },
    { nombre: "Bowl de acai", precio: 28000 },
    { nombre: "Parfait", precio: 25000 },
    // ── BEBIDAS FRÍAS ──
    { nombre: "Sodas", precio: 11000 },
    { nombre: "Kombucha", precio: 11000 },
    { nombre: "Jugos naturales", precio: 11000 },
    { nombre: "Batido de proteína by buena vibra", precio: 15000 },
    { nombre: "Batido detox", precio: 12000 },
    { nombre: "Granizado de coco", precio: 15000 },
    { nombre: "Granizado de mango biche", precio: 15000 },
    { nombre: "Matcha latte", precio: 15000 },
    { nombre: "Cold brew", precio: 15000 },
    // ── BEBIDAS CALIENTES ──
    { nombre: "Cafe americano", precio: 6000 },
    { nombre: "Cafe expresso", precio: 6000 },
    { nombre: "Capuchino", precio: 11000 },
    { nombre: "Latte", precio: 12000 },
    { nombre: "Moka", precio: 12000 },
    { nombre: "Chocolate 100% cacao", precio: 12000 },
    { nombre: "Migote", precio: 15000 },
    { nombre: "Te chai", precio: 12000 },
    { nombre: "Golden milk", precio: 12000 },
    { nombre: "Aromática de frutas deshidratadas", precio: 6000 },
  ]

  const preciosDomicilio = [
    { barrio: "ALAMOS/ONDAS DE OTUN", precio: 6000 },
    { barrio: "ALHAMBRA", precio: 9000 },
    { barrio: "ALFEREZ REAL", precio: 8000 },
    { barrio: "ALTA SUIZA/COLSEGUROS", precio: 5000 },
    { barrio: "ALTO TABLAZO", precio: 12000 },
    { barrio: "ALTOS DE CAPRI", precio: 6000 },
    { barrio: "ARANJUEZ", precio: 7000 },
    { barrio: "ARBOLEDA", precio: 5000 },
    { barrio: "ARENILLO (Hotel el Búho)", precio: 12000 },
    { barrio: "ARRAYANES/PALMAR", precio: 6500 },
    { barrio: "ASTURIAS/QUINTA HISPANIA", precio: 9000 },
    { barrio: "ARGENTINA", precio: 5000 },
    { barrio: "ASUNCION", precio: 5500 },
    { barrio: "AMERICAS", precio: 7000 },
    { barrio: "AGUSTINOS/SAN ANTONIO", precio: 7000 },
    { barrio: "ALCAZARES/FRANCIA", precio: 8000 },
    { barrio: "AUTONOMA/SANTA HELENA", precio: 5500 },
    { barrio: "AMARELLO/EXPOFERIAS", precio: 6000 },
    { barrio: "BAJA SUIZA", precio: 5000 },
    { barrio: "BAJO TABLAZO", precio: 15000 },
    { barrio: "BELEN/ESTRELLA", precio: 5000 },
    { barrio: "BELLA MONTANA/MORICHAL", precio: 10000 },
    { barrio: "BENGALA", precio: 6500 },
    { barrio: "BOSQUE", precio: 8000 },
    { barrio: "BOSQUE POPULAR (Ingreso)", precio: 7000 },
    { barrio: "BOSQUES DE NIZA", precio: 5000 },
    { barrio: "BOSQUES DEL NORTE", precio: 7000 },
    { barrio: "BARRIO 20 DE JULIO", precio: 7000 },
    { barrio: "CARMEN/ALBANIA", precio: 7500 },
    { barrio: "CAROLA/A. DE GRANADA", precio: 5500 },
    { barrio: "CARIBE", precio: 6000 },
    { barrio: "CAMBULOS/CASTILLA", precio: 9000 },
    { barrio: "CAMELIA", precio: 5000 },
    { barrio: "CAMILO TORRES", precio: 7000 },
    { barrio: "CAMPIN", precio: 5500 },
    { barrio: "CEDROS/SAENZ", precio: 5500 },
    { barrio: "CENTENARIO/CASTELLANA", precio: 8000 },
    { barrio: "CENTRO", precio: 6000 },
    { barrio: "CERVANTES/CAMPO AMOR", precio: 6000 },
    { barrio: "CERRO DE ORO AVION", precio: 5000 },
    { barrio: "CERRO DE ORO (Hotel Gold)", precio: 5500 },
    { barrio: "ALBERGUE/MARQUEZA", precio: 6000 },
    { barrio: "VEREDA BUENA VISTA", precio: 10000 },
    { barrio: "CHIPRE/CAMPOHERMOSO", precio: 7000 },
    { barrio: "COLINAS", precio: 7000 },
    { barrio: "COLOMBIA", precio: 5500 },
    { barrio: "COLON", precio: 7000 },
    { barrio: "CONJUNTO TORREAR", precio: 5000 },
    { barrio: "COMUNEROS", precio: 6500 },
    { barrio: "CUMBRE/VILLALUZ", precio: 6000 },
    { barrio: "ESTACION URIBE", precio: 10000 },
    { barrio: "ESTACION URIBE (Chec/Moteles)", precio: 15000 },
    { barrio: "ESTAMBUL", precio: 10000 },
    { barrio: "EUCALIPTOS", precio: 7000 },
    { barrio: "ENEA/BOSQUES ENEA", precio: 7000 },
    { barrio: "FANNY GONZALES", precio: 6000 },
    { barrio: "FATIMA/BETANIA", precio: 5500 },
    { barrio: "FUNDADORES/DELICIAS", precio: 6000 },
    { barrio: "FLORIDA/EL RETIRO", precio: 10000 },
    { barrio: "FLORIDA P. DE LA SALUD", precio: 10000 },
    { barrio: "GALERIA", precio: 7000 },
    { barrio: "GUAMAL/SANTOS", precio: 7000 },
    { barrio: "ISABELLA", precio: 7000 },
    { barrio: "LAURELES/RAMBLA", precio: 5000 },
    { barrio: "LEONORA/ROSALES", precio: 5000 },
    { barrio: "LIBORIO", precio: 7000 },
    { barrio: "LINDA", precio: 15000 },
    { barrio: "LLERAS", precio: 5500 },
    { barrio: "LUSITANIA", precio: 8000 },
    { barrio: "MALHABAR", precio: 7000 },
    { barrio: "MALTERIA (TCC - SENA)", precio: 9000 },
    { barrio: "MALTERIA (Recinto CAI)", precio: 10000 },
    { barrio: "MALTERIA (Progel-Trululu)", precio: 12000 },
    { barrio: "MILAN/CAMELIA", precio: 5000 },
    { barrio: "MINITAS/VIVEROS", precio: 6000 },
    { barrio: "MORROGACHO", precio: 11000 },
    { barrio: "MOLINOS", precio: 10000 },
    { barrio: "NEVADO", precio: 7000 },
    { barrio: "NOGALES", precio: 8500 },
    { barrio: "PALERMO/PALOGRANDE", precio: 5000 },
    { barrio: "PALONEGRO", precio: 6500 },
    { barrio: "PANORAMA", precio: 9000 },
    { barrio: "PARQUE DEL AGUA", precio: 7000 },
    { barrio: "PARAISO/FUENTE", precio: 8000 },
    { barrio: "PERSIA ALTO/PERSIA BAJO", precio: 6000 },
    { barrio: "PERALONSO", precio: 6000 },
    { barrio: "PIO XII", precio: 6000 },
    { barrio: "PRADO ALTO/BAJO", precio: 6500 },
    { barrio: "PORVENIR", precio: 6000 },
    { barrio: "PUERTAS DEL SOL", precio: 9000 },
    { barrio: "RAMBLA/RESIDENCIAS", precio: 5000 },
    { barrio: "ROSALES", precio: 5000 },
    { barrio: "RESERVA CAMPESTRE", precio: 10000 },
    { barrio: "RINCON DE LA FRANCIA", precio: 9000 },
    { barrio: "SAMARIA/SOLFERINO", precio: 7000 },
    { barrio: "SAN CAYETANO", precio: 6000 },
    { barrio: "SAN JOAQUIN", precio: 6000 },
    { barrio: "SAN JORGE/SOL", precio: 5500 },
    { barrio: "SAN JOSE", precio: 7000 },
    { barrio: "SAN MARCEL/MONTAÑITA", precio: 6000 },
    { barrio: "SAN SEBASTIAN", precio: 8000 },
    { barrio: "SINAI", precio: 6000 },
    { barrio: "SULTANA/FLORESTA DE LA SULT.", precio: 5000 },
    { barrio: "TOSCANA", precio: 5000 },
    { barrio: "TOPACIO", precio: 9000 },
    { barrio: "TORRES DE SAN VICENTE", precio: 7000 },
    { barrio: "TREBOL/TEJARES", precio: 5500 },
    { barrio: "URIBE AV PARALELA", precio: 5500 },
    { barrio: "VELEZ", precio: 5500 },
    { barrio: "VERSALLES", precio: 5000 },
    { barrio: "VILLA CARMENZA", precio: 7000 },
    { barrio: "VINA DEL RIO/VILLAHERMOSA", precio: 6000 },
    { barrio: "VILLA JULIA", precio: 8000 },
    { barrio: "VILLA PILAR", precio: 7500 },
    { barrio: "MIRADOR V. PILAR/SACATIN", precio: 8500 },
    { barrio: "MIRADOR DE SANCANCIO", precio: 5500 },
    { barrio: "VILLAMARIA/PRADERA/TURIN", precio: 10000 },
    { barrio: "LA FLORESTA/DESCACHE", precio: 13000 },
    { barrio: "VILLA DEL RIO", precio: 6000 },
    { barrio: "RIDUCO/INDUMA", precio: 10000 },
    { barrio: "GALLINAZO", precio: 13000 },
    { barrio: "TERMALES OTOÑO/ACUAPARQ", precio: 15000 },
    { barrio: "EDIFICIO LA ALCALDIA", precio: 7000 },
    { barrio: "CC PARQUE CALDAS", precio: 6000 },
    { barrio: "CC FUNDADORES", precio: 6000 },
    { barrio: "CC MALL PLAZA", precio: 6000 },
    { barrio: "CC CABLE PLAZA/LUKER", precio: 5000 },
    { barrio: "CC SANCANCIO", precio: 5000 },
  ]

  // ── Helpers ──────────────────────────────────────────
  const getPrecioDomicilio = () => {
    if (!formData.barrio) return 0
    const found = preciosDomicilio.find(i => i.barrio === formData.barrio)
    return found ? found.precio : 0
  }

  const getRecargoDatafono = () => Math.round(getPrecioDomicilio() * 0.5)

  const calcularTotal = () => {
    let subtotal = 0
    if (formData.tipoComida === "Almuerzo del día") {
      subtotal = 31000
    } else if (formData.tipoComida === "Comida del menú" && formData.platoSeleccionado) {
      const plato = opcionesMenu.find(p =>
        `${p.nombre} - ${p.precio.toLocaleString()}` === formData.platoSeleccionado
      )
      if (plato) subtotal = plato.precio
    }
    const empaque    = 2000
    const domicilio  = getPrecioDomicilio()
    const nocturno   = formData.recargoNocturno ? 500 : 0
    const datafono   = formData.usaDatafono ? getRecargoDatafono() : 0
    const maleta     = formData.prestaMaleta ? 2000 : 0
    const adics      = getTotalAdicionales()
    return subtotal + empaque + domicilio + nocturno + datafono + maleta + adics
  }

  // ── Effects ──────────────────────────────────────────
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
      formData.recargoNocturno ? `🌙 Recargo nocturno (después 10 PM): $500` : null,
      formData.usaDatafono    ? `💳 Recargo datáfono (50% domicilio): $${getRecargoDatafono().toLocaleString()}` : null,
      formData.prestaMaleta   ? `🧳 Préstamo de maleta: $2.000` : null,
    ].filter(Boolean).join("\n")

    const adicsLineas = adicionalesSeleccionados.length > 0
      ? adicionalesSeleccionados.map(nombre => {
          const found = adicionales.find(a => a.nombre === nombre)
          return `  • ${nombre}: $${found ? found.precio.toLocaleString() : 0}`
        }).join("\n")
      : ""

    let infoAdicional = ""
    if (formData.tipoPago === "Transferencia") {
      infoAdicional = `

🏦 **SI ELIGES TRANSFERENCIA RECUERDA:**
1- Solo recibimos de Bancolombia o Davivienda. (Otros bancos no)

📱 **DATOS BANCARIOS:**
🟢 Bancolombia ahorros: 37300002343
🔵 Davivienda ahorros: 85670011494

💰 **TOTAL A TRANSFERIR: $${total.toLocaleString()}**
(Incluye $2,000 del empaque biodegradable)

♻️ Recuerda que cobramos $2,000 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️

📸 **IMPORTANTE:** Después de realizar la transferencia, envía el pantallazo del comprobante a este WhatsApp para terminar el proceso.

¡Esperamos tu respuesta para preparar y enviar tu pedido lo antes posible! ¡Gracias por elegir HEALTHYBITE! 🍎 🍏`
    } else {
      infoAdicional = `

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
${adicsLineas ? `🧂 **Adicionales:**\n${adicsLineas}` : ""}
💳 **Tipo de Pago:** ${formData.tipoPago}
${extrasLineas ? `\n➕ **Extras:**\n${extrasLineas}` : ""}
💰 **TOTAL CALCULADO:** $${total.toLocaleString()}
📝 **Observación:** ${formData.observacion}${infoAdicional}
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
      {/* Elementos decorativos de fondo general */}
      {/* <div className={styles.backgroundDecorations}>
        <div className={`${styles.bgShape} ${styles.bgShape1}`} style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }} />
        <div className={`${styles.bgShape} ${styles.bgShape2}`} style={{ transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px)` }} />
        <div className={`${styles.bgShape} ${styles.bgShape3}`} style={{ transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.01}px)` }} />
        <div className={`${styles.bgShape} ${styles.bgShape4}`} style={{ transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * 0.012}px)` }} />
      </div> */}

      {/* Grid principal - Tres columnas */}
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

                <div className={styles.appContent}>
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

                      <form onSubmit={handleSubmit} className={styles.orderForm}>
                        <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required className={styles.formInput} />
                        <input type="email" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} required className={styles.formInput} />
                        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required className={styles.formInput} />
                        <input type="text" name="direccion" placeholder="Dirección de entrega" value={formData.direccion} onChange={handleChange} required className={styles.formInput} />

                        <select name="barrio" value={formData.barrio} onChange={handleChange} required className={styles.formSelect}>
                          <option value="">Selecciona tu barrio</option>
                          {preciosDomicilio.map((item, index) => (
                            <option key={index} value={item.barrio}>
                              {item.barrio} - ${item.precio.toLocaleString()}
                            </option>
                          ))}
                        </select>

                        <select name="tipoComida" value={formData.tipoComida} onChange={handleChange} required className={styles.formSelect}>
                          <option value="">Selecciona tipo de pedido</option>
                          <option value="Almuerzo del día">Almuerzo del día - $31.000</option>
                          <option value="Comida del menú">Comida del menú</option>
                        </select>

                        {formData.tipoComida === "Comida del menú" && (
                          <select name="platoSeleccionado" value={formData.platoSeleccionado} onChange={handleChange} required className={styles.formSelect}>
                            <option value="">Selecciona un plato del menú</option>
                            {opcionesMenu.map((plato, index) => (
                              <option key={index} value={`${plato.nombre} - ${plato.precio.toLocaleString()}`}>
                                {plato.nombre} - ${plato.precio.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        )}

                        <select name="tipoPago" value={formData.tipoPago} onChange={handleChange} required className={styles.formSelect}>
                          <option value="">Selecciona tipo de pago</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Datáfono">Datáfono</option>
                        </select>

                        {/* Info Efectivo */}
                        {formData.tipoPago === "Efectivo" && (
                          <div className={styles.cashInfo}>
                            <h3 className={styles.cashTitle}>💵 PAGO EN EFECTIVO</h3>
                            <div className={styles.cashContent}>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>💰 TOTAL A PAGAR:</h4>
                                <div className={styles.totalAmount}>${calcularTotal().toLocaleString()}</div>
                                <p className={styles.totalNote}>(Incluye $1,500 del empaque biodegradable + domicilio)</p>
                              </div>
                              <div className={styles.ecoMessage}><p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p></div>
                              <div className={styles.instructions}><p>💡 <strong>IMPORTANTE:</strong> Ten listo el dinero exacto o cambio para facilitar la entrega.</p></div>
                              <div className={styles.thankYou}><p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p></div>
                            </div>
                          </div>
                        )}

                        {/* Info Transferencia */}
                        {formData.tipoPago === "Transferencia" && (
                          <div className={styles.transferInfo}>
                            <h3 className={styles.transferTitle}>🏦 INFORMACIÓN DE TRANSFERENCIA</h3>
                            <div className={styles.transferContent}>
                              <p className={styles.transferWarning}>⚠️ Solo recibimos de Bancolombia o Davivienda (Otros bancos NO)</p>
                              <div className={styles.bankData}>
                                <h4 className={styles.bankTitle}>📱 DATOS BANCARIOS:</h4>
                                <div className={styles.bankItem}><span className={styles.bankIcon}>🟢</span><span>Bancolombia ahorros: 37300002343</span></div>
                                <div className={styles.bankItem}><span className={styles.bankIcon}>🔵</span><span>Davivienda ahorros: 85670011494</span></div>
                              </div>
                              <div className={styles.totalSection}>
                                <h4 className={styles.totalTitle}>💰 TOTAL A TRANSFERIR:</h4>
                                <div className={styles.totalAmount}>${calcularTotal().toLocaleString()}</div>
                                <p className={styles.totalNote}>(Incluye $1,500 del empaque biodegradable + domicilio)</p>
                              </div>
                              <div className={styles.ecoMessage}><p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p></div>
                              <div className={styles.instructions}><p>📸 <strong>IMPORTANTE:</strong> Después de realizar la transferencia, envía el pantallazo del comprobante a WhatsApp para terminar el proceso.</p></div>
                              <div className={styles.thankYou}><p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p></div>
                            </div>
                          </div>
                        )}

                        {/* ── NUEVO: Info Datáfono ── */}
                        {formData.tipoPago === "Datáfono" && (
                          <div className={styles.transferInfo}>
                            <h3 className={styles.transferTitle}>💳 USO DEL DATÁFONO</h3>
                            <div className={styles.transferContent}>
                              <p className={styles.transferWarning}>
                                ⚠️ El uso del datáfono tiene un recargo del <strong>50% del valor del domicilio</strong>
                              </p>
                              {formData.barrio && (
                                <div className={styles.totalSection}>
                                  <h4 className={styles.totalTitle}>💰 RECARGO DATÁFONO:</h4>
                                  <div className={styles.totalAmount}>${getRecargoDatafono().toLocaleString()}</div>
                                  <p className={styles.totalNote}>(50% de ${getPrecioDomicilio().toLocaleString()} de domicilio)</p>
                                </div>
                              )}
                              <div className={styles.instructions}><p>💡 <strong>IMPORTANTE:</strong> El datáfono llegará con el domiciliario al momento de la entrega.</p></div>
                              <div className={styles.thankYou}><p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p></div>
                            </div>
                          </div>
                        )}

                        {/* Resumen del pedido */}
                        {(formData.tipoComida || formData.barrio) && (
                          <div className={styles.orderSummary}>
                            <h3 className={styles.summaryTitle}>📋 RESUMEN DEL PEDIDO</h3>
                            <div className={styles.summaryContent}>
                              {formData.tipoComida && (
                                <div className={styles.summaryItem}>
                                  <span>🍽️ Pedido:</span>
                                  <span>{formData.tipoComida === "Almuerzo del día" ? "Almuerzo del día - $25,000" : formData.platoSeleccionado || "Selecciona un plato"}</span>
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
                              {/* ── Extras en resumen ── */}
                              {formData.recargoNocturno && (
                                <div className={styles.summaryItem}>
                                  <span>🌙 Recargo nocturno:</span>
                                  <span>$500</span>
                                </div>
                              )}
                              {formData.usaDatafono && formData.barrio && (
                                <div className={styles.summaryItem}>
                                  <span>💳 Recargo datáfono (50%):</span>
                                  <span>${getRecargoDatafono().toLocaleString()}</span>
                                </div>
                              )}
                              {formData.prestaMaleta && (
                                <div className={styles.summaryItem}>
                                  <span>🧳 Préstamo de maleta:</span>
                                  <span>$2,000</span>
                                </div>
                              )}
                              {adicionalesSeleccionados.length > 0 && (
                                <div className={styles.summaryItem}>
                                  <span>🧂 Adicionales:</span>
                                  <span>${getTotalAdicionales().toLocaleString()}</span>
                                </div>
                              )}
                              <div className={styles.summaryTotal}>
                                <span>💰 TOTAL:</span>
                                <span className={styles.totalPrice}>${calcularTotal().toLocaleString()}</span>
                              </div>
                            </div>
                            <div className={styles.ecoMessageSummary}>
                              <p>♻️ Recuerda que cobramos $1,500 por el empaque biodegradable, contribuyendo así a cuidar nuestro planeta. 🌍♻️</p>
                              <p>¡Gracias por elegir HEALTHYBITE! 🍎 🍏</p>
                            </div>
                          </div>
                        )}

                        {/* ── Adicionales — selector con tags ── */}
                        <div className={styles.adicionalesBox}>
                          <select
                            className={styles.formSelect}
                            value=""
                            onChange={(e) => {
                              const val = e.target.value
                              if (val && !adicionalesSeleccionados.includes(val)) {
                                setAdicionalesSeleccionados(prev => [...prev, val])
                              }
                            }}
                          >
                            <option value="">➕ Agregar adicional</option>
                            {adicionales
                              .filter(item => !adicionalesSeleccionados.includes(item.nombre))
                              .map((item, index) => (
                                <option key={index} value={item.nombre}>
                                  {item.nombre} — ${item.precio.toLocaleString()}
                                </option>
                              ))}
                          </select>

                          {adicionalesSeleccionados.length > 0 && (
                            <div className={styles.adicionalesTags}>
                              {adicionalesSeleccionados.map((nombre, index) => {
                                const found = adicionales.find(a => a.nombre === nombre)
                                return (
                                  <div key={index} className={styles.adicionalTag}>
                                    <span>{nombre} — ${found?.precio.toLocaleString()}</span>
                                    <button
                                      type="button"
                                      onClick={() => toggleAdicional(nombre)}
                                      className={styles.adicionalRemove}
                                    >×</button>
                                  </div>
                                )
                              })}
                              <p className={styles.adicionalesTotal}>
                                Subtotal adicionales: <strong>${getTotalAdicionales().toLocaleString()}</strong>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ── NUEVO: Cuadro azul — costos adicionales ── */}
                        {/* <div className={styles.additionalCostsBox}>
                          <h4 className={styles.additionalCostsTitle}>ℹ️ COSTOS ADICIONALES</h4>
                          <ul className={styles.additionalCostsList}>
                            <li>📦 A partir de <strong>12 kg</strong> se cobra costo adicional por peso</li>
                            <li>🤝 Favor o gestión especial tiene costo adicional</li>
                            <li>⏳ Filas x tiempo tienen costo adicional</li>
                          </ul>
                        </div> */}

                        {/* ── NUEVO: Checkboxes cuadro azul ── */}
                        {/* <div className={styles.checkboxContainer}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="recargoNocturno"
                              checked={formData.recargoNocturno}
                              onChange={(e) => setFormData({ ...formData, recargoNocturno: e.target.checked })}
                              className={styles.checkbox}
                            />
                            🌙 Pedido después de las 10 PM (recargo $500)
                          </label>

                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="usaDatafono"
                              checked={formData.usaDatafono}
                              onChange={(e) => setFormData({ ...formData, usaDatafono: e.target.checked })}
                              className={styles.checkbox}
                            />
                            💳 Usar datáfono (recargo 50% del domicilio)
                          </label>

                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="prestaMaleta"
                              checked={formData.prestaMaleta}
                              onChange={(e) => setFormData({ ...formData, prestaMaleta: e.target.checked })}
                              className={styles.checkbox}
                            />
                            🧳 Préstamo de maleta ($2.000)
                          </label>
                        </div> */}

                        <textarea
                          name="observacion"
                          placeholder="Observaciones: Si deseas algo adicional o modificaciones, especifícalo aquí"
                          value={formData.observacion}
                          onChange={handleChange}
                          rows="2"
                          className={styles.formTextarea}
                        />

                        <button type="submit" className={styles.submitButton}>
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
            <h1 className={styles.titleText}>Real Food Revolution</h1>
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
              { number: "1", title: "Explora nuestro menú en la tablet", text: "Desliza las imágenes para ver todas nuestras opciones" },
              { number: "2", title: "Completa tu pedido en el móvil", text: 'Si deseas algo diferente al almuerzo del día, selecciona "Comida del menú"' },
              { number: "3", title: "Verifica en la lista desplegable", text: "Selecciona el plato que deseas del menú disponible" },
              { number: "4", title: "Agrega observaciones", text: "Si deseas algo adicional, agrégalo en la observación" },
              { number: "5", title: "Para terminar el pago", text: "Se te redirigirá a WhatsApp para confirmar tu pedido" },
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
            <div className={styles.quoteIcon}>💚</div>
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
                  style={{ transform: `translateX(-${currentSlide * 100}%)`, width: `${menuImages.length * 100}%` }}
                >
                  {menuImages.map((image, index) => (
                    <div key={index} className={styles.sliderSlide}>
                      <img src={image} alt={`Menú página ${index + 1}`} className={styles.sliderImage} />
                    </div>
                  ))}
                </div>

                <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`}>←</button>
                <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`}>→</button>

                <button onClick={toggleZoom} className={styles.zoomButton}>
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
            <img src={menuImages[currentSlide]} alt={`Menú página ${currentSlide + 1} ampliada`} className={styles.zoomedImage} />
            <button className={styles.closeButton} onClick={toggleZoom}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealFoodRevolution