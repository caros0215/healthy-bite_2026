"use client";   // ← Puedes quitar esta línea si no estás usando Next.js
import { useState, useEffect } from "react";
import "./WelcomeOverlay.css";

const loaderGif = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620330/logo_oscillate_dfzlda.gif";
const defaultImage = "https://res.cloudinary.com/dxh5zrylb/image/upload/v1774620189/artes-04_rthq5e.webp";

const WelcomeOverlay = ({ onClose }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noImage, setNoImage] = useState(false);
  const [isCanvaLink, setIsCanvaLink] = useState(false);

  useEffect(() => {
    fetchLatestImage();
  }, []);

  const fetchLatestImage = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoImage(false);

      const usuario_id = 1;
      const response = await fetch(`${API_URL}/api/almuerzos/ultima-imagen/${usuario_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();

      if (data.success && data.hasImage) {
        if (data.link_canva) {
          setImageUrl(data.link_canva);
          setIsCanvaLink(true);
        } else if (data.imagen) {
          const base64Image = data.imagen.startsWith("data:image")
            ? data.imagen
            : `data:image/png;base64,${data.imagen}`;
          setImageUrl(base64Image);
          setIsCanvaLink(false);
        }
      } else {
        setNoImage(true);
        setImageUrl(defaultImage);
      }
    } catch (err) {
      console.error("❌ Error fetching image:", err);
      setNoImage(true);
      setImageUrl(defaultImage);
      setError("No hay imagen creada");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función corregida para Create React App
  const handlePedirAhora = () => {
    console.log("🛒 Redirigiendo a /Pedir...");
    onClose();                    // Cierra el overlay primero
    
    // Redirección simple y confiable
    window.location.href = "/Pedir";
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleImageError = () => {
    setNoImage(true);
    setImageUrl(defaultImage);
  };

  return (
    <div className="welcome-overlay" onClick={handleBackgroundClick}>
      <div className="welcome-main-container">
        
        {/* Imagen + Cerrar */}
        <div className="welcome-content">
          <button onClick={onClose} className="close-button" aria-label="Cerrar">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="image-container">
            {loading ? (
              <div className="image-loading">
                <img src={loaderGif} alt="Cargando..." className="loading-gif" />
              </div>
            ) : noImage ? (
              <div className="no-image-container">
                <div className="no-image-icon">🍽️</div>
                <p className="no-image-text">No hay imagen creada</p>
              </div>
            ) : (
              <div className="image-wrapper">
                <img
                  src={imageUrl || defaultImage}
                  alt="Última imagen"
                  className="welcome-image"
                  onError={handleImageError}
                />
                {isCanvaLink && <div className="canva-badge"><span>🎨 Canva</span></div>}
              </div>
            )}
          </div>
        </div>

        {/* Texto y Botón */}
        <div className="welcome-text-content">
          <h3 className="welcome-title">¡Bienvenido!</h3>

          <p className="welcome-text">
            Si deseas explorar el resto de la página dale click a la X,<br /><br />
            si deseas pedir dale click al botón <strong>Pedir Ahora</strong>
          </p>

          <button onClick={handlePedirAhora} className="pedir-button">
            Pedir Ahora
          </button>

          {error && (
            <div className="error-container">
              <p className="error-message">⚠️ {error}</p>
              <button onClick={fetchLatestImage} className="retry-button">
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;