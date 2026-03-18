import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./pagina_principal/footer/footer";
import Header from "./Header/Header";
import DashboardHeader from "./Header/DashboardHeader";
import FloatingButtons from "./pagina_principal/Floatingbuttons";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const checkAuthStatus = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario !== null && usuario !== undefined && usuario !== "";
  };

  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsLoggedIn(authStatus);
    setIsLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = checkAuthStatus();
      setIsLoggedIn(authStatus);
    };

    window.addEventListener('storage', handleStorageChange);

    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'usuario') handleStorageChange();
    };

    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'usuario') handleStorageChange();
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
      {isLoggedIn ? <DashboardHeader /> : <Header />}

      <main>
        <Outlet />
      </main>

      <Footer />

      {/* Botones flotantes WhatsApp e Instagram — visibles en toda la app */}
      <FloatingButtons />
    </div>
  );
};

export default Layout;