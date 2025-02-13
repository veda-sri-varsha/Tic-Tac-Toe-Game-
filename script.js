console.log("Welcome To Tic-Tac-Toe");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");
const cells = document.querySelectorAll(".cell");
const resultBanner = document.querySelector(".result-banner");
const resetButton = document.querySelector(".reset-button");
const scoreDisplays = document.querySelectorAll(".score");
const restartButton = document.querySelector(".restart-button");
const nextRound = document.querySelector(".next-round");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "planet";
let scores = { star: 0, planet: 0 };
let totalGames = 0;
let isPlayerTurn = true;

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (isPlayerTurn) handleMove(index, cell);
    audioTurn.play();
  });
});

restartButton.addEventListener("click", restart);
function restart() {
  location.reload();
}

resetButton.addEventListener("click", resetGame);

function handleMove(index, cell) {
  if (board[index] !== "") return;

  board[index] = currentPlayer;
  addSymbol(cell, currentPlayer);

  if (checkWin()) {
    scores[currentPlayer]++;
    totalGames++;
    updateScore();
    endGame(`${capitalize(currentPlayer)} Wins!`);
    return;
  }

  if (!board.includes("")) {
    totalGames++;
    updateScore();
    endGame("It's a Draw!");
    return;
  }

  switchTurn();

  if (!isPlayerTurn) {
    setTimeout(computerMove, 100);
  }
}

function computerMove() {
  let availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter(val => val !== null);
  if (availableMoves.length === 0) return;

  let chosenMove = findWinningMove(currentPlayer) || findWinningMove(getOpponent()) || getRandomMove(availableMoves);

  makeMove(chosenMove);
}

function getRandomMove(availableMoves) {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findWinningMove(player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = player;
      if (checkWin(player)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return null;
}

function getOpponent() {
  return currentPlayer === "X" ? "O" : "X";
}

function makeMove(index) {
  board[index] = currentPlayer;
  addSymbol(cells[index], currentPlayer);

  if (checkWin(currentPlayer)) {
    updateScore(currentPlayer);
    endGame(`${capitalize(currentPlayer)} Wins!`);
    return;
  }

  if (!board.includes("")) {
    updateScore();
    endGame("It's a Draw!");
    return;
  }

  switchTurn();
}


function addSymbol(cell, player) {
  let img = cell.querySelector(".symbol-img");

  if (!img) {
    img = document.createElement("img");
    img.classList.add("symbol-img");
    cell.appendChild(img);
  }

  img.src =
    player === "star"
      ? "public/images/Star asset.png"
      : "public/images/Planet asset.svg";
  img.style.width = "80%";
  img.style.height = "80%";
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
}

function switchTurn() {
  currentPlayer = currentPlayer === "star" ? "planet" : "star";
  isPlayerTurn = !isPlayerTurn;
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some(
    (pattern) =>
      board[pattern[0]] &&
      board[pattern[0]] === board[pattern[1]] &&
      board[pattern[1]] === board[pattern[2]]
  );
}

function endGame(winner) {
  gameover.play();
  document.body.style.overflow = "hidden";
  let img = document.createElement("img");

  if (winner.includes("Star")) {
    img.src = "public/images/star-wins.svg";
  } else if (winner.includes("Planet")) {
    img.src = "public/images/planet-wins.svg";
  } else {
    img.src = "public/images/draw.svg";
  }

  img.style.width = "1370px";
  img.style.height = "auto";
  img.style.objectFit = "contain";
  img.style.display = "block";
  img.style.margin = "0 auto";
  img.classList.add("result-img"); 
  img.style.cursor = "pointer";

  resultBanner.innerHTML = "";

  let buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "center";
  buttonsContainer.style.gap = "0px";
  buttonsContainer.style.marginBottom = "20px";
  buttonsContainer.style.position = "absolute";
  buttonsContainer.style.top = "290px";
  buttonsContainer.style.left = "50%";
  buttonsContainer.style.transform = "translateX(-50%)";

  let nextRoundButton = document.createElement("img");
  nextRoundButton.src = "public/images/Nextround.png";
  nextRoundButton.classList.add("next-round");
  nextRoundButton.style.width = "185px";
  nextRoundButton.style.height = "40px";
  nextRoundButton.style.cursor = "pointer";
  nextRoundButton.style.marginRight = " -280px";
  nextRoundButton.style.position = "relative";
  nextRoundButton.style.left = " 60px";

  let restartButton = document.createElement("img");
  restartButton.src = "public/images/Restart.png";
  restartButton.classList.add("restart-button");
  restartButton.style.width = "180px";
  restartButton.style.height = " 50px";
  restartButton.style.cursor = "pointer";

  buttonsContainer.appendChild(nextRoundButton);
  buttonsContainer.appendChild(restartButton);

  let wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.height = "100%";
  wrapper.style.position = "absolute";

  wrapper.appendChild(buttonsContainer);
  wrapper.appendChild(img);

  resultBanner.appendChild(wrapper);

  resultBanner.style.display = "flex";
  resultBanner.style.alignItems = "center";
  resultBanner.style.justifyContent = "center";
  resultBanner.style.height = "100%";
  resultBanner.style.position = "absolute";

  isPlayerTurn = false;

  nextRoundButton.addEventListener("click", nextRoundGame);
  restartButton.addEventListener("click", restart);
}

function nextRoundGame() {
  let previousWinner = checkWin() ? currentPlayer : null;

  board = ["", "", "", "", "", "", "", "", ""];
  isPlayerTurn = true;
  if (previousWinner) {
    currentPlayer = previousWinner === "star" ? "planet" : "star";
  } else {
    switchTurn();
  }
  cells.forEach((cell) => {
    let img = cell.querySelector(".symbol-img");
    if (img) img.remove();
  });

  resultBanner.style.display = "none";
}

function resetGame() {
  resultBanner.style.display = "none";
  document.querySelectorAll(".score").forEach((score) => {
    score.classList.remove(".white-text");
    score.style.color = "black";
  });

  isPlayerTurn = true;
}

function updateScore() {
  scoreDisplays[0].textContent = `${scores.planet}/${totalGames}`;
  scoreDisplays[1].textContent = `${scores.star}/${totalGames}`;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isPlayerTurn = true;
  currentPlayer = "star";

  cells.forEach((cell) => {
    let img = cell.querySelector(".symbol-img");
    if (img) img.remove();
  });

  resultBanner.style.display = "none";
  resultBanner.addEventListener("click", restart);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
