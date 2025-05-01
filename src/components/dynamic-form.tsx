import { useForm, FormProvider  } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import DynamicSectionForm from "@/components/dynamic-section-form";

import { resolveResource, join, appConfigDir } from '@tauri-apps/api/path';
import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

// Zod y validadores
import { z, ZodObject } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidNif } from 'nif-dni-nie-cif-validation';

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

  let rutaCompleta: string

  const methods = useForm({ 
    resolver: zodResolver(zodSchema)
  });
 
  /* Este hook se ejecuta después del renderizado */
  useEffect(() => {
    getDocTemplate(formId)
    getDataPath()
  }, []);

  async function getDataPath() {
    // Linux $HOME/.config, 
    // MacOS $HOME/Library/Application Support 
    // Windowes {FOLDERID_RoamingAppData}.
    const appDirectory = await appConfigDir(); 
    rutaCompleta = await join(appDirectory, "profiles.mfp");

    console.log(rutaCompleta)
  }

  async function saveProfile(data: any) {
    let saveData: any = {}
    
    const profilesExists = await exists('profiles.json', {
      baseDir: BaseDirectory.AppLocalData,
    });

    if (profilesExists) {
      const datosPrevios = JSON.parse(await readTextFile( "profiles.json", {
        baseDir: BaseDirectory.AppLocalData,
      }));

      saveData = datosPrevios
    }

    delete saveData[data['CTRL_NIA']]
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(data['CTRL_NIA']))
    saveData[data['CTRL_NIA']] = data
    console.log(JSON.stringify(saveData))
    await writeTextFile("profiles.json", JSON.stringify(saveData), {
      baseDir: BaseDirectory.AppLocalData,
    });

    //console.log(JSON.stringify(datosPrevios))

  }

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

      let fieldSchema: z.ZodTypeAny

      switch (validation.type) {
        case 'string':    // se comprueban cadenas
          let stringSchema

          if (validation.required)
            stringSchema= z.string({required_error: "El campo es obligatorio"})
          else 
            stringSchema= z.string()

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
            stringSchema = stringSchema.min(validation.minLength, { message: `El número mínimo de caracteres permitido es ${validation.minLength}` });
          }
          
          fieldSchema = stringSchema
          break
        case  'dni':
          const dniSchema = 
            z.string()
              .min(9, { message: 'El documento debe tener al menos 9 caracteres' })
              .max(9, { message: 'El documento no puede tener más de 9 caracteres' })
              .refine((value) => isValidNif(value), {
                message: 'El DNI/NIE no es válido o la letra de control es incorrecta',
              })
    
          fieldSchema = dniSchema
          break
        case  'email':
            const emailSchema = 
              z.string()
                .email({ message: 'Introduce una dirección de correo electrónico válida' })
      
            fieldSchema = emailSchema
            break

        default:
          fieldSchema = z.any()
      }

      schemaShape[id] = fieldSchema
    }
    
    return z.object(schemaShape);
  }

  /* Genera el formulario o almacena los datos en un fichero */
  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
    const adat2 = methods.getValues()
    console.log('Datos del formulario:', adat2);
    
    saveProfile(adat2);
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
            <DynamicSectionForm key={section.id} sectionId={section.id}/>
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