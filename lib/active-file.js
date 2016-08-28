const { app, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

class ActiveFile {

  constructor(browserWindow, filePath = null) {
    this.browserWindow = browserWindow;
    this.open(filePath);

    ipcMain.on('file-change', (event, content) => {
      this.content = content;
      this.updateWindowTitle();
    });
  }

  get fileName() {
    return path.basename(this.filePath);
  }

  get fileDirectory() {
    return path.dirname(this.filePath);
  }

  open(filePath) {
    let content = '';
    if (filePath) {
      app.addRecentDocument(filePath);
      content = fs.readFileSync(filePath).toString();
    }

    this.filePath = filePath || null;
    this.content = content;
    this.updateUserInterface();
  }

  saveMarkdown() {
    if (!this.filePath) {
      this.filePath = dialog.showSaveDialog(this.browserWindow, {
        title: 'Save Markdown',
        defaultPath: app.getfilePath('documents'),
        filters: [
          { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
      });
    }

    this.save(this.content, this.filePath);
  }

  save(content, filePath = this.filePath) {
    fs.writeFileSync(filePath, this.content);
    this.updateWindowTitle();
  }

  revert() {
    this.updateContent(this.originalContent);
  }

  reload() {
    this.open(this.filePath);
  }

  updateContent(content) {
    this.content = content;
    this.updateUserInterface();
    return this;
  }

  updateWindowTitle() {
    let title = 'Firesale';

    if (this.filePath) {
      title = `${this.fileName} - ${title}`;
      this.browserWindow.setRepresentedFilename(this.filePath);
    }

    this.browserWindow.setTitle(title);

    return this;
  }

  updateUserInterface() {
    this.browserWindow.webContents.send('file-change', this);
    this.updateWindowTitle();
    return this;
  }
}

module.exports = ActiveFile;
