# Intro
![Truffle box](http://storage1.static.itmages.com/i/18/0309/h_1520617882_2266765_b0734eefc5.png)

For quik iteration over smart contracts and frontend connectors.

# Install

Run `npm run init`

# Develop

`npm run frontend` intitiates webpack vue frontend

`npm run backend` initiates node express web backend

`npm run eth` initiates local RPC development eth node

# Getting started

1. Terminal -> `npm run eth`. (Opens a Truffle console)
2. In truffle console write -> `migrate`. (Deploys contract to local Eth RPC).
2. Open NEW terminal window. Write -> `npm run frontend` (Development frontend in Browser).

Webpack will start you browser on URL http://localhost:8080/#/ and you should see the web application.

After makeing changes to Solidity contracts, just run `migrate --reset` in the truffle console and the frontend should also do a refresh.

![App](http://storage3.static.itmages.com/i/18/0309/h_1520615516_4956393_f30c1f4696.png)

# Troubleshooting

- When "re-booting" the Ethereum RPC, remember to reset your metamask account transaction nounce. ![Metamask transaction nounce](http://storage7.static.itmages.com/i/18/0309/h_1520615869_8453611_ee83786505.png)
- If your getting an error "cannot read address from ... ", run "migrate --reset" in the truffle console.
- When makeing bigger adjustments to some Solidity code that is then reset through migration, if you haveing trouble with unexpected results. Deletes the contracts from ./backend/eth/build/contracts and do a "migrate --reset"*[]:

# Stack

- Truffle
- web3/metamask
- Express
- Node
- Webpack
- Vue
- Vuex
- Bootstrap


+ 进入目录/Users/zheyi/work_energy/web3/solidity/demo3/eth-truffle-vue-master/backend/eth

执行脚本
```
truffle compile --compile-all
truffle migrate --reset
```
build目录下的contracts目录生成相关智能合约编译的json文件
将该目录文件拷贝一份到 frontend/src/contracts/目录下
然后运行前端脚本代码