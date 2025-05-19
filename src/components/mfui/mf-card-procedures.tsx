// shadcn/ui
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Card, CardContent,
  CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card"

// iconos
import { ArrowRight, FileText } from "lucide-react"
import { icons } from "@/components/mfui/icons"

// React Router DOM
import { Link } from "react-router-dom"

export default function MFCardProcedures({data, color} : any) {
  const numProcedures = data.info?.subtypes?.length ?? 0

  return (
    <Card className="mx-4 my-4 cursor-pointer w-64 py-4 px-2 bg-card rounded-2xl shadow-md hover:bg-muted transition-colors duration-200 border border-border" 
          style={{ borderColor: color }}> 
      <CardHeader>
        <div className="flex items-center space-x-4">
          { data.icon && <img src={icons[data.icon]} alt="icono" className="w-10 h-10"/>}
          <div>
            <CardTitle className="mb-2">{data.info.name}</CardTitle>
            <CardDescription>{data.info.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{numProcedures} {numProcedures === 1 ? "trámite" : "trámites"}</span>
            </TooltipTrigger>
            <TooltipContent>
              Número de trámites disponibles
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" style={{ backgroundColor: color, borderColor: data.color }}>
          <div>
          <Link key={data.abbr} to={`/selector/procedures/${data.abbr}`}>Acceder</Link> 
          <ArrowRight />  
          </div>
        </Button>
      </CardFooter>
    </Card> 
  )
}