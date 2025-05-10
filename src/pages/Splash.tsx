// React
import { useEffect } from "react";

import { useDataUser } from "@/components/data/data-user-provider"

// Página de presentación de la aplicación
export default function Splash() {
  
  const { readDataUser } = useDataUser()

  // se ejecuta después de renderizar, asi que aseguro que prinmero se vea 
  // la página y luego se carguen los datos
  useEffect(() => {
    /* const timer = setTimeout(() => {
      readDataUser(); // Se ejecuta después de una pequeña espera
    }, 1000); // 100ms suelen ser suficientes
  
    return () => clearTimeout(timer); */

    readDataUser();
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        {/* <img src="/logo.svg" alt="Logo" className="w-20 h-20 mx-auto mb-4" /> */}
        <p className="text-lg">Cargando... </p>
      </div>
    </div>
  )
}