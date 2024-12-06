require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8546",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 10000000000,

    },
    hardhat: {
      chainId: 1337, // Default Hardhat network chain ID
      gas: 10000000,  // Gas limit for the Hardhat network
  },
  },
};
