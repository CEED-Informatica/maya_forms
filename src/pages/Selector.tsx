// React router dom
import { useParams } from "react-router-dom"

// Data provider
import { useDataInfo } from "@/components/data/data-info-provider"

// componentes maya forms ui
import MFCardStudies from "@/components/mfui/mf-card-estudies"
import MFCardProcedures from "@/components/mfui/mf-card-procedures"
import MFCollapsibleProcedure from "@/components/mfui/mf-collapsible-procedure"

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
  const { type, study_abbr, procedure_type } = useParams<{ type: string, study_abbr: string, procedure_type: string }>()

  const { items, color }: any = (() => {
    switch (type) {
      case "procedures":
        const study = data.studies.find(
          (s: any) => s.GENERAL_INFO?.abbr === study_abbr
        )
        console.log("ESTUDIOS " + study_abbr + "    " +study?.PROCEDURES )

        if (!procedure_type) {
          return {
            items: study?.PROCEDURES ?? [],
            color: study?.GENERAL_INFO.color
          }
        }
        else {
          console.log("ELEGIDO TIPOS DE PROCEDIMIENTO -> " + procedure_type)
          const procedures_type = study?.PROCEDURES.find(
            (s: any) => s.type === procedure_type
          )
      
          const items = [...(procedures_type?.subtypes ?? [])]
            .sort((a: any, b: any) => {
              const now = new Date()

              const aData = a[Object.keys(a)[0]]
              const bData = b[Object.keys(b)[0]]

              const aInit = new Date(aData.init_date)
              const aEnd = new Date(aData.end_date)
              const bInit = new Date(bData.init_date)
              const bEnd = new Date(bData.end_date)

              // Clasifico cada trámite en 3 grupos: en vigor (1), próximos (2), finalizados (3)
              const aStatus = aEnd < now ? 3 : (aInit > now ? 2 : 1)
              const bStatus = bEnd < now ? 3 : (bInit > now ? 2 : 1)

              // Diferentes grupos
              if (aStatus !== bStatus) {
                return aStatus - bStatus;
              }

              if (aStatus === 1)  // Entre activos (más próxima primero)
                return aEnd.getTime() - bEnd.getTime()
              else if (aStatus === 2)    // Próximos (más próxima primero)
                return aInit.getTime() - bInit.getTime()   
              else // Finalizados (más reciente primero)
                return bEnd.getTime() - aEnd.getTime();

            })

          return {
              items: items,
              color: study?.GENERAL_INFO.color
            }
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
        { type == 'procedures' && !procedure_type && items.map((procedure: Studies["PROCEDURES"]) => (
            <MFCardProcedures data={procedure} color={color} study_abbr={study_abbr} key={procedure.type}/>
      ))}
        {/* Sutipo de Trámites  */}
        { type == 'procedures' && procedure_type && items.map((ptype: any) => (
            <MFCollapsibleProcedure data={ptype} color={color} study_abbr={study_abbr} key={ptype.type}/>
      ))}
      </div>
    
    </div>
  );
}