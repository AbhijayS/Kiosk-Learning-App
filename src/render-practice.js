`use strict`

window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')
const { ipcRenderer } = require('electron')

var word = ipcRenderer.sendSync('synchronous-load-word')
document.getElementById("wordID").innerHTML = word.word.toUpperCase()
document.getElementById("imageID").src = word.path

$("#inputID").on("change keyup paste click", function(){
    console.log(typeof $(this).val());
    if($(this).val().toLowerCase() == word.word.toLowerCase()) {
        ipcRenderer.sendSync('synchronous-correct')
    }
})