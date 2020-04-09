const { ipcRenderer } = require('electron')

var word = ipcRenderer.sendSync('synchronous-load-word')
document.getElementById("imageID").src = word.path

// implement countdown timer to reset if stuck

document.getElementById("inputID").addEventListener('change', (event) => {
    if (event.target.value.toLowerCase() == word.word.toLowerCase()) {
        ipcRenderer.send('synchronous-mastery');
    } else {
        ipcRenderer.send('synchronous-failed');
    }
})