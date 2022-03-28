// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
require("dotenv").config();

// The Contract interface
const abi = [
  "function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external",
];

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  //   初始化provider
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HARDHAT_URL
  );

  const wallet = new ethers.Wallet(process.env.HARDHAT_PK, provider);

  // We get the contract to deploy
  const FlashSwap = await ethers.getContractFactory("FlashSwap");
  const flashSwap = await FlashSwap.deploy(
    process.env.V3_SWAP_ROUTER,
    process.env.V2_FACTORY,
    process.env.V2_ROUTER_ADDR
  );

  await flashSwap.deployed();

  console.log("flashSwap deployed to:", flashSwap.address);
  await writeAddr(flashSwap.address, "flashSwap", network.name);

  const pair = new ethers.Contract(
    "0x6e83e37341185a9871f2762e6b390697e95a780e",
    abi,
    wallet
  );
  const bytes = ethers.utils.defaultAbiCoder.encode(["uint256"], [0]);
  const result = await pair.swap(10, 0, flashSwap.address, bytes, {
    gasLimit: ethers.utils.parseUnits("5", 5),
  });
  //   console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
