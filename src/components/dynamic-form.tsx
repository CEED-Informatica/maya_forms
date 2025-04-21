import { useForm, FormProvider  } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button'

import { invoke } from '@tauri-apps/api/core';

interface DynamicFormProps {
  formSchema: string;
}

export default function DynamicForm({ formSchema }: DynamicFormProps)
{
  const methods = useForm();

  /* Este hook se ejecuta después del renderizado */
  useEffect(() => {
    console.log("aaaa")
    invoke(formSchema, { "name": "kkkikki" })
    .then((schema) => {
      alert(schema)
    })
    .catch((error) => {
      console.error('Error al obtener el esquema del formulario:', error);
    });
  }, []);

  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
  };

  return (
    /* Utilizamos el FormProvider ya que nos proporciona un contexto de trabajo que podemos utilizar
       en los subformularios. Todos los métodos que nos proporciona el hook useForm estarán disponibles 
       en los subformularios a través de useFormContext*/
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Button type="submit" className="mt-4">
          Guardar
        </Button>
      </form>
    </FormProvider>
  );
};
