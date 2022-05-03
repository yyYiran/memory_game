# Light and Sound Memory Game

**Memory Game** is a Light & Sound Memory game to apply for CodePath's SITE Program. 

Computer randomly generates a sequence of 7 clues known as a pattern. There are 4 buttons, each represents a clue with a unique image and sound. At the nth round, users need to play back the first n clues in correct order within 5 seconds to pass. Users win if they pass 7 rounds. 

Submitted by: **Yiran Wan**

Time spent: **7** hours spent in total

Link to project: (https://kindly-pebble-nitrogen.glitch.me/)

## Required Functionality

The following **required** functionality is complete:

* [x] Game interface has a heading (h1 tag), a line of body text (p tag), and four buttons that match the demo app
* [x] "Start" button toggles between "Start" and "Stop" when clicked. 
* [x] Game buttons each light up and play a sound when clicked. 
* [x] Computer plays back sequence of clues including sound and visual cue for each button
* [x] Play progresses to the next turn (the user gets the next step in the pattern) after a correct guess. 
* [x] User wins the game after guessing a complete pattern
* [x] User loses the game after an incorrect guess

The following **optional** features are implemented:

* [x] Any HTML page elements (including game buttons) has been styled differently than in the tutorial
* [x] Buttons use a pitch (frequency) other than the ones in the tutorial
* [ ] More than 4 functional game buttons
* [x] Playback speeds up on each turn
* [x] Computer picks a different pattern each time the game is played
* [x] Player only loses after 3 mistakes (instead of on the first mistake)
* [x] Game button appearance change goes beyond color (e.g. add an image)
* [ ] Game button sound is more complex than a single tone (e.g. an audio file, a chord, a sequence of multiple tones)
* [x] User has a limited amount of time to enter their guess on each turn

Here is the video:

[click to see video](https://user-images.githubusercontent.com/72692392/161478682-2d7180d0-5f1e-4493-97de-aebddd829dbd.mp4)




## Reflection Questions
1. If you used any outside resources to help complete your submission (websites, books, people, etc) list them here. 
- The images of the game buttons come from https://unsplash.com/
- The background music of the game comes from https://mixkit.co/free-sound-effects/music/
- stackoverflow

2. What was a challenge you encountered in creating this submission (be specific)? How did you overcome it? (recommended 200 - 400 words) 

- I encountered some difficulties while implementing the timer that limits the user to enter a guess within 5 seconds. When a user takes a guess too quickly or click game buttons while the pattern is playing, the second timer starts before the first one ends, causing the timer not being able to display the correct remaining time. 
- To solve this problem, I went through the logic of `guess(btn)` method carefully and read the documents of `setTimeout` to better understand the logic, so that I could find the correct positions in the codes to implement timer to make sure it starts as soon as the pattern stops and ends as soon as the user finishes their guess. To deal with the issue caused two timers ticking concurrently, I initialy thought of multithreading. However, since guesses (clicking button) directly associates with the timer, the more straightforward approach would be to disable the buttons while the pattern is playing. This not only resolvings the problem of conflicting timers, but also allows patterns to beb played without interruption. For me, a take-away would be to understand the logic and plan accordingly before writing a single line of code. 

3. What questions about web development do you have after completing your submission? (recommended 100 - 300 words) 

- I'm recently learning about Agile software development, and it would be interesting to apply it to the process of web development. I would espacially like to learn more about testing in order to deliver code that covers as many scenarios as possible. Right now, I'm the developer and the tester of the prework, so I might not be able to cover all possible use cases. It would be nice to try pair programming in our future projects. 

4. If you had a few more hours to work on this project, what would you spend them doing (for example: refactoring certain functions, adding additional features, etc). Be specific. (recommended 100 - 300 words) 

- I would implement the backend side of the app. For now, every user can make at most 3 wrong guesses and are required to give a guess within five second. On top of these, it would be nice to enable user setting that allows user to adjust the difficulty of the game through restriction time, number of buttons, number of rounds etc. This would add more flexibility to the game. Also, by storing record of users in the database, user would be able to see how many games they have won consecutively. 
- Game would be more fun when you play with friends. Another feature I would like to work on is to compete with friends on this game. Possible ways to implement this could be entering a room with code, enabling adding friends, and/or scan QR code. 





## License

    Copyright [Yiran Wan]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
