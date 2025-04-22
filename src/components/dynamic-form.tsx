import { useForm, FormProvider  } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import DynamicSectionForm from "@/components/dynamic-section-form";

import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

import { z, ZodObject } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface DynamicFormProps {
  formId: string;
}

interface Section {
  id: string
  style: string
  controls: Control[]
}

interface Control {
  id: string
  control_type: any
  validation: any
}

interface FormSchema {
  sections_ids: Section[];
}

const defaultZodSchema = z.object({}); // creo un esquema vacio de inicio

export default function DynamicForm({ formId }: DynamicFormProps)
{
  const [form, setForm] = useState<FormSchema | null>(null)
  const [zodSchema, setZodSchema] = useState<ZodObject<any>>(defaultZodSchema); // valor por defecto el vacio

  const methods = useForm({ 
    resolver: zodResolver(zodSchema)
  });
 
  /* Este hook se ejecuta después del renderizado */
  useEffect(() => {
    getDocTemplate(formId)
  }, []);

  /* Carga el doc_template pasado como propiedad al componente. 
     Utiliza funciones del plugin FS de Tauri */
  async function getDocTemplate(idDocTemplate: string) {
    try {
      const controls: Control[] = [];

      const path = await resolveResource('resources/doc_templates/' + idDocTemplate + '.json');
      const rootDocTemplate = JSON.parse(await readTextFile(path));

      setForm(rootDocTemplate);
      
      for (const section of rootDocTemplate.sections_ids) {
      /* rootDocTemplate.sections_ids.map(async (section: Section) => { */

        const paths = await resolveResource('resources/doc_templates/sections/' + section.id.toLowerCase( ) + '.json');
        const sectionTemplate = JSON.parse(await readTextFile(paths));
      
        sectionTemplate.controls.forEach((control: Control) => {
          controls.push(control)
        }) 
      }
 
      setZodSchema(buildZodSchema(controls))  // actualizo el zodSchema según el JSON

    } catch (error) {
      console.error('Error al obtener la plantilla ' + idDocTemplate  +':', error);
      return null;
    }
  }

  /* Crea el esquema de validación de Zod para el formulario a partir de los datos 
     que se incluyen en el json */
  function buildZodSchema(controls: Control[]) {

    const schemaShape: Record<string, z.ZodTypeAny> = {}
    
    for (const control of controls) {
     
      const { id, validation } = control

      if (!validation) continue;  // si no hay validación pasa al siguiente control

      let fieldSchema: z.ZodTypeAny;

      switch (validation.type) {
        case 'string':    // se comprueban cadenas
          let stringSchema = z.string()

          /* 
           * permite la defincion de la regex en el json de varias maneras 
              "regex": "expre" +
              o 
              "regex": { "regex": "expre", "message": "mess" }
              o
              "regex": { "regex": "expre" }
          */
          if (validation.regex) { 
            let regex: string = ""

            if (typeof validation.regex === "string") regex = validation.regex
            else if (typeof validation.regex === "object" && validation.regex.regex) regex = validation.regex.regex

            if (regex)
              stringSchema = stringSchema.regex(new RegExp(regex), { message: validation.regex.message || "Formato inválido" });
          }
          if (validation.maxLength) {
            stringSchema = stringSchema.max(validation.maxLength, { message: `El número máximo de caracteres permitido es ${validation.maxLength}` });
          }
          if (validation.minLength) {
            stringSchema = stringSchema.min(validation.minLength, { message: `El número mínimo de caracteres permitido es  ${validation.minLength}` });
          }
          
          fieldSchema = stringSchema
          break
        
        default:
          fieldSchema = z.any();
      }

      schemaShape[id] = fieldSchema;
    }
    
    return z.object(schemaShape);
  }


  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
  };

  if (!zodSchema || !form)
    return (<div>Cargando</div>)

  return (
    /* Utilizamos el FormProvider ya que nos proporciona un contexto de trabajo que podemos utilizar
       en los subformularios. Todos los métodos que nos proporciona el hook useForm estarán disponibles 
       en los subformularios a través de useFormContext*/
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
          { form && form.sections_ids && form.sections_ids.map((section: Section) => (
            <DynamicSectionForm sectionId={section.id}/>
          ))
          }
        <Button type="submit" className="mt-4">
          Guardar
        </Button>
      </form>
    </FormProvider>
  );
};

            /*  */
    /*  <DynamicSectionForm key={section.id} sectionId={section.id}/>)) */