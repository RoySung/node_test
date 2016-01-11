//Mdns define
var mdns = require('mdns'),
    portastic = require('portastic'),
    //amount = process.argv[2],
    amount = 1,
    mdnsService = new Array();
//Server define 
var server,
    ip,
    port = 8000,
    tls = require('tls'),
    fs = require("fs"),
    os = require('os'),
    encode = "ascii",
    options = {
        key: fs.readFileSync('./privatekey.pem'),
        cert: fs.readFileSync('./certificate.pem'),
        rejectUnauthorized: false
    };

var networkInterfaces = os.networkInterfaces();
ip = networkInterfaces['en0'][1].address;

//AC define
var AC = {
    "profile": {
        "saa": {
            "class": 8,
            "saa_version": 4,
            "device_id": 1,
            "brand": "HITACHI",
            "model": "RAS-28NB"
        },
        "module": {
            "firmware_version": 262,
            "mac_address": "A0:24:85:42:E9:43",
            "local_ip": "",
            "ssid": "HITACHI N300RE"
        }
    },
    "status": {
        "H00": 1,
        "H01": 0,
        "H02": 0,
        "H03": 20,
        "H04": 24,
        "H06": 0,
        "H0E": 0,
        "H11": 5,
        "H14": 53,
        "H17": 0,
        "H1E": 0,
        "H1F": 0,
        "H20": 0,
        "H21": 0,
        "H29": 0
    },
    "calendar": [],
    "timer": 0,
    "poll_interval": 60,
    "heartbeat_interval": 90,
    "saa_interval": 30,
    "fields": ["H00", "H01", "H02", "H03", "H04", "H06", "H0E", "H11", "H14", "H17", "H1E", "H1F", "H20", "H21", "H29"],
    "users": []
};
//console.log("Info: build " + amount + " device .");

server = tls.createServer(options, onSocket);

portastic.find({
        min: 8000,
        max: 65535,
        retrieve: amount
    })
    .then(function(ports) {
        server.listen(ports[0], function() {
            console.log("Server is listen to " + ip + ":" + ports[0]);
        });
        createMdns(ports);
    });


//Server 
function onSocket(socket) {
    socket.setEncoding(encode);
    socket.on('data', function(post) {
        //console.log('Get data :\n' + post.toString());
        var command = post.toString().split('\n')[3];
        var type = command.split('_')[0];
        var data = command.split(',');
        console.log(command);
        var respond = "";
        if (type == "INI") {
            //console.log("Add Device");
        } else if (type == 'GET') {
            respond = JSON.stringify(AC);
        } else if (type == 'SET') {
            for (var i = 0; i < data.length; i++) {
                if (i == 0) {
                    AC.status[data[i].split("_")[2]] = parseInt(data[i].split("_")[3]);
                    console.log(data[i].split("_")[2] + "->" + data[i].split("_")[3]);
                } else {
                    AC.status[data[i].split("_")[0]] = parseInt(data[i].split("_")[1]);
                    console.log(data[i].split("_")[0] + "->" + data[i].split("_")[1]);
                }

            }
            respond = JSON.stringify(AC);
        }
        socket.setTimeout(1000);
        socket.write('HTTP/1.1 200 OK\r\n' +
            'Content-Length: ' + respond.length + '\r\n' +
            '\r\n');
        socket.write(respond);
        socket.end();
        socket.pipe(socket);
    });
}

function createMdns(port) {
    for (var i = 0; i < port.length; i++) {
        mdnsService[i] = mdns.createAdvertisement(mdns.tcp('_hitachi'), port[i], {
            name: 'HITACHI_RAS-' + i,
            txtRecord: {
                path: "/",
                id: "A0:24:85:42:E9:" + ((i < 10) ? "0" + i : i),
                vs: "255",
                err: "0",
                st: "0"
            }
        });
    }
}
