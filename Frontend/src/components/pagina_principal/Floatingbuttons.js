import { useState, useEffect } from "react"
import styles from "../pagina_principal/Floatingbuttons.module.css"

export default function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  const instagramUrl = "https://www.instagram.com/healthybite.mzl"
  const whatsappUrl = `https://wa.me/573147139843?text=${encodeURIComponent("Hola, me interesa saber más sobre sus servicios")}`

  // Mostrar mensaje del bot con delay al abrir el chat
  useEffect(() => {
    if (chatOpen) {
      setShowMessage(false)
      const timer = setTimeout(() => setShowMessage(true), 600)
      return () => clearTimeout(timer)
    }
  }, [chatOpen])

  // Mostrar burbuja de notificación después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleWhatsAppClick = () => {
    setChatOpen(true)
    setShowBubble(false)
  }

  return (
    <div className={styles.container}>

      {/* Chat popup */}
      {chatOpen && (
        <div className={styles.chatBox}>
          {/* Header del chat */}
          <div className={styles.chatHeader}>
            <div className={styles.chatAvatar}>HB</div>
            <div className={styles.chatInfo}>
              <p className={styles.chatName}>HealthyBite</p>
              <p className={styles.chatStatus}>
                <span className={styles.statusDot} />
                En línea
              </p>
            </div>
            <button className={styles.chatClose} onClick={() => setChatOpen(false)}>✕</button>
          </div>

          {/* Cuerpo del chat */}
          <div className={styles.chatBody}>
            <p className={styles.chatDate}>Hoy</p>

            {showMessage && (
              <div className={styles.messageWrapper}>
                <div className={styles.botAvatar}>HB</div>
                <div className={styles.message}>
                  <p>👋 ¡Hola! Bienvenido a <strong>HealthyBite</strong>.</p>
                  <p>Estamos aquí para ayudarte. ¿Tienes alguna pregunta sobre nuestro menú, catering o servicios?</p>
                  <span className={styles.messageTime}>ahora</span>
                </div>
              </div>
            )}

            {!showMessage && (
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            )}
          </div>

          {/* Footer con botón */}
          <div className={styles.chatFooter}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.chatCta}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="white">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.473 2.027 7.776L0 32l8.468-2.004A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 19.471c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.361-2.214-2.759-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.697.1-1.062.498-.365.398-1.394 1.362-1.394 3.324s1.427 3.856 1.626 4.121c.199.265 2.808 4.287 6.804 6.013.951.411 1.693.656 2.271.84.954.304 1.823.261 2.509.158.765-.114 2.354-.962 2.686-1.891.332-.929.332-1.726.232-1.891-.099-.166-.365-.265-.763-.464z"/>
              </svg>
              Ir a WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.instagram}`}
        aria-label="Seguir en Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.icon} fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        <span className={styles.tooltip}>Síguenos en Instagram</span>
      </a>

      {/* WhatsApp */}
      <div className={styles.whatsappWrapper}>
        {/* Burbuja de notificación */}
        {showBubble && !chatOpen && (
          <div className={styles.bubble}>
            ¡Hola! ¿En qué te ayudamos? 👋
            <button className={styles.bubbleClose} onClick={() => setShowBubble(false)}>✕</button>
          </div>
        )}

        <button
          className={`${styles.button} ${styles.whatsapp}`}
          onClick={handleWhatsAppClick}
          aria-label="Abrir chat de WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={styles.icon} fill="white">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.473 2.027 7.776L0 32l8.468-2.004A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 19.471c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.361-2.214-2.759-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.697.1-1.062.498-.365.398-1.394 1.362-1.394 3.324s1.427 3.856 1.626 4.121c.199.265 2.808 4.287 6.804 6.013.951.411 1.693.656 2.271.84.954.304 1.823.261 2.509.158.765-.114 2.354-.962 2.686-1.891.332-.929.332-1.726.232-1.891-.099-.166-.365-.265-.763-.464z"/>
          </svg>
          {!chatOpen && <span className={styles.tooltip}>¡Chatea con nosotros!</span>}
        </button>
      </div>

    </div>
  )
}