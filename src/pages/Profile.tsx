import Header from "@/components/header";
import DynamicForm from "@/components/dynamic-form";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useState } from "react";

export default function Profile() {
  
  const [language, setLanguage] = useState('es')

  return  (
    <div>
      <Header></Header>
      <div className="p-6">
        <div className="grid grid-cols-[1fr_0.005fr_1fr] mb-12">
          <h2 className="text-right text-lg font-semibold mb-4 px-3">Selecciona tu idioma </h2>
          <Separator orientation="vertical" />          
          <h2 className="text-left text-lg font-semibold mb-4 px-3">Tria la teua llengua</h2>
            <Button className="mx-3 max-w-32 justify-self-end"
              variant={language === 'es' ? 'default' : 'outline'}
              onClick={() => setLanguage('es')}
            >
              Castellano
            </Button>
            <Separator orientation="vertical" />
            <Button className="mx-3 max-w-32"
              variant={language === 'va' ? 'default' : 'outline'}
              onClick={() => setLanguage('va')}
            >
              Valencià
            </Button>
        </div>
        <div className="space-y-1 ml-3 mr-3">
          <h4 className="text-sm font-medium leading-none">Datos personales</h4>
          <p className="text-sm text-muted-foreground">
            Información general sobre el alumno
          </p>
        </div>
        <Separator className="my-2" />
      <div className="flex space-x-4 mb-6"></div>
        <DynamicForm formSchema="GEN_personal_data"/>
      </div>
    </div>
  );
}