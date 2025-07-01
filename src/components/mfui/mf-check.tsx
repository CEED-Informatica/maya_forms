// shadcn/ui
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormDescription, FormField,
  FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// utilidades ui
import { useIsDisabled } from '@/lib/ui-utils'
import clsx from 'clsx'


// Casilla de edición que se puede incorpora dentro de una sección
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCheck({ control, methods, border = true }: any) {
    
  // Hook para saber si el combo está activado o desactivado

  return (
      <div style={{ gridArea: control.area }} key={control.id} className="mb-4">
        <FormField control={methods.control} name={control.id} 
          render={({ field }) => (
          <FormItem>
            <FormLabel className={clsx(
                        "hover:bg-accent/50 flex items-start gap-3",
                        "p-3 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:bg-blue-950",
                        { "has-[[aria-checked=true]]:border-blue-600 rounded-lg border dark:has-[[aria-checked=true]]:border-blue-900" : border == true })}>
              <Checkbox 
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
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
