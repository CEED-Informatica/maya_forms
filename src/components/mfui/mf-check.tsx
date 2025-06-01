// shadcn/ui
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// utilidades ui
import { useIsDisabled } from '@/lib/ui-utils'

// Casilla de edición que se puede incorpora dentro de una sección
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCheck({ control, methods }: any) {
    
  // Hook para saber si el combo está activado o desactivado
 
  console.log("CHHHECK   " + control ? JSON.stringify(control) :  "NOOOOOO")
  return (
      <div style={{ gridArea: control.area }} key={control.id}>
        <FormField control={methods.control} name={control.id} 
          render={({ field }) => (
          <FormItem>
            <FormControl>

              <div className="flex items-start gap-3">
                <Checkbox 
                          checked={field.value?.includes(control.id)}
                          onCheckedChange={(checked: boolean) => {
                              return checked
                                ? field.onChange([...field.value, control.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: boolean) => value !== control.id
                                    )
                                  )
                            }} />
                
              </div>
            </FormControl>
            <FormLabel>{control.label}</FormLabel>
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

//disabled={isDisabled} 
//const isDisabled = useIsDisabled(control.disabledIf, methods.control)