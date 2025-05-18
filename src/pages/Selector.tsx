// React router dom
import { useParams } from "react-router-dom"

// Data provider
import { useDataInfo } from "@/components/data/data-info-provider"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

// componentes maya forms ui
import MFCardStudies from "@/components/mfui/mf-card-estudies"

const studies = [
  { 
    "GENERAL_INFO": {'name': 'Graduado Educación Secundaria',
    'abbr': 'GES',
    'help': 'Informcación para la ESO',
    'color': '#3b82f6'}
  },
  { 
    "GENERAL_INFO": {'name': 'Bachillerato',
    'abbr': 'BACH',
    'help': 'Documentación 1 y 2 de Bachillerato LOMCE y EBAU',
    'color': '#22c55e',}
  },
  { 
    "GENERAL_INFO": {'name': 'Ciclos Formativos',
    'abbr': 'FP',
    'help': 'Documentación para las familias de Administración y fiananzas',
    'color': '#dc2626'}
  },
  { 
    "GENERAL_INFO": {'name': 'Formación para adultos',
    'abbr': 'FPA',
    'help': 'Información para estudios no reglados',
    'color': '#6d28d9'}
  },
  { 
    "GENERAL_INFO": {'name': 'Infaltil',
    'abbr': 'INF',
    'help': 'Para niños',
    'color': '#ed48a9'}
  },
]

export default function Selector() {

  const { data } = useDataInfo()
  const { type } = useParams<{ type: string }>()

  return  (
    <div>
      <h1>ESTUDIOS</h1>


      <div className="flex flex-wrap justify-center space-y-6 mt-10 mx-auto" style={{ maxWidth: "1200px" }}>
        { data.studies.map((study: { color: any; GENERAL_INFO: { abbr: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; abbr: Key | null | undefined; }) => (
            <MFCardStudies data={study.GENERAL_INFO} key={study.GENERAL_INFO.abbr}/>
  
      ))
      
     
      }

      </div>
    
    </div>
  );
}