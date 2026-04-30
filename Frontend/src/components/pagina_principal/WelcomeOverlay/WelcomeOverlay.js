"use client";
import { useState, useEffect } from "react";
import "./WelcomeOverlay.css";

const loaderGif = "https://ik.imagekit.io/b4rykldk3/logo_oscillate.gif?updatedAt=1777044898795";
const defaultImage = "https://ik.imagekit.io/b4rykldk3/artes-04.webp?updatedAt=1777044887985";
import API_URL from "../../../config/api";

const DEFAULT_IMAGE = defaultImage;

// 🔥 CACHE GLOBAL EN MEMORIA
let cachedImage = null;
let fetchingPromise = null;

// 🔥 CLAVE POR DÍA
const getTodayKey = () => {
  return `almuerzo_${new Date().toISOString().split("T")[0]}`;
};

const WelcomeOverlay = ({ onClose }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noImage, setNoImage] = useState(false);
  const [isCanvaLink, setIsCanvaLink] = useState(false);

  useEffect(() => {
    loadImage();
  }, []);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoImage(false);

      const storageKey = getTodayKey();

      // 🔥 1. CACHE EN MEMORIA
      if (cachedImage) {
        setImageUrl(cachedImage.url);
        setIsCanvaLink(cachedImage.isCanva);
        setLoading(false);
        return;
      }

      // 🔥 2. CACHE EN LOCALSTORAGE (POR DÍA)
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored);

        cachedImage = parsed;

        setImageUrl(parsed.url);
        setIsCanvaLink(parsed.isCanva);
        setLoading(false);
        return;
      }

      // 🔥 3. EVITAR MÚLTIPLES REQUESTS
      if (fetchingPromise) {
        const result = await fetchingPromise;
        setImageUrl(result.url);
        setIsCanvaLink(result.isCanva);
        setLoading(false);
        return;
      }

      // 🔥 4. HACER FETCH CON RETRY
      fetchingPromise = fetchWithRetry();

      const result = await fetchingPromise;

      // 🔥 5. GUARDAR EN CACHE
      cachedImage = result;

      localStorage.setItem(storageKey, JSON.stringify(result));

      setImageUrl(result.url);
      setIsCanvaLink(result.isCanva);

    } catch (err) {
      console.error("❌ Error:", err);
      setNoImage(true);
      setImageUrl(DEFAULT_IMAGE);
      setError("No hay imagen creada");
    } finally {
      setLoading(false);
      fetchingPromise = null;
    }
  };

  const fetchWithRetry = async () => {
    const usuario_id = 1;

    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(
          `${API_URL}/api/almuerzos/ultima-imagen/${usuario_id}`
        );

        if (!response.ok) throw new Error("Backend dormido");

        const data = await response.json();

        if (data.success && data.hasImage) {
          if (data.link_canva) {
            return {
              url: data.link_canva,
              isCanva: true,
            };
          }

          if (data.imagen) {
            const base64Image = data.imagen.startsWith("data:image")
              ? data.imagen
              : `data:image/png;base64,${data.imagen}`;

            return {
              url: base64Image,
              isCanva: false,
            };
          }
        }

        return {
          url: DEFAULT_IMAGE,
          isCanva: false,
        };
      } catch (err) {
        console.log(`⏳ Intento ${i + 1} falló`);
        await sleep(2000); // espera 2s para despertar Railway
      }
    }

    throw new Error("No se pudo conectar al backend");
  };

  const handlePedirAhora = () => {
    onClose();
    window.location.href = "/pedir";
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageError = () => {
    setNoImage(true);
    setImageUrl(DEFAULT_IMAGE);
  };

  return (
    <div className="welcome-overlay" onClick={handleBackgroundClick}>
      <div className="welcome-main-container">

        {/* IZQUIERDA */}
        <div className="welcome-content">
          <button onClick={onClose} className="close-button">
            ✖
          </button>

          <div className="image-container">
            {loading ? (
              <div className="image-loading">
                <img
                  src={loaderGif}
                  alt="Cargando..."
                  className="loading-gif"
                />
              </div>
            ) : noImage && !DEFAULT_IMAGE ? (
              <div className="no-image-container">
                <div className="no-image-icon">🍽️</div>
                <p>No hay imagen creada</p>
              </div>
            ) : (
              <div className="image-wrapper">
                <img
                  src={imageUrl || DEFAULT_IMAGE}
                  alt="Última imagen"
                  className="welcome-image"
                  onError={handleImageError}
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

        {/* DERECHA */}
        <div className="welcome-text-content">
          <h3 className="welcome-title">¡Bienvenido!</h3>

          <p className="welcome-text">
            Si deseas explorar el resto de la página dale click a la X,
            <br /><br />
            o pide directamente aquí:
          </p>

          <button onClick={handlePedirAhora} className="pedir-button">
            Pedir Ahora
          </button>

          {error && (
            <div className="error-container">
              <p>⚠️ {error}</p>
              <button onClick={loadImage}>Reintentar</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WelcomeOverlay;