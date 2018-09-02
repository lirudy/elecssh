# A SSH Terminal, Based Electron, xterm.js and ssh2(nodejs).

## TODO List:
  - <s>node list box</s>
  - <s>node info config file in HOME path</s>
  - scp file send and get
  - node config security
  - <s>muli-window</s>
  - fast command box
  - package binary file
  
## Config file format
$HOME/elecssh.json
```javascript
{
    "remote-list":{
        "node1":{
            "host": "192.168.0.1",
            "port": "22",
            "username": "testxt",
            "password": "123456"
        }
    }
}
```
## at windows, please use electron v1.7.12, DO NOT use latest version.