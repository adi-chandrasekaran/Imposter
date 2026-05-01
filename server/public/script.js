let players = [];
let assignments = [];
let currentIndex = 0;
let word = "";
let imposters = 1;

// 🆕 voting state
let votes = {};
let votingTurnIndex = 0;
let voteCounts = {};
let starterIndex = 0;

// SCREEN SWITCH
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// SETUP → PLAYERS
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

// PASS PHONE FLOW
function updatePlayer() {
  document.getElementById("currentPlayer").innerText = players[currentIndex];
  document.getElementById("wordDisplay").innerText = "";
}

function revealWord() {
  document.getElementById("wordDisplay").innerText = assignments[currentIndex];
}

function hideWord() {
  document.getElementById("wordDisplay").innerText = "";
}

function nextPlayer() {
  currentIndex++;

  if (currentIndex >= players.length) {
    pickStarter();
    return;
  }

  updatePlayer();
}

// RANDOM STARTER
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
      <div 
        class="voteBox" 
        onclick="castVote('${p}')"
      >
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

  // next voter
  votingTurnIndex++;

  if (votingTurnIndex >= players.length) {
    finishVoting();
    return;
  }

  renderVoting();
}

// FINAL SUBMIT (ALL DONE)
function finishVoting() {
  let max = Math.max(...Object.values(voteCounts));
  let top = Object.keys(voteCounts).filter(p => voteCounts[p] === max);

  // 🔵 TIE → NO ELIMINATION
  if (top.length > 1) {
    document.getElementById("resultText").innerText = "TIE — NO ONE ELIMINATED";
    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  let eliminated = top[0];
  let index = players.indexOf(eliminated);
  let isImposter = assignments[index] === "IMPOSTER";

  // 🟡 REMOVE PLAYER ONLY IF NOT TIE
  players.splice(index, 1);
  assignments.splice(index, 1);

  // count imposters left
  let impostersLeft = assignments.filter(a => a === "IMPOSTER").length;
  let normalPlayersLeft = assignments.length - impostersLeft;

  // 🟢 CASE 1: IMPOSTER ELIMINATED
  if (isImposter) {

    if (impostersLeft === 0) {
      document.getElementById("resultText").innerText =
        eliminated + " was the IMPOSTER — ALL IMPOSTERS ELIMINATED! YOU WIN!";
      document.getElementById("continueBtn").style.display = "none";
      return show("resultScreen");
    }

    document.getElementById("resultText").innerText =
      eliminated + " was an IMPOSTER...\nBUT WAIT! THERE'S STILL AN IMPOSTER AMONG YOU!";
    
    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  // 🔴 CASE 2: NORMAL PLAYER ELIMINATED
  if (impostersLeft >= normalPlayersLeft) {

    // 🔍 find remaining imposters
    let imposterNames = players.filter((p, i) => assignments[i] === "IMPOSTER");
  
    document.getElementById("resultText").innerText =
      "THERE ARE MORE IMPOSTERS THAN PLAYERS.\n\n" +
      "IMPOSTERS WIN 😈\n\n" +
      "Imposters were: " + imposterNames.join(", ");
  
    document.getElementById("continueBtn").style.display = "none";
    return show("resultScreen");
  }

  document.getElementById("resultText").innerText =
    eliminated + " was NOT the imposter";

  document.getElementById("continueBtn").style.display = "block";
  show("resultScreen");
}

// CONTINUE ROUND
function continueRound() {
  // rotate starter
  starterIndex = (starterIndex + 1) % players.length;

  document.getElementById("starter").innerText =
    players[starterIndex] + " starts!";

  show("startScreen");
}

// EXIT
function exitGame() {
  location.reload();
}