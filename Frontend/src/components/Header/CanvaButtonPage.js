"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../Header/DashboardHeader";
import "./CanvaButtonPage.css";
import imagen1 from "../../assets/images/canva.png";

function CanvaButtonPage() {
  // Estados para subida de archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estados para guardar diseños por URL
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("1");

  // Estados para categorías de guardado
  const [selectedCategoryForUrl, setSelectedCategoryForUrl] = useState("");
  const [selectedCategoryForPhoto, setSelectedCategoryForPhoto] = useState("");
  const [categorySelectedForUrl, setCategorySelectedForUrl] = useState(false);
  const [categorySelectedForPhoto, setCategorySelectedForPhoto] = useState(false);

  // Estados para la fecha del evento
  const [selectedDateForUrl, setSelectedDateForUrl] = useState("");
  const [selectedDateForPhoto, setSelectedDateForPhoto] = useState("");

  // Validar fecha
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Obtener ID de usuario
  useEffect(() => {
    const getUserId = () => {
      setUserId("1"); // Para pruebas, usar ID estático
    };
    getUserId();
  }, []);

  // Handlers para cambio de categoría
  const handleCategoryChangeForUrl = (e) => {
    setSelectedCategoryForUrl(e.target.value);
    setCategorySelectedForUrl(true);
  };

  const handleCategoryChangeForPhoto = (e) => {
    setSelectedCategoryForPhoto(e.target.value);
    setCategorySelectedForPhoto(true);
  };

  // Abrir Canva
  const openCanva = () => {
    window.open("https://www.canva.com/", "_blank");
  };

  // Convertir archivo a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Función para guardar DISEÑO (ENLACE) - CORREGIDA
  const saveDesignToDatabase = async (content, category, fecha_evento) => {
    if (!content) {
      setSaveStatus("error");
      setErrorMessage("Por favor, ingresa un enlace.");
      return false;
    }
    if (!category) {
      setSaveStatus("error");
      setErrorMessage("Por favor, selecciona una categoría (Almuerzos, Cursos o Running).");
      return false;
    }
    if (!isValidDate(fecha_evento)) {
      setSaveStatus("error");
      setErrorMessage("Por favor, selecciona una fecha válida.");
      return false;
    }

    setIsLoading(true);
    setSaveStatus(null);
    setErrorMessage("");

    const endpoint = `http://localhost:5000/api/${category}/guardar-diseno`;
    const elementosData = [{ type: "link", src: content }];

    try {
      const response = await axios.post(endpoint, {
        usuario_id: Number.parseInt(userId),
        fecha: fecha_evento, // Para guardar-diseno usa "fecha"
        elementos: elementosData,
      });

      if (response.data.success) {
        setSaveStatus("success");
        return true;
      } else {
        setSaveStatus("error");
        setErrorMessage(response.data.error || "Error al guardar el diseño");
        return false;
      }
    } catch (error) {
      console.error("❌ Error al guardar el diseño:", error);
      setSaveStatus("error");
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.code === "ECONNREFUSED") {
        setErrorMessage("No se puede conectar con el servidor. Verifica que esté ejecutándose.");
      } else {
        setErrorMessage("Error al conectar con el servidor. Verifica tu conexión.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar IMAGEN - CORREGIDA
  const saveImageToDatabase = async (base64Image, category, fecha_evento) => {
    if (!base64Image) {
      setUploadStatus("Error: No hay imagen para guardar");
      return false;
    }
    if (!category) {
      setUploadStatus("Error: Por favor selecciona una categoría.");
      return false;
    }
    if (!isValidDate(fecha_evento)) {
      setUploadStatus("Error: Por favor selecciona una fecha válida.");
      return false;
    }

    const endpoint = `http://localhost:5000/api/${category}/guardar-imagen`;

    try {
      const response = await axios.post(endpoint, {
        usuario_id: Number.parseInt(userId),
        fecha_evento: fecha_evento, // Para guardar-imagen usa "fecha_evento"
        imagen_base64: base64Image,
      });

      if (response.data.success) {
        setUploadStatus("¡Imagen guardada exitosamente!");
        return true;
      } else {
        setUploadStatus(`Error: ${response.data.error || "Error al guardar la imagen"}`);
        return false;
      }
    } catch (error) {
      console.error("❌ Error al guardar imagen:", error);
      if (error.response?.data?.error) {
        setUploadStatus(`Error: ${error.response.data.error}`);
      } else if (error.code === "ECONNREFUSED") {
        setUploadStatus("Error: No se puede conectar con el servidor");
      } else {
        setUploadStatus("Error: No se pudo guardar la imagen");
      }
      return false;
    }
  };

  // Manejar envío de URL
  const handleSubmitUrl = async (e) => {
    e.preventDefault();
    const input = document.getElementById("design-url-input");
    const url = input?.value?.trim();

    const success = await saveDesignToDatabase(url, selectedCategoryForUrl, selectedDateForUrl);
    if (success) {
      if (input) input.value = "";
      setSelectedDateForUrl("");
      setCategorySelectedForUrl(false);
      setSelectedCategoryForUrl("");
      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadStatus("Error: Por favor selecciona solo archivos de imagen");
        return;
      }
      const maxSize = 50 * 1024 * 1024; // Aumentado a 50 MB
      if (file.size > maxSize) {
        setUploadStatus("Error: El archivo es demasiado grande. Máximo 50MB");
        return;
      }
      setSelectedFile(file);
      setUploadStatus("");
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar foto
  const handleSavePhoto = async () => {
    if (!selectedFile) {
      setUploadStatus("Error: Por favor selecciona una foto");
      return;
    }
    if (!selectedCategoryForPhoto) {
      setUploadStatus("Error: Por favor selecciona una categoría.");
      return;
    }
    if (!isValidDate(selectedDateForPhoto)) {
      setUploadStatus("Error: Por favor selecciona una fecha válida.");
      return;
    }

    setIsUploadingPhoto(true);
    setUploadStatus("Guardando imagen...");

    try {
      const base64Image = await convertToBase64(selectedFile);
      const success = await saveImageToDatabase(base64Image, selectedCategoryForPhoto, selectedDateForPhoto);

      if (success) {
        setTimeout(() => {
          setSelectedFile(null);
          setPreviewUrl("");
          setUploadStatus("");
          setSelectedDateForPhoto("");
          setCategorySelectedForPhoto(false);
          setSelectedCategoryForPhoto("");
          const fileInput = document.getElementById("photo-upload");
          if (fileInput) fileInput.value = "";
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Error al guardar foto:", error);
      setUploadStatus("Error: No se pudo guardar la foto");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="canva-button-page">
      <DashboardHeader logoColor="/placeholder.svg" />
      <div className="canva-content">
        <div className="canva-info-box">
          <h1>Crea y guarda tus diseños con Canva</h1>
          <div className="canva-main-container">
            <div className="canva-grid">
              <div className="canva-main-card">
                <div className="three-columns">
                  {/* Columna 1: Diseña con Canva */}
                  <div className="canva-sub-card">
                    <h2>Diseña con Canva</h2>
                    <p>Crea diseños profesionales en minutos con la plataforma líder en diseño gráfico online.</p>
                    <div className="canva-button-container">
                      <button className="canva-animated-button" onClick={openCanva}>
                        <img src={imagen1 || "/placeholder.svg"} alt="Logo de Canva" className="canva-logo" />
                        <span className="ir">Ir a Canva</span>
                      </button>
                    </div>
                    <div className="canva-steps">
                      <div className="step-item">
                        <span className="step-number">1</span>
                        <span>Haz clic en el botón para ir a Canva</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">2</span>
                        <span>Elige el tipo de diseño que deseas crear</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">3</span>
                        <span>Personaliza tu diseño con las herramientas de Canva</span>
                      </div>
                    </div>
                  </div>

                  {/* Columna 2: Guardar diseño por URL */}
                  <div className="canva-sub-card">
                    <h2>Guarda tu diseño por enlace</h2>
                    <p>Para <strong>almuerzos, cursos y running</strong>: guarda el enlace de tu diseño de Canva.</p>
                    <div className="canva-steps">
                      <div className="step-item">
                        <span className="step-number">1</span>
                        <span>En Canva, haz clic en "Compartir" en la esquina superior derecha</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">2</span>
                        <span>Selecciona "Copiar enlace" para copiar la URL de tu diseño</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">3</span>
                        <span>Pega el enlace aquí y haz clic en "Guardar diseño"</span>
                      </div>
                    </div>
                    <form className="save-form" onSubmit={handleSubmitUrl}>
                      <div className="category-selector">
                        <label className="category-selector-label">Guardar en:</label>
                        <select
                          value={selectedCategoryForUrl}
                          onChange={handleCategoryChangeForUrl}
                          disabled={isLoading}
                          required
                        >
                          <option value="">Seleccione categoría</option>
                          <option value="almuerzos">Almuerzos (enlace)</option>
                          <option value="cursos">Cursos (enlace)</option>
                          <option value="running">Running (enlace)</option>
                        </select>
                      </div>
                      <div className="date-selector">
                        <label className="date-selector-label">Fecha del evento:</label>
                        <input
                          type="date"
                          value={selectedDateForUrl}
                          onChange={(e) => setSelectedDateForUrl(e.target.value)}
                          disabled={isLoading}
                          required
                          className="date-input"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Pega el enlace de tu diseño aquí (ej: https://www.canva.com/design/...)"
                        className="design-url-input"
                        id="design-url-input"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="submit"
                        className="save-animated-button"
                        disabled={isLoading || !categorySelectedForUrl || !selectedDateForUrl}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner"></span>
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <span className="save-icon">💾</span>
                            <span>Guardar diseño</span>
                          </>
                        )}
                      </button>
                    </form>
                    {saveStatus === "success" && (
                      <div className="status-message success">
                        <p>✅ ¡Diseño guardado correctamente!</p>
                      </div>
                    )}
                    {saveStatus === "error" && (
                      <div className="status-message error">
                        <p>❌ {errorMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* Columna 3: Subir foto del diseño */}
                  <div className="canva-sub-card">
                    <h2>Sube la imagen de tu diseño</h2>
                    <p>Para <strong>almuerzos, cursos y running</strong>: descarga tu diseño como imagen y súbelo aquí.</p>
                    <div className="canva-steps">
                      <div className="step-item">
                        <span className="step-number">1</span>
                        <span>En Canva, haz clic en "Descargar" y guarda tu diseño como imagen</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">2</span>
                        <span>Haz clic en "Seleccionar foto" y elige la imagen descargada</span>
                      </div>
                      <div className="step-item">
                        <span className="step-number">3</span>
                        <span>Revisa la vista previa y haz clic en "Guardar imagen"</span>
                      </div>
                    </div>
                    <div className="upload-section">
                      <div className="category-selector">
                        <label className="category-selector-label">Guardar en:</label>
                        <select
                          value={selectedCategoryForPhoto}
                          onChange={handleCategoryChangeForPhoto}
                          disabled={isUploadingPhoto}
                          required
                        >
                          <option value="">Seleccione categoría</option>
                          <option value="almuerzos">Almuerzos (imagen)</option>
                          <option value="cursos">Cursos (imagen)</option>
                          <option value="running">Running (imagen)</option>
                        </select>
                      </div>
                      <div className="date-selector">
                        <label className="date-selector-label">Fecha del evento:</label>
                        <input
                          type="date"
                          value={selectedDateForPhoto}
                          onChange={(e) => setSelectedDateForPhoto(e.target.value)}
                          disabled={isUploadingPhoto}
                          required
                          className="date-input"
                        />
                      </div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input"
                        disabled={isUploadingPhoto}
                      />
                      <label htmlFor="photo-upload" className={`file-label ${isUploadingPhoto ? "disabled" : ""}`}>
                        📷 Seleccionar imagen
                      </label>
                      {previewUrl && (
                        <div className="image-preview">
                          <img src={previewUrl || "/placeholder.svg"} alt="Vista previa" className="preview-image" />
                          <p className="preview-text">{selectedFile?.name}</p>
                          <p className="file-size">Tamaño: {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      )}
                      <button
                        className="save-button photo-save"
                        onClick={handleSavePhoto}
                        disabled={
                          !selectedFile || isUploadingPhoto || !categorySelectedForPhoto || !selectedDateForPhoto
                        }
                      >
                        {isUploadingPhoto ? (
                          <>
                            <span className="spinner"></span>
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>📁 Guardar imagen</>
                        )}
                      </button>
                      {uploadStatus && (
                        <div className={`upload-status ${uploadStatus.includes("Error") ? "error" : "success"}`}>
                          {uploadStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="additional-info">
            <h3>¿Cómo funciona el sistema de guardado?</h3>
            <div className="benefits">
              <div className="benefit">
                <div className="benefit-icon">🍽️</div>
                <h4>Almuerzos</h4>
                <p>Puedes guardar <strong>imágenes</strong> y <strong>enlaces</strong> en la tabla almuerzos_Canva.</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">📚</div>
                <h4>Cursos</h4>
                <p>Puedes guardar <strong>imágenes</strong> y <strong>enlaces</strong> en cursos_canva, y <strong>diseños</strong> en cursos_disenos.</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">🏃‍♂️</div>
                <h4>Running</h4>
                <p>Puedes guardar <strong>imágenes</strong> y <strong>enlaces</strong> en running_canva, y <strong>diseños</strong> en running_disenos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvaButtonPage;