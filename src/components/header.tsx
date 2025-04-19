import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User } from 'lucide-react';

import  logoCeedW  from '@/assets/ceedcv_white.png'
import  logoCeedG  from '@/assets/ceedcv_gray.png'

import { useTheme } from '@/components/theme-provider';

export default function Header() {

  const { theme, setTheme } = useTheme();

  /* Alterna el tema */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      <div className="mx-1 flex items-center justify-between">
        {/* Logo a la izquierda */}
        <div className="flex items-center space-x-2 borderColor-red">
          <img src={theme === 'dark' ? logoCeedW : logoCeedG } alt="Logo" className="h-8 w-28" />
          <span className="px-2 text-xl font-bold text-gray-800 dark:text-white self-end">
            Generador de documentación administrativa
          </span>
        </div>

        {/* Elementos a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Icono de usuario y nombre */}
          <Link to="/perfil" className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-800 dark:text-white" />
            <span className="text-gray-800 dark:text-white">Nombre Apellido1 - 123456</span>
          </Link>

           {/* Botón de cambio de tema */}
          <Button variant="ghost" onClick={toggleTheme} aria-label="Cambia el tema" className="my-1 self-end">
            {theme === 'dark' ? <Sun className="h-5 w-5 self-end" /> : <Moon className="h-5 w-5 self-end" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
