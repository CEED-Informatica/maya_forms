
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useState, useEffect } from 'react'

import { getVersion } from '@tauri-apps/api/app';
import { useDataInfo } from "@/components/data/data-info-provider"

export default function Footer() {

  const [appVersion, setAppVersion] = useState('----')
  const { data, refreshData } = useDataInfo();

  useEffect(() => {
    getAppVersion()
  }, []);

  async function getAppVersion() {
    setAppVersion(await getVersion());
  }

  return (
    <footer className='fixed bottom-0 px-2 w-full h-6 bg-gray-900 flex items-center justify-between text-gray-200 text-xs border-t border-gray-700 z-50'>
      <TooltipProvider>
        <div>
          
        </div>
        <div className="text-right">
          maya_forms <span className="pl-2">{appVersion}</span><span className="px-2">|</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span onClick={refreshData}>{data.version}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Versión de los datos. Pulsa para actualizar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </footer>
  );
};
