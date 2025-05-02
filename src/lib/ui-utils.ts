// Utilidades para la gestión de los controles de los formularios

///// CONTROL ACTIVO/DESACTIVO /////

interface Condition {
  control_id: string
  operator: string    // admite equals, notEquals, empty, notEmpty
  value: string
}

// Indica si el control tiene o que estar desactivado en función de 
// los valores de otros controles.
// IMPORTANTE: Es posible aplicar condiciones and u or, pero no and y or juntas
// Parametros
//   disableIf: bloque disableIf del JSON
//   getValues: función para obtener el valor de los controles indicados en la condición
// Retorno
//   True si está desactivo o False en caso contrario
export function isDisabled(
  disabledIf: any,
  getValues: (field: string) => any
): boolean {
  if (!disabledIf) return false // no hay bloque disableIf

  if (Array.isArray(disabledIf)) {
    // Lógica AND por defecto
    return disabledIf.every((cond) => evaluateCondition(cond, getValues));
  } else if (disabledIf.logic === 'OR') {
    return disabledIf.conditions.some((cond: Condition) =>
      evaluateCondition(cond, getValues)
    );
  } else if (disabledIf.logic === 'AND') {
    return disabledIf.conditions.every((cond: Condition) =>
      evaluateCondition(cond, getValues)
    );
  }

  return false;
}

// Evalúa cada una de las condiciones de un if, por ejemplo disableIf
// Operadores soportados: 
//    igual '=', distinto '!=', vacio '0', no vacio , '!0'
// Parámetros
//   condition: condición (control_id/operator/value ) a ser evaluada 
//   getValues: función para obtener el valor de los controles indicados en la condición
// Retorno
//   True si se cumple al condicón o False en caso contrario
function evaluateCondition(
  condition: Condition,
  getValues: (field: string) => any
): boolean {
  const fieldValue = getValues(condition.control_id);
  switch (condition.operator) {
    case '=':  // equals
      return fieldValue === condition.value;
    case '!=': // not equals
      return fieldValue !== condition.value;
    case '0':  // empty
      return !fieldValue;
    case '!0': // not empty
      return !!fieldValue;
    default:
      return false;
  }
}
