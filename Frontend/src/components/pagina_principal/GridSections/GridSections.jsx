"use client"

import { useEffect, useRef } from "react"
import styles from "./GridSections.module.css"

const HealthyLifeSection = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const healthWords = [
      "SALUD",
      "VIDA",
      "BIENESTAR",
      "ENERGÍA",
      "NUTRICIÓN",
      "FITNESS",
      "BALANCE",
      "FUERZA",
      "VITALIDAD",
      "WELLNESS",
      "PÉRDIDA DE PESO",
      "EJERCICIO",
      "DIETA",
      "PROTEÍNA",
      "CARDIO",
      "HIDRATACIÓN",
      "DESCANSO",
      "MOTIVACIÓN",
      "SALUD MENTAL",
      "YOGA",
      "MEDITACIÓN",
      "RESISTENCIA",
    ]

    const createTypingWord = () => {
      const wordElement = document.createElement("div")
      wordElement.className = styles.typingWord

      const word = healthWords[Math.floor(Math.random() * healthWords.length)]

      // Posición vertical aleatoria
      wordElement.style.top = Math.random() * 80 + 10 + "%"
      // Tamaño aleatorio
      wordElement.style.fontSize = Math.random() * 12 + 16 + "px"
      // Duración de animación aleatoria
      const duration = Math.random() * 3 + 5
      wordElement.style.animationDuration = duration + "s"

      container.appendChild(wordElement)

      // Efecto de escritura letra por letra
      let charIndex = 0
      const typingInterval = setInterval(() => {
        if (charIndex < word.length) {
          wordElement.textContent += word[charIndex]
          charIndex++
        } else {
          clearInterval(typingInterval)
        }
      }, 100)

      // Eliminar el elemento después de la animación
      setTimeout(() => {
        wordElement.remove()
      }, duration * 1000)
    }

    // Crear palabras iniciales
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createTypingWord(), i * 400)
    }

    // Continuar creando palabras
    const interval = setInterval(createTypingWord, 800)

    return () => {
      clearInterval(interval)
      const words = container.querySelectorAll(`.${styles.typingWord}`)
      words.forEach((word) => word.remove())
    }
  }, [])

  return (
    <section className={styles.wellnessSection}>
      <div ref={containerRef} className={styles.typingContainer}></div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transforma Tu Vida Con Nuestro Programa de Bienestar</h1>
          <p className={styles.subtitle}>
            Un enfoque integral para mejorar tu salud y alcanzar tu peso ideal de forma sostenible
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>Tasa de Éxito</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>10k+</div>
            <div className={styles.statLabel}>Vidas Transformadas</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>-15kg</div>
            <div className={styles.statLabel}>Promedio de Pérdida</div>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Plan Nutricional Personalizado</h3>
            <p className={styles.featureDescription}>
              Diseñado específicamente para tus necesidades, objetivos y estilo de vida
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Rutinas de Ejercicio Efectivas</h3>
            <p className={styles.featureDescription}>Entrenamientos adaptados a tu nivel con resultados comprobados</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Acompañamiento Profesional</h3>
            <p className={styles.featureDescription}>Soporte continuo de nutricionistas y entrenadores certificados</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Seguimiento de Progreso</h3>
            <p className={styles.featureDescription}>
              Monitorea tus avances con métricas detalladas y ajustes personalizados
            </p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>¿Listo para Comenzar tu Transformación?</h2>
          <p className={styles.ctaText}>Únete a miles de personas que ya han mejorado su calidad de vida</p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>Empezar Ahora</button>
            <button className={styles.secondaryButton}>Más Información</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HealthyLifeSection
