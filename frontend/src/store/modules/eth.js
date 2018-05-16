const Web3 = require('web3')
/* eslint-disable */
let myWeb3
let isMetaMask = false
// if (typeof web3 !== 'undefined') {
//   myWeb3 = new Web3(web3.currentProvider)
//   isMetaMask = true
// } else {
  //Should be deleted production

  myWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
  // console.error('No browser web3 client found')

// }


// Initiate contracts
// let network = '4447'
let network = '5777'
import * as jsonBaseContract from '../../contracts/Base.json'
let BaseContract = new myWeb3.eth.Contract(jsonBaseContract.abi, jsonBaseContract.networks[network].address)
// let BaseContract = new myWeb3.eth.Contract(jsonBaseContract.abi, "0x345ca3e014aaf5dca488057592ee47305d9b3e10")

// import shop from '../../api/shop'
const namespaced = true

// initial state
const state = {
  clientAccount: null,
  welcomeText: "",
  isMetaMask: isMetaMask,
  animals: {},
  animalList: [],
  currentBlock: null
}

// getters
const getters = {
  isMetaMask: state => state.isMetaMask,
  clientAccount: state => state.clientAccount,
  welcomeText: state => state.welcomeText,
  currentBlock: state => state.currentBlock,
  animals: state => state.animals,
  animalList: state => state.animalList
}

/**测试 confirmations of a transaction 开始 */
myWeb3.eth.getBlockNumber().then(res => {
  console.log('getBlockNumber：',res)

  //confirmedBlock 

   myWeb3.eth.getBlock(res).then(confirmedBlock => {
    console.log('confirmedBlock',confirmedBlock)

    if (confirmedBlock.transactions.length > 0) {
        confirmedBlock.transactions.forEach(function(txId) {

          myWeb3.eth.getTransaction(txId).then(transaction => { 
            console.log('循环，通过 txId 得 transaction信息',transaction)
            console.log(state.clientAccount)
            console.log( '智能合约地址：', jsonBaseContract.networks[network].address)
              if (transaction.to == jsonBaseContract.networks[network].address  ) {
                // Do something useful.
                console.log("确定交易谢谢谢谢谢谢谢谢谢谢")
              }
          })

        })
    }
  }) 

}) 
/**测试 confirmations of a transaction 结束 */


/* eslint-enable */
// actions
const actions = {
  async start({dispatch, commit}) {
    dispatch('getAccounts')
    await dispatch('getCoinbase')
    dispatch('syncWelcomeText')
    dispatch('syncAnimalByOwner', {address: state.clientAccount})

   // Create an event checker loop. Metamask does not support subscriptions yet. So we need to create our own subscription like service.
    setInterval(() => {
      myWeb3.eth.getBlockNumber()
        .then((res) => {
          console.log("定时器执行", res)
          if (state.currentBlock === null) {
            commit('setCurrentBlock', {block: res})
            return
          }
          if (res !== state.currentBlock) {
            dispatch('watchAnimals', {fromBlock: res, toBlock: res})
            commit('setCurrentBlock', {block: res})
          }
        })
    }, 2000)
  },
  confirmTransation({commit}, data) {
    console.log(data.transactionHash)
    myWeb3.eth.getTransaction(data.transactionHash).then(transaction => {
      console.log('得 transaction信息', transaction)
      console.log(state.clientAccount)
      console.log('智能合约地址：', jsonBaseContract.networks[network].address)
        if (transaction.to === jsonBaseContract.networks[network].address) {
          // Do something useful.
          console.log("确定交易谢谢谢谢谢谢谢谢谢谢")
        }
    })
  },
  getAccounts() {
     return new Promise(resolve => {
      myWeb3.eth.getAccounts()
        .then(res => {
          if (res === undefined) {
            console.error('查看账号列表 失败')
          } else {
            console.log("查看账号列表", res)
            resolve()
          }
        })
    })
  },
  getCoinbase({commit}) {
    return new Promise(resolve => {
      myWeb3.eth.getCoinbase()
        .then(res => {
          if (res === undefined) {
            console.error('web3 address was undefined')
          } else {
            console.log('执行了 getCoinbase', res)
            commit('setClientAccount', res)
            resolve()
          }
        })
    })
  },
  syncWelcomeText({commit}) {
    console.log('获取 BaseContract', BaseContract)
    console.log(state.clientAccount)
    BaseContract.methods.getWelcomeText()
      .call({from: state.clientAccount}, function (error, res) {
        if (error !== null) {
          console.error('getWelcomeText ', error)
        } else {
          commit('updateWelcomeText', {text: res})
        }
      })
  },
  syncAnimalByOwner({commit, dispatch}, data) {
    BaseContract.methods.getAnimalByOwner(data.address)
      .call({from: state.clientAccount}, function (error, res) {
        if (error !== null) {
          console.error('getAnimalByOwner ', error)
        } else {
          console.log("智能合约Base的getAnimalByOwner方法", res)
          let ids = res.map(id => parseInt(id))
          for (let id in ids) {
            dispatch('syncAnimal', {id: id})
          }
          commit('updateAnimalList', {list: ids})
        }
      })
  },
  watchAnimals({dispatch}, data) {
    BaseContract.getPastEvents('NewAnimal', {
        fromBlock: data.fromBlock,
        toBlock: data.toBlock
      }, function (error, events) {
        if (error !== null) {
          console.error('watchAnimals ', error)
        } else {
          events.forEach((event) => {
            if (event.event === "NewAnimal") {
              dispatch('syncAnimal', {id: parseInt(event.returnValues.id)})
            }
          })
        }
      }
    )
  },
  syncAnimal({commit}, data) {
    BaseContract.methods.getAnimal(data.id)
      .call({from: state.clientAccount}, function (error, res) {
        if (error !== null) {
          console.error('getAnimal ', error)
        } else {
          console.log("智能合约Base.sol的getAnimal方法", res)
          commit('updateAnimal', {animal: res})
        }
      })
  },
  createNewAnimal({commit}, data) {
    BaseContract.methods.createAnimal(
      data.name,
      data.age,
      state.clientAccount)
      .send({from: state.clientAccount}, function (error, res) {
        if (error !== null) {
          console.error('getAnimal ', error)
        } else {
          console.log(res)
        }
      })
  },
  changeWelcomeText({dispatch}, data) {
    BaseContract.methods.setWelcomeText(data.text)
    // Contract has problem determining right gas price. I think its because it cant adjust after arbitrary string. To avoid this maybe convert to bytes.
      .send({from: state.clientAccount, gas: 38593})  // Gas limit  4712388 官网有写
      .on('transactionHash', function (hash) {
        console.log("Event #transactionHash: " + hash)
      })
      .on('receipt', function (receipt) {
        console.log("Event #receipt: ")
        console.log(receipt)
        // Just example, better to subscribe to events. See animals function for events. 10 seconds should be enough for the chain to create a block.
        setTimeout(() => {
          dispatch('syncWelcomeText')
        }, 10000)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log("Event #confirmation: ")
        console.log(confirmationNumber)
        console.log("confirmation中的receipt:", receipt)
        // dispatch('confirmTransation', {blockNumber: parseInt(receipt.blockNumber), transactionHash: receipt.transactionHash})
      })
      .on('error', console.error)
  }
}

// mutations
const mutations = {
  setCurrentBlock(state, data) {
    state.currentBlock = data.block
  },
  setClientAccount(state, address) {
    state.clientAccount = address
  },
  updateWelcomeText(state, data) {
    state.welcomeText = data.text
  },
  updateAnimalList(state, data) {
    state.animalList = data.list
  },
  updateAnimal(state, data) {
    //
    state.animals = {...state.animals, [data.animal.id]: data.animal}
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
