import React from 'react';
import styles from './Corporativo.module.css';
import corporativoVideo from '../../../assets/images/img-4678mov-dn6ej5.mp4';

const HonestCatering = () => {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerVideo}>
          <video 
            className={styles.videoElement} 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={corporativoVideo} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
        <div className={styles.bannerContent}>
          <p className={styles.serviceLabel}>SERVICIO CORPORATIVO</p>
          <h1 className={styles.title}>
            <span>HONEST</span>
            <span>CATERING.</span>
          </h1>
          <p className={styles.description}>
            Descubre nuestro nuevo catering saludable para eventos. Opciones 
            vegetarianas, sin gluten, keto, plant-based, y más.
          </p>
          <p className={styles.description}>Ya está disponible online.</p>
          <a 
            href="https://chat.whatsapp.com/Hw56pbJUHC41Ekq67gOgLL?text=Hola,%20me%20interesa%20el%20servicio%20de%20Honest%20Catering%20Corporativo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.ctaButton}
          >
            Pide ahora
            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HonestCatering;