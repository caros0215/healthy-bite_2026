import React from 'react';
import styles from './Corporativo.module.css';
import corporativoVideo from '../../../assets/images/Healthy Principal.webm';

const TrabajaConNosotros = () => {
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
            <source src={corporativoVideo} type="video/webm" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
        <div className={styles.bannerContent} style={{ textAlign: 'center', alignItems: 'center' }}>
          <p className={styles.serviceLabel}>ÚNETE A NUESTRO EQUIPO</p>
          <h1 className={styles.title} style={{ textAlign: 'center' }}>
            <span>TRABAJA</span>
            <span>CON NOSOTROS.</span>
          </h1>
          <p className={styles.description}>
            ¿Te apasiona la alimentación saludable y quieres ser parte de algo 
            grande? Buscamos personas comprometidas, creativas y con ganas de crecer.
          </p>
          <p className={styles.description}>Aplica ahora y forma parte de nuestra familia.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSf4fUhUnZ8Uc5BGcHPV7XBK_23CUm2yhW_186of_LxMq4g91w/viewform" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.ctaButton}
            >
              Aplica aquí
              <span className={styles.arrow}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajaConNosotros;