// shadcn/ui
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Card, CardContent,
  CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card"

// iconos
import { ArrowRight, FileText, Lock, Unlock  } from "lucide-react"
import { icons } from "@/components/mfui/icons"

// React Router DOM
import { Link } from "react-router-dom"

import { isBefore, isAfter, differenceInDays, parseISO } from "date-fns"

const DAYS_WARNING = 7

export default function MFCardProcedures({data, color, study_abbr} : any) {
  const now = new Date()
  const numProcedures = data.subtypes?.length ?? 0

  // cálculo del número de trámites por situacion
  let countOpen = 0
  let countClosingSoon = 0
  let countClosed = 0

  data.subtypes.forEach((subtype: any) => {
    const key = Object.keys(subtype)[0]
    const item = subtype[key]
    const init = parseISO(item.init_date)
    const end = parseISO(item.end_date)
  
    if (isBefore(now, init)) {
      countClosed++
      return 
    }

    if (isAfter(now, end)) {
      countClosed++
    } else {
      const daysLeft = differenceInDays(end, now)
      if (daysLeft <= DAYS_WARNING) {
        countClosingSoon++
      } else {
        countOpen++
      }
    }
  })

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
      <CardContent className="flex flex-col items-start">
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
        <div className="flex items-center space-x-4 mt-5">
          {/* Abiertos */}
          {countOpen > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center space-x-2">
                  <Unlock className="text-green-600 w-5 h-5 animate-bounce" />
                  <span className="text-sm text-green-700">{countOpen}</span>
                </TooltipTrigger>
                <TooltipContent>{countOpen} plazo abierto(s)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Próximos a cerrar */}
          {countClosingSoon > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger  className="flex items-center space-x-2">
                  <Unlock className="text-yellow-600 w-5 h-5  animate-pulse" />
                  <span className="text-sm text-yellow-700">{countClosingSoon}</span>
                </TooltipTrigger>
                <TooltipContent>{countClosingSoon} plazo a punto de cerrar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Cerrados */}
          {countClosed > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center space-x-2">
                  <Lock className="text-red-600 w-5 h-5" />
                  <span className="text-sm text-red-700">{countClosed}</span>
                </TooltipTrigger>
                <TooltipContent>{countClosed} plazo cerrado(s)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" style={{ backgroundColor: color, borderColor: data.color }}>
          <div>
          <Link key={data.type} to={`/selector/procedures/${study_abbr}/${data.type}`}>Acceder</Link> 
          <ArrowRight />  
          </div>
        </Button>
      </CardFooter>
    </Card> 
  )
}