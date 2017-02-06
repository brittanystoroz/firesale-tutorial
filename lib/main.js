const { app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')

let mainWindow = null

app.on('ready', function () {
  console.log('The application is ready.')

  mainWindow = new BrowserWindow()

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })
})

const openFile = () => {
  let files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
    ]
  })

  if (!files) { return }

  let file = files[0]
  let content = fs.readFileSync(file).toString()

  mainWindow.webContents.send('file-opened', file, content)
}

const saveFile = (content) => {
  let fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save HTML Output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!fileName) { return }

  fs.writeFileSync(fileName, content)
};

exports.openFile = openFile
exports.saveFile = saveFile;
