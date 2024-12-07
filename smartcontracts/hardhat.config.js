require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Ganache URL
      accounts: [process.env.PRIVATE_KEY], // Use the private key from .env
      gasPrice: 2000000000, // Adjust as needed
      gas: 10000000, // Increased gas limit for transactions
    },
    hardhat: {
      chainId: 1337, // Default Hardhat network chain ID
      gas: 10000000,  // Gas limit for the Hardhat network
    },
  },
};
