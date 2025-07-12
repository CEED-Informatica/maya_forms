// React
import { useForm, FormProvider } from 'react-hook-form'
import { useState, useEffect } from 'react'

// shadcn/ui
import { Button } from '@/components/ui/button'

// Componentes
import DynamicSectionForm from "@/components/dynamic-section-form";

// Modelos
import { DocTemplate, FieldSection, Control, CustomZodRules } from "@/lib/component-models"

// Tauri
import { resolveResource, join, appConfigDir } from '@tauri-apps/api/path'
import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

// Zod y validadores
import { z, ZodIssueCode, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValidNif } from 'nif-dni-nie-cif-validation'


import { buildFullFormSchema } from "@/lib/buildZodSchemas"

interface DynamicFormProps {
  formId: string
}

const defaultZodSchema = z.object({}); // creo un esquema vacio de inicio

export default function DynamicForm({ formId }: DynamicFormProps)
{
  const [form, setForm] = useState<DocTemplate | null>(null)
  const [zodSchema, setZodSchema] = useState<ZodType<any>>(defaultZodSchema); // valor por defecto el vacio
  const [sectionErrors, setSectionErrors] = useState<Record<string, number>>({}) // errores en la sección
  const [controlToSectionMap, setControlToSectionMap] = useState<Record<string, string>>({});

  let rutaCompleta: string

  const methods = useForm({ 
    resolver: zodResolver(zodSchema)
  });
 
  /* Este hook se ejecuta después del renderizado */
  useEffect(() => {
    getDocTemplate(formId)
    getDataPath()
  }, [])
  
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
      const controls: Control[] = []
      const initValues: Record<string, any> =  {}
      const controlToSectionMap: Record<string, string> = {};

      const path = await resolveResource('resources/doc_templates/' + idDocTemplate + '.json');
      const rootDocTemplate = JSON.parse(await readTextFile(path));

      setForm(rootDocTemplate);
      
      for (const section of rootDocTemplate.sections_ids) {
      /* rootDocTemplate.sections_ids.map(async (section: Section) => { */

        const paths = await resolveResource('resources/doc_templates/sections/' + section.id.toLowerCase( ) + '.json');
        const sectionTemplate = JSON.parse(await readTextFile(paths));
      
        sectionTemplate.controls.forEach((control: Control) => {
          processControl(control, section.id, controls, initValues)
          /* controls.push(control)

          console.log("conotrl a añadir --->" + control.name )
          controlToSectionMap[control.name] = section.id

          // si es de tipo Edit lo inicializo a ""
          if (Object.keys(control.control_type)[0] == 'Edit')
            initValues[control.name] = "" */
        }) 
      }
 
      methods.reset(initValues)   // inicializo el formulario
      setZodSchema(buildZodSchema(controls))  // actualizo el zodSchema según el JSON
      setControlToSectionMap(controlToSectionMap);

    } catch (error) {
      console.error('Error al obtener la plantilla ' + idDocTemplate  +':', error);
      return null;
    }
  }

  // función recursiva que busca todos los controles hijos 
  function processControl(control: Control, sectionId: string, controls: Control[], initValues: Record<string, any>) {
    controls.push(control);
    controlToSectionMap[control.name] = sectionId

    const typeKey = Object.keys(control.control_type)[0]

    if (typeKey === 'Edit') {
      initValues[control.name] = '';
    }

    // Si el control tiene hijos, procesarlos también
    const typeConfig = control.control_type[typeKey]
    if (typeConfig?.items && Array.isArray(typeConfig.items)) {
      typeConfig.items.forEach((childControl: Control) => {
          processControl(childControl, sectionId, controls, initValues)
      });
    }
  }

  function buildZodSchema(controls: Control[]) {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const customZodRules: CustomZodRules[] = [];
    const checkGroupValidations: { ids: string[]; minSelected: number; groupId: string; message: string }[] = [];
    const checkContainerValidations: { parentName: string; childControls: Control[] }[] = [];
  
    const buildFieldSchema = (control: Control): z.ZodTypeAny => {
      const { validation } = control;
      if (!validation) return z.any();
  
      switch (validation.type) {
        case "string":
          let stringSchema = z.string();
          if (validation.regex) {
            const regex = typeof validation.regex === "string"
              ? validation.regex
              : validation.regex.regex;
  
            if (regex) {
              stringSchema = stringSchema.regex(new RegExp(regex), {
                message: validation.regex.message || "Formato inválido",
              });
            }
          }
          if (validation.minLength)
            stringSchema = stringSchema.min(validation.minLength, {
              message: `Mínimo ${validation.minLength} caracteres`,
            });
  
          if (validation.maxLength)
            stringSchema = stringSchema.max(validation.maxLength, {
              message: `Máximo ${validation.maxLength} caracteres`,
            });
  
          return stringSchema;
  
        case "dni":
          return z
            .string()
            .min(9, { message: "Debe tener 9 caracteres" })
            .max(9, { message: "Debe tener 9 caracteres" })
            .refine(isValidNif, { message: "DNI/NIE no válido" });
  
        case "email":
          return z.string().email({ message: "Correo inválido" });
  
        default:
          return z.any();
      }
    };
  
    for (const control of controls) {
      const { name, validation, control_type } = control;
      const controlName = Object.keys(control_type)[0];
  
      if (controlName === "CheckGroup") {
        const items = control_type.CheckGroup.items;
  
        for (const item of items) {
          const itemType = Object.keys(item.control_type)[0];
  
          if (itemType === "Check") {
            schemaShape[item.name] = z.boolean().optional();
          } else if (itemType === "CheckContainer") {
            schemaShape[item.name] = z.boolean().optional();
            checkContainerValidations.push({
              parentName: item.name,
              childControls: item.control_type.CheckContainer.items,
            });
            for (const child of item.control_type.CheckContainer.items) {
              schemaShape[child.name] = z.any().optional();
            }
          }
        }
  
        if (validation?.type?.startsWith("atLeast")) {
          const match = validation.type.match(/^atLeast(\d+)$/);
          const min = parseInt(match?.[1] || "0", 10);
          checkGroupValidations.push({
            ids: items.map((i: any) => i.name),
            minSelected: min,
            groupId: control.name,
            message: validation.message || `Selecciona al menos ${min}`,
          });
        }
  
        continue;
      }
  
      if (controlName === "CheckContainer") {
        schemaShape[name] = z.boolean().optional();
        checkContainerValidations.push({
          parentName: name,
          childControls: control.control_type.CheckContainer.items,
        });
        for (const child of control.control_type.CheckContainer.items) {
          schemaShape[child.name] = z.any().optional();
        }
        continue;
      }
  
      if (controlName === "Check") {
        schemaShape[name] = z.boolean().optional();
        continue;
      }
  
      if (validation?.custom) {
        customZodRules.push(validation.custom);
      }
  
      schemaShape[name] = z.any().optional(); // No validamos aquí directamente
    }
  
    const schema = z.object(schemaShape).superRefine((data, ctx) => {
      // Validación manual de todos los campos
      for (const control of controls) {
        const { name, validation } = control;
        if (!validation) continue;
  
        const value = data[name];
  
        if (validation.required && (value === undefined || value === "")) {
          ctx.addIssue({
            path: [name],
            code: ZodIssueCode.custom,
            message: "Este campo es obligatorio",
          });
        }
  
        const parsed = buildFieldSchema(control).safeParse(value);
        if (!parsed.success) {
          parsed.error.errors.forEach((err) => {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: [name],
              message: err.message,
            });
          });
        }
      }
  
      // Validaciones de grupo
      checkGroupValidations.forEach(({ ids, minSelected, message, groupId }) => {
        const selected = ids.reduce((acc, id) => acc + (data[id] ? 1 : 0), 0);
        if (selected < minSelected) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: [groupId],
            message,
          });
        }
      });
  
      // Validaciones de CheckContainer
      for (const { parentName, childControls } of checkContainerValidations) {
        if (!data[parentName]) continue;
        for (const child of childControls) {
          const parsed = buildFieldSchema(child).safeParse(data[child.name]);
          if (!parsed.success) {
            parsed.error.errors.forEach((err) => {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: [child.name],
                message: err.message,
              });
            });
          }
        }
      }
  
      // Validaciones personalizadas (custom)
      for (const rule of customZodRules) {
        try {
          const isInvalid = new Function("data", `return ${rule.condition}`)(data);
          const message = new Function("data", `return \`${rule.message}\`;`)(data);
          if (isInvalid) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              message,
              path: JSON.parse(rule.path.replace(/'/g, '"')),
            });
          }
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Error evaluando condición custom",
            path: [],
          });
        }
      }
    });
  
    return schema;
  }
  
  
  // Crea el esquema de validación de Zod para el formulario a partir de los datos 
  // que se incluyen en el json
  /* function buildZodSchema(controls: Control[]) {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    let customZodRules: CustomZodRules[] = [];
    const checkGroupValidations: { ids: string[]; minSelected: number; groupId: string; message: string }[] = []
    const checkContainerValidations: { parentName: string; childControls: Control[]}[] = []
  
    // Utilidad para crear la validación base de un campo, según su tipo
    const buildFieldSchema = (control: Control): z.ZodTypeAny => {
      const { validation } = control;
      if (!validation) return z.any();
  
      switch (validation.type) {
        case "string":
          let stringSchema = validation.required
            ? z.string({ required_error: "El campo es obligatorio" })
            : z.string()
  
          // permite la definición de la regex en el json de varias maneras 
          // "regex": "expre"  o   "regex": { "regex": "expre", "message": "mess" } o "regex": { "regex": "expre" }
          if (validation.regex) {
            const regex =
              typeof validation.regex === "string"
                ? validation.regex
                : validation.regex.regex
  
            if (regex)
              stringSchema = stringSchema.regex(new RegExp(regex), {
                message: validation.regex.message || "Formato inválido",
              });
          }
  
          if (validation.minLength)
            stringSchema = stringSchema.min(validation.minLength, {
              message: `El número mínimo de caracteres permitido es ${validation.minLength}`,
            });
  
          if (validation.maxLength)
            stringSchema = stringSchema.max(validation.maxLength, {
              message: `El número máximo de caracteres permitido es ${validation.maxLength}`,
            });
  
          return stringSchema;
  
        case "dni":
          return z
            .string()
            .min(9, { message: "El documento debe tener al menos 9 caracteres" })
            .max(9, { message: "El documento no puede tener más de 9 caracteres" })
            .refine((value) => isValidNif(value), {
              message: "El DNI/NIE no es válido o la letra de control es incorrecta",
            });
  
        case "email":
          return z.string().email({
            message: "Introduce una dirección de correo electrónico válida",
          });
  
        default:
          return z.any()
      }
    }
  
    for (const control of controls) {
      const { name, validation, control_type } = control
      const controlName = Object.keys(control_type)[0]
  
      // CheckGroup
      if (controlName === "CheckGroup") {
        const items = control_type.CheckGroup.items;
  
        for (const item of items) {
          const itemType = Object.keys(item.control_type)[0];
  
          if (itemType === "Check") {
            schemaShape[item.name] = z.boolean().default(item.control_type.Check?.default || false);
          } else if (itemType === "CheckContainer") {
            schemaShape[item.name] = z.boolean().default(item.control_type.CheckContainer?.default || false);
  
            checkContainerValidations.push({
              parentName: item.name,
              childControls: item.control_type.CheckContainer.items,
            });
  
            for (const child of item.control_type.CheckContainer.items) {
              schemaShape[child.name] = buildFieldSchema(child).optional();
            }
          } else {
            throw new Error("Uno de los items de un CheckGroup no es un Check o CheckContainer");
          }
        }
  
        if (validation?.type?.startsWith("atLeast")) {
          const match = validation.type.match(/^atLeast(\d+)$/);
          if (!match) throw new Error(`Tipo de validación inválido: ${validation.type}`);
  
          const minRequired = parseInt(match[1], 10);
          checkGroupValidations.push({
            ids: items.map((i: any) => i.name),
            minSelected: minRequired,
            groupId: control.name,
            message:
              validation.message ||
              `Debes seleccionar al menos ${minRequired} opción${minRequired > 1 ? "es" : ""}`,
          });
        }
  
        continue
      }
      
      // CheckContainer
      if (controlName === "CheckContainer") {
        schemaShape[name] = z.boolean().default(control_type.CheckContainer.default ?? false);
  
        checkContainerValidations.push({
          parentName: control.name,
          childControls: control.control_type.CheckContainer.items,
        });
  
        for (const child of control.control_type.CheckContainer.items) {
          // Registramos como opcionales para evitar validaciones prematuras
          schemaShape[child.name] = buildFieldSchema(child).optional();
        }
  
        continue
      }
  
      // Normal
      if (controlName === "Check") {
        schemaShape[name] = z.boolean().default(control_type.Check.default ?? false);
        continue
      }

      if (!validation) continue
  
      const fieldSchema = buildFieldSchema(control);
  
      schemaShape[name] = fieldSchema;
      if (validation?.custom) customZodRules.push(validation.custom)
    }
  
    const zodSchema = z.object(schemaShape).superRefine((data, ctx) => {

      // Custom Zod Rules
      customZodRules.forEach((rule) => {
        try {
          const messageInterpolated = new Function("data", `return \`${rule.message}\`;`)(data);
          const conditionFunction = new Function("data", `return ${rule.condition}`);
          const isInvalid = conditionFunction(data);
  
          if (isInvalid) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              message: messageInterpolated,
              path: JSON.parse(rule.path.replace(/'/g, '"')),
            })
          }
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Error al evaluar la condición de validación.",
            path: [],
          })
        }
      })

      // Validaciones para CheckGroup
      checkGroupValidations.forEach(({ ids, minSelected, message, groupId }) => {
        const selectedCount = ids.reduce((acc, id) => acc + (data[id] ? 1 : 0), 0);
        if (selectedCount < minSelected) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message,
            path: [groupId],
          })
        }
      })

      // Validaciones para CheckContainer
      for (const { parentName, childControls } of checkContainerValidations) {
        if (!data[parentName]) continue // si el check está desactivado, no se valida

        for (const item of childControls) {
          const fieldSchema = buildFieldSchema(item);
          const parsed = fieldSchema.safeParse(data[item.name]);

          if (!parsed.success) {
            parsed.error.errors.forEach((err) => {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                message: err.message,
                path: [item.name],
              })
            })
          }
        }
    }
    })
  
    return zodSchema;
  } */
  
  const onError = (errors: any) => {

    const newSectionErrors: Record<string, number> = {};
    console.log("IONERROR " + JSON.stringify(errors))
    Object.keys(errors).forEach((fieldName) => {
      console.log("Field ->" + fieldName)
      const sectionId = controlToSectionMap[fieldName];
      if (sectionId) {
        newSectionErrors[sectionId] = (newSectionErrors[sectionId] || 0) + 1;
      }
    });

    setSectionErrors(newSectionErrors);
  }

  // Genera el formulario o almacena los datos en un fichero
  const onSubmit = (data: any) => {
    console.log("Errores actuales:", methods.formState.errors);
    console.log('Datos del formulario:', data);
    const adat2 = methods.getValues()
    console.log('Datos del formulario:', adat2)

    if (!form?.onSubmitAction) {
      console.warn("No se especificó ninguna acción en la plantilla del fomrulario. Guardando por defecto.")
      saveProfile(adat2)
      return
    }
    
    switch (form.onSubmitAction) {
      case "saveJson":
        saveProfile(adat2);
        break
      
      case "generatePdf":
        console.log("Generando PDF. TODO")
        break
  
      default:
        console.error(`Acción onSubmitAction desconocida: ${form.onSubmitAction}`)
    }
   
  };

  if (!zodSchema || !form)
    return (<div>Cargando</div>)

  return (
    /* Utilizamos el FormProvider ya que nos proporciona un contexto de trabajo que podemos utilizar
       en los subformularios. Todos los métodos que nos proporciona el hook useForm estarán disponibles 
       en los subformularios a través de useFormContext*/
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit,onError)}>
          { form && form.sections_ids && form.sections_ids.map((section: FieldSection, index: number) => (
            <DynamicSectionForm key={section.id} sectionId={section.id} headerStyle={section.style} 
            index={index + 1} errorCount={sectionErrors[section.id] || 0}/>
          ))
          }
        <Button type="submit" className="mt-4">
          Guardar
        </Button>
      </form>
    </FormProvider>
  );
};
