import { useState } from 'react';
import styles from './pedido.module.css';
import imagen_1 from '../../../assets/images/eso.png'; // Asegúrate de que la ruta sea correcta

export default function HonestiCatering() {
  const [hovering, setHovering] = useState(false);
  
  return (
    <div className={styles.container}>
      {/* Texto izquierda */}
      <div 
        className={styles.textSection}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <p className={styles.subtitle}>FÁCIL, FÁCIL</p>
        
        <h1 className={styles.mainTitle}>
          SIN<br />ESTRÉS.
        </h1>
        
        <p className={styles.description}>
          Para compartir estilo bufé, desde 10 personas hasta las que quieras.
        </p>
        <p className={styles.description}>
          Pide en un abrir y cerrar de ojos, nos encargamos del resto.
        </p>
        
        <button className={styles.actionButton}>
          Pedir ahora
        </button>
      </div>

      {/* Imagen derecha */}
      <div className={styles.imageSection}>
        <div className={styles.imageContainer}>
          <div 
            className={styles.imageWrapper}
            style={{ transform: hovering ? 'scale(1.05)' : 'scale(1)' }}
          >
            <img 
              src={imagen_1}
              className={styles.cateringImage}
            />
            <div className={styles.overlay}></div>
          </div>
        </div>
        <div className={styles.gradient}></div>
      </div>
    </div>
  );
}