import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface DataInfoContextType {
  data: any;
  refreshData: () => void;
}

type Props = {
  children: ReactNode;
};

/* Permite crear un contexto, un espacio para compartir datos entre componentes sin tener que pasar props
   Puede albergar dos tipos de datos DataInfoContextType o undefined, por defecto, undefined */
const DataInfoContext = createContext<DataInfoContextType | undefined>(undefined);

/* Se encarga de la obtención y distribución de la información pública sobre los trámites que se ofrece 
   desde internet */ 
export default function DataInfoProvider({children}: Props) {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataInfo();
  }, []);

  const fetchDataInfo = async () => {
    // Reemplaza con tu lógica de obtención de datos
    const response = await fetch('https://raw.githubusercontent.com/CEED-Informatica/maya_forms_info/main/data_info_46025799.json');
    const result = await response.json();
    setData(result);
    console.log("Actualizando datos desde github")
  };

  // todos los componentes envueltos por el contexto pueden acceder a los datos
  return (
    <DataInfoContext.Provider value={{ data, refreshData: fetchDataInfo }}>
      {children}
    </DataInfoContext.Provider>
  );
}

export const useDataInfo = () => {
  const context = useContext(DataInfoContext);
  if (!context) {
    throw new Error('useDataInfo debe usarse dentro de DataInfoProvider');
  }
  return context;
};
