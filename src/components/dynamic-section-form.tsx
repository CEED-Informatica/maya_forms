// React
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

// shadcn/ui
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tauri
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

// utilidades
import { adaptLayout, renderControl } from '@/lib/ui-utils'
import clsx from 'clsx'

import { SectionSchema } from "@/lib/component-models"

import { AlertCircle } from "lucide-react";

interface DynamicSectionFormProps {
  sectionId: string
  headerStyle:  "ACC" | "FIXED"
  index: number
  errorCount?: number
}

export default function DynamicSectionForm({ sectionId, headerStyle = "FIXED", index, errorCount }: DynamicSectionFormProps)
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

  const sectionContent = section && (
    <div className={clsx("grid", `grid-cols-${columns}`, "px-8 gap-x-4 gap-y-7")} style={{ gridTemplateAreas: section ? layout : '' }}>
      {section && section.controls && section.controls.map((control: any) => renderControl(control, methods))}
    </div>
  )

  return (
      <div className='mb-3'>
        
        {headerStyle === "FIXED" && section && (
          <>
            <div className="space-y-1 mx-3">
              <div className="text-3xl font-bold flex items-center h-full mr-3">{index}</div>
              <div>
                <h4 className="text-lg font-medium leading-none">{section ? section.title : ''}</h4>
                <p className="text-sm htext-muted-foreground">{section ? section.subtitle : ''}</p>
              </div>
            </div>
            <Separator className="mt-2 mb-5" />
            {sectionContent}
          </>
        )}

        {headerStyle === "ACC" && section && (
          <Accordion type="multiple">
            <AccordionItem value={section.id}>
              <AccordionTrigger className="hover:bg-accent hover:no-underline p-3 rounded-md mb-6">
                <div className="flex items-center space-y-1 mx-3 text-left w-full">
                  <div className="text-3xl font-bold flex items-center h-full mr-3">{index}</div>
                  <div>
                    <h4 className="text-lg font-medium">{section ? section.title : ''}</h4>
                    <p className="text-sm text-muted-foreground">{section ? section.subtitle : ''}</p>
                  </div>
                  {errorCount != null && errorCount > 0 && 
                  (<TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-auto">
                          <span className="flex items-center gap-1 text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900 text-sm rounded-full px-2 py-0.5">
                            <AlertCircle className="w-4 h-4" />
                            {errorCount}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{`${errorCount} error${errorCount > 1 ? 'es' : ''} en esta sección`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {sectionContent}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
  );
}
