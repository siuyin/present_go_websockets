// INIT_START OMIT
var wsUri = "ws://127.0.0.1:8123/echo"; // HL
var output;
var log;

function init() {
  output = document.getElementById("output");
  log = document.getElementById("log");
  runWebSocket();
}
// INIT_END OMIT

// RWS_S OMIT
function runWebSocket() {
  ws = new WebSocket(wsUri);
  ws.onopen = function(evt) { onOpen(evt) };
  ws.onclose = function(evt) { onClose(evt) };
  ws.onmessage = function(evt) { onMessage(evt) };
  ws.onerror = function(evt) { onError(evt) };
}
// RWS_E OMIT

// OP_S OMIT
function onOpen(evt) {
  writeToScreen("Connected");
  doSend(JSON.stringify({cmd: "Print", // HL
  "args":["Brown",
  "Fox","Lazy","Dog"]}));
}
// OP_E OMIT

function onClose(evt) {
  writeToScreen("Disconnected");
}

// OMS_S OMIT
function onMessage(evt) {
  output.innerHTML = '<p>'+evt.data;
}
// OMS_E OMIT

// UTIL_S OMIT
function doSend(msg) {
  writeToScreen("Sent: " + msg);
  ws.send(msg);
}
function writeToScreen(msg) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = msg;
  log.appendChild(pre);
}
// UTIL_E OMIT
function onError(evt) {
  console.log(evt)
}

// LISTEN_S OMIT
window.addEventListener("load", init, false);
// LISTEN_E OMIT
