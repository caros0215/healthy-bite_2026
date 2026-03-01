import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import './TieredCollapsible.css';

export default function TieredCollapsible() {
  const [openSection, setOpenSection] = useState(null);
  const sectionRefs = useRef([]);
  const headerRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, 4);
    headerRefs.current = headerRefs.current.slice(0, 4);
  }, []);

  const handleToggle = (index) => {
    setOpenSection(prevOpen => {
      if (prevOpen === index) {
        // Primero cerrar la sección
        sectionRefs.current[index].style.maxHeight = "0px";
        sectionRefs.current[index].style.opacity = "0";
  
        // Después de cerrarla, hacer el desplazamiento uniforme para todas
        setTimeout(() => {
          const header = headerRefs.current[index];
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          
          if (header) {
            const y = header.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10; // Ajuste +10px para que no desaparezca
            
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        }, 300); // Esperar antes de mover el scroll
  
        return null;
      } else {
        return index;
      }
    });
  };
  useEffect(() => {
    if (openSection !== null && headerRefs.current[openSection]) {
      const timer = setTimeout(() => {
        const header = headerRefs.current[openSection];
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
  
        if (header) {
          // Asegurar que la sección esté completamente expandida antes del scroll
          sectionRefs.current[openSection].style.maxHeight = "1000px";
          sectionRefs.current[openSection].style.opacity = "1";
  
          setTimeout(() => {
            const y = header.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }, 300); // Esperar antes de mover el scroll para garantizar la visibilidad
        }
      }, 200);
  
      return () => clearTimeout(timer);
    }
  }, [openSection]);

  const sections = [
    {
      name: "STARTER.",
      colorClass: "bg-starter",
      content: [
        { title: "Acceso a pedidos básicos en la app", icon: <Check size={20} /> },
        { title: "Notificaciones sobre nuevos productos", icon: <Check size={20} /> },
        { title: "Programa de recompensas inicial", icon: <Check size={20} /> },
        { title: "Newsletters con recetas saludables", icon: <Check size={20} /> }
      ]
    },
    {
      name: "CHAMP.",
      colorClass: "bg-champ",
      content: [
        { title: "Greens challenge: pide 10 Garden Bowls o Market Plates y te regalaremos el nº 11.", icon: <Check size={20} /> },
        { title: "Invita a un amigo y gana 4€ cuando pidan por primera vez en la app", icon: <Check size={20} /> },
        { title: "5€ de crédito en la semana de tu cumple.", icon: <Check size={20} /> },
        { title: "Una proteína ball gratis al mes.", icon: <Check size={20} /> }
      ]
    },
    {
      name: "STAR.",
      colorClass: "bg-star",
      content: [
        { title: "Envío gratis en todos los pedidos", icon: <Check size={20} /> },
        { title: "Acceso prioritario a nuevos productos", icon: <Check size={20} /> },
        { title: "Descuento del 10% en pedidos para grupos", icon: <Check size={20} /> },
        { title: "Un smoothie gratis a la semana", icon: <Check size={20} /> }
      ]
    },
    {
      name: "LEGEND.",
      colorClass: "bg-legend",
      content: [
        { title: "Consultas nutricionales gratuitas", icon: <Check size={20} /> },
        { title: "Acceso a menús exclusivos", icon: <Check size={20} /> },
        { title: "Descuento del 20% en productos seleccionados", icon: <Check size={20} /> },
        { title: "Invitaciones a eventos especiales", icon: <Check size={20} /> }
      ]
    }
  ];

  return (
    <div className="tiered-collapsible">
      {sections.map((section, index) => (
        <div key={index} className="section-container">
          <div 
            ref={el => headerRefs.current[index] = el}
            onClick={() => handleToggle(index)}
            className={`section-header ${section.colorClass}`}
          >
            <span>{section.name}</span>
          </div>
          
          <div 
            ref={el => sectionRefs.current[index] = el}
            className={`section-content ${section.colorClass} ${openSection === index ? 'expanded' : ''}`}
          >
            <div className="content-inner">
              <div className="content-grid">
                {section.content.map((item, i) => (
                  <div key={i} className="content-item">
                    <div className="icon-container">{item.icon}</div>
                    <p className="item-text">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
