import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Data provider
import { useDataInfo } from "@/components/data/data-info-provider"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

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

export default function Studies() {

  const { data } = useDataInfo()

  return  (
    <div>
      <h1>ESTUDIOS</h1>


      <div className="flex flex-wrap justify-center space-y-6 mt-10 mx-auto" style={{ maxWidth: "1200px" }}>
        {/* { data.studies.map((study: { color: any; GENERAL_INFO: { abbr: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; abbr: Key | null | undefined; }) => ( */}
        { studies.map((study ) => (
          <Card className="mx-4 my-4 cursor-pointer w-64 p-4 bg-card rounded-2xl shadow-md hover:bg-muted transition-colors duration-200 border border-border" 
                style={{ borderColor: study.GENERAL_INFO.color }}> 
            <CardHeader>
              <CardTitle>{study.GENERAL_INFO.abbr}</CardTitle>
              <CardDescription>{study.GENERAL_INFO.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" style={{ backgroundColor: study.GENERAL_INFO.color, borderColor: study.GENERAL_INFO.color }}>
                <div>
                <Link key={study.GENERAL_INFO.abbr} to={'/section/${study}'}>Acceder</Link> 
                <ArrowRight />  
                </div>
              </Button>
            </CardFooter>
        </Card> 
      
      
      ))
      
     
      }

      </div>
    
    </div>
  );
}