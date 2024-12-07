import express from 'express';
import { ethers } from 'ethers';
import Claim from '../models/Claim.js'; // Import the Claim model

const router = express.Router();

// Ethereum configuration
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');  // Ganache RPC URL
const privateKey = '0x7eac080b8eff9c7d2edbcd7146195a4e4edc5ea5b1ce3adae8afbd230e3aaeac';  // Ganache account private key
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's address and ABI
const contractAddress = '0x59cca497e9a472dd51151a7072f8c8d1b48098ce';  // Replace with your actual contract address
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_claimId",
          "type": "uint256"
        }
      ],
      "name": "approveClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "claims",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "diagnosis",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "treatment",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "claimAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "reportCID",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_diagnosis",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_treatment",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_claimAmount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_reportCID",
          "type": "string"
        }
      ],
      "name": "fileClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_claimId",
          "type": "uint256"
        }
      ],
      "name": "getClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextClaimId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Route: POST /api/claims/submit
router.post('/submit', async (req, res) => {
    console.log("In Blockchain part route");

    try {
        const { doctorName, patientName, doctorId, patientId, claimAmount, reportCID } = req.body;

        // Validation
        if (!patientName || !patientId || !doctorId || !claimAmount || !reportCID) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Interact with the smart contract to file the claim
        const tx = await contract.fileClaim(
            'Diagnosis here',  // You can use req.body.diagnosis if needed
            'Treatment here',   // Same for treatment
            claimAmount,
            reportCID
        );

        // Wait for the transaction to be mined
        await tx.wait();

        console.log("In Blockchain part route inside server");

        // Create and save the claim in the backend (optional)
        const newClaim = new Claim({
            doctorName,
            patientName,
            doctorId,
            patientId,
            amount: claimAmount,
            documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
        });

        await newClaim.save();

        res.status(201).json({ message: 'Claim submitted successfully and stored on the blockchain!' });
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;
