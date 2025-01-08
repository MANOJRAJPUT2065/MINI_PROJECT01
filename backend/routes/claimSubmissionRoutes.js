// import express from 'express';
// import pinataSDK from '@pinata/sdk';
// import { ethers } from 'ethers';
// import { keccak256, toUtf8Bytes, parseUnits } from 'ethers';
// import Claim from '../models/Claim.js'; 

// const router = express.Router();

// // Initialize Pinata client with environment variables
// const pinata = new pinataSDK({
//   pinataApiKey: process.env.PINATA_API_KEY,
//   pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
// });

// // Ethereum configuration
// const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
// const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba';
// const wallet = new ethers.Wallet(privateKey, provider);

// // The deployed contract's new address
// const contractAddress = '0x3dD553C1F602C61DBF3f16610b7C24bBFB83d562'; 
// const contractABI = 
// const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// // POST route to submit a claim
// router.post('/submit', async (req, res) => {
//   try {
//     const {
//       doctorName,
//       patientName,
//       doctorId,
//       patientId,
//       diagnosis,
//       treatment,
//       claimAmount,
//       reportCID,
//       walletAddress,
//       description,
//     } = req.body;

//     console.log('Received request to submit claim:', req.body);

//     // Validation
//     if (!patientName || !patientId || !doctorId || !diagnosis || !treatment || !claimAmount || !reportCID || !description) {
//       console.error('Validation error: Missing required fields');
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     if (isNaN(claimAmount) || claimAmount <= 0) {
//       console.error('Validation error: Invalid claim amount');
//       return res.status(400).json({ error: 'Invalid claim amount.' });
//     }

//     if (!reportCID.startsWith('Qm')) {
//       console.error('Validation error: Invalid report CID');
//       return res.status(400).json({ error: 'Invalid report CID.' });
//     }

//     // Generate a unique claim ID
//     const claimId = keccak256(toUtf8Bytes(`${Date.now()}-${patientId}`));
//     console.log('Generated unique claim ID:', claimId);

//     // Convert claimAmount to BigNumber using parseUnits
//     const claimAmountInWei = parseUnits(claimAmount.toString(), 18); // Assuming 18 decimals for ETH
//     console.log('Claim amount in wei:', claimAmountInWei.toString());

//     // Submit the claim to the smart contract
//     const tx = await contract.submitClaim(
//       claimId,           // Backend-generated claimId
//       claimAmountInWei,  // Claim amount (in wei)
//       description,       // Description of the claim
//       doctorName,        // Doctor's name
//       patientName,       // Patient's name
//       doctorId,          // Doctor's ID
//       patientId,         // Patient's ID
//       diagnosis,         // Diagnosis
//       treatment,         // Treatment
//       reportCID          // Report CID
//     );

//     console.log(`Transaction hash: ${tx.hash}`);
//     const receipt = await provider.waitForTransaction(tx.hash);

//     if (receipt.status !== 1) {
//       console.error('Transaction failed on the blockchain');
//       return res.status(500).json({ error: 'Blockchain transaction failed.' });
//     }

//     console.log(`Transaction mined successfully in block ${receipt.blockNumber}`);

//     // Save claim to the database
//     const newClaim = new Claim({
//       claimId,           // Backend-generated claimId
//       doctorName,
//       patientName,
//       doctorId,
//       patientId,
//       diagnosis,
//       treatment,
//       amount: claimAmountInWei.toString(),  // Save the amount as a string
//       reportCID,
//       walletAddress,
//       status: 'pending',
//       documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
//     });

//     const savedClaim = await newClaim.save();
//     console.log('Claim saved to the database successfully:', savedClaim);

//     res.status(201).json({
//       message: 'Claim submitted successfully and stored on the blockchain!',
//       claimId,
//       transactionHash: tx.hash
//     });
//   } catch (error) {
//     console.error('Error occurred while submitting the claim:', error);
//     res.status(500).json({ error: 'Server error. Please try again later.' });
//   }
// });

// export default router;




import express from 'express';
import { ethers } from 'ethers';
import pinataSDK from '@pinata/sdk';
import { keccak256, toUtf8Bytes } from 'ethers';
import Claim from '../models/Claim.js';
import axios from 'axios';
const router = express.Router();

// Initialize Pinata client with environment variables
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

// Ethereum configuration
const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba';
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's new address
const contractAddress = '0xB9Cd9f8Cada31f37A20C42910366BCE5E7381Ad3'; 
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "ClaimApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "ClaimPaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "ClaimRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "doctorName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "patientName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "doctorId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "patientId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "diagnosis",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "treatment",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reportCID",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ClaimSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "ClaimVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "DoctorNotified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "FraudDetected",
    "type": "event"
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
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "approveClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "claimCountPerClaimant",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "claimantClaims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
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
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "doctorName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "patientName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "doctorId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "patientId",
            "type": "uint256"
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
            "internalType": "string",
            "name": "reportCID",
            "type": "string"
          }
        ],
        "internalType": "struct InsuranceClaim.ClaimDetails",
        "name": "details",
        "type": "tuple"
      },
      {
        "internalType": "enum InsuranceClaim.ClaimStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isFraud",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "reportCID",
        "type": "string"
      }
    ],
    "name": "detectDuplicateReportCID",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "detectFraud",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaim",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "claimId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "claimant",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "doctorName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "patientName",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "doctorId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "patientId",
                "type": "uint256"
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
                "internalType": "string",
                "name": "reportCID",
                "type": "string"
              }
            ],
            "internalType": "struct InsuranceClaim.ClaimDetails",
            "name": "details",
            "type": "tuple"
          },
          {
            "internalType": "enum InsuranceClaim.ClaimStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isFraud",
            "type": "bool"
          }
        ],
        "internalType": "struct InsuranceClaim.Claim",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      }
    ],
    "name": "getClaimCountForClaimant",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      }
    ],
    "name": "getClaimantClaims",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "insurer",
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
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "payClaim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "rejectClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "setAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "doctorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "patientName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "doctorId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "patientId",
        "type": "uint256"
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
        "internalType": "string",
        "name": "reportCID",
        "type": "string"
      }
    ],
    "name": "submitClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "reportCID",
        "type": "string"
      }
    ],
    "name": "validateReportCID",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "verifyClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// POST route to submit a claim
router.post('/submit', async (req, res) => {
  try {
    const {
      doctorName,
      patientName,
      doctorId,
      patientId,
      diagnosis,
      treatment,
      claimAmount,
      reportCID,
      walletAddress,
      description,
    } = req.body;

    console.log('Received request to submit claim:', req.body);

    // Validation
    if (!patientName || !patientId || !doctorId || !diagnosis || !treatment || !claimAmount || !reportCID || !description) {
      console.error('Validation error: Missing required fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (isNaN(claimAmount) || claimAmount <= 0) {
      console.error('Validation error: Invalid claim amount');
      return res.status(400).json({ error: 'Invalid claim amount.' });
    }

    if (!reportCID.startsWith('Qm')) {
      console.error('Validation error: Invalid report CID');
      return res.status(400).json({ error: 'Invalid report CID.' });
    }

    // Ensure walletAddress is a valid Ethereum address
    try {
      const validatedAddress = ethers.getAddress(walletAddress);  // This should work with ethers.getAddress()
      console.log('Valid wallet address:', validatedAddress);
    } catch (error) {
      console.error('Validation error: Invalid wallet address', error);
      return res.status(400).json({ error: `Invalid wallet address: ${error.message}` });
    }

    // Generate a unique claim ID
    const claimId = keccak256(toUtf8Bytes(`${Date.now()}-${patientId}`));
    console.log('Generated unique claim ID:', claimId);

    // Convert claimAmount to BigNumber using ethers.parseUnits (fix for error)
    const claimAmountInWei = ethers.parseUnits(claimAmount.toString(), 18);  // Assuming 18 decimals for ETH
    console.log('Claim amount in wei:', claimAmountInWei.toString());

    // Submit the claim to the smart contract
    try {
      const tx = await contract.submitClaim(
        claimId,            // Backend-generated claimId
        claimAmountInWei,   // Claim amount (in wei)
        description,        // Description of the claim
        doctorName,         // Doctor's name
        patientName,        // Patient's name
        doctorId,           // Doctor's ID
        patientId,          // Patient's ID
        diagnosis,          // Diagnosis
        treatment,          // Treatment
        reportCID           // Report CID
      );

      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await provider.waitForTransaction(tx.hash);

      if (receipt.status !== 1) {
        console.error('Transaction failed on the blockchain');
        return res.status(500).json({ error: 'Blockchain transaction failed.' });
      }

      console.log(`Transaction mined successfully in block ${receipt.blockNumber}`);

      // Save claim to the database
      const newClaim = new Claim({
        claimId,            // Backend-generated claimId
        doctorName,
        patientName,
        doctorId,
        patientId,
        diagnosis,
        treatment,
        amount: claimAmountInWei.toString(),  // Save the amount as a string
        reportCID,
        walletAddress,
        status: 'pending',
        documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
      });

      const savedClaim = await newClaim.save();
      console.log('Claim saved to the database successfully:', savedClaim);

      res.status(201).json({
        message: 'Claim submitted successfully and stored on the blockchain!',
        claimId,
        transactionHash: tx.hash,
      });

    } catch (blockchainError) {
      if (blockchainError.message.includes("This reportCID has already been used for another claim")) {
        console.error('Duplicate reportCID found');
        return res.status(400).json({ error: 'Duplicate reportCID found. This report has already been used for another claim.' });
      }

      console.error('Error while submitting claim:', blockchainError);
      res.status(500).json({ error: 'Don\'t use duplicate one' });
    }

  } catch (error) {
    console.error('Error occurred while submitting the claim:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});



// router.post('/submit', async (req, res) => {
//   try {
//     const {
//       doctorName,
//       patientName,
//       doctorId,
//       patientId,
//       diagnosis,
//       treatment,
//       claimAmount,
//       reportCID,
//       walletAddress,
//       description,
//     } = req.body;

//     console.log('Received request to submit claim:', req.body);

//     // Validation
//     if (!patientName || !patientId || !doctorId || !diagnosis || !treatment || !claimAmount || !reportCID || !description) {
//       console.error('Validation error: Missing required fields');
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     if (isNaN(claimAmount) || claimAmount <= 0) {
//       console.error('Validation error: Invalid claim amount');
//       return res.status(400).json({ error: 'Invalid claim amount.' });
//     }

//     if (!reportCID.startsWith('Qm')) {
//       console.error('Validation error: Invalid report CID');
//       return res.status(400).json({ error: 'Invalid report CID.' });
//     }

//     // Ensure walletAddress is a valid Ethereum address
//     try {
//       const validatedAddress = ethers.getAddress(walletAddress);  // This should work with ethers.getAddress()
//       console.log('Valid wallet address:', validatedAddress);
//     } catch (error) {
//       console.error('Validation error: Invalid wallet address', error);
//       return res.status(400).json({ error: `Invalid wallet address: ${error.message}` });
//     }

//     // **Step 1: Integrate Fraud Detection API Call**
//     try {
//       const fraudDetectionResponse = await axios.post('http://localhost:5001/predict', {
//         DiagnosisCode: diagnosis,
//         TreatmentCode: treatment,
//         IsDuplicate: 'Unknown',  // You may want to modify this to capture actual duplicate detection
//         ClaimAmount: claimAmount,
//       });

//       const { fraud } = fraudDetectionResponse.data;

//       // If fraud is detected, return an error response
//       if (fraud) {
//         console.error('Fraud detected for this claim');
//         return res.status(400).json({ error: 'This claim has been flagged as fraudulent.' });
//       } else {
//         console.log('Claim is legitimate');
//       }

//     } catch (fraudDetectionError) {
//       console.error('Error while calling fraud detection API:', fraudDetectionError);
//       return res.status(500).json({ error: 'Failed to check fraud detection.' });
//     }

//     // Generate a unique claim ID
//     const claimId = keccak256(toUtf8Bytes(`${Date.now()}-${patientId}`));
//     console.log('Generated unique claim ID:', claimId);

//     // Convert claimAmount to BigNumber using ethers.parseUnits (fix for error)
//     const claimAmountInWei = ethers.parseUnits(claimAmount.toString(), 18);  // Assuming 18 decimals for ETH
//     console.log('Claim amount in wei:', claimAmountInWei.toString());

//     // Submit the claim to the smart contract
//     try {
//       const tx = await contract.submitClaim(
//         claimId,            // Backend-generated claimId
//         claimAmountInWei,   // Claim amount (in wei)
//         description,        // Description of the claim
//         doctorName,         // Doctor's name
//         patientName,        // Patient's name
//         doctorId,           // Doctor's ID
//         patientId,          // Patient's ID
//         diagnosis,          // Diagnosis
//         treatment,          // Treatment
//         reportCID           // Report CID
//       );

//       console.log(`Transaction hash: ${tx.hash}`);
//       const receipt = await provider.waitForTransaction(tx.hash);

//       if (receipt.status !== 1) {
//         console.error('Transaction failed on the blockchain');
//         return res.status(500).json({ error: 'Blockchain transaction failed.' });
//       }

//       console.log(`Transaction mined successfully in block ${receipt.blockNumber}`);

//       // Save claim to the database
//       const newClaim = new Claim({
//         claimId,            // Backend-generated claimId
//         doctorName,
//         patientName,
//         doctorId,
//         patientId,
//         diagnosis,
//         treatment,
//         amount: claimAmountInWei.toString(),  // Save the amount as a string
//         reportCID,
//         walletAddress,
//         status: 'pending',
//         documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
//       });

//       const savedClaim = await newClaim.save();
//       console.log('Claim saved to the database successfully:', savedClaim);

//       res.status(201).json({
//         message: 'Claim submitted successfully and stored on the blockchain!',
//         claimId,
//         transactionHash: tx.hash,
//       });

//     } catch (blockchainError) {
//       if (blockchainError.message.includes("This reportCID has already been used for another claim")) {
//         console.error('Duplicate reportCID found');
//         return res.status(400).json({ error: 'Duplicate reportCID found. This report has already been used for another claim.' });
//       }

//       console.error('Error while submitting claim:', blockchainError);
//       res.status(500).json({ error: 'Don\'t use duplicate one' });
//     }

//   } catch (error) {
//     console.error('Error occurred while submitting the claim:', error);
//     res.status(500).json({ error: 'Server error. Please try again later.' });
//   }
// });



export default router;
