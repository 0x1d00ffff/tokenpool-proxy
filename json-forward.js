/*

ON RIG #1:
   1. Install nodejs 8 from here https://nodejs.org/en/
   2. Run START.bat
   3. If this PC is not your only rig, open port 8586 in your firewall


ON OTHER RIGS:
   Edit your miner configs to use the IP of RIG #1 as the pool url.
      ...so if rig #1 is 192.168.0.5:  ->  use http://192.168.0.5:8080

*/

var pool_url = "http://mike.rs:8080"
var cached_value_time = 5;



/*DONT CHANGE SHIT BELOW HERE*/



var jayson = require('jayson');
var web3utils = require('web3-utils')
var version = "0.0.5"

var cache = {
    getPoolEthAddress: {
        updated: 0,
        last_val: null,
    },
    submitShare: {
        updated: 0,
        last_val: null,
    },
    getMinimumShareDifficulty: {
        updated: 0,
        last_val: null,
    },
    getMinimumShareTarget: {
        updated: 0,
        last_val: null,
    },
    getChallengeNumber: {
        updated: 0,
        last_val: null,
    },
    getAllMiningParameters: {
        updated: 0,
        last_val: null,
    },
    getMinerData: {
        updated: 0,
        last_val: null,
    },
    getAllMinerData: {
        updated: 0,
        last_val: null,
    },
    getAllTransactionData: {
        updated: 0,
        last_val: null,
    },
    getPoolData: {
        updated: 0,
        last_val: null,
    },
    getMintingAccount: {
        updated: 0,
        last_val: null,
    },
    getPaymentAccount: {
        updated: 0,
        last_val: null,
    },
}


function getDataCached(endpoint_name) {
    return function (args, callback) {
        console.log(endpoint_name);

        if(cache[endpoint_name].updated == 0
            || cache[endpoint_name].last_val === null
            || Date.now() / 1000 > cache[endpoint_name].updated + cached_value_time ) {

            console.log('  tx to server..');


            let client = jayson.client.http(pool_url);
            client.request(endpoint_name, args, function(err, response) {
                if(err) {
                    console.log('  cannot talk to pool');
                }

                console.log('  server says', response.result);

                cache[endpoint_name].updated = Date.now() / 1000;
                cache[endpoint_name].last_val = response.result;

                callback(null, response.result);
            });

        } else {
            console.log('  using cached');
            callback(null, cache[endpoint_name].last_val)
        }

    }
}
function getDataImmediate(endpoint_name) {
    return function (args, callback) {
        console.log(endpoint_name);
        console.log('  tx to server..');
        let client = jayson.client.http(pool_url);
        client.request(endpoint_name, args, function(err, response) {
            if(err) {
                console.log('  cannot talk to pool');
            }

            console.log('  server says', response.result);
            callback(null, response.result);
        });
    }
}


var server = jayson.server({
  ping: jayson.client.http(pool_url),

  getPoolEthAddress: getDataCached('getPoolEthAddress'),
  submitShare: getDataImmediate('submitShare'),
  getMinimumShareDifficulty: getDataCached('getMinimumShareDifficulty'),
  getMinimumShareTarget: getDataCached('getMinimumShareTarget'),
  getChallengeNumber: getDataCached('getChallengeNumber'),
  getAllMiningParameters: getDataCached('getAllMiningParameters'),
  getMinerData: getDataCached('getMinerData'),
  getAllMinerData: getDataCached('getAllMinerData'),
  getAllTransactionData: getDataCached('getAllTransactionData'),
  getPoolData: getDataCached('getPoolData'),
  getMintingAccount: getDataCached('getMintingAccount'),
  getPaymentAccount: getDataCached('getPaymentAccount'),
});

console.log('init v' + version);

server.http().listen(8080);
console.log('listening on port', 8080);