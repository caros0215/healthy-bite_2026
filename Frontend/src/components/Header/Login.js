"use client"

import { useState } from "react"
import "./Login.css"
import image1 from "../../assets/images/artes_Mesa de trabajo 1.1.webp"
import image2 from "../../assets/images/logo_animado.gif"

function LoginModal({ isOpen, onClose }) {
  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [autenticado, setAutenticado] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!usuario || !contraseña) {
      setError("Por favor ingrese usuario y contraseña")
      return
    }

    try {
      setLoading(true)

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, contraseña }),
        credentials: "include",
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const textResponse = await response.text()
        console.error("Respuesta no válida:", textResponse)
        throw new Error("El servidor no devolvió un formato JSON válido")
      }

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión")
      }

      // ✅ Mantener el loading un poco más para mostrar el gif
      await new Promise((resolve) => setTimeout(resolve, 1800)) // 1.5 segundos extra

      // ✅ Guardar en localStorage
      setAutenticado(true)
      localStorage.setItem("usuario", JSON.stringify(data.usuario)) // Guarda el objeto completo
      localStorage.setItem("canvaUserLoggedIn", "true") // Marca sesión iniciada

      // Redirigir al dashboard después de mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000) // 2 segundos para ver el mensaje de éxito
    } catch (err) {
      console.error("Error de login:", err)
      setError(err.message || "Error al iniciar sesión")
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="modal-content">
          {autenticado ? (
            <div className="login-success">
              <div className="success-icon">✓</div>
              <h2>¡Inicio de sesión exitoso!</h2>
              <p>Bienvenido al sistema, {usuario}.</p>
              <p className="redirect-message">Redirigiendo al dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-logo">
                <img src={image1 || "/placeholder.svg"} alt="Logo" className="logo-image" />
              </div>

              <h2>Iniciar Sesión</h2>
              <p>Ingrese sus credenciales para acceder al sistema</p>

              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="usuario">Usuario</label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingrese su usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contraseña">Contraseña</label>
                <input
                  id="contraseña"
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  placeholder="Ingrese su contraseña"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Procesando..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>
          )}
        </div>

        {loading && (
          <div className="loading-overlay">
            <img src={image2 || "/placeholder.svg"} alt="Cargando..." className="loading-gif" />
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginModal
