// React
import { createContext, useState, useContext, ReactNode } from 'react'

// Tauri
import { BaseDirectory, exists, readTextFile } from '@tauri-apps/plugin-fs'

// Modelos
import { Profile } from "@/lib/data-models"

interface DataUserContextType {
  users: Record<string, Profile> | null
  setUsers: React.Dispatch<React.SetStateAction<Record<string, Profile> | null>>
  readDataUser: () => void
  currentUserNia: string | null
  setCurrentUserNia: (nia: string) => void
}

// Permite crear un contexto, un espacio para compartir datos entre componentes sin tener que pasar props
// Puede albergar dos tipos de datos DataInfoContextType o undefined, por defecto, undefined 
const DataUserContext = createContext<DataUserContextType | undefined>(undefined);

// Se encarga de la obtención y distribución de la información del usuario  
export default function DataUserProvider({ children }: { children: ReactNode }) {
  
  const [users, setUsers] = useState<Record<string, Profile> | null>(null)
  const [currentUserNia, setCurrentUserNia] = useState<string | null>(null)

  const readDataUser = async () => { 
    
    const profilesExists = await exists('profiles.json', {
      baseDir: BaseDirectory.AppLocalData, // .local/com.maya_forms.app
    })
    
    // no existe aun el fichero de perfiles
    if (!profilesExists) 
      setUsers({})
    else {
      const rawProfiles:  Record<string, Record<string, any>> = JSON.parse(await readTextFile( "profiles.json", {
        baseDir: BaseDirectory.AppLocalData,
      }));

      // convierto las claves del fichero a las de Profile
      const profiles: Record<string, Profile> = Object.entries(rawProfiles).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            nia: value.CTRL_NIA,
            name: value.CTRL_NOMBRE,
            surname: value.CTRL_APELLIDOS,
          };
          return acc;
        },
        {} as Record<string, Profile>
      );
  
      setUsers(profiles);
    }  
  }

  return (
    <DataUserContext.Provider value={{ users, setUsers, readDataUser, currentUserNia, setCurrentUserNia }}>
      {children}
    </DataUserContext.Provider>
  );
}

// Devuelve el contexto creado con los tipos definidos en DataInfoContextType
export const useDataUser = () => {
  const context = useContext(DataUserContext);
  if (!context) {
    throw new Error('useDataUser debe usarse dentro de DataUserProvider');
  }
  return context;
};
