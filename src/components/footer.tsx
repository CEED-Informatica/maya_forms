import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User } from 'lucide-react';

import { useState, useEffect } from 'react'

import { getVersion } from '@tauri-apps/api/app';

export default function Footer() {

  // No la necesito reactiva, solo se detecta al arrancar
  const [appVersion, setAppVersion] = useState('----')
  const [infoVersion, setInfoVersion] = useState('----')

  useEffect(() => {
    getAppVersion()
  }, []);

  async function getAppVersion() {
    setAppVersion(await getVersion());
  }

  return (
    <footer className='fixed bottom-0 px-2 w-full h-6 bg-gray-900 flex items-center justify-between text-gray-200 text-xs border-t border-gray-700 z-50'>
      <div>
        hola
      </div>
      <div className="text-right">
        maya_forms <span className="pl-2">{appVersion}</span><span className="px-2">|</span> 
        <span>{infoVersion}</span>
      </div>
    </footer>
  );
};
