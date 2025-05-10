// React
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

// Tauri
import { BaseDirectory, exists, readTextFile } from '@tauri-apps/plugin-fs'

interface DataUserContextType {
  users: any
  readDataUser: () => void
}

// Permite crear un contexto, un espacio para compartir datos entre componentes sin tener que pasar props
// Puede albergar dos tipos de datos DataInfoContextType o undefined, por defecto, undefined 
const DataUserContext = createContext<DataUserContextType | undefined>(undefined);

// Se encarga de la obtención y distribución de la información del usuario  
export default function DataUserProvider({ children }: { children: ReactNode }) {
  
  const [users, setUsers] = useState(null)

  const readDataUser = async () => {  
    const profilesExists = await exists('profiles.json', {
      baseDir: BaseDirectory.AppLocalData, // .local/com.maya_forms.app
    })
    
    // no existe aun el fichero de perfiles
    if (!profilesExists) 
      setUsers(null)
    else {
      const dataProfiles = JSON.parse(await readTextFile( "profiles.json", {
        baseDir: BaseDirectory.AppLocalData,
      }));
      
      setUsers(dataProfiles)
      alert(Object.keys(dataProfiles).length)  
    }  
  }

  return (
    <DataUserContext.Provider value={{ users, readDataUser }}>
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
