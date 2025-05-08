import { Outlet } from 'react-router-dom';

import Footer from "@/components/footer"
import Header from "@/components/header"

// Componente Layout que estrutura las páginas menos el Splash
// Simplemente añade el Header y el Footer
// Se utuliza para poder anidar rutas y de ese manera eliminar la cabecera y el footer del Splash
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}