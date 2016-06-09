var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

var tcpClients = [];

var server = net.createServer(function(socket) {
	tcpClients.push(socket);

	io.emit('tcp connected', socket.name);

	socket.on('data', function (data) {
    	io.emit('tcp message', data);
  	});

  socket.on('end', function () {
	tcpClients.splice(tcpClients.indexOf(socket), 1);
	io.emit('tcp disconnected', socket.name);
  });
});

server.listen(6162, '0.0.0.0');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);

    tcpClients.forEach(function (client) {
    	client.write(msg);
    });
  });
});

http.listen(6161, function(){
  console.log('listening on *:6161');
});
