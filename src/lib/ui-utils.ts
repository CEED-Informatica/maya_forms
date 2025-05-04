// Utilidades para la gestión de los controles de los formularios

// Modelos
import { Condition, DisabledIf, FilterCondition, ComboOptions } from "@/lib/data-models"

// React hook form
import { useWatch, Control } from "react-hook-form";

///// CONTROL ACTIVO/DESACTIVO /////

// Hook que indica si el control tiene o que estar desactivado en función de 
// los valores de otros controles.
// IMPORTANTE: Es posible aplicar condiciones and u or, pero no and y or juntas
// Parámetros
//   disableIf: bloque disableIf del JSON
//   control: control obtenido desde useForm. Es opcional con el uso de FormProvider
// Retorno
//   True si está desactivo o False en caso contrario
export function useIsDisabled(
  disabledIf: DisabledIf,
  control?: Control  
): boolean {
  if (!disabledIf) return false // no hay bloque disableIf

  // obtengo las condiciones en función de como estén definidas en el JSON
  const conditions: Condition[] = Array.isArray(disabledIf) 
    ? disabledIf
    : disabledIf.conditions;

  // obtengo el tipo de lógica a aplicar
  const logic = Array.isArray(disabledIf) ? "AND" : disabledIf.logic?.toUpperCase() || "AND"
  
  // controles sobre los que se hacen las condiciones, los que hay que vigilar
  const controlNames = conditions.map((cond) => cond.control_id);

  // array de valores de los controles, ordenados por controlNames
  const watchedValuesArray = useWatch({ control, name: controlNames })

  // lo convierto de array a coleccion de pares control_id, valor
  const watchedValues: Record<string, any> = {};
    controlNames.forEach((field, index) => {
      watchedValues[field] = watchedValuesArray[index];
  });
  
  const results = conditions.map((condition) => evaluateCondition(condition,  watchedValues))
  
  return logic === "OR" ? results.some(Boolean) : results.every(Boolean)
}

// Evalúa cada una de las condiciones de un if, por ejemplo disableIf
// Operadores soportados: 
//    igual '=', distinto '!=', vacio '0', no vacio , '!0'
// Parámetros
//   condition: condición (control_id/operator/value ) a ser evaluada 
//   values: objeto con los valores actuales del formulario
// Retorno
//   True si se cumple al condicón o False en caso contrario
function evaluateCondition(
  condition: Condition,
  values: Record<string, any>  
): boolean {
  const controlValue = values[condition.control_id];

  switch (condition.operator) {
    case '=':  // equals
      return controlValue === condition.value;
    case '!=': // not equals
      return controlValue !== condition.value;
    case '0':  // empty
      return !controlValue;
    case '!0': // not empty
      return !!controlValue;
    default:
      return false;
  }
}


///// FILTRADO DE OPCIONES /////

// Hook que devuelve las opciones filtradas en función del valor de otro control.
// En el caso de un combo el valor que se utiliza para comparar es el value, no el texto de la etiqueta
// Parámetros
//   filter: bloque filter del JSON
//   control: control obtenido desde useForm. Es opcional con el uso de FormProvider
// Retorno
//   Las opciones filtradas. Si el parametro de filtro no existe en la opción, no debe devolverla
export function useFilteredOptions(
  options: ComboOptions[],
  filter: FilterCondition | undefined,
  control?: Control  
): ComboOptions[] {
  if (!filter) return options;  // no hay bloque filter

  const watchedValue = useWatch({ control, name: filter.control_id });

  return options.filter(
    (option) => filter.optionField in option && option[filter.optionField] === watchedValue
  );
}
