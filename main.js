

var GlobalVar = window.GlobalVar || {};
GlobalVar.ValueList = new function () {
  var self = this;

  var os = require('os');
  var nodeConf = require(os.homedir + "/elecssh.json");
  var rmNodes = nodeConf["remote-list"];

  var currentTerm = "";

  //all opened remote node
  var currentNode = {};


  self.switchTerm = function (nextTerm) {
    console.log("nextTerm: " + nextTerm + ",  currentTerm: " + currentTerm);


    if (currentTerm != "" && document.getElementById(currentTerm)) {
      document.getElementById(currentTerm).style.display = "none";
    }
    document.getElementById(nextTerm).style.display = "";
    currentTerm = nextTerm;
  };

  self.addNewNode = function (nodeName) {
    var addr_bar = document.getElementById("addr_bar");
    var new_addr = document.createElement("nav-item");
    new_addr.textContent = nodeName;
    addr_bar.appendChild(new_addr);
  };


  //get node link info
  self.getNode = function (nodeName) {
    return rmNodes[nodeName];
  }

  //add new node to node list
  self.setName = function (nodeName) {
    return currentNode[nodeName] = "";
  }

  //check node existed
  self.getName = function (nodeName) {
    return currentNode[nodeName];
  }

  //remove node form existed
  self.delName = function (nodeName) {
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
NameSpace.ConsoleBuilder = new function () {

  var self = this;

  self.conn = function (_name, _nodeInfo) {
    var term = new xterm.Terminal();

    var term_box = document.createElement('div');
    term_box.id = _name + "_term_box";
    term_box.setAttribute("class", "pop_win");

    document.getElementById("term-panel").appendChild(term_box);

    term.open(term_box);
    term.write('Hello from \x1B[1;3;31melecssh\x1B[0m $ ');
    var Client = require('ssh2').Client;
    var conn = new Client();


    var tab_grp = document.getElementById("term-group");

    var tab = document.createElement("div");
    tab.setAttribute("class", "tab-item");
    var tab_close = document.createElement("div");
    tab_close.setAttribute("class", "icon icon-cancel icon-close-tab");
    tab.appendChild(tab_close);

    tab.addEventListener("destoryTerm", function () {
      console.log("destory tab :" + event.srcElement.id);
      conn.end();
      GlobalVar.ValueList.delName(_name);
      term.destroy();
      term_box = document.getElementById(_name + "_term_box");
      if (term_box) {
        document.getElementById("term-panel").removeChild(term_box);
      }

      showWin = document.getElementById("msgBox");
      pop_win = document.getElementById("pop_win");
      if (showWin && pop_win) {
        showWin.removeChild(pop_win);
      }

      tab_grp.removeChild(tab);

    });


    tab.addEventListener("click", function () {
      console.log("click tab :" + event.srcElement.id);

      GlobalVar.ValueList.switchTerm(_name + "_term_box");

    });


    tab.id = _name;
    tab_close.addEventListener("click", function () {
      console.log("click tab close:" + event.srcElement.id);
      var pop_win = document.createElement("div");
      pop_win.setAttribute("class", "panel");

      pop_win.textContent = "close this term ?";

      pop_win.className = "pop_win"

      pop_win.id = "pop_win";

      var pop_ok = document.createElement("button");
      var pop_cancel = document.createElement("button");

      pop_ok.setAttribute("class", "btn btn-negative");
      pop_ok.textContent = "ok";

      pop_cancel.setAttribute("class", "btn btn-positive");
      pop_cancel.textContent = "cancel";

      pop_win.appendChild(pop_cancel);
      pop_win.appendChild(pop_ok);


      showWin = document.getElementById("msgBox");

      pop_ok.addEventListener("click", function () {
        console.log("click pop_ok :" + event.srcElement.id);

        var destory_event = document.createEvent("HTMLevents");
        destory_event.initEvent("destoryTerm", false, false);
        tab.dispatchEvent(destory_event);

      });


      pop_cancel.addEventListener("click", function () {
        console.log("click pop_cancel :" + event.srcElement.id);
        showWin.removeChild(pop_win);
      });

      showWin.appendChild(pop_win);

    });


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

          var destory_event = document.createEvent("HTMLevents");
          destory_event.initEvent("destoryTerm", false, false);
          tab.dispatchEvent(destory_event);

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

  if (GlobalVar.ValueList.getName(nodeName) == null) {
    //open new node link
    GlobalVar.ValueList.currentNode = nodeName;
    console.log(GlobalVar.ValueList.getNode(nodeName));

    NameSpace.ConsoleBuilder.conn(nodeName, GlobalVar.ValueList.getNode(nodeName));
    GlobalVar.ValueList.setName(nodeName);

    GlobalVar.ValueList.switchTerm(nodeName + "_term_box");

  } else {
    //existed node, do nothing.
    console.log("current node is " + GlobalVar.ValueList.getNode(nodeName));
  }
});