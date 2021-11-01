import express from "express";
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const TICKRATE = 200;
const PORT = process.env.PORT || 3000;

let objectsstate = null;
let obj1 = {
  position_x: 0,
  position_y: 0,
};
let increases: boolean = true;

function refreshFigures() {
  if (obj1.position_x === 1200) {
    increases = false;
  } else if (obj1.position_x === 0){
    increases = true;
  }

  if (increases) {
    obj1.position_x += 10;
  } else {
    obj1.position_x -= 10;
  }
}

function tick() {
  refreshFigures();
  objectsstate = { obj1: obj1 };
  io.sockets.emit("updatepos", objectsstate);
}

app.use("/", express.static("www/"));

app.get("/", (req: any, res: any) => {
  //res.sendFile(path.resolve("www/index.html"));
  res.sendFile(__dirname + "/www/index.html");
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  console.log("a user connected");
});

setInterval(function () {
  tick();
}, TICKRATE);

http.listen(PORT, function () {
  console.log("listening on *:" + PORT);
});
