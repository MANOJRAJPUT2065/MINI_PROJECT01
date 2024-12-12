import express from 'express';
import {ethers} from 'ethers';
import Claim from '../models/Claim.js'; // Import the Claim model

const router = express.Router();

// Ethereum configuration
const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // Ganache RPC URL
const privateKey = '0x266aea04456d3685fd9393aaf11fd7d7a7b31cfd5ce3efbb111e29fbdc9b3fba'; // Ganache account private key
const wallet = new ethers.Wallet(privateKey, provider);

// The deployed contract's new address
const contractAddress = '0x52999617220cdDFCa7C7F319B6Fd7a286C084B12'; // Updated contract address
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

// Route: POST /api/claims/submit
router.post('/submit', async (req, res) => {
  try {
    const { doctorName, patientName, doctorId, patientId, diagnosis, treatment, claimAmount, reportCID } = req.body;

    console.log('Received request to submit claim:', req.body);

    // Validation
    if (!patientName || !patientId || !doctorId || !diagnosis || !treatment || !claimAmount || !reportCID) {
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

    const claimId = ethers.keccak256(ethers.toUtf8Bytes(`${Date.now()}-${patientId}`));
    console.log('Generated unique claim ID:', claimId);

    // Smart contract interaction
    const tx = await contract.submitClaim(
      ethers.parseEther(claimAmount.toString()),
      diagnosis,
      doctorName,
      patientName,
      doctorId,
      reportCID
    );

    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await provider.waitForTransaction(tx.hash);

    if (receipt.status !== 1) {
      console.error('Transaction failed on the blockchain');
      return res.status(500).json({ error: 'Blockchain transaction failed.' });
    }

    console.log(`Transaction mined successfully in block ${receipt.blockNumber}`);

    const newClaim = new Claim({
      doctorName,
      patientName,
      doctorId,
      patientId,
      amount: claimAmount,
      documents: [{ fileUrl: `https://ipfs.io/ipfs/${reportCID}`, ipfsHash: reportCID, fileType: 'pdf' }],
    });

    await newClaim.save();
    console.log('Claim saved to the database successfully.');

    res.status(201).json({ message: 'Claim submitted successfully and stored on the blockchain!', claimId });
  } catch (error) {
    console.error('Error occurred while submitting the claim:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});


// Route to get the claim status by Claim ID
router.get('/status/:claimId', async (req, res) => {
  const { claimId } = req.params;
  console.log(`Received request for claim ID: ${claimId}`);  // Add logging to see what claimId is received

  try {
    // Find the claim by its unique ID
    const claim = await Claim.findOne({ claimId: claimId });

    console.log('Claim found:', claim);  // Log the result of the query

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



export default router;




