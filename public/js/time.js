// VARS_S OMIT
var wsUri = "ws://127.0.0.1:8123/time"; // HL
var output;

function init() {
  output = document.getElementById("clock");
  timeWebSocket();
}
// VARS_E OMIT

// TS_S OMIT
function timeWebSocket() {
  ws = new WebSocket(wsUri);
  ws.onopen = function(evt) { onOpen(evt) };
  ws.onclose = function(evt) { onClose(evt) };
  ws.onmessage = function(evt) { onMessage(evt) }; // HL
  ws.onerror = function(evt) { onError(evt) };
}
// TS_E OMIT

function onOpen(evt) {

}

function onClose(evt) {

}

// OM_S OMIT
function onMessage(evt) {
  output.innerHTML = '<p>'+evt.data; // HL

}
// OM_E OMIT

function doSend(msg) {
  ws.send(msg);
}

function onError(evt) {
  console.log(evt)
}


window.addEventListener("load", init, false);
