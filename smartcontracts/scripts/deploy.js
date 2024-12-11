async function main() {
    // Get the signers (accounts) connected to the network
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Compile the contract (if you haven't already)
    await hre.run('compile');
  
    // Get the contract factory
    const InsuranceClaim = await ethers.getContractFactory("InsuranceClaim");
  
    // Deploy the contract
    const insuranceClaim = await InsuranceClaim.deploy();
    console.log("InsuranceClaim contract deployed to:", insuranceClaim.address);
  }
  
  // Run the deployment script
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    