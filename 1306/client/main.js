import { io } from "socket.io-client";

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
    socket.on("MessageFromServer", function (msg) {
      console.log(msg);
      let textarea = document.getElementById("textarea");
      textarea.value += `${msg}\n\n`;
      textarea.scrollTop = textarea.scrollHeight;
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
  });

  document.getElementById("input").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      socket.username = document.getElementById("name").value;
      const value = document.getElementById("input").value;
      console.log(value);
      document.getElementById("input").value = "text";
      let textarea = document.getElementById("textarea");
      textarea.value += `${socket.username}: ${value}\n\n`;
      textarea.scrollTop = textarea.scrollHeight;
      socket.emit("MessageToServer", value, socket.username);
    }
  };
}

window.addEventListener("load", (event) => {
  main();
});
