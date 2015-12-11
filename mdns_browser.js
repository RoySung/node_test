var mdns = require('mdns-js');
var browser = mdns.createBrowser(mdns.tcp('http'));

browser.on('ready', function onReady() {
  console.log('browser is ready');
  browser.discover();
});


browser.on('update', function onUpdate(data) {
  console.log('data:', data);
});