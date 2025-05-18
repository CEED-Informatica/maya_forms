// React
import { useEffect } from "react"

// Providers
import { useDataUser } from "@/components/data/data-user-provider"

// React Router DOM
import { useNavigate } from "react-router-dom"

// Tauri
import { listen } from "@tauri-apps/api/event"

// Modelos
import { Profile } from "@/lib/component-models"

// Página de inicio. Enruta en función de los perfiles existentes
// En principio solo se ejecuta al arrancar la aplicación
export default function StartupRouter() {
  
  const { users, setUsers } = useDataUser()
  const navigate = useNavigate()

  // escucho el evento que indioca que los datos han sido cargados
  useEffect(() => {
    const unlisten = listen("data_loaded", (event) => {
      console.log(event.payload)
      setUsers(event.payload as Record<string, Profile>)
    })
  
    return () => {
      unlisten.then((off) => off())
    }
  }, [])

  useEffect(() => {
    console.log(users ? users : "no hay users")

    if (!users) return

    if (Object.keys(users).length == 0) 
      navigate("/profile",  {replace: true });

    if (Object.keys(users).length == 1)     // solo hay un usuarios
      navigate("/profile",  {replace: true });

    if (Object.keys(users).length > 1) // hay más de un usuario
      navigate("/select_profile",  {replace: true })
    
  }, [users]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <p className="text-lg">Cargando perfiles...</p>
    </div>
  )
}