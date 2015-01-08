var express = require('express');
var app = express();
app.use(express.static(__dirname+'/files'));
app.listen(3000, function(){

});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port:8080});

wss.broadcast = function(data){
    wss.clients.forEach(function(client){
        client.send(data);
    });
};

var usercount = 0;

function passwordMatches(users, name, password)
{
    return users[name] === password;
}

var userlist = {}
userlist['timmy'] = "foobar".hashCode;

wss.on('connection', function (ws){
    console.log("user "+usercount+" connected");
    ws.on('message', function (message){
        var data = JSON.parse(message);
        if (data.type === "login"){
            console.log("user attempting to log in");
            if (passwordMatches(userlist, data.username, data.password))
            {
                ws.loggedin = true;
                ws.username = data.username;
                console.log(data.username+" logged in!");
            }
        } else if (ws.loggedin && data.type === "chat") {
            console.log('got %s', message);
            wss.broadcast(ws.username+": "+data.message);
        }
    });
    ws.username = "User"+usercount++;
    ws.send("Hello");
});

//hashes a string, for passwords (really insecure ones)
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
