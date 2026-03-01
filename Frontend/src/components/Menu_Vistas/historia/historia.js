"use client"

import { useState, useEffect } from "react"
import styles from "./historia.module.css"
import imagen1 from "../../../assets/images/fundador_1.jpeg"
import imagen2 from "../../../assets/images/fundador_3-.png"
import imagen3 from "../../../assets/images/run_2.jpg"
import imagen4 from "../../../assets/images/bowl.png"
import imagen5 from "../../../assets/images/helado_2.jpeg"

// Iconos como componentes SVG simples
const ChefHat = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2M4 6h16M4 10h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z"
    />
  </svg>
)

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const Star = ({ className }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const Heart = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const Zap = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const Smile = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Leaf = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

const Brain = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const HealthyFoodStory = () => {
  // Estados para el hero section
  const [scrollY, setScrollY] = useState(0)
  const [currentWord, setCurrentWord] = useState(0)

  // Estados para fundadores
  const [hoveredFounder, setHoveredFounder] = useState(null)

  // Estados para recetas
  const [activeRecipe, setActiveRecipe] = useState(0)

  const dynamicWords = ["Deliciosa", "Nutritiva", "Sostenible", "Auténtica", "Transformadora"]

  const founders = [
    {
      id: "laura",
      name: "Laura Melissa Gutierrez",
      title: "Co-fundadora & Especialista en Nutrición",
      image: imagen1,
      description: "Especialista en nutrición, dietética y coaching nutricional",
      quote: "La alimentación es la base. Cuando comes bien, te sientes bien… y eso se nota",
    },
    {
      id: "andres",
      name: "Andrés Rivera",
      title: "Co-fundador & Licenciado en Educación Física",
      image: imagen2,
      description: "Experto en bienestar integral y el poder del movimiento",
      quote: "La alimentación y el movimiento no son extremos ni castigos, sino herramientas de amor propio",
    },
  ]

  const recipes = [
    {
      id: 1,
      name: "Bowl de Quinoa Arcoíris",
      image: imagen4,
      time: "15 min",
      serves: "2 personas",
      rating: 4.9,
      ingredients: ["Quinoa", "Aguacate", "Tomate cherry", "Espinacas", "Semillas de chía"],
      description: "Una explosión de colores y nutrientes que alimenta tu cuerpo y alma",
    },
    {
      id: 2,
      name: "Smoothie Verde Energizante",
      image: imagen5,
      time: "5 min",
      serves: "1 persona",
      rating: 4.8,
      ingredients: ["Espinacas", "Plátano", "Mango", "Leche de coco", "Jengibre"],
      description: "El impulso natural que necesitas para comenzar tu día con energía",
    },
    {
      id: 3,
      name: "Ensalada Mediterránea",
      image: "/small-kitchen-with-fresh-ingredients-and-cooking-u.jpg",
      time: "10 min",
      serves: "3 personas",
      rating: 4.7,
      ingredients: ["Tomate", "Pepino", "Aceitunas", "Queso feta", "Aceite de oliva"],
      description: "Sabores del mediterráneo que transportan tus sentidos",
    },
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Corazón Saludable",
      description: "Ingredientes ricos en omega-3 y antioxidantes que cuidan tu sistema cardiovascular",
      color: "redGradient",
      bgColor: "redBg",
    },
    {
      icon: Zap,
      title: "Energía Natural",
      description: "Carbohidratos complejos y proteínas que te dan energía sostenida todo el día",
      color: "yellowGradient",
      bgColor: "yellowBg",
    },
    {
      icon: Shield,
      title: "Sistema Inmune",
      description: "Vitaminas y minerales esenciales que fortalecen tus defensas naturales",
      color: "blueGradient",
      bgColor: "blueBg",
    },
    {
      icon: Smile,
      title: "Bienestar Mental",
      description: "Nutrientes que mejoran tu estado de ánimo y reducen el estrés",
      color: "purpleGradient",
      bgColor: "purpleBg",
    },
    {
      icon: Leaf,
      title: "Digestión Perfecta",
      description: "Fibra natural y probióticos que cuidan tu salud digestiva",
      color: "greenGradient",
      bgColor: "greenBg",
    },
    {
      icon: Brain,
      title: "Mente Clara",
      description: "Nutrientes que potencian tu concentración y memoria",
      color: "indigoGradient",
      bgColor: "indigoBg",
    },
  ]

  const journeySteps = [
    {
      step: "01",
      title: "Descubrimiento",
      description: "Conoces nuestras recetas y te enamoras del sabor",
      icon: "🌱",
    },
    {
      step: "02",
      title: "Transformación",
      description: "Cambias tus hábitos alimenticios gradualmente",
      icon: "⚡",
    },
    {
      step: "03",
      title: "Resultados",
      description: "Experimentas los beneficios en tu cuerpo y mente",
      icon: "🎯",
    },
    {
      step: "04",
      title: "Estilo de Vida",
      description: "La alimentación saludable se vuelve parte de ti",
      icon: "💚",
    },
  ]

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % dynamicWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.healthyFoodStory}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroImage} style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <img src={imagen3} alt="Ingredientes frescos y saludables" />
          </div>
          <div className={styles.heroOverlay} />

          <div className={styles.floatingParticles}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            <h1>
              <span className={styles.mainTitle}>Nuestra Historia</span>
              <span className={styles.subtitle}>
                Comida <span className={styles.dynamicWord}>{dynamicWords[currentWord]}</span>
              </span>
            </h1>
          </div>

          <p className={styles.heroDescription}>
            Healthy Bite nació de una idea sencilla, pero poderosa: transformar la forma en la que las personas se alimentan y se relacionan con la comida. No empezó en una gran cocina ni con grandes recursos, empezó en un garaje de 2x2, con una tabla, un cuchillo y una convicción profunda: comer bien puede cambiar vidas.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.btnPrimary}>
              <span>Descubre Nuestro Menú</span>
              <ArrowRight className={styles.btnIcon} />
            </button>
            <button className={styles.btnSecondary}>Ver Nuestra Misión</button>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Descubre más</span>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollDot} />
          </div>
        </div>

        <div className={styles.decorativeBlobs}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
        </div>
      </section>

      {/* Founders Section */}
      <section className={styles.foundersSection}>
        <div className={styles.sectionBackground}>
          <div className={`${styles.bgBlob} ${styles.bgBlob1}`} />
          <div className={`${styles.bgBlob} ${styles.bgBlob2}`} />
          <div className={`${styles.bgBlob} ${styles.bgBlob3}`} />
        </div>

        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Somos Laura y Andrés</h2>
            <p>Los fundadores de Healthy Bite. Unimos nuestros conocimientos, pero sobre todo nuestra pasión por el bienestar integral. Entendimos que la alimentación y el movimiento no son extremos ni castigos, sino herramientas de amor propio.</p>
          </div>

          <div className={styles.foundersGrid}>
            {founders.map((founder, index) => (
              <div
                key={founder.id}
                className={`${styles.founderCard} ${index % 2 === 1 ? styles.offset : ""}`}
                onMouseEnter={() => setHoveredFounder(founder.id)}
                onMouseLeave={() => setHoveredFounder(null)}
              >
                <div className={styles.founderContent}>
                  <div className={styles.founderInfo}>
                    <h3>{founder.name}</h3>
                    <p className={styles.founderTitle}>{founder.title}</p>
                    <p className={styles.founderDescription}>{founder.description}</p>
                  </div>

                  <div className={styles.founderQuote}>
                    <div className={styles.quoteMark}>&quot;</div>
                    <p>{founder.quote}</p>
                  </div>
                </div>

                <div className={`${styles.founderImage} ${hoveredFounder === founder.id ? styles.visible : ""}`}>
                  <div className={styles.imageGlow} />
                  <div className={styles.imageContainer}>
                    <img src={founder.image || "/placeholder.svg"} alt={founder.name} />
                    <div className={styles.imageOverlay} />
                  </div>
                  <div className={`${styles.decorativeDot} ${styles.dot1}`} />
                  <div className={`${styles.decorativeDot} ${styles.dot2}`} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.hoverHint}>
            <div className={styles.hintIndicator} />
            <p>Pasa el cursor sobre las tarjetas para conocer a nuestros fundadores</p>
          </div>
        </div>
      </section>

      {/* Mission Section - AQUÍ ESTÁ TODO EL TEXTO DE LA HISTORIA */}
      <section className={styles.missionSection}>
        {/* Iconos flotantes decorativos */}
        <div className={styles.floatingIcons}>
          <span className={styles.floatingIcon} style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🌱</span>
          <span className={styles.floatingIcon} style={{ top: '20%', right: '10%', animationDelay: '1s' }}>🥗</span>
          <span className={styles.floatingIcon} style={{ bottom: '15%', right: '8%', animationDelay: '2s' }}>🍎</span>
          <span className={styles.floatingIcon} style={{ bottom: '25%', left: '12%', animationDelay: '1.5s' }}>💚</span>
          <span className={styles.floatingIcon} style={{ top: '50%', right: '5%', animationDelay: '2.5s' }}>✨</span>
        </div>
        
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2>Creamos Healthy Bite para romper mitos</h2>
              <ul className={styles.mythsList}>
                <li>Que lo saludable no sabe bien</li>
                <li>Que comer sano es aburrido</li>
                <li>Que cuidarse es complicado</li>
              </ul>
              <p className={styles.missionStatement}>
                Y plato a plato demostramos que la comida saludable puede ser <strong>deliciosa, cercana, consciente y real.</strong>
              </p>
            </div>
            
            <div className={styles.missionHighlight}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightNumber}>4</div>
                <div className={styles.highlightLabel}>Años</div>
              </div>
              <p className={styles.highlightText}>
                Hoy, después de 4 años, Healthy Bite es mucho más que un mercado y un restaurante saludable. Es una <strong>comunidad</strong> que cree en el bienestar, en los procesos, en la educación nutricional y en el poder de los hábitos.
              </p>
            </div>
          </div>
          
          <div className={styles.purposeBox}>
            <p>Cada receta lleva intención, cada ingrediente tiene propósito y cada persona que llega hace parte de esta historia.</p>
          </div>
          
          <div className={styles.finalMessage}>
            <h3>Porque para nosotros la alimentación es la base</h3>
            <p className={styles.tagline}>Cuando comes bien, te sientes bien... y eso se nota.</p>
            <div className={styles.brandEssence}>
              <p>Eso es Healthy Bite:</p>
              <p className={styles.essence}>Nutrir de adentro hacia afuera, con pasión, coherencia y corazón 💚</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Showcase */}
      <section className={styles.recipeShowcase}>
        <div className={styles.recipeBackground}>
          <div className={`${styles.recipeBlob} ${styles.recipeBlob1}`}></div>
          <div className={`${styles.recipeBlob} ${styles.recipeBlob2}`}></div>
          <div className={`${styles.recipeBlob} ${styles.recipeBlob3}`}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <ChefHat className={styles.badgeIcon} />
              Nuestras Creaciones
            </div>
            <h2>
              Recetas que <span className={styles.highlight}>Transforman Vidas</span>
            </h2>
            <p>
              Cada plato cuenta una historia de pasión, nutrición y sabor. Descubre las recetas que han conquistado
              miles de corazones.
            </p>
          </div>

          <div className={styles.recipeContent}>
            <div className={styles.recipeNavigation}>
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`${styles.recipeNavItem} ${activeRecipe === index ? styles.active : ""}`}
                  onClick={() => setActiveRecipe(index)}
                >
                  <div className={styles.recipeNavIcon}>
                    <ChefHat className={styles.navIcon} />
                  </div>
                  <div className={styles.recipeNavContent}>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <div className={styles.recipeMeta}>
                      <div className={styles.metaItem}>
                        <Clock className={styles.metaIcon} />
                        {recipe.time}
                      </div>
                      <div className={styles.metaItem}>
                        <Users className={styles.metaIcon} />
                        {recipe.serves}
                      </div>
                      <div className={styles.metaItem}>
                        <Star className={`${styles.metaIcon} ${styles.starFilled}`} />
                        {recipe.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.recipeDisplay}>
              <div className={styles.recipeImageContainer}>
                <img
                  src={recipes[activeRecipe].image || "/placeholder.svg"}
                  alt={recipes[activeRecipe].name}
                  className={styles.recipeImage}
                />
                <div className={styles.recipeImageOverlay}></div>
                <div className={styles.recipeImageContent}>
                  <h3>{recipes[activeRecipe].name}</h3>
                  <div className={styles.recipeIngredients}>
                    {recipes[activeRecipe].ingredients.map((ingredient, index) => (
                      <span key={index} className={styles.ingredientTag}>
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.recipeDecorative1}></div>
              <div className={styles.recipeDecorative2}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className={styles.healthBenefits}>
        <div className={styles.benefitsPattern}></div>

        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <Leaf className={styles.badgeIcon} />
              Beneficios Comprobados
            </div>
            <h2>
              Más que Comida, es <span className={styles.highlight}>Medicina Natural</span>
            </h2>
            <p>
              Cada ingrediente ha sido cuidadosamente seleccionado por sus propiedades nutricionales y beneficios para
              tu salud integral.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className={styles.benefitCard}>
                  <div className={`${styles.benefitContent} ${styles[benefit.bgColor]}`}>
                    <div className={`${styles.benefitIcon} ${styles[benefit.color]}`}>
                      <Icon className={styles.icon} />
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                    <div className={`${styles.benefitDecorative} ${styles[benefit.color]}`}></div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.benefitsStats}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>Clientes reportan más energía</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>15kg</div>
                <div className={styles.statLabel}>Promedio de peso perdido</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>30 días</div>
                <div className={styles.statLabel}>Para ver resultados visibles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className={styles.customerJourney}>
        <div className={styles.journeyBackground}>
          <div className={`${styles.journeyBlob} ${styles.journeyBlob1}`}></div>
          <div className={`${styles.journeyBlob} ${styles.journeyBlob2}`}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <Star className={styles.badgeIcon} />
              Tu Transformación
            </div>
            <h2>
              El Viaje Hacia una <span className={styles.highlight}>Vida Saludable</span>
            </h2>
            <p>Descubre cómo transformar tu vida paso a paso con nuestra alimentación consciente.</p>
          </div>

          <div className={styles.journeySteps}>
            {journeySteps.map((step, index) => (
              <div key={index} className={styles.journeyStep}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepNumber}>PASO {step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < journeySteps.length - 1 && (
                  <div className={styles.stepArrow}>
                    <ArrowRight className={styles.arrowIcon} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.journeyImage}>
            <img src="/colorful-quinoa-bowls-and-green-smoothies-on-woode.jpg" alt="Comida saludable y colorida" />
            <div className={styles.journeyImageOverlay}></div>
            <div className={styles.journeyImageContent}>
              <h3>Alimentación que Transforma Vidas</h3>
              <p>Cada plato es una oportunidad para nutrir tu cuerpo y alma</p>
            </div>
          </div>

          <div className={styles.journeyCta}>
            <h3>¿Listo para comenzar tu propia transformación?</h3>
            <p>Únete a miles de personas que ya han cambiado sus vidas con nuestra alimentación consciente.</p>
            <button className={styles.ctaButton}>Comenzar Mi Viaje Saludable</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HealthyFoodStory