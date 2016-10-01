var wsUri = "ws://127.0.0.1:8123/echo";
//var wsUri = "ws://127.0.0.1:12345/echo";
//var wsUri = "wss://echo.websocket.org/";
var output;

function init() {
  output = document.getElementById("output");
  testWebSocket();
}

function testWebSocket() {
  ws = new WebSocket(wsUri);
  ws.onopen = function(evt) { onOpen(evt) };
  ws.onclose = function(evt) { onClose(evt) };
  ws.onmessage = function(evt) { onMessage(evt) };
  ws.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
  writeToScreen("Connected");
  doSend(JSON.stringify({cmd: "Print",
  "args":["Brown",
  "Fox","Lazy","Dog"]}));
}

function onClose(evt) {
  writeToScreen("Disconnected");
}

function onMessage(evt) {
  output.innerHTML = evt.data;
  /* writeToScreen('<span style="color: blue;">Response: ' + evt.data + '</span>');
  */
  //ws.close();
}

function doSend(msg) {
  writeToScreen("Sent: " + msg);
  ws.send(msg);
}

function onError(evt) {
  console.log(evt)
}

function writeToScreen(msg) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = msg;
  log.appendChild(pre);
  /* output.innerHTML = msg; */
}

window.addEventListener("load", init, false);
