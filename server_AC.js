var server,
    ip,
    port = 8000,
    http = require('https'),
    fs = require("fs"),
    qs = require('querystring'),
    os = require('os'),
    folderPath = "static",
    url = require('url'),
    path,
    filePath,
    encode = "utf8";

var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem'),
    rejectUnauthorized: false
};


var networkInterfaces = os.networkInterfaces();
ip = networkInterfaces['en0'][1].address;

//Ac status
var ac_status = {
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
            "local_ip": ip,
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

server = http.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var POST = qs.parse(body);
            var respond = "";
            console.log("Receive POST :");
            console.log(POST);
            var keys = Object.keys(POST);
            var post_data = keys[0].split(",");
            var type = post_data[0].split("_")[0];
            //GET
            if (type == 'GET') {
                respond = JSON.stringify(ac_status);
            }
            if (type == 'SET') {
                for (var key in ac_status.status) {
                    for (var i = 0; i < post_data.length; i++) {
                        if (i == 0) {
                            ac_status.status[post_data[i].split("_")[2]] = parseInt(post_data[i].split("_")[3]);
                        } else {
                            ac_status.status[post_data[i].split("_")[0]] = parseInt(post_data[i].split("_")[1]);
                        }
                    }
                }
                respond = JSON.stringify(ac_status);
            }
            res.setTimeout(1000);
            res.writeHead(200, {
                'Content-Length': respond.length
            });
            res.write(respond);
            res.end();
        });
    }
});

server.listen(port, ip);
console.log("Server running at https://" + ip + ":" + port);
