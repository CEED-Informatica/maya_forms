// React
import { useState, useEffect } from "react";

// Tauri
import { invoke } from "@tauri-apps/api/core"
import { emit } from "@tauri-apps/api/event"

// Data providers
import { useDataUser } from "@/components/data/data-user-provider"
import { useDataInfo } from "@/components/data/data-info-provider"

const SPLASH_TIME: number = 7000 // ms

// Página de presentación de la aplicación
export default function Splash() {
  
  const [loadFinished, setLoadFinished] = useState<boolean>(false)
  const { users, readDataUser } = useDataUser()
  const { refreshData } = useDataInfo()

  // se ejecuta después de renderizar, asi que aseguro que primero se vea 
  // la página y luego se carguen los datos
  useEffect(() => {
    // en paralelo para ganar tiempo
    const loadData = async () => {
      // lanzo al mismo tiempo un timer y los procesos de carga para que como 
      // mínimo este un tiempo el splash en pantalla
      await Promise.all([ 
        (async () => {
          await Promise.all([readDataUser(), refreshData()]) // en paralelo para ganar tiempo
        })(),
        new Promise((res) => setTimeout(res, SPLASH_TIME)) // minimo que el splash ha de estar abierto
      ])

      setLoadFinished(true)
    }
    
   loadData()
  }, [])

  // las ventanas están aisladas, luego no comparten los datos del provider
  // <así que cuando users ya tenga valor asignado => se lo digo a la otra ventana
  // mediante un evento. Luego cierro el splash y abro el main a traves del backend
  useEffect(() => {
    if (!users || !loadFinished) return

    emit("data_loaded", users)
      
    // Notificamos al backend que puede cerrar el splash y abrir el main
    invoke('close_splash_and_open_main')
  }, [loadFinished])

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        {/* <img src="/logo.svg" alt="Logo" className="w-20 h-20 mx-auto mb-4" /> */}
        <p className="text-lg">Cargando... </p>
      </div>
    </div>
  )
}