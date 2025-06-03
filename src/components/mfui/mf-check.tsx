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
      <div style={{ gridArea: control.area }} key={control.id} className="mb-4">
        <FormField control={methods.control} name={control.id} 
          render={({ field }) => (
          <FormItem>
            <FormLabel className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border 
                      p-3 has-[[aria-checked=true]]:border-blue-600 
                      has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 
                      dark:has-[[aria-checked=true]]:bg-blue-950">
              <Checkbox 
                checked={field.value?.includes(control.id)}
                onCheckedChange={(checked: boolean) => {
                    return checked
                      ? field.onChange([...(field.value ?? []), control.id])
                      : field.onChange(
                          field.value?.filter(
                            (value: boolean) => value !== control.id
                          )
                        )
              }} />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {control.label}
                </p>
                <FormDescription className="text-muted-foreground text-sm">
                  {control.caption}
                </FormDescription>
              </div>
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
        />
      </div>
  )

}

//disabled={isDisabled} 
//const isDisabled = useIsDisabled(control.disabledIf, methods.control)