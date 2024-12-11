require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.0", // Use the same Solidity version as in your contract
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache RPC URL
      accounts: ["0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba"], // Your Ganache account private key
    },
  },
};
