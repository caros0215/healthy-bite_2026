import styles from "./Proposito.module.css"
import imagen_1 from "../../../assets/images/platos_3.jpg"
import imagen_2 from "../../../assets/images/comida_3.jpeg"
import imagen_3 from "../../../assets/images/comida_2.jpeg"

export default function InvertedLayout() {
    return (
      <section className={styles.layoutContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <img src={imagen_1} alt="Comida 1" className={styles.image} />
          </div>
          <div className={styles.imageWrapper}>
            <img src={imagen_2} alt="Comida 2" className={styles.image} />
          </div>
          <div className={styles.imageWrapper}>
            <img src={imagen_3} alt="Comida 3" className={styles.image} />
          </div>
        </div>
  
        <div className={styles.textContainer}>
          <h1 className={styles.title}>ESTILO DE VIDA SALUDABLE</h1>
          <h2 className={styles.subtitle}>NUESTRO PROPÓSITO</h2>
          <p className={styles.paragraph}>

          Impulsamos una transformación en los hábitos de vida mediante una alimentación clean: ingredientes naturales, 
          libres de aditivos químicos y procesamientos innecesarios.
          </p>
          <p className={styles.paragraph}>

          Nuestra visión es hacer que el bienestar integral sea accesible, práctico y deseable, 
          rompiendo barreras económicas y logísticas para que todas las personas puedan disfrutar de una vida plena y con propósito.
          </p>
          <p className={styles.paragraph}>

          Estamos convencidos de que acceder a opciones nutritivas y transparentes no es un privilegio, sino un derecho fundamental. Por eso, 
          lideramos un movimiento que reinventa la forma en que interactuamos con la comida: desde redefinir los estándares de la gastronomía 
          hasta hacer de la nutrición consciente una realidad cotidiana para todos, sin excepciones.
          </p>
        </div>
      </section>
    )
  }