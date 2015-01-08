//var WebSocket = require('ws');
var ws = new WebSocket('ws://127.0.0.1:8080/');

ws.onmessage = function(event){
    console.log(event);
    document.getElementById("messages").innerHTML += event.data + "<br>";
};

function ready(){
    var box = document.getElementById("inputbox");
    console.log('ready!');

    box.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            var packet = {};
            packet.type = "chat";
            packet.message = box.value;
            ws.send(JSON.stringify(packet));
            box.value = "";
            return false;
        }
    }

    document.getElementById('passwordbox').onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        console.log("keypress");
        if (keyCode == '13'){
            console.log("enter");
            var packet = {};
            packet.type = "login";
            packet.username = document.getElementById('usernamebox').value.trim();
            packet.password = document.getElementById('passwordbox').value.trim();
            ws.send(JSON.stringify(packet));
            document.getElementById('loginBoxes').innerHTML += "<br>Login request sent</br>";
            return false;
        }
    }
    
    document.getElementById("registerbutton").onclick = function() {
        document.getElementById('shadow').style.display = "block";
    }
}



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
