// Definición de los modelos /tipos de datos

// ReglasZod  de validación personalizadas
export interface CustomZodRules {
  condition: string
  path: string
  message: string
  code: string
}

// opciones de un combo
export interface ComboOptions {
  value: string
  label: string
  [propName: string]: string | number; // son opcionales
} 

// Condición atómíca
export interface Condition {
  control_id: string
  operator: "=" | "!=" | "0" | "!0"     
  value?: any   // puedes no estar o sí y en ese caso ser de varios tipos (por ejemplo string o number)
}

// Bloque JSON para indicar las condiciones por las que un control está activo o no
export interface DisabledIf {
  logic?: "AND" | "OR"      // o todas las condiciones se anidan con un and o con un or
  conditions: Condition[]
}

// Condición de filtrado de opciones para Combos
export interface FilterCondition {
  control_id: string;       // Control del formulario a observar 
  optionField: string;      // Campo de la opción a comparar 
}

// Control (componente gráfico del formulario)
export interface Control {
  id: string
  label: string
  caption: string
  area: string
  control_type: any
  validation: any
  disableIf?: DisabledIf
  filter?: FilterCondition
}

// Sección. Partes de un formulario
export interface Section {
  id: string
  title: string
  subtitle: string
  layout: string
  controls: Control[]
}


// Campo sección de un doc_template
export interface FieldSection {
  id: string
  style: string
}

export interface DocTemplate {
  sections_ids: FieldSection[];
}