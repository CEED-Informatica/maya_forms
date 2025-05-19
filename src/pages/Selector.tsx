// React router dom
import { useParams } from "react-router-dom"

// Data provider
import { useDataInfo } from "@/components/data/data-info-provider"

// componentes maya forms ui
import MFCardStudies from "@/components/mfui/mf-card-estudies"
import MFCardProcedures from "@/components/mfui/mf-card-procedures"

// Modelos
import { Studies } from "@/lib/data-models"

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
  const { type, study_abbr } = useParams<{ type: string, study_abbr: string }>()

  const { items, color }: any = (() => {
    switch (type) {
      case "procedures":
        const study = data.studies.find(
          (s: any) => s.GENERAL_INFO?.abbr === study_abbr
        )
        console.log(study_abbr + "    " +study?.PROCEDURES )
        return {
          items: study?.PROCEDURES ?? [],
          color: study?.GENERAL_INFO.color
        }
      default:
        return {
          items: [],    
        }
    }
  })()

  return  (
    <div>
      <h1>ESTUDIOS</h1>

      <div className="flex flex-wrap justify-center space-y-6 mt-10 mx-auto" style={{ maxWidth: "1200px" }}>
        {/* Estudios */}
        { type == 'studies' && data.studies.map((study: Studies) => (
            <MFCardStudies data={study.GENERAL_INFO} key={study.GENERAL_INFO.abbr}/>
      ))}
        {/* Trámites */}
        { type == 'procedures' && items.map((procedure: Studies["PROCEDURES"]) => (
            <MFCardProcedures data={procedure} color={color} key={procedure.type}/>
      ))}
      </div>
    
    </div>
  );
}