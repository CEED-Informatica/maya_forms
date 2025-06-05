// componentes maya forms ui
import MFCheck from "@/components/mfui/mf-check"

import { adaptLayout } from '@/lib/ui-utils'

// shadcn/ui
import { FormField, FormItem, FormMessage } from "@/components/ui/form"

// Grupo de casillas de edicion
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCheckGroup({ control, methods }: any) {

  console.log("cadafasd asd oo " + JSON.stringify(control.control_type.CheckGroup.items))

  const items = control.control_type.CheckGroup.items

  return (
    <FormField
      control={methods.control}
      name={control.id}
      render={({ field, fieldState }) => (
        <FormItem style={{ gridArea: control.area }}>
          <div style={{ gridTemplateAreas: adaptLayout(control.control_type.CheckGroup.layout) }} >
            {items.map((checkItem: any) => (
              <MFCheck control={checkItem} methods={methods} key={checkItem.id} />
            ))}
          </div>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}