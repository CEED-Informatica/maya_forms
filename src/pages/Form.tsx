// React router dom
import { useParams } from "react-router-dom"

// Componentes
import DynamicForm from "@/components/dynamic-form";


export default function Form() {
  
  const { study_abbr, procedure_type } = useParams<{ study_abbr: string, procedure_type: string }>()

  return  (
    <div className="p-6">
      <DynamicForm formId={`${study_abbr?.toUpperCase()}_${procedure_type?.toLowerCase()}`}/>
    </div>
  );
}