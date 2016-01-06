var https = require('https'),
	fs = require('fs'),
	qs = require('querystring'),
    host = "10.10.1.11",
    port = 41741,
    path = "/",
    method = 'POST',
    postData = 'GET_881291ec4df4ef0b4f66f093c603a3a31f4d3e2f';


var options = {
	hostname: host,
	port: port,
	path: path,
	method: method,
	body: postData,
	headers: {
	    'Content-Length': Buffer.byteLength(postData)
  	},
	secureProtocol: "SSLv3_method",
    /*key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem'),*/
    ciphers: 'RC4-SHA',
	honorCipherOrder: true,
    rejectUnauthorized: false
};

var req = https.request(options, function(res){
	console.log("statusCode: ", res.statusCode);
	console.log("headers: ", res.headers);

	res.on('data', function(d) {
		console.log("data: ");
		process.stdout.write(d);
	});
});
req.write(postData);
req.end();

req.on('error', function(e) {
	console.error(e);
});