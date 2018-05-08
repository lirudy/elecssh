var os = require('os')
var conf = require(os.homedir+"/elecssh.json")


var nodes = conf["node-list"];
var node = "nil";
for (var key in nodes)
{
  console.log(nodes[key]);
  node = nodes[key];
}


var xterm = require('xterm');
var ssh = require('ssh2');

var term = new xterm.Terminal();
term.open(document.getElementById('terminal'));

term.write('Hello from \x1B[1;3;31melecssh\x1B[0m $ ');

var Client = require('ssh2').Client;

var conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.shell(function(err, stream) {
    if (err) throw err;
    stream.on('close', function() {
      console.log('Stream :: close');
      conn.end();
    }).on('data', function(data) {
      term.write(String(data));
    }).stderr.on('data', function(data) {
      term.write(String(data));
    });

    term.textarea.onkeydown = function (e) {
        if (e.key != 'Enter'){
          stream.write(e.key);
        }else{
          stream.write('\n');
        }
      }  
  });
  
}).connect(node);

