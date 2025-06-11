// Utilidades para la gestión de los controles de los formularios

// Modelos
import { Condition, DisabledIf, FilterCondition, ComboOptions } from "@/lib/component-models"

// React hook form
import { useWatch, Control } from "react-hook-form";

// componentes maya forms ui
import MFCombo from "@/components/mfui/mf-combo"
import MFEdit from "@/components/mfui/mf-edit"
import MFCheckGroup from "@/components/mfui/mf-checkgroup"
import MFRepetableControlContainer from "@/components/mfui/control-container/mf-repetable-control-container"

// Mapea nombres de tipo a componentes
const controlComponentMap: Record<string, React.ComponentType<any>> = {
  Edit: MFEdit,
  Combo: MFCombo,
  CheckGroup: MFCheckGroup,
  RepetableControlContainer: MFRepetableControlContainer,
};

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
//   filters: bloque filters del JSON
//   control: control obtenido desde useForm. Es opcional con el uso de FormProvider
// Retorno
//   Las opciones filtradas. Si el parametro de filtro no existe en la opción, no debe devolverla
export function useFilteredOptions(
  options: ComboOptions[],
  filters: FilterCondition[] | undefined,
  control?: Control  
): ComboOptions[] {
  if (!filters || !filters.length ) return options;  // no hay bloque filter

  // observo todos los valores de los controles implicados
  const watchedValues = useWatch({ control, name: filters.map((f) => f.control_id) })

  return options.filter(
    (option) => filters.every((filter, index) => {
      const watchedValue = watchedValues?.[index]
      return (
        filter.optionField in option &&
        option[filter.optionField] === watchedValue
      )
    })
  );
}
// Convierte el formato de layout que llega desdel JSON en formato CSS
export function adaptLayout(layout: string) : string {
  return layout.replaceAll(',',' ')
}

// Renderiza el componente según el tipo
export function renderControl(control: any, methods: any): JSX.Element {
  const type = control?.control_type ? Object.keys(control.control_type)[0] : null;

  if (!type || !controlComponentMap[type]) {
    return <h2 key={control?.id}>Control no soportado</h2>
  }

  const Component = controlComponentMap[type];
  return <Component key={control.id} control={control} methods={methods} />
}


/* 
export function renderControl(control: any, methods: any) {

  switch (Object.keys(control.control_type)[0]) {
    case 'Edit':
      return (<MFEdit control={control} methods={methods} key={control.id}/>)
       
    case 'Combo':
      return (<MFCombo control={control} methods={methods} key={control.id}/>)

    case 'CheckGroup':
      return (<MFCheckGroup control={control} methods={methods} key={control.id}/>)

    case 'RepetableControlContainer':
        return (<MFRepetableControlContainer control={control} methods={methods} key={control.id}/>)

    default:
      return (<h1>Control no soportado</h1>)  // TODO 
  }  
}
 */