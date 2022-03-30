require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      // {
      //   version: "=0.5.16",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 999999,
      //     },
      //   },
      // },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
      {
        version: ">=0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    Goerli: {
      url: process.env.GRO_URL || "",
      accounts:
        process.env.GRO_PRIVATE_KEY !== undefined
          ? [process.env.GRO_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      // url: process.env.HARDHAT_URL,
      // accounts:
      //   process.env.HARDHAT_PK !== undefined ? [process.env.HARDHAT_PK] : [],
      forking: {
        url: "https://goerli.infura.io/v3/b50be745408f41f19731449156edf5ec",
      },
      // url: process.env.GRO_URL || "",
      // accounts:
      //   process.env.GRO_PRIVATE_KEY !== undefined
      //     ? [process.env.GRO_PRIVATE_KEY]
      //     : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
