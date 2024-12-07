const hre = require("hardhat");

async function main() {
  console.log("Starting contract deployment...");

  try {
    // Log network details
    const provider = hre.ethers.provider;
    const network = await provider.getNetwork();
    console.log("Connected to network:");
    console.log("Network name:", network.name);
    console.log("Network chain ID:", network.chainId);

    // Get the contract factory
    const InsuranceClaim = await hre.ethers.getContractFactory("InsuranceClaim");
    console.log("Contract factory obtained.");

    // Deploy the contract with an increased gas limit
    const insuranceClaim = await InsuranceClaim.deploy({
      gasLimit: 10000000,  // Increased gas limit
    });

    console.log("Deploying contract...");

    // Log the deployment transaction details
    console.log("Deploy transaction details:", insuranceClaim.deployTransaction);

    if (insuranceClaim.deployTransaction) {
      // Log transaction hash and address
      console.log("Transaction hash:", insuranceClaim.deployTransaction.hash);
      console.log("Contract address:", insuranceClaim.address);
      console.log("Waiting for transaction confirmation...");

      // Wait for the deployment to be confirmed
      await insuranceClaim.deployTransaction.wait();

      console.log("Contract deployed to:", insuranceClaim.address);
    } else {
      throw new Error("Deploy transaction is undefined. The deployment might have failed.");
    }

  } catch (error) {
    console.error("Error during contract deployment:", error);

    // Additional logging to help with troubleshooting
    if (error.code === 'NETWORK_ERROR') {
      console.error("Network error. Check your network configuration and connection.");
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error("Insufficient funds to deploy the contract. Ensure you have enough ETH in your wallet.");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}

// Run the main function and handle any errors
main()
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exitCode = 1;
  });
