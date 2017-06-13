var http = require('http'),
    os = require('os');

// CSS from http://codepen.io/anon/pen/LyMJqX
var css = `
<style>
@import "https://fonts.googleapis.com/css?family=Open+Sans:300,400";
body, .badgescard, .firstinfo {
  display: flex;
  justify-content: center;
  align-items: center;
}

html {
  height: 100%;
}

body {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  min-height: 100%;
  background: #009688;
  font-size: 16px;
  overflow: hidden;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.content {
  position: relative;
  animation: animatop 0.9s cubic-bezier(0.425, 1.14, 0.47, 1.125) forwards;
}

.card {
  margin: 20px 0;
  width: 500px;
  min-height: 100px;
  padding: 20px;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}
.card:after {
  content: '';
  display: block;
  width: 190px;
  height: 300px;
  background:  	green;
  position: absolute;
  animation: rotatemagic 0.75s cubic-bezier(0.425, 1.04, 0.47, 1.105) 1s both;
}


.firstinfo {
  flex-direction: row;
  z-index: 2;
  position: relative;
}
.firstinfo img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
}
.firstinfo .profileinfo {
  padding: 0px 20px;
}
.firstinfo .profileinfo h1 {
  font-size: 1.8em;
}
.firstinfo .profileinfo h3 {
  font-size: 1.2em;
  color: #009688;
  font-style: italic;
}
.firstinfo .profileinfo p.bio {
  padding: 10px 0px;
  color: #5A5A5A;
  line-height: 1.2;
  font-style: initial;
}

@keyframes animatop {
  0% {
    opacity: 0;
    bottom: -500px;
  }
  100% {
    opacity: 1;
    bottom: 0px;
  }
}
@keyframes animainfos {
  0% {
    bottom: 10px;
  }
  100% {
    bottom: -42px;
  }
}
@keyframes rotatemagic {
  0% {
    opacity: 0;
    transform: rotate(0deg);
    top: -24px;
    left: -253px;
  }
  100% {
    transform: rotate(-30deg);
    top: -24px;
    left: -78px;
  }
}
</style>
`;
var html = `

<div class="content">
  <div class="card">
    <div class="firstinfo"><img src="https://s-media-cache-ak0.pinimg.com/originals/9f/0e/be/9f0ebe5fae590f559240f3f5ad955c04.jpg"/>
      <div class="profileinfo">
        <h1>The Doctor</h1>
        <h3>Timelord</h3>
        <p class="bio">
          <p>What?</p>
          <p>$edgeIdentity</p>
        </p>
      </div>
    </div>
  </div>
   
  <div class="card">
    <div class="firstinfo"><img src="$internalPhoto"/>
      <div class="profileinfo">
        <h1>$internalName</h1>
        <h3>$internalPosition</h3>
        <p class="bio">
          <p>$internalMessage</p>
          <p>$internalIdentity</p>
        </p>
      </div>
    </div>
  </div>

</div>
`;


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
          var content = JSON.parse(rsMessage);
          var message = css + html
            .replace('$edgeIdentity', identity)
            .replace('$internalName', content.name)
            .replace('$internalPhoto', content.photo)
            .replace('$internalPosition', content.position)
            .replace('$internalMessage', content.message)
            .replace('$internalIdentity', content.identity);
          
          doctorResponse.end('<html><body>' + message + '</body></html>');
      });
    }).on('error', function(e) {
      console.log("Error: " + e.message);
    });   
    
});

server.listen(80);

console.log('The Doctor initialized.');
