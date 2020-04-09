const { app, BrowserWindow, ipcMain,globalShortcut } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

var mainWindow = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    fullscreen: true,
    autoHideMenuBar: true,
    kiosk: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'practice.html'));

  globalShortcut.register('Escape', () => {
    app.quit();
  })

  mainWindow.on('closed', () => {
      win = null
  })

  mainWindow.on('close', event => {
      event.preventDefault() // stop the browser window from being closed
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', event => {
  event.preventDefault() // prevent the process from ending
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const allWords = [
  {
    "word": "blippi",
    "path": path.join(__dirname, 'blippi.jpg'),
    "score":0
  },
  {
    "word": "car",
    "path": path.join(__dirname, 'car.jpg'),
    "score":0
  },
  {
    "word": "bike",
    "path": path.join(__dirname, 'bike.webp'),
    "score":0
  },
  {
    "word": "smell",
    "path": path.join(__dirname, 'smell.jpg'),
    "score":0
  },
  {
    "word": "game",
    "path": path.join(__dirname, 'game.jpg'),
    "score":0
  },
]

var wordIndex = 0
var minScore = 5
var timeout = 5*60*1000;

// get the next word in the sequence
ipcMain.on('synchronous-load-word', (event) => {
  event.returnValue = allWords[wordIndex]
})

// update word score
ipcMain.on('synchronous-correct', (event) => {
  allWords[wordIndex].score += 1;
  if (allWords[wordIndex].score == minScore) {
    mainWindow.loadFile(path.join(__dirname, 'quizz.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, 'practice.html'));
  }
})

// passed the quizz
ipcMain.on('synchronous-mastery', (event) => {
  wordIndex = (wordIndex+1)%allWords.length
  if (wordIndex == 0) {
    allWords.forEach((value, index, thisArray) => {
      thisArray[index].score = 0;
    })
  }
  mainWindow.loadURL("https://poki.com/en/g/moto-x3m");
  setTimeout(() => {
    mainWindow.loadFile(path.join(__dirname, 'practice.html'));
  }, timeout)
})

// failed the quizz
ipcMain.on('synchronous-failed', (event) => {
  allWords[wordIndex].score = 0;
  mainWindow.loadFile(path.join(__dirname, 'practice.html'));
})