
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

import clsx from 'clsx';


interface DynamicSectionFormProps {
  sectionId: string,
}

interface SectionSchema {
  id: string
  title: string
  subtitle: string
  layout: string
  controls: any[]
}

export default function DynamicSectionForm({ sectionId }: DynamicSectionFormProps)
{
  const [section, setSection] = useState<SectionSchema | null>(null)
  const [columns, setColumns] = useState<number>(1)   // numero de columnas del grid
  const [layout, setLayout] = useState<string>('')   // layout con saltos de linea

  useEffect(() => {
    getSectionTemplate(sectionId)
  }, []);

  useEffect(() => {
    getColumns()
  }, [section]);

  useEffect(() => {
    getLayout()
  }, [section]);
  
  const methods = useFormContext();

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

  function getColumns() {
    if (section) {
      setColumns(section.layout.split(',').map(line => line.trim().
                                split(/\s+/).length).
                                reduce((max, current) => Math.max(max, current), 0));
    }
  } 

  function getLayout() {
    if (section) {
      setLayout(section.layout.replaceAll(',',' '))
    }
  } 

  function renderControl(control: any) {

    switch (Object.keys(control.control_type)[0]) {
      case 'Edit':
        return (
          <div style={{ gridArea: control.area }} key={control.id}>
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
            </div>
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
      <Separator className="mt-2 mb-5" />
      <div className={clsx("grid", `grid-cols-${columns}`, "gap-4")} style={{ gridTemplateAreas: section ? layout : ''}}>
      { section && section.controls && section.controls.map((control: any) => renderControl(control)) }
      </div>
    </div>
  );

}


//