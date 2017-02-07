const { app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')
const windows = new Set()

const createWindow = exports.createWindow = (file) => {
  let newWindow = new BrowserWindow({ show: false });
  windows.add(newWindow)

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    if (file) openFile(newWindow, file)
    newWindow.show();
  });

  newWindow.on('close', (event) => {
    if(newWindow.isDocumentEdited()) {
      const result = dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'You have unsaved changes. Are you sure you want to quit?',
        buttons: [
          'Quit Anyway',
          'Cancel'
        ],
        defaultId: 0,
        cancelId: 1
      })

      if(result === 0) newWindow.destroy()
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow)
    newWindow = null
  });

  return newWindow
}


const openFile = exports.openFile = (targetWindow) => {
  let files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
    ]
  })

  if (!files) { return }

  let file = files[0]
  let content = fs.readFileSync(file).toString()

  targetWindow.webContents.send('file-opened', file, content)
}

const saveFile = exports.saveFile = (targetWindow, content) => {
  let fileName = dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML Output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!fileName) { return }

  fs.writeFileSync(fileName, content)
};

app.on('ready', function () {
  console.log('The application is ready.')
  createWindow()
})
