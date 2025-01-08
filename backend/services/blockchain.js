import { ethers } from 'ethers';
import contractABI from '../services/contractABI.json';  // Adjust path as needed

const contractAddress = "0xC1fd7B8Df6230883b39770cc853025b259E8E411";  // Replace with your contract address
const provider = new ethers.JsonRpcProvider("http://localhost:7545");  // Replace with your RPC URL
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

/**
 * Submits a claim to the blockchain smart contract.
 * @param {Object} claimData - The data for the claim.
 * @returns {Promise<Object>} - The transaction receipt.
 */
const submitClaimToBlockchain = async (claimData) => {
  try {
    const tx = await contract.submitClaim(
      claimData.claimId,
      claimData.claimAmountInWei,
      claimData.description,
      claimData.doctorName,
      claimData.patientName,
      claimData.doctorId,
      claimData.patientId,
      claimData.diagnosis,
      claimData.treatment,
      claimData.reportCID
    );

    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await provider.waitForTransaction(tx.hash);

    if (receipt.status !== 1) {
      throw new Error("Blockchain transaction failed.");
    }

    console.log(`Transaction mined successfully in block ${receipt.blockNumber}`);
    return receipt;
  } catch (error) {
    console.error("Error while interacting with the blockchain:", error);
    throw error;
  }
};

export { submitClaimToBlockchain };
