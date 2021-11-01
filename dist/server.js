"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
//how often the server updates the client in milliseconds
var tickrate = 200;
var objectsstate = null;
var http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
var io = require("socket.io")(http);
var obj1 = {
    position_x: 0,
    position_y: 0,
};
function refreshFigures() {
    obj1.position_x += 10;
}
function tick() {
    refreshFigures();
    objectsstate = { obj1: obj1 };
    io.sockets.emit('updatepos', objectsstate);
}
app.use('/', express_1.default.static('www/'));
app.get("/", function (req, res) {
    //res.sendFile(path.resolve("www/index.html"));
    res.sendFile(__dirname + '/www/index.html');
});
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket) {
    console.log("a user connected");
});
setInterval(function () { tick(); }, tickrate);
http.listen(PORT, function () {
    console.log('listening on *:' + PORT);
});
