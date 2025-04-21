/* definimos los comandos que vamos a ejecutar desde el Frontend */

#[tauri::command]
pub fn greet(name: &str) -> String {
  println!("Hola {}", name);
  format!("Hello, {}! You've been greeted from Rust!", name)
}