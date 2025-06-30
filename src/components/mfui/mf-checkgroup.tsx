// componentes maya forms ui
import MFCheck from "@/components/mfui/mf-check"
import MFCheckContainer from "@/components/mfui/control-container/mf-check-container"

import { adaptLayout } from '@/lib/ui-utils'

// shadcn/ui
import { FormField, FormItem, FormMessage } from "@/components/ui/form"

// Grupo de casillas de edicion
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCheckGroup({ control, methods }: any) {

  const items = control.control_type.CheckGroup.items

  return (
    <FormField
      control={methods.control}
      name={control.id}
      render={({ field, fieldState }) => (
        <FormItem style={{ gridArea: control.area }}>
          <div style={{ gridTemplateAreas: adaptLayout(control.control_type.CheckGroup.layout) }} >
            { items.map((checkItem: any) => {
              const type = Object.keys(checkItem.control_type)[0]
              if (type === "Check") 
                return <MFCheck key={checkItem.id} control={checkItem} methods={methods} />
              if (type === "CheckContainer") 
                return <MFCheckContainer key={checkItem.id} control={checkItem} methods={methods} />
            })}
          </div>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}
