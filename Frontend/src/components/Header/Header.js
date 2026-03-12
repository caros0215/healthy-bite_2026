"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import "./Header.css"
import logoColor from "../../assets/images/artes_Mesa de trabajo 1.webp"
import logoWhite from "../../assets/images/artes-01.webp"
import LoginModal from "./Login"

function Header() {
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (headerRef.current) {
        if (scrollY > 70) {
          headerRef.current.classList.add("header-white")
          setScrolled(true)
        } else {
          headerRef.current.classList.remove("header-white")
          setScrolled(false)
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const handleKnowUs = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.getElementById("conocenos")
    if (target) {
      const headerHeight = 90
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`header ${scrolled ? "header-white" : ""}`}
        style={{ transition: "background-color 0.3s ease" }}
      >
        <div className="logo-nav-container">
          {/* ✅ Hamburger — solo visible en móvil */}
          <button
            className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="/" className="logo">
            <img src={scrolled ? logoColor : logoWhite} width="150" alt="Logo" />
          </a>

          {/* Nav desktop — se oculta en móvil */}
          <nav className="navigation">
            <Link to="/" className="nav-link">Inicio</Link>
            <a href="#conocenos" className="nav-link" onClick={handleKnowUs}>conocenos</a>
            <a href="/Servicios_corporativos" className="nav-link">Servicios corporativos</a>
            <a href="/Cursos" className="nav-link">Cursos</a>
            <a href="/Historia" className="nav-link">Nuestra historia</a>
            <a href="/Sports" className="nav-link">Sports</a>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <a href="/Pedir" className="order-button">
            PIDE AHORA <span className="arrow-icon">→</span>
          </a>
          <button className="login-button" onClick={() => setIsLoginModalOpen(true)}>
            LOGIN
          </button>
        </div>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </header>

      {/* ✅ Menú móvil lateral */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <a href="#conocenos" className="mobile-nav-link" onClick={handleKnowUs}>Conócenos</a>
          <a href="/Servicios_corporativos" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Servicios corporativos</a>
          <a href="/Cursos" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Cursos</a>
          <a href="/Historia" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Nuestra historia</a>
          <a href="/Sports" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sports</a>
          <button
            className="mobile-login-button"
            onClick={() => { setMenuOpen(false); setIsLoginModalOpen(true) }}
          >
            LOGIN
          </button>
        </nav>
      </div>

      {/* Overlay para cerrar al tocar fuera */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}

export default Header