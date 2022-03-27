/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// camelCase for identifier names (variables and functions)

// global const
var clueHoldTime = 1000; // hold each clue's light/sound for 0.8 second
const cluePauseTime = 300; //how long to pause in between clues
const nextSeqWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var waitTime = 0;
// global var
const pattern = [];
var numOfRounds = 7;
var progress = 0; // 0~7
var gamePlaying = false;
var tonePlaying = false;

var timerOn = false;

var volume = 0.5; // btw 0 and 1
var guessCount = 0; // how many guesses user has made so far
var mistakeCount = 0;
const maxMistakeCount = 3;
const maxTime = 5;
let timeLeft = maxTime; 


const progressBarWidth = 10; 
const bgm = document.querySelector("audio");
bgm.volume = 0.2;

const timer = document.querySelector("#timer>#clock");
const rabbit = document.querySelector("#timer>#timerProgress");

// document object refers to the current web page
// and can be accessed to make changes to the page content.

let setPattern = (len) => {
  // push `len` random numbers in range 1-4
  pattern.splice(0, pattern.length);
  for (var i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * 4 + 1);
    pattern.push(rand);
  }
  console.log("pattern[" + pattern.length + "] = " + pattern);
};

let startGame = () => {
  bgm.play();
  progress = 0;
  gamePlaying = true;
  mistakeCount = 0;
  clueHoldTime = 1000;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("instructionTxt").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("startTxt").classList.remove("hidden");

  timer.innerHTML = formatTimer(maxTime);
  rabbit.style.width = progressBarWidth + "%";
  
  setPattern(numOfRounds);
  // timerOn = true; 
  playClueSequence();
};

// let setNumberOfRounds = (num) => {
//   console.log("num: " + num);
//   numOfRounds = num;
// };

function stopGame() {
  bgm.pause();
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startTxt").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("instructionTxt").classList.remove("hidden");
  
  // timerOn = false; 
  
  console.log("timeLeft = " + timeLeft);
  
  if (timeLeft < maxTime){
    console.log("clear timer now");
    stopTimer();
  } else{
    console.log("clear timer in " + cluePauseTime);
    setTimeout(()=>{
      stopTimer();
      timer.innerHTML = formatTimer(maxTime);
      rabbit.style.width = progressBarWidth + "%";
    }, cluePauseTime);
  }
  
  
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
    console.log("clue " + btn + " is on for " + clueHoldTime);
    changeLightBtn(btn);
    setTimeout(changeLightBtn, clueHoldTime, btn);
  }
};

let playClueSequence = () => {
  guessCount = 0; // reset so that user guess from the start
  context.resume();
  waitTime = nextSeqWaitTime; //set delay to initial wait time
  disableBtns();
  

  for (var i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + waitTime + " ms");
    setTimeout(playSingleClue, waitTime, pattern[i]); // wait 1s before first clue
    waitTime += cluePauseTime + clueHoldTime;
  }
  
  // start timer
  console.log("start timer in " + waitTime);
  timer.innerHTML = formatTimer(maxTime);
  rabbit.style.width = progressBarWidth + "%";
  setTimeout(startTimer, waitTime);
  setTimeout(enableBtns, waitTime);
  
  
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
      stopTimer();
      
      // progress reach end of pattern: win game
      if (progress == pattern.length - 1) {
        winGame();
      }
      // else, progress in middle of pattern: check for a longer sequence
      else {
        progress++;
        clueHoldTime -= 100; // speed up for next sequence
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
    stopTimer();
    
    if (mistakeCount < maxMistakeCount) {
      mistakeCount++;
      maxMistakeCount === mistakeCount
        ? alert("Last chance!")
        : alert(maxMistakeCount - mistakeCount + " more chances left.");
      console.log("mistake " + mistakeCount);
      playClueSequence(); // replay
      
    } else {
      console.log("mistake " + mistakeCount);
      loseGame();
    }
  }
};

let loseGame = () => {
  alert("You lost. Try again.");
  stopGame();
};

let winGame = () => {
  alert("Congrats, you won!");
  stopGame();
};

// rabbit.style.marginLeft = "10%";
var setTimer = null;
console.log("rabbit padding right" + rabbit.style.paddingRight);

timer.innerHTML = formatTimer(maxTime);
rabbit.style.width = progressBarWidth + "%";

let startTimer = () => {
  // timer.innerHTML = second + "";
  timeLeft = maxTime;
  let width = progressBarWidth;
  const rabbitIntervel = 90 / maxTime;
  
  // initial position
  timer.innerHTML = formatTimer(maxTime);
  rabbit.style.width = width + "%";

  setTimer = setInterval(() => {
    timer.innerHTML = formatTimer(--timeLeft);
    width += rabbitIntervel;
    rabbit.style.width = width + "%";
    
    if (timeLeft == "0") {
      stopTimer();
      
      setTimeout(()=>{
        if (mistakeCount < maxMistakeCount) {
          mistakeCount++;
          maxMistakeCount === mistakeCount
            ? alert("Time out. Last chance!")
            : alert("Time out. " + (maxMistakeCount - mistakeCount) + " more chances left.");
          console.log("mistake " + mistakeCount);
          playClueSequence(); // replay
        } else {
          console.log("mistake " + mistakeCount);
          loseGame();
        }
      }, 500);
      
    }
  }, 1000);
};

function formatTimer(timeLeft) {
  console.log(timeLeft);
  if (timeLeft < 10) {
    timeLeft = `0${timeLeft}`;
  }
  return `0:${timeLeft}`;
}

let stopTimer = () => {
  clearInterval(setTimer);
  
};


function disableBtns(){
  let gameBtns = document.querySelectorAll("button");
  gameBtns.forEach((btn)=>{btn.disabled=true;})
}

function enableBtns(){
  let gameBtns = document.querySelectorAll("button");
  gameBtns.forEach((btn)=>{btn.disabled=false;})
}