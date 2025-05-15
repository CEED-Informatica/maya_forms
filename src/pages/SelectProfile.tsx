// Data provider
import { useDataUser } from "@/components/data/data-user-provider"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { UserIcon } from "lucide-react"

import { Profile } from "@/lib/data-models"

// React Router DOM
import { useNavigate } from "react-router-dom"

export default function SelectProfile() {

  const { users, setCurrentUserNia } = useDataUser()
  const navigate = useNavigate()

  const handleSelectUser = (user: Profile) => {
    setCurrentUserNia(user.nia)
    console.log("Usuario seleccionado:", user)
    navigate("/studies",  {replace: true })
  }
  
  return  (
    <div>
      <div className="p-6">
        <div className="space-y-1 ml-3 mr-3">
          <h4 className="text-sm font-medium leading-none">
            Alumno
          </h4>
          <p className="text-sm text-muted-foreground">
          Selecciona el NIA/nombre del alumno para cargar sus datos
          </p>
        </div>
        <Separator></Separator>
      </div> 
      <div className="w-full flex justify-center bg-background text-foreground py-8">
      <ScrollArea className="w-full max-w-md border border-white rounded-md p-3 shadow-lg dark:shadow-[0_4px_30px_rgba(255,255,255,0.10)]">
        <h4 className="ml-3 mb-4 text-sm font-medium leading-none">Usuarios</h4>
        <div>
          {users ?  Object.values(users).map((user) => (  
          <div key={user.nia}
               onClick={() => handleSelectUser(user)}
               className="py-1 px-3 mb-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
            {/* <Separator className="mb-2" /> */}
            <div className="flex items-center space-x-4">
            <UserIcon className="w-5 h-5 text-white" />
            <div>
                  <div className="text-sm font-semibold ">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-xs text-muted-foreground">{user.nia}</div>
                </div>
            </div>
          </div>
        )) : ''}
        </div>
      </ScrollArea>
      </div>
    </div>
  );
}