let players = [];
let assignments = [];
let currentIndex = 0;
let word = "";
let imposters = 1;

let votes = {};
let votingTurnIndex = 0;
let voteCounts = {};
let starterIndex = 0;

let randomMode = false;

// =========================
// 🔥 WORD BANK
// =========================

const wordBank = {
  English: {

    Movies: [
      "Titanic","Avatar","Inception","Gladiator","Frozen","Joker","Matrix","Batman","Spiderman","Superman",
      "Iron Man","Avengers","Interstellar","Lion King","Harry Potter","Jurassic Park","Shrek","Toy Story","Up","Cars",
      "Finding Nemo","Aladdin","Coco","Moana","Deadpool","Thor","Hulk","Black Panther","Doctor Strange","Dune",
      "Top Gun","Rocky","Rambo","Godfather","Scarface","Jaws","E.T.","Terminator","Transformers","Fast and Furious",
      "Mission Impossible","Pirates Caribbean","Frozen 2","Inside Out","Minions","Despicable Me","Kung Fu Panda","Madagascar","Ice Age","Megamind"
    ],

    Food: [
      "Pizza","Burger","Pasta","Sushi","Taco","Biryani","Sandwich","Fries","Noodles","Salad",
      "Steak","Chicken","Rice","Bread","Cheese","Chocolate","Ice Cream","Cake","Donut","Pancake",
      "Waffle","Soup","Dumpling","Curry","Hotdog","Kebab","Nachos","Popcorn","Apple","Banana",
      "Orange","Mango","Strawberry","Grapes","Watermelon","Coffee","Tea","Milk","Juice","Smoothie",
      "Egg","Fish","Shrimp","Lobster","Butter","Jam","Honey","Peanut Butter","Cereal","Oatmeal"
    ],

    Brands: [
      "Apple","Google","Microsoft","Amazon","Tesla","Nike","Adidas","Coca Cola","Pepsi","McDonalds",
      "Starbucks","Netflix","Disney","Samsung","Sony","Intel","BMW","Mercedes","Toyota","Honda",
      "Uber","Airbnb","Spotify","Snapchat","Instagram","Facebook","Twitter","YouTube","PayPal","Visa",
      "Mastercard","Zara","H&M","Gucci","Louis Vuitton","Rolex","Puma","Dell","HP","Lenovo",
      "LG","Panasonic","Philips","Nvidia","AMD","Red Bull","KFC","Burger King","Subway","Dominos"
    ],

    FamousPeople: [
      "Einstein","Newton","Elon Musk","Bill Gates","Steve Jobs","Taylor Swift","Drake","Rihanna","Beyonce","Kanye West",
      "Messi","Ronaldo","Neymar","LeBron James","Michael Jordan","Serena Williams","Roger Federer","Usain Bolt","Virat Kohli","MS Dhoni",
      "Barack Obama","Donald Trump","Joe Biden","Narendra Modi","Mahatma Gandhi","Nelson Mandela","Martin Luther King","Winston Churchill","Cleopatra","Napoleon",
      "Leonardo da Vinci","Picasso","Shakespeare","J.K. Rowling","Stephen King","Albert Camus","Mark Twain","Charles Darwin","Galileo","Hawking",
      "Ariana Grande","Ed Sheeran","Bruno Mars","Justin Bieber","Selena Gomez","Zendaya","Tom Cruise","Leonardo DiCaprio","Will Smith","Dwayne Johnson"
    ],

    Countries: [
      "USA","India","China","Japan","Germany","France","UK","Canada","Australia","Brazil",
      "Russia","Italy","Spain","Mexico","South Korea","Indonesia","Turkey","Saudi Arabia","Argentina","South Africa",
      "Egypt","Nigeria","Kenya","Thailand","Vietnam","Malaysia","Singapore","Philippines","Pakistan","Bangladesh",
      "Netherlands","Belgium","Switzerland","Sweden","Norway","Denmark","Finland","Poland","Ukraine","Greece",
      "Portugal","Ireland","New Zealand","Chile","Colombia","Peru","Iran","Iraq","Israel","UAE"
    ],

    Books: [
      "Harry Potter","Lord of the Rings","Hobbit","1984","Animal Farm","To Kill a Mockingbird","Great Gatsby","Moby Dick","War and Peace","Crime and Punishment",
      "Pride and Prejudice","Jane Eyre","Wuthering Heights","Dracula","Frankenstein","Sherlock Holmes","Da Vinci Code","Angels and Demons","Twilight","Hunger Games",
      "Divergent","Maze Runner","Percy Jackson","Game of Thrones","The Alchemist","The Little Prince","The Kite Runner","Life of Pi","The Book Thief","The Road",
      "The Shining","It","Carrie","The Stand","Green Mile","Eragon","Narnia","Charlotte's Web","Matilda","Charlie and the Chocolate Factory",
      "Diary of a Wimpy Kid","Goosebumps","Anne Frank","The Giver","Bridge to Terabithia","Holes","Hatchet","Wonder","The Outsiders","Catch-22"
    ],

    TVShows: [
      "Friends","Breaking Bad","Game of Thrones","Stranger Things","The Office","Brooklyn Nine Nine","Sherlock","Money Heist","Dark","Narcos",
      "Suits","House of Cards","The Crown","The Witcher","Black Mirror","Peaky Blinders","Lost","Prison Break","Dexter","The Boys",
      "The Mandalorian","Loki","WandaVision","Euphoria","Gossip Girl","Riverdale","How I Met Your Mother","Big Bang Theory","Modern Family","Rick and Morty",
      "South Park","Family Guy","Simpsons","The Walking Dead","Vikings","The Flash","Arrow","Supernatural","Smallville","Lucifer",
      "Grey's Anatomy","House","Scrubs","CSI","NCIS","The Good Doctor","Shameless","Westworld","True Detective","Ozark"
    ]
  },

  Spanish: {
    Movies: [
      "Titánic","Avatar","Origen","Gladiador","Frozen","Guasón","Matrix","Batman","Spiderman","Superman",
      "Iron Man","Los Vengadores","Interestelar","El Rey León","Harry Potter","Parque Jurásico","Shrek","Toy Story","Up","Cars",
      "Buscando a Nemo","Aladdín","Coco","Moana","Deadpool","Thor","Hulk","Black Panther","Doctor Strange","Duna",
      "Top Gun","Rocky","Rambo","El Padrino","Scarface","Tiburón","E.T.","Terminator","Transformers","Rápidos y Furiosos",
      "Misión Imposible","Piratas del Caribe","Frozen 2","Intensamente","Minions","Mi Villano Favorito","Kung Fu Panda","Madagascar","La Era de Hielo","Megamente"
      ],
      
      Food: [
      "Pizza","Hamburguesa","Pasta","Sushi","Taco","Biryani","Sándwich","Papas Fritas","Fideos","Ensalada",
      "Bistec","Pollo","Arroz","Pan","Queso","Chocolate","Helado","Pastel","Donut","Panqueque",
      "Gofre","Sopa","Empanadilla","Curry","Perrito Caliente","Kebab","Nachos","Palomitas de Maíz","Manzana","Plátano",
      "Naranja","Mango","Fresa","Uvas","Sandía","Café","Té","Leche","Jugo","Batido",
      "Huevo","Pescado","Camarones","Langosta","Mantequilla","Mermelada","Miel","Mantequilla de Maní","Cereal","Avena"
      ],
      
      Brands: [
      "Apple","Google","Microsoft","Amazon","Tesla","Nike","Adidas","Coca Cola","Pepsi","McDonalds",
      "Starbucks","Netflix","Disney","Samsung","Sony","Intel","BMW","Mercedes","Toyota","Honda",
      "Uber","Airbnb","Spotify","Snapchat","Instagram","Facebook","Twitter","YouTube","PayPal","Visa",
      "Mastercard","Zara","H&M","Gucci","Louis Vuitton","Rolex","Puma","Dell","HP","Lenovo",
      "LG","Panasonic","Philips","Nvidia","AMD","Red Bull","KFC","Burger King","Subway","Dominos"
      ],
      
      FamousPeople: [
      "Einstein","Newton","Elon Musk","Bill Gates","Steve Jobs","Taylor Swift","Drake","Rihanna","Beyoncé","Kanye West",
      "Messi","Ronaldo","Neymar","LeBron James","Michael Jordan","Serena Williams","Roger Federer","Usain Bolt","Virat Kohli","MS Dhoni",
      "Barack Obama","Donald Trump","Joe Biden","Narendra Modi","Mahatma Gandhi","Nelson Mandela","Martin Luther King","Winston Churchill","Cleopatra","Napoleón",
      "Leonardo da Vinci","Picasso","Shakespeare","J.K. Rowling","Stephen King","Albert Camus","Mark Twain","Charles Darwin","Galileo","Hawking",
      "Ariana Grande","Ed Sheeran","Bruno Mars","Justin Bieber","Selena Gomez","Zendaya","Tom Cruise","Leonardo DiCaprio","Will Smith","Dwayne Johnson"
      ],
      
      Countries: [
      "Estados Unidos","India","China","Japón","Alemania","Francia","Reino Unido","Canadá","Australia","Brasil",
      "Rusia","Italia","España","México","Corea del Sur","Indonesia","Turquía","Arabia Saudita","Argentina","Sudáfrica",
      "Egipto","Nigeria","Kenia","Tailandia","Vietnam","Malasia","Singapur","Filipinas","Pakistán","Bangladesh",
      "Países Bajos","Bélgica","Suiza","Suecia","Noruega","Dinamarca","Finlandia","Polonia","Ucrania","Grecia",
      "Portugal","Irlanda","Nueva Zelanda","Chile","Colombia","Perú","Irán","Irak","Israel","Emiratos Árabes Unidos"
      ],
      
      Books: [
      "Harry Potter","El Señor de los Anillos","El Hobbit","1984","Rebelión en la Granja","Matar a un Ruiseñor","El Gran Gatsby","Moby Dick","Guerra y Paz","Crimen y Castigo",
      "Orgullo y Prejuicio","Jane Eyre","Cumbres Borrascosas","Drácula","Frankenstein","Sherlock Holmes","El Código Da Vinci","Ángeles y Demonios","Crepúsculo","Los Juegos del Hambre",
      "Divergente","Maze Runner","Percy Jackson","Juego de Tronos","El Alquimista","El Principito","Cometas en el Cielo","La Vida de Pi","La Ladrona de Libros","El Camino",
      "El Resplandor","It","Carrie","La Torre Oscura","La Milla Verde","Eragon","Narnia","La Telaraña de Carlota","Matilda","Charlie y la Fábrica de Chocolate",
      "Diario de Greg","Escalofríos","Ana Frank","El Dador","Un Puente hacia Terabithia","Holes","Hatchet","Wonder","Los Outsiders","Catch-22"
      ],
      
      TVShows: [
      "Friends","Breaking Bad","Juego de Tronos","Stranger Things","The Office","Brooklyn 99","Sherlock","La Casa de Papel","Dark","Narcos",
      "Suits","House of Cards","The Crown","The Witcher","Black Mirror","Peaky Blinders","Lost","Prison Break","Dexter","The Boys",
      "The Mandalorian","Loki","WandaVision","Euphoria","Gossip Girl","Riverdale","How I Met Your Mother","Big Bang Theory","Modern Family","Rick y Morty",
      "South Park","Family Guy","Los Simpson","The Walking Dead","Vikingos","The Flash","Arrow","Supernatural","Smallville","Lucifer",
      "Grey’s Anatomy","House","Scrubs","CSI","NCIS","The Good Doctor","Shameless","Westworld","True Detective","Ozark"
      ]
  },

  French: {
    Movies: [
      "Titanic","Avatar","Inception","Gladiator","La Reine des Neiges","Joker","Matrix","Batman","Spiderman","Superman",
      "Iron Man","Avengers","Interstellar","Le Roi Lion","Harry Potter","Jurassic Park","Shrek","Toy Story","Là-haut","Cars",
      "Le Monde de Nemo","Aladdin","Coco","Moana","Deadpool","Thor","Hulk","Black Panther","Doctor Strange","Dune",
      "Top Gun","Rocky","Rambo","Le Parrain","Scarface","Les Dents de la Mer","E.T.","Terminator","Transformers","Fast and Furious",
      "Mission Impossible","Pirates des Caraïbes","Frozen 2","Vice Versa","Minions","Moi Moche et Méchant","Kung Fu Panda","Madagascar","L’Âge de Glace","Megamind"
      ],
      
      Food: [
      "pizza","burger","pâtes","sushi","taco","biryani","sandwich","frites","nouilles","salade",
      "steak","poulet","riz","pain","fromage","chocolat","glace","gâteau","donut","crêpe",
      "gaufre","soupe","ravioli","curry","hotdog","kebab","nachos","popcorn","pomme","banane",
      "orange","mangue","fraise","raisin","pastèque","café","thé","lait","jus","smoothie",
      "œuf","poisson","crevette","homard","beurre","confiture","miel","beurre de cacahuète","céréales","avoine"
      ],

      Brands: [
        "Apple","Google","Microsoft","Amazon","Tesla","Nike","Adidas","Coca Cola","Pepsi","McDonalds",
        "Starbucks","Netflix","Disney","Samsung","Sony","Intel","BMW","Mercedes","Toyota","Honda",
        "Uber","Airbnb","Spotify","Snapchat","Instagram","Facebook","Twitter","YouTube","PayPal","Visa",
        "Mastercard","Zara","H&M","Gucci","Louis Vuitton","Rolex","Puma","Dell","HP","Lenovo",
        "LG","Panasonic","Philips","Nvidia","AMD","Red Bull","KFC","Burger King","Subway","Dominos"
      ],
  
      FamousPeople: [
        "Einstein","Newton","Elon Musk","Bill Gates","Steve Jobs","Taylor Swift","Drake","Rihanna","Beyonce","Kanye West",
        "Messi","Ronaldo","Neymar","LeBron James","Michael Jordan","Serena Williams","Roger Federer","Usain Bolt","Virat Kohli","MS Dhoni",
        "Barack Obama","Donald Trump","Joe Biden","Narendra Modi","Mahatma Gandhi","Nelson Mandela","Martin Luther King","Winston Churchill","Cleopatra","Napoleon",
        "Leonardo da Vinci","Picasso","Shakespeare","J.K. Rowling","Stephen King","Albert Camus","Mark Twain","Charles Darwin","Galileo","Hawking",
        "Ariana Grande","Ed Sheeran","Bruno Mars","Justin Bieber","Selena Gomez","Zendaya","Tom Cruise","Leonardo DiCaprio","Will Smith","Dwayne Johnson"
      ],

      Countries: [
        "États-Unis","Inde","Chine","Japon","Allemagne","France","Royaume-Uni","Canada","Australie","Brésil",
        "Russie","Italie","Espagne","Mexique","Corée du Sud","Indonésie","Turquie","Arabie Saoudite","Argentine","Afrique du Sud",
        "Égypte","Nigeria","Kenya","Thaïlande","Vietnam","Malaisie","Singapour","Philippines","Pakistan","Bangladesh",
        "Pays-Bas","Belgique","Suisse","Suède","Norvège","Danemark","Finlande","Pologne","Ukraine","Grèce",
        "Portugal","Irlande","Nouvelle-Zélande","Chili","Colombie","Pérou","Iran","Irak","Israël","Émirats Arabes Unis"
      ],

      Books: [
        "Harry Potter","Le Seigneur des Anneaux","Le Hobbit","1984","La Ferme des Animaux","Ne tirez pas sur l’oiseau moqueur","Gatsby le Magnifique","Moby Dick","Guerre et Paix","Crime et Châtiment",
        "Orgueil et Préjugés","Jane Eyre","Les Hauts de Hurlevent","Dracula","Frankenstein","Sherlock Holmes","Le Code Da Vinci","Anges et Démons","Twilight","Hunger Games",
        "Divergente","Le Labyrinthe","Percy Jackson","Game of Thrones","L’Alchimiste","Le Petit Prince","Les Cerfs-volants de Kaboul","L’Histoire de Pi","La Voleuse de livres","La Route",
        "Shining","Ça","Carrie","La Tour Sombre","La Ligne Verte","Eragon","Narnia","Charlotte aux fraises","Matilda","Charlie et la Chocolaterie",
        "Journal d’un dégonflé","Chair de Poule","Journal d’Anne Frank","Le Passeur","Un pont vers Terabithia","Holes","Hatchet","Wonder","Les Outsiders","Catch-22"
      ],

      TVShows: [
        "Friends","Breaking Bad","Game of Thrones","Stranger Things","The Office","Brooklyn 99","Sherlock","La Casa de Papel","Dark","Narcos",
        "Suits","House of Cards","The Crown","The Witcher","Black Mirror","Peaky Blinders","Lost","Prison Break","Dexter","The Boys",
        "The Mandalorian","Loki","WandaVision","Euphoria","Gossip Girl","Riverdale","How I Met Your Mother","The Big Bang Theory","Modern Family","Rick et Morty",
        "South Park","Family Guy","Les Simpson","The Walking Dead","Vikings","The Flash","Arrow","Supernatural","Smallville","Lucifer",
        "Grey’s Anatomy","Dr House","Scrubs","CSI","NCIS","The Good Doctor","Shameless","Westworld","True Detective","Ozark"
      ],
  }
};

  

// =========================
// SCREEN SWITCH
// =========================

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// =========================
// RANDOM WORD SYSTEM
// =========================

function toggleRandom() {
  const dropdown = document.getElementById("categorySelect");

  dropdown.style.display =
    dropdown.style.display === "none" ? "block" : "none";
}

function selectRandomCategory() {
  const language = document.getElementById("language").value;
  const category = document.getElementById("categorySelect").value;

  const words = wordBank[language][category];

  word = words[Math.floor(Math.random() * words.length)];
  randomMode = true;

  document.getElementById("word").value = "";
  document.getElementById("word").placeholder = category + " selected";
  document.getElementById("randomStatus").innerText = "Done";

  document.getElementById("categorySelect").style.display = "none";
}

// =========================
// SETUP FLOW
// =========================

function goToPlayers() {

  if (!randomMode) {
    word = document.getElementById("word").value;
  }

  imposters = parseInt(document.getElementById("imposters").value);

  if (!word) {
    alert("Enter or randomise a word");
    return;
  }

  show("playersScreen");
}

// =========================
// PLAYER SETUP
// =========================

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

// =========================
// GAME START
// =========================

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

// =========================
// PASS PHONE
// =========================

function updatePlayer() {
  document.getElementById("currentPlayer").innerText = players[currentIndex];
  document.getElementById("wordDisplay").innerText = "";
}

function revealWord() {
  document.getElementById("wordDisplay").innerText =
    assignments[currentIndex];
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

// =========================
// START ROUND
// =========================

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

  // TIE
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

  players.splice(index, 1);
  assignments.splice(index, 1);

  let impostersLeft = assignments.filter(a => a === "IMPOSTER").length;
  let normalPlayersLeft = assignments.length - impostersLeft;

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

  document.getElementById("resultText").innerHTML = `
    <div class="resultBox">
      <h1>${eliminated} was NOT the imposter</h1>
    </div>
  `;

  document.getElementById("continueBtn").style.display = "block";
  show("resultScreen");
}

// =========================
// CONTINUE
// =========================

function continueRound() {
  starterIndex = (starterIndex + 1) % players.length;

  document.getElementById("starter").innerText =
    players[starterIndex] + " starts!";

  show("startScreen");
}

// =========================
// EXIT
// =========================

function exitGame() {
  location.reload();
}