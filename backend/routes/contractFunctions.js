import { ethers } from 'ethers';
import contractABI from './contractABI.json' assert { type: 'json' };

// Ethereum configuration for Ganache
const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // Ganache RPC URL
const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba'; // Ganache account private key
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's address
const contractAddress = '0x52999617220cdDFCa7C7F319B6Fd7a286C084B12'; // Updated contract address
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to approve a claim on the blockchain
export async function approveClaimOnBlockchain(claimId, approvalStatus) {
  try {
    // Calling the approveClaim function of the smart contract
    const transaction = await contract.approveClaim(claimId, approvalStatus);
    await transaction.wait(); // Wait for the transaction to be mined

    return { success: true, message: 'Claim approved successfully' };
  } catch (error) {
    console.error('Error in approving claim on blockchain:', error);
    return { success: false, error: error.message };
  }
}

// Optionally, you can add other smart contract interaction functions like payClaim, verifyClaim, etc.
