# maya-forms

Aplicación multiplataforma que genera la documentación administrativa requerida para el CEED.

La aplicación se puede ejecutar en Linux/MacOS/Windows y permite a los estudiantes generar correctamente los anexos o formularios que se solicitan para realizar trámites en el Centro Especifico de Educación a Distancia de la Comunidad Valenciana.

Además, en fases posteriores, se pretende que:
 * se pueda firmar eletrónicamente la documentación
 * la aplicación ayude a la creación de un fichero comprimido con el resto de documentación necesaria en cada trámite
 * que conecte con la plataforma de entrega o que realice el envio de manera automática

### Trámites soportados

**Ciclos Formativos**
 
  * Convalidaciones por estudios 
  * Convalidaciones por experiencia profesional reconocida

## Cómo empezar


### Requisitos

La aplicación está desarrollada en Tauri (Rust) utilizando React para el desarrollo del interfaz gráfico

  - Instalar Rust (>= 1.86)
  - Instalar node (>= 22). Recomendado [nvm](https://github.com/nvm-sh/nvm) en Linux/MacOS o [nvm for Windows](https://github.com/coreybutler/nvm-windows)
  - [Instalar dependencias Tauri](https://v2.tauri.app/es/start/prerequisites/)
  - Instalar Tauri

### Configuración de IDE recomendada

  - [VS Code](https://code.visualstudio.com/)
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### Primeros pasos

Instalar los paquetes necesarios

```yarn```

##  Plantillas

El core de maya_forms se encarga de la creación de formularios HTML con sus correspondientes validaciones que, una vez completados correctamente, generen documentos pdf. Cada uno de esos formularios se modela a través de lo que se denomina internamente _doc_template_ o plantilla de documento.

Cada uno de esos _doc_template_ están compuestos a su vez de _sections_ o secciones, lo que vendrían a ser bloques de formularios. Por ejemplo: datos personales, documentación aportada, etc

### doc_template

 1. Cada _doc_template_ es un fichero _json_.
 2. Su nombre se escribe en nomenclatura _snake_case_ con el formato XXXX_nombre_del_template. Donde:

    * _XXXXX_: es un nemotécnico que indique a qué estudio está referido.
    * _nombre_del_template_: es el noombre que se le asigna a la platilla.

      Ejemplo: _CF_studies_validation_
    
 3. Se almacenan en la carpeta _src-tauri/resources/doc_templates_.

 4. Su estructura es:

      - "id": cadena en MAYÚSCULAS con el formato: DOCTMPL_XXXX_ID_DEL_TEMPLATE, donde XXXX es el nmotécnico del tipo de estudio para el está dirigida e ID_DEL_TEMPLATE es el identificador elegido. Por ejemplo: _"DOCTMPL_CF_STUDIES_VALIDATION"_.

      - "version": número entero que indica la versión de la plantillla. Por ejemplo: _1_.

      - "title": cadena que permite al ser humano entender cual es el formulario. Por ejemplo: _"Convalidaciones por estudios"_,

      - "description": cadena que proporciona información detallada sobre el formulario. Será mostrada como ayuda para los usuarios finales. Por ejemplo: _"Formulario para solicitar convalidaciones por estudios, no por experiencia profesional."_,

      - "study_type": nmotécnico del tipo de estudio para el está dirigida la plantilla. Por ejemplo: _"CF"_.

      - "sections_ids": array de todas las secciones que incluye el _doc_template_. Cada una de ella es un objeto con la siguiente estructura:
  
        * "id": Identificador de la sección. Por ejemplo: _"PERSONAL_DATA"_.
        * "style": forma en la que se va a mostrar la sección. Hay dos posibilidades:
          1. "FIXED": modo fijo. Siempre visible.
          2. "ACC": modo acordeon. Se puede mostrar u ocultar pinchando en el título de al sección.

        Por ejemplo: 
        ```
        "sections_ids": [ {
            "id": "PERSONAL_DATA",
            "style": "FIXED"
          }
        ]
        ```

      > NOTA: El orden de las secciones en el _doc_template_ será el orden en el que estás se mostrarán en el formulario.

### section

 1. Cada _section_ es un fichero _json_.

 2. Su nombre se escribe en nomenclatura _snake_case_ indicando simplemente el nombre_del_template. Por ejemplo: _personal_data_
    
 3. Se almacenan en la carpeta _src-tauri/resources/doc_templates/sections_.

 4. Su estructura es:

     - "id": cadena en MAYÚSCULAS con el formato: SEC_ID_DEL_TEMPLATE, donde ID_DEL_TEMPLATE es el identificador elegido. Por ejemplo: _"SEC_PERSONAL_DATA"_.
     
     - "title": cadena que indica el título de la sección. Se utilizará para ser renderizada como cabecera de la misma. Por ejemplo: _"Datos personales"_.
     
     - "subtitle": cadena que indica el subtítulo de la sección. Se utilizará_ para ser renderizada como subcabecera de la misma. Por ejemplo: _"Información general sobre el alumno/a"_

     - "layout": cadena con el _css grid areas template_. Indica, mediante el uso de areas  las distribución de los control. Cada fila va entercomillada con comillas simples y se separa del resto de filas con comas. Por ejemplo:  _"'name surname surname nia dni', 'address address address email phone', 'region city city city cp'"_

     - "controls": array de todos los controles que incluye la _section_. El orden de los controles no es relevante ya que su posicionamiento viene definido por el layout.
 

## Anexo I. Tipos de estudios

Nmotécnicos por estudios

  * GEN: general, todos los estudios
  * CF: Ciclo Formativo
  * BCH: Bachillerato

