const socket = io();

let roomCode = "";
let name = "";
let isHost = false;
let selected = null;
let myWord = "";

// SCREEN SWITCH
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// CREATE ROOM
function createRoom() {
  name = document.getElementById("name").value;
  isHost = true;
  socket.emit("createRoom", { name });
}

// JOIN ROOM
function joinRoom() {
  name = document.getElementById("name").value;
  roomCode = document.getElementById("room").value;
  isHost = false;
  socket.emit("joinRoom", { roomCode, name });
}

// ROOM CREATED
socket.on("roomCreated", (code) => {
  roomCode = code;
  document.getElementById("room").value = code;
  alert("Room Code: " + code);
});

// PLAYER LIST
socket.on("playersUpdated", (players) => {
  let html = "<h3>Players</h3>";
  players.forEach(p => html += `<p>${p.name}</p>`);
  document.getElementById("players").innerHTML = html;
});

// START GAME
function startGame() {
  const word = document.getElementById("word").value;
  const imposters = parseInt(document.getElementById("imposters").value);

  socket.emit("setGameSettings", { roomCode, word, imposters });
  socket.emit("startGame", { roomCode, name });
}

// RECEIVE WORD
socket.on("yourWord", (word) => {
  myWord = word;
  show("descScreen");
  renderDescriptions([]);
});

// RENDER WORD + DESCRIPTIONS
function renderDescriptions(list) {
  let html = `<h2>${myWord || "HOST VIEW"}</h2>`;

  list.forEach(d => {
    html += `<p><b>${d.name}:</b> ${d.text}</p>`;
  });

  document.getElementById("descList").innerHTML = html;
}

// SUBMIT DESCRIPTION (players only)
function submitDesc() {
  if (isHost) return;

  const text = document.getElementById("descInput").value;

  if (!text) return;

  socket.emit("submitDescription", {
    roomCode,
    name,
    text
  });

  document.getElementById("descInput").value = "";
}

// LIVE DESCRIPTIONS (HOST + PLAYERS SEE)
socket.on("newDescription", (list) => {
  renderDescriptions(list);
});

// START VOTING
socket.on("startVoting", (players) => {
  show("voteScreen");

  let html = `<h2>${myWord || "VOTING"}</h2>`;

  players.forEach(p => {
    html += `
      <button id="btn-${p.name}" onclick="selectVote('${p.name}')">
        ${p.name}
      </button>
    `;
  });

  document.getElementById("playersList").innerHTML = html;
});

// SELECT VOTE (FIXED)
function selectVote(player) {
  if (isHost) return;

  if (selected === player) {
    document.getElementById(`btn-${player}`).style.background = "white";
    selected = null;
  } else {
    document.querySelectorAll("#playersList button").forEach(b => {
      b.style.background = "white";
    });

    document.getElementById(`btn-${player}`).style.background = "yellow";
    selected = player;
  }
}

// SEND VOTE (FIXED)
function sendVote() {
  if (isHost) return;

  if (!selected) {
    alert("Pick someone");
    return;
  }

  socket.emit("vote", {
    roomCode,
    voter: name,
    voted: selected
  });
}

// AUTO END VOTING
socket.on("forceEndVoting", () => {
  socket.emit("endVoting", roomCode);
});

// RESULTS
socket.on("result", (data) => {
  let html = `<h2>${myWord || "RESULTS"}</h2>`;

  for (let p in data.votes) {
    html += `<p>${p}: ${"⚫".repeat(data.votes[p])}</p>`;
  }

  if (data.type === "tie") {
    html += "<h1>TIE</h1>";
  }

  if (data.type === "win") {
    html += `<h1>${data.name} WAS THE IMPOSTER</h1>`;
    html += `<h2>WORD: ${data.word}</h2>`;
  }

  if (data.type === "continue") {
    html += `<h1>${data.name} WAS NOT THE IMPOSTER</h1>`;

    setTimeout(() => {
      show("descScreen");
    }, 3000);
  }

  document.getElementById("voteScreen").innerHTML = html;
});