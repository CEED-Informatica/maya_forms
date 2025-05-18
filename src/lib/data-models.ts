
// Perfil de un usuario
export interface Profile {
  nia: string
  name: string
  surname: string
}

export interface Studies {
  GENERAL_INFO: 
    { 
      abbr: string 
      name: string 
      help: string | null
      color: string
      icon: string | null
    },
  PROCEDURES: 
    { 
      type: string 
      info: {
        name: string

      }
    }
}