var http = require('http'),
    os = require('os');

var ifaces = os.networkInterfaces();
var identity = '';
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) return;
    identity = identity + '[' + (iface.address) + '] ';
  });
});

var server = http.createServer(function (drRequest, doctorResponse) {
    doctorResponse.writeHead(200, {'Content-Type': 'text/html'});
  
    var options = {
      host: process.env.INTERNAL_SERVICE_NAME? process.env.INTERNAL_SERVICE_NAME : 'localhost',
      port: 8888,
      path: '/'
    };

    http.get(options, function(riverResponse) {
      var rsMessage = '';
      riverResponse.on('data', function(chunk) {
        rsMessage += chunk;
      });
      riverResponse.on('end', function() {
          var drMessage = 'I\'m the Doctor, calling Riversong from ' + identity + '.';
          doctorResponse.end('<html><body>' 
                       + '<p>' + drMessage + '</p>'
                       + '<blockquote>' + rsMessage + '</blockquote>'
                       + '</body></html>');
      });
    }).on('error', function(e) {
      console.log("Error: " + e.message);
    });   
    
});

server.listen(80);

console.log('The Doctor initialized.');