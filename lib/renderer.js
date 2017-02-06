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

ipcRenderer.on('file-opened', function (event, file, content) {
  $markdownView.text(content)
  renderMarkdownToHtml(content)
})

$markdownView.on('keyup', function () {
  var content = $(this).val()
  renderMarkdownToHtml(content)
})

const renderMarkdownToHtml = (markdown) => {
  var html = marked(markdown)
  $htmlView.html(html)
}
