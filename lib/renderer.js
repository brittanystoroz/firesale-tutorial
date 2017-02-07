const { ipcRenderer, app, remote } = require('electron')
const $ = require('jquery')
const marked = require('marked')
const { createWindow, saveFile, openFile} = remote.require('./main')
const currentWindow = remote.getCurrentWindow()
const clipboard = remote.clipboard

const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $newFileButton = $('#new-file')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')
const $saveMarkdownButton = $('#save-markdown')
const $revertButton = $('#revert')

let filePath = null
let originalContent = ''

$newFileButton.on('click', () => {
  createWindow();
});

$openFileButton.on('click', () => {
  openFile(currentWindow)
})

$copyHtmlButton.on('click', () => {
  var html = $htmlView.html()
  clipboard.writeText(html)
})

$saveFileButton.on('click', () => {
  var html = $htmlView.html()
  saveFile(currentWindow, html)
})

$saveMarkdownButton.on('click', () => {
  var html = $htmlView.html()
  saveFile(currentWindow, html)
})

$revertButton.on('click', () => {
  $markdownView.text(originalContent)
  renderMarkdownToHtml(originalContent)
  updateEditedState(false);
});


ipcRenderer.on('file-opened', function (event, file, content) {
  filePath = file
  originalContent = content

  updateEditedState(false)

  $markdownView.text(content)
  renderMarkdownToHtml(content)
})

$markdownView.on('keyup', function () {
  var content = $(this).val()
  renderMarkdownToHtml(content)
  updateEditedState(content !== originalContent)
})

const renderMarkdownToHtml = (markdown) => {
  var html = marked(markdown)
  $htmlView.html(html)
}

const updateEditedState = (isEdited) => {
  $saveMarkdownButton.attr('disabled', !isEdited)
  $revertButton.attr('disabled', !isEdited)

  currentWindow.setDocumentEdited(isEdited)

  let title = 'Fire Sale'
  if(filePath) {
     title = `${filePath} - ${title}`
  }
  if(isEdited) {
    title = `${title} (Edit)`
  }
  currentWindow.setTitle(title)
}
