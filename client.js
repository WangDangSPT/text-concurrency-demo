const sharedb = require('sharedb/lib/client');
const StringBinding = require('sharedb-string-binding');

// Open WebSocket connection to ShareDB server
const ReconnectingWebSocket = require('reconnecting-websocket');
const socket = new ReconnectingWebSocket('ws://' + window.location.host);
const connection = new sharedb.Connection(socket);

const element = document.querySelector('textarea');
const statusSpan = document.getElementById('status-span');
statusSpan.innerHTML = 'Not Connected';

element.style.backgroundColor = 'gray';
socket.addEventListener('open', function() {
  statusSpan.innerHTML = 'Connected';
  element.style.backgroundColor = 'white';
});

socket.addEventListener('close', function() {
  statusSpan.innerHTML = 'Closed';
  element.style.backgroundColor = 'gray';
});

socket.addEventListener('error', function() {
  statusSpan.innerHTML = 'Error';
  element.style.backgroundColor = 'red';
});

// Create local Doc instance mapped to 'examples' collection document with id 'textarea'
const doc = connection.get('examples', 'textarea');
doc.subscribe(function(err) {
  if (err) throw err;

  const binding = new StringBinding(element, doc, ['content']);
  binding.setup();
});