
// shadcn/ui
import { Input } from "@/components/ui/input"
import {
  FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// utilidades ui
import { useIsDisabled } from '@/lib/ui-utils'

// Casilla de edición que se puede incorpora dentro de una sección
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFEdit({ control, methods, disabled = false }: any) {
    
  // Hook para saber si el combo está activado o desactivado
  const isDisabled = useIsDisabled(control.disabledIf, methods.control) || disabled

  return (
      <div style={{ gridArea: control.area }} key={control.id}>
        <FormField control={methods.control} name={control.id} 
          render={({ field }) => (
          <FormItem>
            <FormLabel>{control.label}</FormLabel>
            <FormControl>
              <Input  disabled={isDisabled} placeholder={control.control_type.Edit.placeholder} {...field} />
            </FormControl>
            <FormDescription>
              {control.caption}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
        />
      </div>
  )

}