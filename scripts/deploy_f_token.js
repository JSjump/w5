// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const FirstToken = await ethers.getContractFactory("FirstToken");
  const firstToken = await FirstToken.deploy(
    ethers.utils.parseUnits("10000", 18)
  );

  await firstToken.deployed();

  console.log("FirstToken deployed to:", firstToken.address);
  await writeAddr(firstToken.address, "FirstToken", network.name);

  const SecondToken = await ethers.getContractFactory("SecondToken");
  const secondToken = await SecondToken.deploy(
    ethers.utils.parseUnits("20000", 18)
  );

  await secondToken.deployed();

  console.log("SecondToken deployed to:", secondToken.address);
  await writeAddr(secondToken.address, "SecondToken", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
