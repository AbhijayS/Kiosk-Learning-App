`use strict`

window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')
const { ipcRenderer, remote } = require('electron')

const attempts = remote.getGlobal('attempts')
const $inputRow = $(`
    <div class="input-group input-group-lg px-5 mb-3">
        <input type="text" class="form-control input-class" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
    </div>
`);
$inputRow.find(':input')
$('#playground-id').append($inputRow.prop('outerHTML'));
for (let index = 1; index < attempts; index++) {
    $('#playground-id').append($inputRow.prop('outerHTML'));
}

var word = ipcRenderer.sendSync('synchronous-load-word')
document.getElementById("wordID").innerHTML = word.word.toUpperCase()
$("#imageID").attr('src', word.path)
$('.input-class').attr('maxlength', word.word.length)

$(".input-class").on("change keyup paste click", function(){
    console.log(typeof $(this).val());
    if($(this).val().toLowerCase() == word.word.toLowerCase()) {
        ipcRenderer.sendSync('synchronous-correct')
    }
})