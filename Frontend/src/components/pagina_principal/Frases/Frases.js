import React, { useEffect, useRef, useState } from 'react';
import styles from './Frases.module.css';
import imagen2 from "../../../assets/images/healthy_bite_qr.webp";
import { Facebook, Instagram, Twitter, Youtube, QrCode, Music, Plus, Share2 } from 'lucide-react';

const Footer = () => {
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
    <footer className={containerClassName} ref={sectionRef}>
      {/* Columna Verde - Izquierda */}
      <div className={`${styles.sectionContainer} ${styles.greenContainer}`}>
        <div className={styles.backgroundLoader}></div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>ÚNETE A LA REVOLUCIÓN</h2>
          
          <div className={styles.twoColumns}>
            {/* Subcolumna izquierda - Redes Sociales */}
            <div className={styles.leftSubColumn}>
              <h3 className={styles.subTitle}>SÍGUENOS</h3>
              <div className={styles.socialIconsContainer}>
                <a href="#" className={styles.socialLink}>
                  <Facebook size={24} />
                  <span>Facebook</span>
                </a>
                <a href="#" className={styles.socialLink}>
                  <Instagram size={24} />
                  <span>Instagram</span>
                </a>
                <a href="#" className={styles.socialLink}>
                  <Twitter size={24} />
                  <span>Twitter</span>
                </a>
                <a href="#" className={styles.socialLink}>
                  <Youtube size={24} />
                  <span>YouTube</span>
                </a>
              </div>
              <p className={styles.smallText}>
                Síguenos en redes sociales para estar al día de todas nuestras novedades.
              </p>
            </div>
            
            {/* Subcolumna derecha - Información */}
            <div className={styles.rightSubColumn}>
              <h3 className={styles.subTitle}>INFORMACIÓN</h3>
              <div className={styles.infoLinksContainer}>
                <a href="#" className={styles.infoLink}>Política de Privacidad</a>
                <a href="#" className={styles.infoLink}>Términos y Condiciones</a>
                <a href="#" className={styles.infoLink}>Localización de Tiendas</a>
                <a href="#" className={styles.infoLink}>Trabaja con Nosotros</a>
                <a href="#" className={styles.infoLink}>Contacto</a>
              </div>
            </div>
          </div>
          
          <p className={styles.description}>
          ©2025 Oscar orozco ®
          </p>
        </div>
      </div>
      
      {/* Columna Gris - Derecha (ahora con fondo GIF e instrucciones de Spotify) */}
      <div className={`${styles.sectionContainer} ${styles.grayContainer}`}>
        <div className={styles.backgroundLoader}></div>
                  
        <div className={styles.content}>
          <h2 className={styles.title}>NUESTRA LISTA DE SPOTIFY</h2>
          <p className={styles.description}>
            Escanea el QR para disfrutar de nuestra lista de reproducción mientras disfrutas de la mejor comida.
          </p>
          
          <div className={styles.spotifyContainer}>
            <div className={styles.qrCodeSection}>
            <img src={imagen2} className={styles.qrIcon} />
              <p className={styles.qrText}>Escanea este código</p>
            </div>
            
            <div className={styles.spotifyInstructions}>
              <h3 className={styles.instructionTitle}>¿Cómo añadir tus canciones?</h3>
              
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <strong>Abre Spotify</strong> tras escanear el QR
                </div>
              </div>
              
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <strong>Busca tu canción favorita</strong> usando la lupa
                  <Music size={16} className={styles.stepIcon} />
                </div>
              </div>
              
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <strong>Mantén presionada la canción</strong> y selecciona "Añadir a lista"
                  <Plus size={16} className={styles.stepIcon} />
                </div>
              </div>
              
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <strong>Elige nuestra lista</strong> y compártela con tus amigos
                  <Share2 size={16} className={styles.stepIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;