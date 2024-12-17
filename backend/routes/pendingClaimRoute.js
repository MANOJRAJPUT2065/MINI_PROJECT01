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
  const contractAddress = '0xF57d4C739495d44DE7bb176c75737E8be76327c8'; // Updated contract address
  const contractABI =[
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

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // TODO:
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
        description: dbClaim.description || 'No description',  // Description from the database (if available)
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

    

 
 
 
  router.post('/validate/:claimId', async (req, res) => {
    console.log("Inside validations");
    const { claimId } = req.params;
    console.log("Received request to validate claim with ID:", claimId);
  
    try {
      // Fetch claim from the database using claimId
      console.log("Fetching claim from the database...");
      const claim = await Claim.findOne({ claimId });
      if (!claim) {
        console.error("Claim not found for ID:", claimId);
        return res.status(404).json({ error: 'Claim not found.' });
      }
  
      console.log("Claim fetched:", claim);
  
      // Check if the claim is already verified
      if (claim.isVerified) {
        console.warn("Claim is already verified. Claim ID:", claimId);
        return res.status(400).json({ error: 'Claim is already verified.' });
      }
  
      // Check if the claimId exists on the blockchain
      console.log("Checking if claimId exists on the blockchain...");
      const blockchainClaim = await contract.claims(claimId); // Call the smart contract to fetch the claim by ID
      if (!blockchainClaim.claimant) {
        console.error("Claim ID does not exist on the blockchain:", claimId);
        return res.status(404).json({ error: 'Claim does not exist on the blockchain.' });
      }
  
      console.log("Claim exists on the blockchain:", blockchainClaim);
  
      // Interact with the smart contract to verify the claim
      console.log("Interacting with the smart contract to verify claim...");
      const tx = await contract.verifyClaim(claimId, {
        from: wallet.address, // Using the wallet associated with the private key
        gasLimit: 500000, // Set an appropriate gas limit for the transaction
      });
      console.log("Transaction initiated. Waiting for it to be mined...");
  
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction mined. Hash:", tx.hash);
  
      // Update claim status and save transaction hash in the database
      claim.isVerified = true;
      claim.status = "approved"; // Change the claim status to 'approved'
      claim.transactionHash = tx.hash; // Save transaction hash
      console.log("Updating claim status in the database...");
      await claim.save();
  
      // Respond with success
      console.log("Claim verified successfully. Returning response...");
      return res.status(200).json({
        message: 'Claim verified successfully.',
        transactionHash: tx.hash,
      });
    } catch (error) {
      console.error('Error verifying claim:', error);
  
      // Check if the error is specific to contract interaction
      if (error.error && error.error.message) {
        console.error("Smart contract error message:", error.error.message);
      }
  
      // General error response
      return res.status(500).json({ error: 'Failed to verify claim.' });
    }
  });
  
  
  
  // Route to upload report to Pinata (for report CID)
  
  

  
  router.post('/claims/upload-report', async (req, res) => {
    const { claimId, reportFile } = req.body;  // Get report file from frontend

    try {
      // Read the file and prepare for upload to Pinata
      const reportPath = path.join(__dirname, 'uploads', reportFile);
      const fileStream = fs.createReadStream(reportPath);

      // Pin the file to Pinata
      const pinataResponse = await pinata.pinFileToIPFS(fileStream);
      const reportCID = pinataResponse.IpfsHash;  // Get CID from the response

      // Update the claim with the report CID
      const claim = await Claim.findById(claimId);
      if (!claim) {
        return res.status(404).json({ message: 'Claim not found' });
      }

      claim.reportCID = reportCID;  // Store the CID of the report in DB
      await claim.save();

      res.json({ message: 'Report uploaded successfully', reportCID });

    } catch (error) {
      console.error('Error uploading report to Pinata:', error);
      res.status(500).json({ message: 'Error uploading report to Pinata' });
    }
  });



  // Assuming you have already imported necessary modules and set up your server

  
  // Route to get claim by claimId
  router.get('/claim/:claimId', async (req, res) => {
      try {
          // Get claimId from request parameters
          const { claimId } = req.params;

          // Find the claim in the database by claimId
          const claim = await Claim.findOne({ claimId });

          // If claim not found, send a 404 error
          if (!claim) {
              return res.status(404).json({ error: 'Claim not found' });
          }

          // Return the found claim as a response
          res.status(200).json(claim);
      } catch (error) {
          console.error('Error occurred while fetching the claim:', error);
          res.status(500).json({ error: 'Server error. Please try again later.' });
      }
  });



  export default router;






