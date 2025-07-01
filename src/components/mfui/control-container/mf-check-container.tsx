
// componentes maya forms ui
import MFCheck from "@/components/mfui/mf-check"

// react-hook-form
import { useWatch } from "react-hook-form";


// React
import { useState } from 'react'

// libs
import { adaptLayout, renderControl } from '@/lib/ui-utils'
import { v4 as uuidv4 } from "uuid"


// Check qued contiene un contenedor de controles
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCheckContainer({ control, methods }: any) {

  // vigilo el estado del check
  const isChecked = useWatch({
    control: methods.control,
    name: control.id,
  });

  const isDisabled = !isChecked;

  console.log("CHECKED "+ isChecked)

  return (
    <div style={{ gridArea: control.area }} className="mb-4 has-[[aria-checked=true]]:border-blue-600 rounded-lg border dark:has-[[aria-checked=true]]:border-blue-900">
      <MFCheck control={control} methods={methods} border="false"/>
      <div style={{ gridTemplateAreas: adaptLayout(control.control_type.CheckContainer.layout) }} className="px-10 pb-4">
       {control.control_type.CheckContainer.items.map((childControl: any) =>
          renderControl(
            {
              ...childControl,
              name: `${childControl.id}`,
            },
            methods,
            isDisabled,
          )
        )}
      </div>
    </div>
  );

 
}