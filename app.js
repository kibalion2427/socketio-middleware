const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const index = require("./routes/index");

const port = 4000;

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

// ####

const getApiEmit = async (socket) => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/viewset/covid/");
    socket.emit("FromAPI", res.data); //emit the real time data
  } catch (error) {
    console.log(`Error: ${error.code}`);
  }
};

let interval;

io.on("connection", (socket) => {
  console.log("New client connection");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiEmit(socket), 10000);

  socket.on("disconnet", () => console.log("Client disconnected"));
});

// ##listen server

server.listen(port, () => console.log(`Listening on port ${port}`));
