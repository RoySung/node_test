var http = require('http'),
    httpProxy = require('http-proxy');

http.createServer(function(req, res) {
  proxy.web(req, res, { target: 'http://simulator.ac:8080' });
});