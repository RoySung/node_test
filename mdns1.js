var mdns = require('mdns-js');
var amount = process.argv[2];
var service = Array() ;
var i;
var portfinder = require('portfinder');

console.log("Info: build " + amount + " device .");

portfinder.getPort(function (err, port) {
	for (i = 0 ; i<amount ;i++) {
		service[i] = mdns.createAdvertisement(mdns.tcp('HTTP'), 80, {
		  name:'20C38FF76B47@mysimplelink',
		  txt:{
		    path:'/',
		    srcvers:'1D90645'
		  }
		});
		service[i].start();
	}
});

// read from stdin
process.stdin.resume();

// stop on Ctrl-C
process.on('SIGINT', function () {
	for (i = 0 ; i<amount ;i++) {
		service[i].stop();
	}

	// give deregistration a little time
	setTimeout(function onTimeout() {
    	process.exit();
	}, 1000);
});