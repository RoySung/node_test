var net = require('net'),
    ip = "192.168.11.28",
    port = 8000;

var server = net.createServer(function(socket) {
    socket.on('data',function(data){
    	console.log('Get data from '+ socket.remoteAddress + ' : ' + data);
    	socket.write('Hi !');
    });
});

server.listen(port, ip);