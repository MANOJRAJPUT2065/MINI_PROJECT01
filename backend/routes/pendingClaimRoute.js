import express from 'express';
import { ethers } from 'ethers';
import Claim from '../models/Claim.js'; // Import the Claim model
import { default as pinataSDK } from '@pinata/sdk';
import fs from 'fs'; // For file system operations
import path from 'path'; // Path operations
import dotenv from 'dotenv'; // To load environment variables

dotenv.config();

const router = express.Router();

// Pinata API setup
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY); // Use 'new' here
// Ethereum configuration
const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // Ganache RPC URL
const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba'; // Ganache account private key
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's address and ABI (you must define the ABI here)
const contractAddress = '0x01da2365E87ff01BC9CF416ca5D4bDaa68bFeFd4'; // Updated contract address
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
          "indexed": false,
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
          "indexed": false,
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
          "indexed": false,
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
        }
      ],
      "name": "ClaimSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "claimId",
          "type": "uint256"
        }
      ],
      "name": "ClaimVerified",
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
          "internalType": "string",
          "name": "reportCID",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isApproved",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isPaid",
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
      "name": "getClaimDetails",
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
              "internalType": "string",
              "name": "reportCID",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isVerified",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isApproved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isPaid",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "claimId",
          "type": "uint256"
        }
      ],
      "name": "payClaim",
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
          "internalType": "uint256",
          "name": "claimId",
          "type": "uint256"
        }
      ],
      "name": "verifyClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);




router.get('/pending', async (req, res) => {
    console.log("Inside pending claim");
    try {
      // Fetch all claims with "under review" or "pending" status from the database
      const pendingClaims = await Claim.find({
        status: { $in: ['under review', 'pending'] }
      });
  
      if (pendingClaims.length === 0) {
        // If no claims are found with "under review" or "pending" status
        return res.status(200).json({ message: 'No pending claims at the moment.' });
      }
  
      // Prepare the list of claims with relevant details
      const responseClaims = pendingClaims.map(dbClaim => ({
        claimId: dbClaim.claimId,  // Claim ID from the database
        claimant: dbClaim.patientName,  // Patient's name from the database
        amount: dbClaim.amount,  // Amount from the database
        description: dbClaim.description,  // Description from the database (if available)
        doctorName: dbClaim.doctorName,  // Doctor's name from the database
        patientName: dbClaim.patientName,  // Patient's name from the database
        reportCID: dbClaim.reportCID,  // Report CID from the database (if available)
        status: dbClaim.status,  // Status from the database
        submissionDate: dbClaim.createdAt ? dbClaim.createdAt.toISOString() : 'N/A',  // Submission date
        transactionHash: dbClaim.transactionHash || 'N/A',  // Transaction hash if available
      }));
  
      // Respond with the list of pending claims
      return res.status(200).json({ pendingClaims: responseClaims });
    } catch (error) {
      console.error('Error fetching pending claims:', error);
      return res.status(500).json({ error: 'Failed to fetch pending claims.' });
    }
  });
  


// Route to validate claim via smart contract

// Route to validate claim via smart contract
router.post('/validate/:claimId', async (req, res) => {
    const { claimId } = req.params;

    try {
        // Fetch claim from the database
        const claim = await Claim.findOne({ claimId });
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found.' });
        }

        // Check if the claim is already verified
        if (claim.isVerified) {
            return res.status(400).json({ error: 'Claim is already verified.' });
        }

        // Interact with the smart contract to verify the claim
        const tx = await contract.verifyClaim(claimId);
        await tx.wait(); // Wait for the transaction to be mined

        // Update claim status in the database
        claim.isVerified = true;
        claim.transactionHash = tx.hash; // Save transaction hash
        await claim.save();

        // Respond with success
        return res.status(200).json({
            message: 'Claim verified successfully.',
            transactionHash: tx.hash,
        });
    } catch (error) {
        console.error('Error verifying claim:', error);
        return res.status(500).json({ error: 'Failed to verify claim.' });
    }
});

  

// Route to upload report to Pinata (for report CID)
router.post('/claims/upload-report', async (req, res) => {
  const { claimId, reportFile } = req.body; // Get report file from frontend

  try {
    // Read the file and prepare for upload to Pinata
    const reportPath = path.join(__dirname, 'uploads', reportFile);
    const fileStream = fs.createReadStream(reportPath);

    // Pin the file to Pinata
    const pinataResponse = await pinata.pinFileToIPFS(fileStream);
    const reportCID = pinataResponse.IpfsHash; // Get CID from the response

    // Update the claim with the report CID
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.reportCID = reportCID; // Store the CID of the report in DB
    await claim.save();

    res.json({ message: 'Report uploaded successfully', reportCID });

  } catch (error) {
    console.error('Error uploading report to Pinata:', error);
    res.status(500).json({ message: 'Error uploading report to Pinata' });
  }
});

export default router;
