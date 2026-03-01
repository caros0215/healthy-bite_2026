import React, { useState, useEffect } from 'react';
import styles from './frases_2.module.css';

const defaultPhrases = [
  {
    text: "NACE PARA TRANSFORMAR LA FORMA EN QUE LAS PERSONAS SE RELACIONAN CON LA COMIDA. CREEMOS EN UNA ALIMENTACIÓN HONESTA, LIBRE DE ATAJOS INDUSTRIALES Y LLENA DE SABOR, CREADA CON INGREDIENTES VERDADEROS Y PROCESOS TRANSPARENTES. ",
    position: "right",
  },
  {
    text: "CREEMOS EN UNA FORMA DE VIVIR MÁS CONSCIENTE, MÁS NATURAL Y MÁS HONESTA. PORQUE ESTAR BIEN NO ES UNA MODA, ES UNA DECISIÓN DIARIA",
    position: "top",
  },
  {
    text: "NOS PERMITIMOS SER IRREVERENTES Y PROVOCADORES SI ESO SIGNIFICA ROMPER MITOS SOBRE LA COMIDA REAL, EDUCAR CON AMOR Y ACERCAR A MÁS PERSONAS A UN ESTILO DE VIDA SALUDABLE SIN CULPA",
    position: "bottom",
  },
  {
    text: "SOMOS UN MOVIMIENTO: UNO QUE APUESTA POR LA SALUD INTEGRAL",
    position: "bottom",
  },
  {
    text: "NO QUEREMOS CAMBIAR TU CUERPO, QUEREMOS TRANSFORMAR TU RELACIÓN CON LO QUE COMES, CON LO QUE PIENSAS Y CON LO QUE SIENTES",
    position: "center",
  },
];

function KaraokeText({ phrases = defaultPhrases, phraseDuration = 8000, pauseAfterComplete = 1500 }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setColorProgress(0);
    setIsVisible(true);

    const totalDuration = phraseDuration + pauseAfterComplete;
    const colorSpeed = 30;

    const colorInterval = setInterval(() => {
      setColorProgress((prev) => {
        if (prev >= 100) {
          clearInterval(colorInterval);
          return 100;
        }
        return prev + (colorSpeed / phraseDuration) * 100;
      });
    }, colorSpeed);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, totalDuration - 500);

    const phraseTimer = setTimeout(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, totalDuration);

    return () => {
      clearInterval(colorInterval);
      clearTimeout(hideTimer);
      clearTimeout(phraseTimer);
    };
  }, [currentPhraseIndex, phrases.length, phraseDuration, pauseAfterComplete]);

  const getPositionClass = (position) => {
    switch (position) {
      case "top":
        return styles.positionTop;
      case "bottom":
        return styles.positionBottom;
      case "center":
        return styles.positionCenter;
      case "right":
        return styles.positionRight;
      default:
        return styles.positionRight;
    }
  };

  const renderPhrase = () => {
    const phrase = phrases[currentPhraseIndex];
    const charCount = phrase.text.length;
    const charsToColor = Math.floor((colorProgress / 100) * charCount);

    return (
      <div 
        key={currentPhraseIndex} 
        className={`${styles.textWrapper} ${getPositionClass(phrase.position)} ${isVisible ? styles.visible : styles.hidden}`}
      >
        <div className={styles.textContent}>
          {phrase.text.split("").map((char, charIndex) => (
            <span 
              key={charIndex} 
              className={charIndex < charsToColor ? styles.colored : styles.uncolored}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderPhrase()}
    </div>
  );
}

export default KaraokeText;