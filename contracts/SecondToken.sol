//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SecondToken is ERC20 {
    address public owner; 

    constructor(uint256 _totalSupply) ERC20("SecondToken", "ST") {
        // initialSupply = 0
        _mint(msg.sender, _totalSupply);
        owner = msg.sender;
    }

    // 可动态增发
    function mint(uint256 num_) public onlyOwner {
        _mint(msg.sender,num_);
    }

    modifier onlyOwner() {
        require(msg.sender ==owner,"onlyOwner");
        _;
    }
}