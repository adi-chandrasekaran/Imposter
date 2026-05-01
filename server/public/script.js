let players = [];
let assignments = [];
let currentIndex = 0;
let word = "";
let imposters = 1;

// RANDOM WORD SYSTEM
let randomMode = false;

const wordBank = {

  English: [
    "apple","beach","car","dog","pizza","school","phone","tree","coffee","music",
    "river","mountain","city","forest","ocean","cloud","rain","storm","sun","moon",
    "star","light","shadow","fire","ice","snow","wind","flower","grass","leaf",
    "chair","table","window","door","bed","mirror","clock","book","pen","paper",
    "teacher","student","doctor","artist","driver","chef","pilot","actor","singer","dancer",
    "game","sport","ball","goal","race","jump","run","walk","climb","swim",
    "cake","bread","cheese","butter","milk","egg","fruit","vegetable","soup","rice",
    "train","plane","boat","bike","road","bridge","tower","castle","village","hotel",
    "camera","photo","video","screen","keyboard","mouse","internet","code","robot","machine",
    "family","friend","child","parent","brother","sister","love","smile","laugh","cry"
  ],

  Spanish: [
    "manzana","playa","coche","perro","pizza","escuela","telefono","arbol","cafe","musica",
    "rio","montana","ciudad","bosque","oceano","nube","lluvia","tormenta","sol","luna",
    "estrella","luz","sombra","fuego","hielo","nieve","viento","flor","hierba","hoja",
    "silla","mesa","ventana","puerta","cama","espejo","reloj","libro","boligrafo","papel",
    "maestro","estudiante","doctor","artista","conductor","chef","piloto","actor","cantante","bailarin",
    "juego","deporte","pelota","gol","carrera","salto","correr","caminar","escalar","nadar",
    "pastel","pan","queso","mantequilla","leche","huevo","fruta","verdura","sopa","arroz",
    "tren","avion","barco","bicicleta","carretera","puente","torre","castillo","pueblo","hotel",
    "camara","foto","video","pantalla","teclado","raton","internet","codigo","robot","maquina",
    "familia","amigo","nino","padre","hermano","hermana","amor","sonrisa","risa","llorar"
  ],

  French: [
    "pomme","plage","voiture","chien","pizza","ecole","telephone","arbre","cafe","musique",
    "riviere","montagne","ville","foret","ocean","nuage","pluie","tempete","soleil","lune",
    "etoile","lumiere","ombre","feu","glace","neige","vent","fleur","herbe","feuille",
    "chaise","table","fenetre","porte","lit","miroir","horloge","livre","stylo","papier",
    "professeur","etudiant","docteur","artiste","conducteur","chef","pilote","acteur","chanteur","danseur",
    "jeu","sport","balle","but","course","saut","courir","marcher","escalader","nager",
    "gateau","pain","fromage","beurre","lait","oeuf","fruit","legume","soupe","riz",
    "train","avion","bateau","velo","route","pont","tour","chateau","village","hotel",
    "camera","photo","video","ecran","clavier","souris","internet","code","robot","machine",
    "famille","ami","enfant","parent","frere","soeur","amour","sourire","rire","pleurer"
  ]

};

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

// RANDOM WORD BUTTON
function randomizeWord() {
  const language = document.getElementById("language").value;

  const words = wordBank[language];
  word = words[Math.floor(Math.random() * words.length)];

  randomMode = true;

  document.getElementById("word").value = "";
  document.getElementById("word").placeholder = "Random word selected";
  document.getElementById("randomStatus").innerText = "Done";
}

// GO TO PLAYER ENTRY
function goToPlayers() {

  if (!randomMode) {
    word = document.getElementById("word").value;
  }

  imposters = parseInt(document.getElementById("imposters").value);

  if (!word) {
    alert("Enter a word or randomise one");
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
// VOTING SYSTEM
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
// RESULTS
// =========================

function finishVoting() {
  let max = Math.max(...Object.values(voteCounts));
  let top = Object.keys(voteCounts).filter(p => voteCounts[p] === max);

  if (top.length > 1) {
    document.getElementById("resultText").innerHTML =
      "TIE - No one eliminated";

    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  let eliminated = top[0];
  let index = players.indexOf(eliminated);
  let isImposter = assignments[index] === "IMPOSTER";

  players.splice(index, 1);
  assignments.splice(index, 1);

  let impostersLeft = assignments.filter(a => a === "IMPOSTER").length;
  let normalPlayersLeft = assignments.length - impostersLeft;

  if (isImposter) {

    if (impostersLeft === 0) {
      document.getElementById("resultText").innerHTML =
        `${eliminated} was the IMPOSTER — ALL IMPOSTERS ELIMINATED — YOU WIN`;

      document.getElementById("continueBtn").style.display = "none";
      show("resultScreen");
      return;
    }

    document.getElementById("resultText").innerHTML =
      `${eliminated} was an IMPOSTER — BUT THERE IS STILL ONE AMONG YOU`;

    document.getElementById("continueBtn").style.display = "block";
    show("resultScreen");
    return;
  }

  if (impostersLeft >= normalPlayersLeft) {

    let imposterNames = players.filter((p, i) => assignments[i] === "IMPOSTER");

    document.getElementById("resultText").innerHTML =
      `THERE ARE MORE IMPOSTERS THAN PLAYERS. IMPOSTERS WIN. Imposters were: ${imposterNames.join(", ")}`;

    document.getElementById("continueBtn").style.display = "none";
    show("resultScreen");
    return;
  }

  document.getElementById("resultText").innerHTML =
    `${eliminated} was NOT the imposter`;

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
  randomMode = false;
  location.reload();
}