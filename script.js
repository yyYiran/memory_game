/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// camelCase for identifier names (variables and functions)

// global const
var clueHoldTime = 1000; // hold each clue's light/sound for 0.8 second
const cluePauseTime = 300; //how long to pause in between clues
const nextSeqWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// global var
const pattern = [];
var numOfRounds = 3; 
var progress = 0; // 0~7
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; // btw 0 and 1
var guessCount = 0; // how many guesses user has made so far
var mistakeCount = 0; 
const maxMistakeCount = Math.ceil(pattern.length * 0.3) + 1; 

// document object refers to the current web page
// and can be accessed to make changes to the page content.

let setPattern = (len) => {
  // push `len` random numbers in range 1-4
  pattern.splice(0, pattern.length)
  for (var i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * 4 + 1);
    pattern.push(rand);
  }
  console.log("pattern[" + pattern.length + "] = " + pattern);
};

let startGame = () => {
  progress = 0;
  gamePlaying = true;
  mistakeCount = 0; 
  clueHoldTime = 1000; 
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("instructionTxt").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("startTxt").classList.remove("hidden");
  
  setPattern(numOfRounds)
  playClueSequence();
};

let setNumberOfRounds = (num)=>{
  console.log("num: " + num)
  numOfRounds = num; 
}


let testsetTimeout = () => {
  // changeLightBtn(1)

  // when use writeln, although a newline char is added,
  // whitespace is converted to a single space when rendering HTML
  // use <br> instead
  setTimeout(() => {
    document.write("1st msg<br>");
  }, 5000);
  setTimeout(() => {
    document.write("2nd msg<br>");
  }, 3000);
  setTimeout(
    (msg) => {
      document.write(msg + "<br>");
    },
    1000,
    "3rd!"
  );
};

function stopGame() {
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startTxt").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("instructionTxt").classList.remove("hidden");
}

// function hello(){
//   alert("hello!");
// }

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
context.resume();

// Create source
var o = context.createOscillator();

// Create effect node
var g = context.createGain();

// Connect effect node to final destimation
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);

// Connect source to effect node
o.connect(g);

// Start source
o.start(0);

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
};

/* Play a tone corresp to a button number (1 through 4) 
    for a length of time in milliseconds (1000 milliseconds = 1 second)*/
function playTone(btn, len) {
  // tell source which tone to play
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);

  // play for how long
  context.resume();
  tonePlaying = true;
  // setTimeout is an asynchronouns func
  // len here is delay: time in ms that the timer should wait before the specified function or code is executed
  setTimeout(() => {
    stopTone();
  }, len); // executes function until time expires
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();

    // tell source which tone to play
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025); // increase gradually to target value

    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.25); // volume decrease gradually to 0 余音绕梁
  tonePlaying = false;
}

// document.getElementById("btn1").addEventListener("mouseup", startTone(1));
// document.getElementById("btn1").addEventListener("mousedown", stopTone());

let changeLightBtn = (btn) =>
  document.getElementById("btn" + btn).classList.toggle("lit");

let playSingleClue = (btn) => {
  if (gamePlaying) {
    // light up and play sound of btn for 'clueHoldTime'
    playTone(btn, clueHoldTime);
    console.log("clue " + btn + " is on for " + clueHoldTime)
    changeLightBtn(btn);
    setTimeout(changeLightBtn, clueHoldTime, btn);
  }
};

let playClueSequence = () => {
  guessCount = 0; // reset so that user guess from the start
  context.resume();
  var waitTime = nextSeqWaitTime; //set delay to initial wait time

  for (var i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + waitTime + " ms");
    setTimeout(playSingleClue, waitTime, pattern[i]); // wait 1s before first clue
    waitTime += cluePauseTime + clueHoldTime;
  }
};

let guess = (btn) => {
  console.log("user guessed: " + btn);
  console.log("guessCount/progress = " + guessCount + "/" + progress);
  // if not even playing, ignore guess
  if (!gamePlaying) return;

  // if made correct guess: ith guess == pattern[i]
  if (btn == pattern[guessCount]) {
    // reach end of progress
    if (guessCount == progress) {
      // progress reach end of pattern: win game
      if (progress == pattern.length - 1) {
        winGame();
      }
      // else, progress in middle of pattern: check for a longer sequence
      else {
        progress++;
        clueHoldTime -= 100; // speed up
        playClueSequence();
      }
    }
    // else, in the middle of progress: check next guess
    else {
      guessCount++;
    }
  }
  // incorrect guess: lose game
  else {
    if (mistakeCount < maxMistakeCount){
      alert((maxMistakeCount - mistakeCount) + " more try!")
      console.log("mistake")
      playClueSequence(); // replay
      mistakeCount++; 
    } else{
      console.log(maxMistakeCount)
      loseGame();
    }
  }
};

let loseGame = () => {
  alert("Oops");
  stopGame();
};

let winGame = () => {
  alert("Congrats, you won the game!");
  stopGame();
};
