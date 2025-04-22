
import { useState, useEffect } from 'react'
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"

import { useFormContext } from 'react-hook-form';

import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';


interface DynamicSectionFormProps {
  sectionId: string
}

interface SectionSchema {
  id: string
  title: string
  subtitle: string
  controls: any[]
}

export default function DynamicSetionForm({ sectionId }: DynamicSectionFormProps)
{
  const [section, setSection] = useState<SectionSchema | null>(null)

  useEffect(() => {
    getSectionTemplate(sectionId)
  }, []);

  async function getSectionTemplate(idSectionTemplate: string) {
  
    try {
      const path = await resolveResource('resources/doc_templates/sections/' + idSectionTemplate.toLowerCase( ) + '.json');
      const sectionTemplate = JSON.parse(await readTextFile(path));
      setSection(sectionTemplate);

    } catch (error) {
      alert('Error al obtener la plantilla ' + idSectionTemplate  +':' + error);
      return null;
    }
  } 

  function renderControl(control: any) {

    const methods = useFormContext();
    
    switch (Object.keys(control.control_type)[0]) {
      case 'Edit':
        return (
          <FormField control={methods.control} name={control.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{control.label}</FormLabel>
                <FormControl>
                  <Input placeholder={control.control_type['Edit'].placeholder} {...field} />
                </FormControl>
                <FormDescription>
                  {control.caption}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />
          /* <div key={control.id}>
            <label>{control.label}</label>
            <Input
              {...register(control.id)}
              placeholder={control.control_type.props.caption}
              defaultValue={control.control_type.props.default || ''}
            />
        </div>
 */     )
      default:
        return (<h1>C o n otrol </h1>)  // TODO 
    }  
  }

  return (
    <div>
      <div className="space-y-1 ml-3 mr-3">
        <h4 className="text-sm font-medium leading-none">
          { section ? section.title : ''}
        </h4>
        <p className="text-sm text-muted-foreground">
        { section ? section.subtitle : '' } 
        </p>
      </div>
      <Separator className="my-2" />
      <div>
      { section && section.controls && section.controls.map((control: any) => renderControl(control)) }
      </div>
    </div>
  );

}