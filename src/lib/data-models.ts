// Definición de los modelos /tipos de datos

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
