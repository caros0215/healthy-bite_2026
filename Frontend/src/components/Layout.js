import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./pagina_principal/footer/footer";
import Header from "./Header/Header"; // Header general (6 opciones)
import DashboardHeader from "./Header/DashboardHeader"; // Header logueado (2 opciones)

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Función para verificar si el usuario está logueado
  const checkAuthStatus = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario !== null && usuario !== undefined && usuario !== "";
  };

  // Verificar autenticación al cargar y cuando cambie la ruta
  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsLoggedIn(authStatus);
    setIsLoading(false);
  }, [location.pathname]);

  // Escuchar cambios en localStorage (si se loguea/desloguea en otra pestaña)
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = checkAuthStatus();
      setIsLoggedIn(authStatus);
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // También escuchar cambios locales (cuando se modifica localStorage en la misma pestaña)
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'usuario') {
        handleStorageChange();
      }
    };

    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'usuario') {
        handleStorageChange();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {/* Mostrar DashboardHeader si está logueado, Header general si no */}
      {isLoggedIn ? <DashboardHeader /> : <Header />}
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;