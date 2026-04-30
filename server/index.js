const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7);
}

io.on("connection", (socket) => {

  socket.on("createRoom", ({ name }) => {
    const roomCode = generateRoomCode();

    rooms[roomCode] = {
      hostName: name,
      players: [],
      word: "",
      imposters: 1,
      assignments: {},
      descriptions: [],
      votes: {}
    };

    socket.join(roomCode);
    socket.emit("roomCreated", roomCode);
  });

  socket.on("joinRoom", ({ roomCode, name }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.players.push({ id: socket.id, name });
    socket.join(roomCode);

    io.to(roomCode).emit("playersUpdated", room.players);
  });

  socket.on("setGameSettings", ({ roomCode, word, imposters }) => {
    const room = rooms[roomCode];
    room.word = word;
    room.imposters = imposters;
  });

  socket.on("startGame", ({ roomCode, name }) => {
    const room = rooms[roomCode];
    if (name !== room.hostName) return;

    room.descriptions = [];
    room.votes = {};

    let shuffled = [...room.players].sort(() => 0.5 - Math.random());

    shuffled.forEach((p, i) => {
      room.assignments[p.id] =
        i < room.imposters ? "IMPOSTER" : room.word;

      io.to(p.id).emit("yourWord", room.assignments[p.id]);
    });

    io.to(roomCode).emit("gameStarted");
  });

  socket.on("submitDescription", ({ roomCode, name, text }) => {
    const room = rooms[roomCode];

    room.descriptions.push({ name, text });

    io.to(roomCode).emit("newDescription", room.descriptions);

    if (room.descriptions.length === room.players.length) {
      io.to(roomCode).emit("startVoting", room.players);

      // ⏱ AUTO END VOTING AFTER 15s
      setTimeout(() => {
        io.to(roomCode).emit("forceEndVoting");
      }, 15000);
    }
  });

  socket.on("vote", ({ roomCode, voter, voted }) => {
    const room = rooms[roomCode];
    room.votes[voter] = voted;
  });

  socket.on("endVoting", (roomCode) => {
    const room = rooms[roomCode];

    let count = {};
    Object.values(room.votes).forEach(v => {
      count[v] = (count[v] || 0) + 1;
    });

    let max = Math.max(...Object.values(count || {0:0}));
    let top = Object.keys(count).filter(p => count[p] === max);

    if (top.length > 1) {
      io.to(roomCode).emit("result", { type: "tie", votes: count });
      return;
    }

    let eliminatedName = top[0];
    let eliminatedPlayer = room.players.find(p => p.name === eliminatedName);

    let isImposter = room.assignments[eliminatedPlayer.id] === "IMPOSTER";

    if (isImposter) {
      io.to(roomCode).emit("result", {
        type: "win",
        name: eliminatedName,
        word: room.word,
        votes: count
      });
    } else {
      io.to(roomCode).emit("result", {
        type: "continue",
        name: eliminatedName,
        votes: count
      });
    }
  });

});
server.listen(3000, () => console.log("http://localhost:3000"));