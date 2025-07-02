// React
import { useEffect, useState } from 'react';

// shadcn/ui
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Command, CommandEmpty, CommandGroup, 
  CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// iconos
import { Check, ChevronsUpDown } from "lucide-react"

// Tauri
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

// clsx para composicion de clases CSS
import clsx from 'clsx';

// utilidades ui
import { useFilteredOptions, useIsDisabled, formatDisplay } from '@/lib/ui-utils'

// Modelos
import { ComboOptions } from "@/lib/component-models"

// react-hook-form
import { useWatch } from "react-hook-form";

// Combo que se puede incorpora dentro de una sección
// Permite la carga de datos de manera asincrona
// Propiedades:
//   control: bloque JSON del control
//   methods: methods del hook useForm de react-hook-form del formulario padre
export default function MFCombo({ control, methods, disabled = false }: any) {
  const [options, setOptions] = useState<ComboOptions[]>([])
  const [open, setOpen] = useState(false)

  // Hook para saber si el combo está activado o desactivado
  const isDisabled = useIsDisabled(control.disabledIf, methods.control) || disabled

  // Hook  para obtener las opciones filtradas
  const filteredOptions = useFilteredOptions(options, control.filter, methods.control)

  // Hook para controlar el valor de actual del control
  const watchedValue = useWatch({ control: methods.control, name: control.name });

  // en el caso de que el valor no esté en la lista de opciones, resetea el valor
  useEffect(() => {
    if (!filteredOptions || filteredOptions.length === 0) return

    const existsInOptions = filteredOptions.some(opt => opt.value === watchedValue)
    if (!existsInOptions && watchedValue) {
      console.log(`[MFCombo] El valor "${watchedValue}" no está entre las opciones visibles. Debería resetearse.`)
      methods.setValue(control.name, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }
  }, [watchedValue, filteredOptions]);
 
  
  useEffect(() => {
    async function getOptionsFromJSON() {
      const idOptionsData: string  = control.control_type.Combo.options

      try {
        const path = await resolveResource('resources/' + idOptionsData + '.json');
        const optionsData = JSON.parse(await readTextFile(path));
        return optionsData;
      
      } catch (error) {
        alert('Error al obtener los datos de ' + idOptionsData  +':' + error);
        return null;
      }
    } 

    // Obtiene los datos de las opciones
    // Existen tres opciones de indicar los datos
    //   1. Un array de cadenas de texto  ['Hola', 'Adios']
    //   2. Array de objetos {value, label}  [ {'value':  'HI 'label': 'Hola' }. {{'value':  'BYE', 'label': 'Adios' }]
    //   3. Ruta, desde resources, de un fichero json con las opciones "data_general/mis_opciones.json"
    async function fetchOptions() {
      const optionsField = control.control_type.Combo.options

      if (Array.isArray(control.control_type.Combo.options)) {
        // Caso 1: Array de cadenas de texto
        if (typeof optionsField[0] === 'string') {
          setOptions(optionsField.map((value: string)  => ({ value, label: value })))
        }
        // Caso 2: Array de objetos con 'value' y 'label'
        else if (typeof optionsField[0] === 'object') {
          setOptions(optionsField)
        }
      }
      // Caso 3: Identificador que referencia otro objeto JSON
      else if (typeof optionsField === 'string') {
        const referencedOptions = await getOptionsFromJSON();
        if (Array.isArray(referencedOptions)) {
          if (typeof referencedOptions[0] === 'string') {
            setOptions(referencedOptions.map(value => ({ value, label: value })))
          } else if (typeof referencedOptions[0] === 'object') {
            setOptions(referencedOptions)
          }
        }
      }
    }

    fetchOptions()

  }, [control])

  return (
    <div style={{ gridArea: control.area }}>
      <FormField control={methods.control} name={control.name} 
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{control.label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox"
                    disabled={isDisabled}
                    className={clsx("justify-between",
                    !field.value && "text-muted-foreground")} {...field}>
                      {field.value ? formatDisplay(filteredOptions.find((option) => option.value === field.value), control.control_type.Combo.display)
                       : "Selecciona " + control.control_type.Combo.placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" style={{ width: "var(--radix-popover-trigger-width)"}}>
                <Command>
                  <CommandInput placeholder={"Busca " + control.control_type.Combo.placeholder} />
                  <CommandList>
                    <CommandEmpty>No se encuentra {control.control_type.Combo.placeholder} con ese patrón de búsqueda.</CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option: any) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            methods.setValue(control.name, option.value)
                            methods.setValue(`${control.name}_ctrl`, option.value) /// valor utilizado para el control de inhabilitado
                            console.log("Se ha seleccionado " + option.value)
                            setOpen(false)
                          }}
                        >
                          {formatDisplay(option, control.control_type.Combo.display)}
                          <Check
                            className={clsx(
                              "ml-auto",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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