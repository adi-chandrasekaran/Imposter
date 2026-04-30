let players = [];
let assignments = [];
let currentIndex = 0;
let word = "";
let imposters = 1;

// SCREEN SWITCH
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// GO TO PLAYER ENTRY
function goToPlayers() {
  word = document.getElementById("word").value;
  imposters = parseInt(document.getElementById("imposters").value);

  if (!word) {
    alert("Enter a word");
    return;
  }

  show("playersScreen");
}

// ADD PLAYER
function addPlayer() {
  const name = document.getElementById("playerName").value;

  if (!name) return;

  players.push(name);
  document.getElementById("playerName").value = "";

  renderPlayers();
}

function renderPlayers() {
  let html = "";

  players.forEach(p => {
    html += `<div class="playerTag">${p}</div>`;
  });

  document.getElementById("playersList").innerHTML = html;
}

// START GAME
function startGame() {
  if (players.length < 3) {
    alert("Need at least 3 players");
    return;
  }

  // assign imposters
  assignments = [...players].map(() => word);

  let shuffled = [...players]
    .map((p, i) => ({ p, i }))
    .sort(() => 0.5 - Math.random());

  for (let i = 0; i < imposters; i++) {
    assignments[shuffled[i].i] = "IMPOSTER";
  }

  currentIndex = 0;

  show("passScreen");
  updatePlayer();
}

// UPDATE CURRENT PLAYER
function updatePlayer() {
  document.getElementById("currentPlayer").innerText = players[currentIndex];
  document.getElementById("wordDisplay").innerText = "";
}

// HOLD TO SEE
function revealWord() {
  document.getElementById("wordDisplay").innerText =
    assignments[currentIndex];
}

function hideWord() {
  document.getElementById("wordDisplay").innerText = "";
}

// NEXT PLAYER
function nextPlayer() {
  currentIndex++;

  if (currentIndex >= players.length) {
    pickStarter();
    return;
  }

  updatePlayer();
}

// PICK RANDOM STARTER
function pickStarter() {
  let random = players[Math.floor(Math.random() * players.length)];

  document.getElementById("starter").innerText =
    random + " starts!";

  show("startScreen");
}