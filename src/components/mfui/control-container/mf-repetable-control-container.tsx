
// shadcn/ui
import { Button } from '@/components/ui/button'

// react-hook-form
import { useFieldArray } from "react-hook-form"

// React
import { useEffect, useRef } from "react";

// libs
import { adaptLayout, renderControl } from '@/lib/ui-utils'
import { v4 as uuidv4 } from "uuid"

// iconos
import { DiamondPlus } from "lucide-react"

// Contenedor de RepetableGroups
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFRepetableControlContainer({ control, methods, disabled = false }: any) {

  const maxReps = control.control_type.RepetableControlContainer.num_max_rep || 1

  const isDynamic = control.control_type.RepetableControlContainer.mode.toUpperCase() === 'DYNAMIC'
  const columnClass = `lg:grid-cols-${control.control_type.RepetableControlContainer.num_max_col || 1}`

  const { fields, append } = useFieldArray({
    control: methods.control,
    name: control.name,
  })

  console.log(isDynamic + "    " +  control.control_type.RepetableControlContainer.mode.toUpperCase())
  const initialized = useRef(false);

  useEffect(() => {
    if (!isDynamic && !initialized.current && fields.length === 0) {
      for (let i = 0; i < maxReps; i++) {
        append({ id: uuidv4() });
      }
      initialized.current = true;
    }
  }, [append, fields.length, isDynamic, maxReps]);

  function addContainter() {
    if (fields.length < maxReps) {
      append({ id: uuidv4() })
    } 
  }

  return (
      <div className="w-full">
        <div className={`grid ${columnClass} gap-4`}>  
          { fields.map((field, index) => (
            <div key={field.id} className="grid gap-4 border p-4 rounded shadow-sm" style={{ gridTemplateAreas: adaptLayout(control.control_type.RepetableControlContainer.layout), gridTemplateColumns: '1fr 1fr 1fr' }}>
                {control.control_type.RepetableControlContainer.items.map((childControl: any) =>
              renderControl(
                {
                  ...childControl,
                  name: `${control.name}[${index}].${childControl.name}`,
                },
                methods,
                disabled
              )
            )}
            </div>
          ))}
        </div>
        { isDynamic && fields.length < maxReps && (
          <Button asChild className="w-full mt-5" onClick={addContainter}>
            <div>
              <DiamondPlus />Añadir {control.label?.toLowerCase() || 'elemento'}
            </div>
          </Button>
        )}
      </div>
  )
}
