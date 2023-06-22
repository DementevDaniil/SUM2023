const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];
io.on("connection", (socket) => {
  id = socket.id;
  clients.push(socket);
  console.log(`Client connected with id: ${id}`);
  if (clients.length == 2) {
    for (client of clients) client.emit("initGame", clients.indexOf(client));
  }
  socket.on("endOfInit", (data) => {
    for (client of clients) {
      if (client == socket) continue;
      else client.emit("startRender", data);
    }
  });
  socket.on("MessageToServer", (msg, name) => {
    const replyMsg = `${name}: ${msg}`;
    console.log(replyMsg);
    for (client of clients) {
      if (client === socket) {
        continue;
      }
      client.emit("MessageFromServer", replyMsg);
    }
  });
  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(process.env.PORT || 1000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
