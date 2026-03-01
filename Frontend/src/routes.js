import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./components/pagina_principal/Landing/Landing_page";
import Food from "./components/Menu_Vistas/Real_food/Real_food_revolution";
import Catering from "./components/Menu_Vistas/catering/catering";
import Cursos from "./components/Menu_Vistas/Cursos/cursos";
import Dashboard from "./components/Header/Dashboard";
import CanvaButtonPage from './components/Header/CanvaButtonPage';
import CalendarioCreator   from './components/pagina_principal/calendario creador/CalendarioCreator';
import RunningPage from "./components/Menu_Vistas/running/running";
import PedirPage from "./components/Menu_Vistas/Pedir_ahora/pedir";
import HistoriaPage from "./components/Menu_Vistas/historia/historia";

// Mueve NoMatch arriba para que esté disponible antes de usarlo
function NoMatch() {
  return (
    <section className="page_404">
      <div>
        <div className="four_zero_four_bg">
          <h1>404</h1>
        </div>
        <div className="box_404">
          <h3>
            <center>Página No Encontrada</center>
          </h3>
        </div>
        <center>
          <button className="boton404">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "#ffffff" }}
            >
              Ir al Menú
            </NavLink>
          </button>
        </center>
      </div>
    </section>
  );
}

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Todas las rutas están envueltas en Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/Food" element={<Food />} />
        <Route path="/Servicios_corporativos" element={<Catering />} />
        <Route path="/Cursos" element={<Cursos />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/canva-button" element={<CanvaButtonPage />} />
       <Route path="/calendario-creator" element={<CalendarioCreator />} />
       <Route path="/Sports" element={<RunningPage />} />
       <Route path="/Pedir" element={<PedirPage />} />
        <Route path="/Historia" element={<HistoriaPage />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;