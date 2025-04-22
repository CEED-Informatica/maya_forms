
import { useState, useEffect } from 'react'
import { Separator } from "@/components/ui/separator"

import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';


interface DynamicSectionFormProps {
  sectionId: string
}

interface SectionSchema {
  id: string
  title: string
  subtitle: string
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
      alert(JSON.stringify(sectionTemplate))
      setSection(sectionTemplate);

    } catch (error) {
      alert('Error al obtener la plantilla ' + idSectionTemplate  +':' + error);
      return null;
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
    </div>
  );

}