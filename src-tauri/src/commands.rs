// definimos los comandos que vamos a ejecutar desde el Frontend
use tauri::Manager;

#[tauri::command]
pub fn close_splash_and_open_main(app_handle: tauri::AppHandle) {
    let main_window = app_handle.get_webview_window("main").unwrap();
    let splash_window = app_handle.get_webview_window("splash").unwrap();

    main_window.show().unwrap();
    splash_window.close().unwrap();
}
