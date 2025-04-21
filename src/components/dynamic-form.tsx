import { useForm, FormProvider  } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

//import { invoke } from '@tauri-apps/api/core';
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

interface DynamicFormProps {
  formSchema: string;
}

interface Section {
  id: string;
  style: string;
}

interface FormSchema {
  sections_ids: Section[];
}

export default function DynamicForm({ formSchema }: DynamicFormProps)
{
  const methods = useForm();
  const [form, setForm] = useState<FormSchema | null>(null)

  /* Este hook se ejecuta después del renderizado */
  useEffect(() => {
    getDocTemplate(formSchema)
  }, []);

  /** Carga el doc_template pasado como propiedad al componente */
  async function getDocTemplate(idDocTemplate: string) {
    try {
      
      const path = await resolveResource('resources/doc_templates/' + idDocTemplate + '.json');
      const rootDocTemplate = JSON.parse(await readTextFile(path));

      setForm(rootDocTemplate);

    } catch (error) {
      console.error('Error al obtener la plantilla ' + idDocTemplate  +':', error);
      return null;
    }
  }

  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
  };

  return (
    /* Utilizamos el FormProvider ya que nos proporciona un contexto de trabajo que podemos utilizar
       en los subformularios. Todos los métodos que nos proporciona el hook useForm estarán disponibles 
       en los subformularios a través de useFormContext*/
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
          {form && form.sections_ids && form.sections_ids.map((section: any) => (
          <h1 key={section.id}>{section.id}</h1>))}
        <Button type="submit" className="mt-4">
          Guardar
        </Button>
      </form>
    </FormProvider>
  );
};
