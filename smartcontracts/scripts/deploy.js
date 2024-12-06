const hre = require("hardhat");

async function main() {
  console.log("Starting contract deployment...");

  try {
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
  }
}

// Run the main function and handle any errors
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
