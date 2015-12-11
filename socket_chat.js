Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
var net = require('net'),
	ip = "192.168.11.28",
	port = 8000;
var sockets = [];
var server = net.createServer(function(socket) {
	sockets.push(socket);
    socket.write('hello\n');
    socket.write('world\n');
    socket.on('data', function(data){
        var i;
        for (i=0; i < sockets.length; i++){
            if (sockets[i] === socket)  continue;
            sockets[i].write(data.toString());
            console.log(data.toString());
        }
    });
    socket.on('end', function(){
        var i = sockets.indexOf(socket);
        sockets.remove(i);
    });
});

server.listen(port, ip);