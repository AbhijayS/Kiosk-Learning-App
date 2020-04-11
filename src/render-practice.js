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

for (let index = 0; index < attempts; index++) {
    $('#playground-id').append($inputRow.prop('outerHTML'));
}

var completed = 0;

var updateInputForm = function() {
    for(let i = 0; i < attempts; i++) {
        if (i == completed) {
            $($('.input-class')[i]).prop('disabled', false);
            $('.input-class')[i].focus();
        } else {
            $($('.input-class')[i]).prop('disabled', true);
        }
    }
}

updateInputForm();

const word = ipcRenderer.sendSync('synchronous-load-word')
document.getElementById("wordID").innerHTML = word.word.toUpperCase()
$("#imageID").attr('src', word.path)
$('.input-class').attr('maxlength', word.word.length)

$(".input-class").on("keyup", function() {
    console.log(typeof $(this).val());
    if($(this).val().toLowerCase() == word.word.toLowerCase()) {
        $(this).addClass('bg-success text-white border border-light');
        completed++;
        updateInputForm();
        if (completed == attempts) {
            $('.input-class').off();
            ipcRenderer.send('synchronous-practice-complete');
        } else {
            speakWord()
        }
    }
})

var speakWord = function() {
    var synth = window.speechSynthesis;
    var utter = new SpeechSynthesisUtterance(word.word);
    utter.voice = synth.getVoices()[0];
    utter.rate = 0.5;
    utter.pitch = 2;
    synth.speak(utter);
}

speakWord();