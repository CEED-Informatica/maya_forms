// React
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form';

// shadcn/ui
import { Separator } from "@/components/ui/separator"

// Tauri
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

// componentes maya forms ui
import MFCombo from "@/components/mfui/mf-combo"
import MFEdit from "@/components/mfui/mf-edit"
import MFCheckGroup from "@/components/mfui/mf-checkgroup"

// utilidades
import { adaptLayout } from '@/lib/ui-utils'
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
      setLayout(adaptLayout(section.layout.replaceAll(',',' ')))
    }
  } 

  function renderControl(control: any) {

    switch (Object.keys(control.control_type)[0]) {
      case 'Edit':
        return <MFEdit control={control} methods={methods} key={control.id}/>;
          /* <div key={control.id}>
            <label>{control.label}</label>
            <Input
              {...register(control.id)}
              placeholder={control.control_type.props.caption}
              defaultValue={control.control_type.props.default || ''}
            />
        </div>
 */     
      case 'Combo':
        return <MFCombo control={control} methods={methods} key={control.id}/>

      case 'CheckGroup':
        return <MFCheckGroup control={control} methods={methods} key={control.id}/>

      /* case 'CheckGroup':
          return <MFCombo control={control} methods={methods} key={control.id}/>; */

      default:
        return (<h1>Control no soportado</h1>)  // TODO 
    }  
  }

  return (
    <div className='mb-9'>
      <div className="space-y-1 mx-3">
        <h4 className="text-sm font-medium leading-none">
          { section ? section.title : ''}
        </h4>
        <p className="text-sm text-muted-foreground">
        { section ? section.subtitle : '' } 
        </p>
      </div>
      <Separator className="mt-2 mb-5" />
      <div className={clsx("grid", `grid-cols-${columns}`, "gap-x-4 gap-y-7")} style={{ gridTemplateAreas: section ? layout : ''}}>
      { section && section.controls && section.controls.map((control: any) => renderControl(control)) }
      </div>
    </div>
  );

}
