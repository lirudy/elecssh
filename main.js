

var GlobalVar = window.GlobalVar || {};
GlobalVar.ValueList = new function(){
  var self = this;
  
  var os = require('os');
  var nodeConf = require(os.homedir + "/elecssh.json");
  var rmNodes =  nodeConf["remote-list"];

  //all opened remote node
  var currentNode = {};

  
  self.addNewNode = function(nodeName) {
    var addr_bar = document.getElementById("addr_bar");
    var new_addr = document.createElement("nav-item");
    new_addr.textContent = nodeName;
    addr_bar.appendChild(new_addr);
  };


  //get node link info
  self.getNode = function(nodeName){
    return rmNodes[nodeName];
  }

  //add new node to node list
  self.setName = function(nodeName){
    return currentNode[nodeName] = "";
  }

  //check node existed
  self.getName = function (nodeName){
    return currentNode[nodeName];
  }

  //remove node form existed
  self.delName = function (nodeName){
    return currentNode[nodeName] = null;
  }


  for (var remoteNode_id in rmNodes) {
    console.log(rmNodes[remoteNode_id]);
    remoteNode = rmNodes[remoteNode_id];
    self.addNewNode(remoteNode_id);
    
  };

  
}

var ep = require('electron-photon');

var xterm = require('xterm');
var ssh = require('ssh2');



var NameSpace = window.NameSpace || {};
NameSpace.ConsoleBuilder = new function() {
  
  var self = this;
  
  self.conn = function(_name,_nodeInfo) {
    var term = new xterm.Terminal();
    term.open(document.getElementById('terminal'));
    term.write('Hello from \x1B[1;3;31melecssh\x1B[0m $ ');
    var Client = require('ssh2').Client;
    var conn = new Client();
    
    
    var tab_grp = document.getElementById("term-group");

    var tab = document.createElement("tab-item");

    var tab_close = document.createElement("button");
    tab_close.setAttribute("action", "close");
    tab.appendChild(tab_close);

    tab.id = _name;
    tab_close.addEventListener("click", function (){
      console.log("click tab bt :" + event.srcElement.id);
    });
    //tab.addEventListener()
    tab.addEventListener("focus", function (){
      console.log("click tab :" + event.srcElement.id);
    });
    //tab.addEventListener()
    //tab.addEventListener("destory", function (){
    //  console.log("click tab :" + event.srcElement.id);
    //});

    var tab_name = document.createElement("div");
    tab_name.textContent = _name;
    tab.appendChild(tab_name);

    tab_grp.appendChild(tab);

    conn.on('ready', function () {
      console.log('Client :: ready');
      conn.shell(function (err, stream) {
        if (err) throw err;
        stream.on('close', function () {
          console.log('Stream :: close');
          conn.end();
          
          //remove node
          GlobalVar.ValueList.delName(_name);

          //close xterm window
          term.destroy();

        }).on('data', function (data) {
          term.write(String(data));
        }).stderr.on('data', function (data) {
          term.write(String(data));
        });
        term.on('data', function (data) {
          stream.write(data);
        })
      });
    
    }).connect(_nodeInfo);
  };
};



document.getElementById("addr_bar").addEventListener("dblclick", function (event) {

  var nodeName = event.srcElement.textContent;

  if(GlobalVar.ValueList.getName(nodeName) == null){
    //open new node link
    GlobalVar.ValueList.currentNode = nodeName;
    console.log(GlobalVar.ValueList.getNode(nodeName));
    
    NameSpace.ConsoleBuilder.conn(nodeName, GlobalVar.ValueList.getNode(nodeName));
    GlobalVar.ValueList.setName(nodeName)

  }else{
    //existed node, do nothing.
    console.log("current node is " + GlobalVar.ValueList.getNode(nodeName));
  }
});