import { Activity, Brain, Users, ClipboardList, Coffee } from "lucide-react"
import styles from "./catering.module.css"

export default function ServiciosCorporativos() {
  const servicios = [
    {
      icon: <Coffee className="w-12 h-12" />,
      title: "Snacks Empresariales",
      description: "Snacks saludables y nutritivos para energizar tu equipo durante el día",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Bienestar Empresarial",
      description: "Programas integrales de salud y nutrición para equipos corporativos",
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Análisis InBody",
      description: "Evaluación corporal completa in-situ para tus colaboradores",
    },
    {
      icon: <ClipboardList className="w-12 h-12" />,
      title: "Almuerzos Corporativos",
      description: "Menús saludables y personalizados para tu empresa",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Asesorías Nutricionales",
      description: "Consultas personalizadas con nuestros expertos en nutrición",
    },
  ]

  return (
    <section className={styles.corporativoSection}>
      {/* Elementos de fondo animados */}
      <div className={styles.bgShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      <div className={styles.corporativoContainer}>
        <div className={styles.corporativoHeader}>
          <span className={styles.corporativoTag}>SERVICIOS EMPRESARIALES</span>
          <h2 className={styles.corporativoTitle}>Acompañamiento Empresarial en Bienestar</h2>
          <p className={styles.corporativoSubtitle}>
            Llevamos salud y nutrición directamente a tu empresa con soluciones personalizadas
          </p>
        </div>

        <div className={styles.serviciosGrid}>
          {servicios.map((servicio, index) => (
            <div key={index} className={styles.servicioCard}>
              <div className={styles.servicioIcon}>{servicio.icon}</div>
              <h3 className={styles.servicioTitle}>{servicio.title}</h3>
              <p className={styles.servicioDescription}>{servicio.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaContainer}>
          <button className={styles.ctaButton}>
            <span>Solicitar Información</span>
            <svg className={styles.ctaArrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}