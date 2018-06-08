## How to Run:

### ON RIG #1:
 1. Install nodejs 8 from here https://nodejs.org/en/
 2. Run START.bat
 3. If this PC is not your only rig, open port 8080 in your firewall
### ON OTHER RIGS:
   Edit your miner configs to use the IP of RIG #1 as the pool url.
      ...so if rig #1 is 192.168.0.5:  ->  use http://192.168.0.5:8080


Dev:
 - Install NodeJS 8
 - run `npm install`
 - run `node json-forward.js`