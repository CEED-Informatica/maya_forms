// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
/* #[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
} */
use tauri::Manager;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
        #[cfg(debug_assertions)] // only include this code on debug builds
        {
            let splash = app.get_webview_window("splash").unwrap();
            let window = app.get_webview_window("main").unwrap();

            window.open_devtools();

            tauri::async_runtime::spawn(async move {
                std::thread::sleep(std::time::Duration::from_secs(2));
                splash.close().ok();
                window.show().ok();
              });
            
        }
        Ok(())
    })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
