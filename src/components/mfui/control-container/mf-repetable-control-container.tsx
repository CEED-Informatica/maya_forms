
// shadcn/ui
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from '@/components/ui/button'

// React
import { useState } from 'react'

// libs
import { adaptLayout, renderControl } from '@/lib/ui-utils'

// iconos
import { DiamondPlus } from "lucide-react"

// Contenedor de RepetableGroups
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFRepetableControlContainer({ control, methods }: any) {

  const [repetitions, setRepetitions] = useState<number>(1)

  const isDynamic = control.control_type.RepetableControlContainer.mode.toUpperCase() === 'DYNAMIC'
  const columnClass = `lg:grid-cols-${control.control_type.RepetableControlContainer.num_max_col || 1}`

  console.log(isDynamic + "    " +  control.control_type.RepetableControlContainer.mode.toUpperCase())

  function addContainter() {
    if (repetitions < control.control_type.RepetableControlContainer.num_max_rep) {
      setRepetitions(prev => prev + 1)
    } 
  }

  return (
      <div className="w-full">
        <div className={`grid ${columnClass} gap-4`}>  
          { Array.from({ length: repetitions }).map((_, index) => (
            <div key={index} className="grid gap-4 border p-4 rounded shadow-sm" style={{ gridTemplateAreas: adaptLayout(control.control_type.RepetableControlContainer.layout), gridTemplateColumns: '1fr 1fr 1fr' }}>
                {control.control_type.RepetableControlContainer.items.map((childControl: any) => (
                  renderControl({ ...childControl, id: `${childControl.id}_${index}` }, methods)
                ))}
            </div>
          ))}
        </div>
        { isDynamic && repetitions < control.control_type.RepetableControlContainer.num_max_rep && (
          <Button asChild className="w-full" onClick={addContainter}>
            <div>
              <DiamondPlus />Añadir {control.label?.toLowerCase() || 'elemento'}
            </div>
          </Button>
        )}
      </div>
  )
}

 {/* <div className="grid gap-4">
                {control.controls.map((childControl: any) => (
                  renderControl({ ...childControl, id: `${childControl.id}_${index}` }, methods)
                ))}
              </div> */}