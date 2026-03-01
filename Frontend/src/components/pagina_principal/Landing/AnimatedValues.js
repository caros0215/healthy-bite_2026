import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/home.css';

function AnimatedValues({ values }) {
  const [displayedTexts, setDisplayedTexts] = useState(Array(values.length).fill(""));
  const [showCheckmarks, setShowCheckmarks] = useState(Array(values.length).fill(false));
  const containerRef = useRef(null);

  useEffect(() => {
    const timeouts = [];

    values.forEach((value, index) => {
      const startDelay = index * 3500; // 3.5 segundos entre cada frase

      timeouts.push(
        setTimeout(() => {
          // Efecto karaoke: mostrar letra por letra
          let currentText = "";
          value.split("").forEach((char, charIndex) => {
            timeouts.push(
              setTimeout(() => {
                currentText += char;
                setDisplayedTexts((prev) => {
                  const newTexts = [...prev];
                  newTexts[index] = currentText;
                  return newTexts;
                });
              }, charIndex * 30) // 30ms entre caracteres
            );
          });

          // Mostrar checkmark después de que termine el karaoke
          timeouts.push(
            setTimeout(() => {
              setShowCheckmarks((prev) => {
                const newChecks = [...prev];
                newChecks[index] = true;
                return newChecks;
              });
            }, value.length * 30) // Después de terminar el karaoke
          );
        }, startDelay)
      );
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [values]);

  return (
    <div className="values-list" ref={containerRef}>
      {values.map((_, index) => (
        <div key={index} className="value-item">
          <div className="checkmark-placeholder">
            {showCheckmarks[index] && (
              <svg
                className="checkmark"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <p className="value-text">{displayedTexts[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default AnimatedValues;