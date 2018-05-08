# A SSH Terminal, Based Electron, xterm.js and ssh2(nodejs).

## TODO List:
  - node list box
  - node info config file in HOME path
  - scp file send and get
  - node config security
  - muli-window
  - fast command box
  - package binary file
  
## Config file format
$HOME/elecssh.json
```javascript
{
    "node-list":{
        "node1":{
            "host": "192.168.0.1",
            "port": "22",
            "username": "testxt",
            "password": "123456"
        }
    }
}
```
