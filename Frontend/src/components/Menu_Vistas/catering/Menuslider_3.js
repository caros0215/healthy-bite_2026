import styles from "./Menuslider.module.css"
import heroImage from "../../../assets/images/run_2.webp"
import imagen_1 from "../../../assets/images/101.webp"
import imagen_2 from "../../../assets/images/102.webp"
import imagen_3 from "../../../assets/images/103.webp"
import imagen_4 from "../../../assets/images/104.webp"
import imagen_5 from "../../../assets/images/105.webp"
import imagen_6 from "../../../assets/images/101.webp"

const MenuRestaurant = () => {
  // Datos de los platos
  const dishItems = [
    {
      id: 1,
      image: imagen_1,
      title: "Bowl Mediterráneo",
      description: "Quinoa, pollo a la plancha, vegetales asados y hummus casero.",
    },
    {
      id: 2,
      image: imagen_2,
      title: "Ensalada Caesar",
      description: "Lechuga romana, parmesano, crutones y aderezo tradicional.",
    },
    {
      id: 3,
      image: imagen_3,
      title: "Poke Bowl",
      description: "Salmón fresco, arroz sushi, edamame y aguacate cremoso.",
    },
    {
      id: 4,
      image: imagen_4,
      title: "Wrap de Pollo",
      description: "Tortilla integral, pollo, vegetales frescos y salsa yogurt.",
    },
    {
      id: 5,
      image: imagen_5,
      title: "Bowl Vegano",
      description: "Tofu marinado, quinoa roja, kale fresco y tahini.",
    },
    {
      id: 6,
      image: imagen_6,
      title: "Pasta Integral",
      description: "Pasta de trigo integral, vegetales salteados y pesto artesanal.",
    },
  ]

  return (
    <div className={styles.menuContainer}>
      {/* Elementos decorativos flotantes alusivos a comida saludable */}
      <div className={styles.floatingShapes}>
        {/* Aguacate */}
        <div className={styles.avocado}>
          <div className={styles.avocadoOuter}>
            <div className={styles.avocadoInner}></div>
          </div>
        </div>

        {/* Hojas verdes */}
        <div className={styles.leaf1}>
          <svg viewBox="0 0 100 100" className={styles.leafSvg}>
            <path d="M50,10 Q80,30 70,60 Q60,80 50,90 Q40,80 30,60 Q20,30 50,10" fill="rgba(127, 155, 23, 0.3)" />
          </svg>
        </div>
        <div className={styles.leaf2}>
          <svg viewBox="0 0 100 100" className={styles.leafSvg}>
            <path d="M50,10 Q80,30 70,60 Q60,80 50,90 Q40,80 30,60 Q20,30 50,10" fill="rgba(173, 206, 38, 0.25)" />
          </svg>
        </div>
        <div className={styles.leaf3}>
          <svg viewBox="0 0 100 100" className={styles.leafSvg}>
            <path d="M50,10 Q80,30 70,60 Q60,80 50,90 Q40,80 30,60 Q20,30 50,10" fill="rgba(127, 155, 23, 0.2)" />
          </svg>
        </div>

        {/* Tomate */}
        <div className={styles.tomato}>
          <div className={styles.tomatoBody}></div>
          <div className={styles.tomatoStem}></div>
        </div>

        {/* Rodajas de limón */}
        <div className={styles.lemon1}>
          <div className={styles.lemonSlice}>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
          </div>
        </div>
        <div className={styles.lemon2}>
          <div className={styles.lemonSlice}>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
            <div className={styles.lemonSegment}></div>
          </div>
        </div>

        {/* Brócoli */}
        <div className={styles.broccoli}>
          <div className={styles.broccoliTop}></div>
          <div className={styles.broccoliStem}></div>
        </div>

        {/* Zanahoria */}
        <div className={styles.carrot}>
          <div className={styles.carrotBody}></div>
          <div className={styles.carrotLeaves}></div>
        </div>
      </div>

      {/* Hero Section con imagen de fondo y texto */}
      <div className={styles.heroSection}>
        <div className={styles.heroImageWrapper}>
          <img src={heroImage} alt="Nuestro Restaurante" className={styles.heroImage} />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>BIENVENIDO</span>
          <h1 className={styles.heroTitle}>
            NUESTRO
            <br />
            RESTAURANTE
          </h1>
          <p className={styles.heroSubtitle}>
            Donde la frescura y el sabor se encuentran con la nutrición perfecta
          </p>
          <button className={styles.heroButton}>
            <span>Explora el Menú</span>
            <svg className={styles.buttonArrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Section - 2 filas x 3 columnas */}
      <div className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>PLATOS QUE NUTREN</h2>
          <p className={styles.gridSubtitle}>
            Cada plato está diseñado para brindarte energía, sabor y los nutrientes que tu cuerpo necesita
          </p>
        </div>

        <div className={styles.gridContainer}>
          {dishItems.map((item, index) => (
            <div key={item.id} className={styles.gridItem} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.gridImageWrapper}>
                <img src={item.image} alt={item.title} className={styles.gridImage} />
                <div className={styles.gridOverlay}>
                  <div className={styles.gridContent}>
                    <h3 className={styles.gridItemTitle}>{item.title}</h3>
                    <p className={styles.gridItemDescription}>{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <button className={styles.ctaButton}>
            <span>Ver Menú Completo</span>
            <span className={styles.ctaIcon}>↗</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuRestaurant