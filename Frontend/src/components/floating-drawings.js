class FloatingDrawings {
  constructor() {
    this.drawings = []
    this.containerDimensions = { width: 0, height: 0 }
    this.patternImageUrl = "../assets/images/5-Photoroom.webp"
    this.patternImageWidth = 375
    this.patternImageHeight = 750
    this.numberOfDrawings = 25
    this.initialized = false
    this.container = null

    this.init()
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup())
    } else {
      // Si ya está cargado, esperar un poco para que React termine de renderizar
      setTimeout(() => this.setup(), 500)
    }
  }

  setup() {
    // Buscar la scroll-layer
    const scrollLayer = document.querySelector(".scroll-layer")
    if (!scrollLayer) {
      // Si no encuentra scroll-layer, intentar de nuevo
      setTimeout(() => this.setup(), 200)
      return
    }

    // Crear el contenedor principal
    this.container = document.createElement("div")
    this.container.className = "floating-drawings-container"
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    `

    // Insertar como primer hijo de scroll-layer
    scrollLayer.insertBefore(this.container, scrollLayer.firstChild)

    this.updateDimensions()
    this.createDrawings()

    // Escuchar cambios de tamaño de ventana
    window.addEventListener("resize", () => this.handleResize())

    this.initialized = true
    console.log("FloatingDrawings initialized with", this.numberOfDrawings, "drawings")
  }

  handleResize() {
    this.updateDimensions()
    // Reposicionar dibujos si salen de pantalla
    this.drawings.forEach((drawing) => {
      if (drawing.x > this.containerDimensions.width - drawing.size) {
        drawing.x = Math.random() * (this.containerDimensions.width - drawing.size)
        drawing.element.style.left = `${drawing.x}px`
      }
    })
  }

  updateDimensions() {
    this.containerDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  createDrawings() {
    if (this.containerDimensions.width > 0 && this.containerDimensions.height > 0) {
      for (let i = 0; i < this.numberOfDrawings; i++) {
        const size = Math.random() * (70 - 30) + 30 // Tamaño entre 30 y 70px
        const bgOffsetX = Math.random() * (this.patternImageWidth - size)
        const bgOffsetY = Math.random() * (this.patternImageHeight - size)

        const drawing = {
          id: `drawing-${i}`,
          element: null,
          x: Math.random() * (this.containerDimensions.width - size),
          initialY: this.containerDimensions.height + Math.random() * 400,
          bgOffsetX: -bgOffsetX,
          bgOffsetY: -bgOffsetY,
          size: size,
          duration: (Math.random() * (25 - 12) + 12) * 1000, // Entre 12 y 25 segundos
          delay: Math.random() * 10 * 1000, // Retraso entre 0 y 10 segundos
          startTime: null,
          animationStarted: false,
        }

        // Crear el elemento DOM
        const element = document.createElement("div")
        element.className = "floating-drawing"
        element.style.cssText = `
          position: absolute;
          width: ${drawing.size}px;
          height: ${drawing.size}px;
          background-image: url(${this.patternImageUrl});
          background-size: ${this.patternImageWidth}px ${this.patternImageHeight}px;
          background-position: ${drawing.bgOffsetX}px ${drawing.bgOffsetY}px;
          background-repeat: no-repeat;
          opacity: 0;
          left: ${drawing.x}px;
          top: ${drawing.initialY}px;
          pointer-events: none;
          will-change: transform, opacity;
          backface-visibility: hidden;
        `

        drawing.element = element
        this.container.appendChild(element)
        this.drawings.push(drawing)

        // Iniciar la animación con retraso
        setTimeout(() => {
          this.startDrawingAnimation(drawing)
        }, drawing.delay)
      }
    }
  }

  startDrawingAnimation(drawing) {
    drawing.startTime = Date.now()
    drawing.animationStarted = true
    this.animateDrawing(drawing)
  }

  animateDrawing(drawing) {
    if (!drawing.animationStarted || !drawing.element) return

    const now = Date.now()
    const elapsed = now - drawing.startTime
    const progress = (elapsed % drawing.duration) / drawing.duration

    // Calcular la posición Y (movimiento vertical suave)
    const startY = this.containerDimensions.height + 200
    const endY = -drawing.size - 100
    const currentY = startY + (endY - startY) * progress

    // Calcular la opacidad con transiciones suaves
    let opacity = 0
    if (progress <= 0.15) {
      // Aparecer gradualmente durante el primer 15%
      opacity = progress / 0.15
    } else if (progress <= 0.85) {
      // Mantenerse visible del 15% al 85%
      opacity = 1
    } else {
      // Desaparecer gradualmente durante el último 15%
      opacity = 1 - (progress - 0.85) / 0.15
    }

    // Aplicar las transformaciones
    drawing.element.style.top = `${currentY}px`
    drawing.element.style.opacity = Math.max(0, Math.min(1, opacity))

    // Continuar la animación
    requestAnimationFrame(() => this.animateDrawing(drawing))
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    this.drawings.forEach((drawing) => {
      drawing.animationStarted = false
    })
    this.drawings = []
    window.removeEventListener("resize", () => this.handleResize())
    this.initialized = false
  }
}

// Variables globales para controlar la instancia
let floatingDrawingsInstance = null

// Función para inicializar
function initFloatingDrawings() {
  if (!floatingDrawingsInstance) {
    floatingDrawingsInstance = new FloatingDrawings()
  }
}

// Función para destruir
function destroyFloatingDrawings() {
  if (floatingDrawingsInstance) {
    floatingDrawingsInstance.destroy()
    floatingDrawingsInstance = null
  }
}

// Auto-inicializar cuando se carga el script
initFloatingDrawings()

// Exportar para uso global
window.FloatingDrawings = FloatingDrawings
window.initFloatingDrawings = initFloatingDrawings
window.destroyFloatingDrawings = destroyFloatingDrawings
