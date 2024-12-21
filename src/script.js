"use strict";

let secretNumber;
let score = 20;
let highscore = 0;
let timeLeft = 60; // Increased timer duration
let timerInterval;
let difficulty = "medium";

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

const setSecretNumber = function () {
  if (difficulty === "easy") {
    secretNumber = Math.trunc(Math.random() * 10) + 1;
    document.querySelector(".range").textContent = "10";
  } else if (difficulty === "medium") {
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    document.querySelector(".range").textContent = "20";
  } else if (difficulty === "hard") {
    secretNumber = Math.trunc(Math.random() * 50) + 1;
    document.querySelector(".range").textContent = "50";
  }
};

const startTimer = function () {
  clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    timeLeft--;
    document.querySelector(".time").textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      displayMessage("⏰ Time's up! You lost the game!");
      document.querySelector(".score").textContent = 0;
    }
  }, 1000);
};

const resetGame = function () {
  score = 20;
  timeLeft = 60; // Reset timer duration
  setSecretNumber();
  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
  document.querySelector(".time").textContent = timeLeft;
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
  document.querySelector("body").className = difficulty;
  startTimer();
};

document.querySelector(".difficulty").addEventListener("change", function () {
  difficulty = this.value;
  resetGame();
});

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  // Check if the guess is within the allowed range
  let maxRange;
  if (difficulty === "easy") maxRange = 10;
  else if (difficulty === "medium") maxRange = 20;
  else if (difficulty === "hard") maxRange = 50;

  if (!guess) {
    displayMessage("⛔️ No number!");
  } else if (guess < 1 || guess > maxRange) {
    displayMessage(`⛔️ Enter a number between 1 and ${maxRange}!`);
  } else if (guess === secretNumber) {
    const congratulations = [
      "🎉 Correct Number!",
      "🎊 You did it!",
      "🏆 Congratulations!",
      "🌟 Great job!",
    ];
    const randomMessage =
      congratulations[Math.floor(Math.random() * congratulations.length)];
    displayMessage(randomMessage);
    document.querySelector(".number").textContent = secretNumber;
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";
    clearInterval(timerInterval);

    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "📈 Too high!" : "📉 Too low!");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      displayMessage("💥 You lost the game!");
      document.querySelector(".score").textContent = 0;
      clearInterval(timerInterval);
    }
  }
});

document.querySelector(".again").addEventListener("click", resetGame);

document.querySelector(".hint").addEventListener("click", function () {
  if (score > 1) {
    const hint = secretNumber % 2 === 0 ? "even" : "odd";
    displayMessage(`Hint: The number is ${hint}`);
    score -= 2;
    document.querySelector(".score").textContent = score;
  } else {
    displayMessage("💥 Not enough score for a hint!");
  }
});

// Add event listener for the Enter key to submit the guess
document.querySelector(".guess").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.querySelector(".check").click();
  }
});

resetGame();
