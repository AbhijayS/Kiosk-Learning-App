const { ipcRenderer } = require('electron')

var word = ipcRenderer.sendSync('synchronous-load-word')
document.getElementById("imageID").src = word.path
document.getElementById('inputID').setAttribute('maxlength', word.word.length)

// implement countdown timer to reset if stuck

document.getElementById("inputID").addEventListener('change', (event) => {
    if (event.target.value.toLowerCase() == word.word.toLowerCase()) {
        ipcRenderer.send('synchronous-mastery');
    } else {
        ipcRenderer.send('synchronous-failed');
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

speakWord()