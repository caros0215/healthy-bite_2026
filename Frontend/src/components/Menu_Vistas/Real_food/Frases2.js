// components/Frase.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './Frases2.module.css';

const Frase = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Combinamos clases de manera condicional
  const containerClassName = `${styles.container} ${isVisible ? styles.animate : ''}`;

  return (
    <div className={containerClassName} ref={sectionRef}>
      {/* Sección Verde */}
      <div className={`${styles.sectionContainer} ${styles.greenContainer}`}>
        <div className={styles.backgroundLoader}></div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>ÚNETE A LA REVOLUCIÓN</h2>
          <p className={styles.description}>Sáltate la cola, obtén acceso privilegiado a eventos y productos exclusivos y Real Food gratuito.</p>
          <img src="/path/to/your/app-icon.webp" alt="App icon" className={styles.sectionImage} />
        </div>
      </div>
      
      {/* Sección Gris */}
      <div className={`${styles.sectionContainer} ${styles.grayContainer}`}>
        <div className={styles.backgroundLoader}></div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>LISTA DE REPRODUCCIÓN</h2>
          <p className={styles.description}>Escucha los nuevos sonidos seleccionados por nuestros DJs mientras comes.</p>
          <img src="/path/to/your/music-icon.webp" alt="Music icon" className={styles.sectionImage} />
        </div>
      </div>
    </div>
  );
};

export default Frase;