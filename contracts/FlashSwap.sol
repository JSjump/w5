//SPDX-License-Identifier: Unlicense
pragma solidity =0.6.6;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";

import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@uniswap/v2-periphery/contracts/interfaces/V1/IUniswapV1Factory.sol";


import "./ISwapRouter.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";

contract FlashSwap is IUniswapV2Callee {
    ISwapRouter immutable swapRouterV3;
    address immutable factory;
    IWETH immutable WETH;

    constructor(address _factory, address _routerV3, address router) public {
        swapRouterV3 = ISwapRouter(_routerV3);
        factory = _factory;
        WETH = IWETH(IUniswapV2Router01(router).WETH());
    }

    // needs to accept ETH from any V1 exchange and WETH. ideally this could be enforced, as in the router,
    // but it's not possible because it requires a call to the v1 factory, which takes too much gas
    receive() external payable {}

    // gets tokens/WETH via a V2 flash swap, swaps for the ETH/tokens on V1, repays V2, and keeps the rest!
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        console.log("----ceshi",sender);
        address[] memory path = new address[](2);
        uint amountToken;
        uint amountETH;
        console.log("+++amount0",amount0,amount1);

        { // scope for token{0,1}, avoids stack too deep errors
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        assert(msg.sender == UniswapV2Library.pairFor(factory, token0, token1)); // ensure that msg.sender is actually a V2 pair
        assert(amount0 == 0 || amount1 == 0); // this strategy is unidirectional
        path[0] = amount0 == 0 ? token0 : token1;
        path[1] = amount0 == 0 ? token1 : token0;
        amountToken = token0 == address(WETH) ? amount1 : amount0;
        amountETH = token0 == address(WETH) ? amount0 : amount1;
        console.log("amountToken",amountToken,amountETH);

        }

        // assert(path[0] == address(WETH) || path[1] == address(WETH)); // this strategy only works with a V2 WETH pair
        // IERC20 token = IERC20(path[0] == address(WETH) ? path[1] : path[0]);
        // IUniswapV1Exchange exchangeV1 = IUniswapV1Exchange(factoryV3.getExchange(address(token))); // get V1 exchange
        console.log("IERC20(path[1])",IERC20(path[1]).balanceOf(sender));

        if (amountToken > 0) {
            (uint minOut) = abi.decode(data, (uint)); // slippage parameter for V1, passed in by caller
            IERC20(path[1]).approve(address(swapRouterV3), amountToken);
            // swap
            uint256 amountReceived = swapRouterV3.exactInputSingle(
             ISwapRouter.ExactInputSingleParams({
                    tokenIn: path[1],
                    tokenOut: path[0],
                    fee: uint24(((amountToken * 3)/997) + 1),
                    recipient: sender,
                    deadline: block.timestamp,
                    amountIn: amountToken,
                    amountOutMinimum: minOut,
                    sqrtPriceLimitX96: 0
                })
            );
            // uint amountReceived = exchangeV1.tokenToEthSwapInput(amountToken, minETH, uint(-1));

            uint amountRequired = UniswapV2Library.getAmountsIn(factory, amountToken, path)[0];
            console.log("amountRequired",amountRequired);
            assert(amountReceived > amountRequired); // fail if we didn't get enough amountReceived back to repay our flash loan
            // WETH.deposit{value: amountRequired}();
            assert(IERC20(path[0]).transfer(msg.sender, amountRequired)); // return WETH to V2 pair
            // (bool success,) = sender.call{value: amountReceived - amountRequired}(new bytes(0)); // keep the rest! (ETH)
            // assert(success);
        } else {
            (uint minOut) = abi.decode(data, (uint)); // slippage parameter for V1, passed in by caller
            IERC20(path[0]).approve(address(swapRouterV3), amountETH);
            // swap
            uint256 amountReceived = swapRouterV3.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                    tokenIn: path[0],
                    tokenOut: path[1],
                    fee: uint24(((amountETH * 3)/997) + 1),
                    recipient: sender,
                    deadline: block.timestamp,
                    amountIn: amountETH,
                    amountOutMinimum: minOut,
                    sqrtPriceLimitX96: 0
                })
            );

            // (uint minTokens) = abi.decode(data, (uint)); // slippage parameter for V1, passed in by caller
            // WETH.withdraw(amountETH);
            // uint amountReceived = exchangeV1.ethToTokenSwapInput{value: amountETH}(minTokens, uint(-1));
            uint amountRequired = UniswapV2Library.getAmountsIn(factory, amountETH, path)[0];
            assert(amountReceived > amountRequired); // fail if we didn't get enough tokens back to repay our flash loan
            // assert(token.transfer(msg.sender, amountRequired)); // return tokens to V2 pair
            assert(IERC20(path[1]).transfer(msg.sender, amountRequired)); // return WETH to V2 pair
        }
    }
}
