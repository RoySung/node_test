var net = require('net'),
	ip = "192.168.11.28",
    port = 8000;

var client = new net.Socket();
client.connect(port, ip, function() {
	console.log('Connected');
	client.write('Hello ! i am Roy');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});