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
    cert: fs.readFileSync('./certificate.pem')
};

var networkInterfaces = os.networkInterfaces();
ip = networkInterfaces['eth0'][0]['address'];

server = http.createServer(options,function(req, res) {
    if(req.method=='POST') {
            var body='';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end',function(){
                var POST =  qs.parse(body);
                console.log("Receive POST :");
                console.log(POST);
                res.writeHead(200,{});
                var data = {
                        "profile":{
                        "saa":{
                        "class":123,
                        "saa_version":4,
                        "device_id":1,
                        "brand":"Hitachi",
                        "model":"ac1000"
                        },
                        "module":{
                        "firmware_version":1,
                        "mac_address":"AC123",
                        "local_ip":"192.168.0.13",
                        "ssid":"BRX13"
                        }
                        },
                        "status":{
                        "H00":0,
                        "H01":0,
                        "H02":0,
                        "H03":0,
                        "H04":0,
                        "H05":0,
                        "H0E":0,
                        "H0F":0,
                        "H10":0,
                        "H14":0,
                        "H17":0,
                        "H20":0,
                        "H21":0,
                        "H28":0,
                        "H29":0
                        },
                        "calendar":[
                        {
                        "start":"12:24",
                        "end":"13:24",
                        "days":[
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                        ],
                        "active":1,
                        "saa":{
                        "H00":1
                        }
                        }
                        ],
                        "timer":121,
                        "poll_interval":120,
                        "heartbeat_interval":900,
                        "saa_interval":30,
                        "fields":[
                        "H00",
                        "H01",
                        "H02",
                        "H03",
                        "H04",
                        "H05",
                        "H0E",
                        "H0F",
                        "H10",
                        "H14",
                        "H17",
                        "H20",
                        "H21",
                        "H28",
                        "H29"
                        ],
                        "users":[
                        "123ABC",
                        "456DEF"
                        ]
                        };
                //res.write("");    
                //res.end();
                res.writeHead(200,{'Content-Type': 'application/json'});
                res.write(JSON.stringify(data)); 
                res.end();
            });
    } else if(req.method=='GET') {
        var url_parts = url.parse(req.url,true);
        console.log("Receive GET :");
        console.log(url_parts.query);
    }
});

server.listen(port, ip);
console.log("Server running at https://" + ip + ":" + port);




