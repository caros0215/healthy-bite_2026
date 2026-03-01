"use client";
import { useState, useEffect } from "react";
import "./WelcomeOverlay.css";
import loaderGif from '../../../assets/images/logo_oscillate.gif';

const WelcomeOverlay = ({ onClose }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanvaLink, setIsCanvaLink] = useState(false);

  useEffect(() => {
    fetchLatestImage();
  }, []);

  const fetchLatestImage = async () => {
    try {
      setLoading(true);
      setError(null);

      const usuario_id = 1;
      const response = await fetch(`http://localhost:5000/api/almuerzos/ultima-imagen/${usuario_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 Respuesta del servidor:", data);

      // CORRECCIÓN: Los datos están directamente en data, no en data.imagen
      if (data.success && data.hasImage) {
        // Si tiene link_canva (aunque no veo que lo tenga en tu respuesta actual)
        if (data.link_canva) {
          setImageUrl(data.link_canva);
          setIsCanvaLink(true);
          console.log("🔗 Es link de Canva:", true);
        } 
        // Si es base64 - que es tu caso actual
        else if (data.imagen) {
          const base64Image = data.imagen.startsWith("data:image")
            ? data.imagen
            : `data:image/png;base64,${data.imagen}`;

          setImageUrl(base64Image);
          setIsCanvaLink(false);
          console.log("✅ Imagen base64 cargada");
        } 
        else {
          throw new Error("No hay imagen o enlace disponible");
        }

        console.log("✅ Imagen cargada exitosamente");
      } else {
        throw new Error(data.mensaje || "No hay almuerzos disponibles");
      }
    } catch (err) {
      console.error("❌ Error fetching latest image:", err);
      setError("No se pudo cargar la imagen: " + err.message);

      // Tu placeholder existente
      setImageUrl(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5TaW4gSW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K"
      );
      setIsCanvaLink(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePedirAhora = () => {
    console.log("🛒 Botón Pedir Ahora clickeado");
    console.log("🎨 Imagen actual:", imageUrl);
    console.log("🔗 Es link de Canva:", isCanvaLink);

    if (isCanvaLink) {
      const mensaje = `Hola! Me interesa este diseño de Canva: ${imageUrl}`;
      // window.open(`https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`)
      console.log("📱 Mensaje para WhatsApp:", mensaje);
    } else {
      console.log(
        "📱 Se puede crear mensaje con la imagen base64 o usar otro método"
      );
    }

    onClose();
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageError = () => {
    console.error("❌ Error loading image from URL/Base64:", imageUrl);
    console.error("🔗 Es link de Canva:", isCanvaLink);

    // Usar SVG embebido en lugar de placeholder externo
    const errorSvg =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjREMyNjI2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5FcnJvciBJbWFnZW48L3RleHQ+Cjwvc3ZnPgo=";

    setImageUrl(errorSvg);
  };

  return (
    <div className="welcome-overlay" onClick={handleBackgroundClick}>
      {/* Contenedor principal con imagen y texto lado a lado */}
      <div className="welcome-main-container">
        {/* Contenedor de la imagen */}
        <div className="welcome-content">
          {/* Botón X para cerrar */}
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Cerrar"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Imagen con estados de carga */}
          <div className="image-container">
            {loading ? (
              <div className="image-loading">
                <div className="spinner">
                  <img
                    src={loaderGif} 
                    alt="Cargando..."
                    className="loading-gif"
                  />
                </div>
              </div>
            ) : (
              <div className="image-wrapper">
                <img
                  src={
                    imageUrl ||
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5TaW4gSW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K"
                  }
                  alt="Última imagen"
                  className="welcome-image"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
                {isCanvaLink && (
                  <div className="canva-badge">
                    <span>🎨 Canva</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contenedor del texto y botón al lado derecho */}
        <div className="welcome-text-content">
          <h3 className="welcome-title">¡Bienvenido!</h3>

          <p className="welcome-text">
            Si deseas explorar el resto de la página dale click a la X,
            <br />
            <br />
            si deseas pedir dale click
            <br />
            al botón Pedir Ahora
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