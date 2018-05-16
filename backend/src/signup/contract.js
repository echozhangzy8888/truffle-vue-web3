var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// var web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.66:7545"));
var fs = require('fs');


var json = JSON.parse(fs.readFileSync('./eth/build/contracts/Base.json', 'utf8'))

// var baseContract = new web3.eth.Contract(json.abi,json.networks["4447"].address);
var baseContract = new web3.eth.Contract(json.abi,json.networks["5777"].address);

// module.exports =  gangsterContract;
module.exports =  baseContract;