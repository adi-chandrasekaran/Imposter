let players = [];
let assignments = [];
let currentIndex = 0;
let word = "";
let imposters = 1;

// voting state
let votes = {};
let votingTurnIndex = 0;
let voteCounts = {};
let starterIndex = 0;

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
  starterIndex = Math.floor(Math.random() * players.length);

  document.getElementById("starter").innerText =
    players[starterIndex] + " starts!";

  show("startScreen");
}

// =========================
// 🔥 VOTING SYSTEM
// =========================

function goToVoting() {
  votes = {};
  voteCounts = {};
  votingTurnIndex = 0;

  players.forEach(p => voteCounts[p] = 0);

  renderVoting();
  show("voteScreen");
}

function renderVoting() {
  let currentVoter = players[votingTurnIndex];

  document.getElementById("votingPlayer").innerText =
    currentVoter + " vote";

  let html = "";

  players.forEach(p => {
    let dots = "⚪".repeat(voteCounts[p]);

    html += `
      <div class="voteBox" onclick="castVote('${p}')">
        ${p}
        <div>${dots}</div>
      </div>
    `;
  });

  document.getElementById("voteGrid").innerHTML = html;
}

// CLICK = INSTANT VOTE
function castVote(target) {
  let voter = players[votingTurnIndex];

  votes[voter] = target;
  voteCounts[target]++;

  votingTurnIndex++;

  if (votingTurnIndex >= players.length) {
    finishVoting();
    return;
  }

  renderVoting();
}

// =========================
// 🔥 RESULTS LOGIC
// =========================

function finishVoting() {
  let max = Math.max(...Object.values(voteCounts));
  let top = Object.keys(voteCounts).filter(p => voteCounts[p] === max);

  // 🟦 TIE
  if (top.length > 1) {
    document.getElementById("resultText").innerHTML = `
      <div class="resultBox">
        <h1>TIE</h1>
        <p>No one was eliminated</p>
      </div>
    `;

    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  let eliminated = top[0];
  let index = players.indexOf(eliminated);
  let isImposter = assignments[index] === "IMPOSTER";

  // remove player
  players.splice(index, 1);
  assignments.splice(index, 1);

  let impostersLeft = assignments.filter(a => a === "IMPOSTER").length;
  let normalPlayersLeft = assignments.length - impostersLeft;

  // 🟩 IMPOSTER ELIMINATED
  if (isImposter) {

    if (impostersLeft === 0) {
      document.getElementById("resultText").innerHTML = `
        <div class="resultBox">
          <h1>${eliminated} was the IMPOSTER</h1>
          <h2>ALL IMPOSTERS ELIMINATED</h2>
          <p>YOU WIN</p>
        </div>
      `;

      document.getElementById("continueBtn").style.display = "none";
      show("resultScreen");
      return;
    }

    document.getElementById("resultText").innerHTML = `
      <div class="resultBox">
        <h1>${eliminated} was an IMPOSTER</h1>
        <h2>BUT WAIT</h2>
        <p>There is still an imposter among you</p>
      </div>
    `;

    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  // 🟥 IMPOSTERS WIN
  if (impostersLeft >= normalPlayersLeft) {

    let imposterNames = players.filter((p, i) => assignments[i] === "IMPOSTER");

    document.getElementById("resultText").innerHTML = `
      <div class="resultBox">
        <h2>There are more imposters than players</h2>
        <h1>IMPOSTERS WIN</h1>
        <p>Imposters were: ${imposterNames.join(", ")}</p>
      </div>
    `;

    document.getElementById("continueBtn").style.display = "none";
    show("resultScreen");
    return;
  }

  // 🟨 NORMAL PLAYER ELIMINATED
  document.getElementById("resultText").innerHTML = `
    <div class="resultBox">
      <h1>${eliminated} was NOT the imposter</h1>
    </div>
  `;

  document.getElementById("continueBtn").style.display = "block";
  show("resultScreen");
}

// CONTINUE ROUND
function continueRound() {
  starterIndex = (starterIndex + 1) % players.length;

  document.getElementById("starter").innerText =
    players[starterIndex] + " starts!";

  show("startScreen");
}

// EXIT
function exitGame() {
  location.reload();
}