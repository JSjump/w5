W5_1作业
* 以太坊测试网上部署两个自己的ERC20合约MyToken，分别在Uniswap V2、V3(网页上)添加流动性
* 作业：编写合约执行闪电贷（参考V2的ExampleFlashSwap）：
   * uniswapV2Call中，用收到的 TokenA 在 Uniswap V3 的 SwapRouter 兑换为 TokenB 还回到 uniswapV2 Pair 中。
   
W5_2作业
* 在一笔交易中完成（模拟闪电贷交易）
   * 在 AAVE 中借款 token A
   * 使用 token A 在 Uniswap V2 中交易兑换 token B，然后在 Uniswap V3 token B 兑换为 token A
   * token A 还款给 AAVE




答案：


1. 
uniswapV2 pair 合约的构建
https://goerli.etherscan.io/tx/0x94549b19d8d7d355f6caa9a27b306fd311d8e117be2e667bd8458780333c292b
ft-st  流动池为1:1  pair合约地址：0x6e83e37341185a9871f2762e6b390697e95a780e

uniswapV3 pair 合约的构建
https://goerli.etherscan.io/tx/0x02ee41765ac7326e1deaf6785cfd3a4bc5bbfa192b740aac3f0c236f88d343d4
ft-st  流动池为1:2  pair合约地址：0x3e28d27d544970113a09f97f3daa8e9c3275db62

v2-v3套利成功交易链接
https://goerli.etherscan.io/tx/0xd8c7813381697874d602af3b700b710cbbdfb7c36df78f07b288c797aa6f6c91
