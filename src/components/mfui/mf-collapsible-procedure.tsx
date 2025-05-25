// shadcn/ui
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// iconos
import { CalendarCheck, CalendarX, ExternalLink, Lock, Unlock, ChevronsUpDown, ArrowRight  } from "lucide-react"

// React Router DOM
import { Link } from "react-router-dom"

// gestión de fechas
import { isBefore, isAfter, differenceInDays, parseISO } from "date-fns"

import clsx from 'clsx'

const CLOSED = 0, CLOSING_SOON = 1, OPENED = 2

export default function MFCollapsibleProcedure({data, color, studyAbbr} : any) {

  const info = data[Object.keys(data)[0]]

  const now = new Date()

  // en qué estado está?
  const init = parseISO(info.init_date)
  const end = parseISO(info.end_date)
  let state = CLOSED

  if (isBefore(now, init)) 
    state = CLOSED  // podria poner algo así como próximamente

  if (isAfter(now, end)) {
    state = CLOSED
  } else {
    const daysLeft = differenceInDays(end, now)
    if (daysLeft <= 15) {
      state = CLOSING_SOON
    } else {
      state = OPENED
    }
  }

  return (
    <Collapsible className="w-[65%] border rounded-lg mb-4 bg-muted/40 shadow-md"
      style={{ borderColor: color }} open={ state != CLOSED}>
      <CollapsibleTrigger className="w-full bg-muted px-4 py-2 rounded-lg hover:bg-muted/70 transition flex justify-between px-4 py-2 hover:bg-muted transition">
        
        {state != CLOSED ? (
          <Unlock className={clsx(
            "text-green-400 w-4 h-5 mr-3",
            { "animate-pulse" : state == CLOSING_SOON })}/>
        ) : (
          <Lock className="text-red-400 w-4 h-5 mr-3" />
        )}
        <span className="font-semibold">{info.description}</span>
        <ChevronsUpDown className="ml-3 h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 space-y-3 text-sm">
        <p className="flex space-x-2 mb-0.5">
          <CalendarCheck className="text-green-400 w-4 h-4" /><strong>Inicio:</strong><span className="ml-1">{info.init_date}</span> 
        </p>
        <p className="flex space-x-2">
          <CalendarX className="text-red-400 w-4 h-4" /><strong>Fin:</strong><span className="ml-1">{info.end_date}</span> 
        </p>
        <p>{info.info}</p>

        {/* Enlace al video */}
        <a href={data.url_help} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
          Ver vídeo explicativo <ExternalLink className="ml-1 w-4 h-4" />
        </a>

        {/* Dialogo con detalles */}
       {/*  <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">¿Qué documentos necesito?</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold mb-2">Documentación requerida</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Documento 1 (ejemplo)</li>
              <li>Documento 2 (ejemplo)</li>
              
            </ul>
          </DialogContent>
        </Dialog>
 */}
        {/* Botón de acceso al formulario */}
        <Button asChild className="w-full flex items-center" style={{ backgroundColor: color, borderColor: data.color }}>
          <Link to={`/selector/procedures/${data.abbr}`}>
            <span>Acceder al formulario</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
} 