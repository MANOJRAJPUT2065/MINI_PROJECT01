import express from 'express';
import { ethers } from 'ethers'; // Import ethers
import Claim from '../models/Claim.js'; // Import the Claim model
import ClaimSubmission from '../models/ClaimSubmission.js';
const router = express.Router();

// Ethereum configuration
const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // Ganache RPC URL
const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba'; // Ganache account private key
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's new address
const contractAddress = '0xF57d4C739495d44DE7bb176c75737E8be76327c8'; // Updated contract address
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


  

 // SUBMIT ROUTE 
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
      description,  // Added description here
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

    // Generate a unique claim ID
    const claimId = ethers.keccak256(ethers.toUtf8Bytes(`${Date.now()}-${patientId}`));
    console.log('Generated unique claim ID:', claimId);

    // Convert claimAmount to BigNumber using parseUnits
    const claimAmountInWei = ethers.parseUnits(claimAmount.toString(), 18); // Assuming 18 decimals for ETH
    console.log('Claim amount in wei:', claimAmountInWei.toString());

    // Submit the claim to the smart contract
    const tx = await contract.submitClaim(
      claimId,               // Backend-generated claimId
      claimAmountInWei,      // Claim amount (in wei)
      description,           // Description of the claim
      doctorName,            // Doctor's name
      patientName,           // Patient's name
      doctorId,              // Doctor's ID
      patientId,             // Patient's ID
      diagnosis,             // Diagnosis
      treatment,             // Treatment
      reportCID              // Report CID
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
      claimId,               // Backend-generated claimId
      doctorName,
      patientName,
      doctorId,
      patientId,
      diagnosis,
      treatment,
      amount: parseFloat(claimAmount), // Save the original claim amount (in fiat currency)
      reportCID,
      walletAddress,
      status: 'pending',
      documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
    });

    const savedClaim = await newClaim.save();
    console.log('Claim saved to the database successfully:', savedClaim);

    res.status(201).json({ message: 'Claim submitted successfully and stored on the blockchain!', claimId });
  } catch (error) {
    console.error('Error occurred while submitting the claim:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});






 



 



router.get('/status/:claimId', async (req, res) => {
  const { claimId } = req.params;
  console.log(`Received request for claim ID: ${claimId}`);  // Add logging to see what claimId is received

  try {
    // Find the claim by its unique ID
    const claim = await Claim.findOne({ claimId: claimId });

    console.log('Claim found:', claim);  // Log the result of the query

    if (!claim) {
      return res.status(404).json({ error: "Claim not found." });
    }

    // Return the status of the claim
    return res.status(200).json({ status: claim.status });
  } catch (error) {
    console.error("Error fetching claim status:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

 


router.get('/claims', async (req, res) => {
  try {
    const claims = await Claim.find();

    if (!claims.length) {
      console.log('No claims found in the database.');
      return res.status(404).json({ message: 'No claims found' });
    }

    console.log('Fetched claims:', claims);

    const claimsWithDetails = claims.map(claim => ({
      claimId: claim.claimId,
      doctorName: claim.doctorName,
      patientName: claim.patientName,
      doctorId: claim.doctorId,
      patientId: claim.patientId,
      diagnosis: claim.diagnosis,
      treatment: claim.treatment,
      amount: claim.amount,
      status: claim.status.trim(),
      submissionDate: claim.createdAt ? claim.createdAt.toISOString() : 'N/A',
      transactionHash: claim.transactionHash || 'N/A',
      documents: claim.documents,
    }));

    res.status(200).json(claimsWithDetails);
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ message: 'Error fetching claims' });
  }
});


// TODO: FOR DELETION

router.delete('/claims/:claimId', async (req, res) => {
  const { claimId } = req.params;
  console.log('Claim ID from request:', claimId);

  try {
      const claims = await ClaimSubmission.find();
      console.log('Claim IDs in database:', claims.map(c => c.claimId));

      const deletedClaim = await ClaimSubmission.findOneAndDelete({ claimId });
      if (!deletedClaim) {
          return res.status(404).json({ error: 'Claim not found' });
      }
      res.status(200).json({ message: 'Claim deleted successfully', deletedClaim });
  } catch (error) {
      console.error('Error deleting claim:', error);
      res.status(500).json({ error: 'Failed to delete claim' });
  }
});





export default router;



