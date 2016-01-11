// import the module
var mdns = require('mdns'),
    portastic = require('portastic'),
    amount = process.argv[2],
    service = new Array();

console.log("Info: build " + amount + " device .");

//multiple dns
portastic.find({
        min: 8000,
        max: 65535,
        retrieve: amount
    })
    .then(function(ports) {
        for (var i = 0; i < ports.length; i++) {
            service[i] = mdns.createAdvertisement(mdns.tcp('_hitachi'), ports[i], {
                name: 'HITACHI_RAS-' + i,
                txtRecord: {
                    path: "/",
                    id: "A0:24:85:42:E9:" + ((i < 10) ? "0" + i : i),
                    vs: "255",
                    err: "0",
                    st: "0"
                }
            }).start();
        }

    });
