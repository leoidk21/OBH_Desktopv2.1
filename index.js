const { app, BrowserWindow } = require('electron')
const path = require('path')

let win

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    background: '#f5f5f5',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'src/preload.js')
    }
  })

  win.loadFile('src/renderer/Pages/Auth/LoginPage.html')

  win.webContents.openDevTools();

  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow)

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


// Re-create a window when the app is activated (macOS behavior)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
