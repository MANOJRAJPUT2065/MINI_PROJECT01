# Smart Contracts Documentation (Hardhat + Solidity)

## 📋 Overview

The Healthcare System uses **Ethereum smart contracts** to provide immutable, transparent, and decentralized insurance claim management. Built with **Solidity 0.8.x** and deployed using **Hardhat**, the contracts enable trustless verification, fraud detection, and automated claim processing on the blockchain.

**Configuration:**
- **Solidity Version:** ^0.8.0
- **Development Network:** Ganache (http://127.0.0.1:7545)
- **Test Network:** Ethereum Sepolia / Polygon Mumbai
- **Framework:** Hardhat
- **License:** MIT

---

## 🏗️ Architecture

### Contract Structure

```
smartcontracts/
├── contracts/
│   └── InsuranceClaim.sol         # Main insurance claim contract
├── scripts/
│   └── deploy.js                  # Deployment script
├── test/
│   └── Lock.js                    # Contract tests
├── ignition/
│   └── modules/                   # Deployment modules
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Node.js dependencies
└── README.md                      # Contract documentation
```

---

## 📜 InsuranceClaim Contract

### Contract Overview

The `InsuranceClaim` contract is the core smart contract managing the entire lifecycle of insurance claims on the blockchain.

**Key Features:**
- ✅ **Decentralized Claim Submission** - Immutable record of all claims
- ✅ **Doctor Verification** - Assigned doctors verify claims on-chain
- ✅ **Admin Approval** - Multi-level approval workflow
- ✅ **Fraud Detection** - On-chain fraud detection mechanisms
- ✅ **Automatic Payouts** - Direct Ether transfers to claimants
- ✅ **IPFS Integration** - Store medical reports on IPFS with CID verification
- ✅ **Event Logging** - Comprehensive event emissions for off-chain tracking

---

## 📊 Data Structures

### 1. Claim Struct

```solidity
struct Claim {
    uint256 claimId;           // Unique claim identifier
    address claimant;          // Ethereum address of the patient
    uint256 amount;            // Claim amount in Wei
    string description;        // Brief description of the claim
    ClaimDetails details;      // Nested struct with detailed information
    ClaimStatus status;        // Current status (Pending, Verified, etc.)
    uint256 timestamp;         // Block timestamp when submitted
    address doctor;            // Assigned doctor's address
    bool isFraud;             // Fraud flag
}
```

---

### 2. ClaimDetails Struct

```solidity
struct ClaimDetails {
    string doctorName;         // Name of the treating doctor
    string patientName;        // Name of the patient
    uint256 doctorId;          // Doctor's unique identifier
    uint256 patientId;         // Patient's unique identifier
    string diagnosis;          // ICD-10 diagnosis code
    string treatment;          // CPT treatment code
    string reportCID;          // IPFS Content Identifier for medical reports
}
```

**IPFS reportCID Example:**
- `QmXyZ123...` - Hash pointing to encrypted medical documents stored on IPFS
- Ensures tamper-proof storage of sensitive medical data
- Enables decentralized, censorship-resistant file storage

---

### 3. ClaimStatus Enum

```solidity
enum ClaimStatus {
    Pending,    // 0: Claim submitted, awaiting verification
    Verified,   // 1: Doctor verified the claim
    Approved,   // 2: Admin approved the claim
    Rejected,   // 3: Claim rejected
    Paid        // 4: Payment processed
}
```

**Status Flow:**
```
Pending → Verified → Approved → Paid
        ↓           ↓
    Rejected    Rejected
```

---

## 🔐 State Variables

```solidity
// Core state
uint256 public claimCount = 0;
mapping(uint256 => Claim) public claims;
mapping(address => uint256[]) public claimantClaims;
mapping(address => uint256) public claimCountPerClaimant;

// Access control
address public admin;
address public insurer;
```

**Storage Mappings:**

| Mapping | Key | Value | Purpose |
|---------|-----|-------|---------|
| `claims` | claimId (uint256) | Claim struct | Store all claim data |
| `claimantClaims` | claimant address | uint256[] | Track claims per patient |
| `claimCountPerClaimant` | claimant address | uint256 | Count claims per patient |

---

## 🔧 Core Functions

### 1. submitClaim()

**Description:** Submit a new insurance claim to the blockchain

**Visibility:** Public  
**Modifiers:** None  
**Gas Cost:** ~350,000 - 450,000 gas

**Parameters:**
```solidity
function submitClaim(
    uint256 claimId,           // Unique ID from backend
    uint256 amount,            // Claim amount in Wei
    string memory description, // Claim description
    string memory doctorName,
    string memory patientName,
    uint256 doctorId,
    uint256 patientId,
    string memory diagnosis,
    string memory treatment,
    string memory reportCID    // IPFS CID
) public
```

**Validation:**
- ✅ Amount must be > 0
- ✅ reportCID must be unique (no duplicates)
- ✅ All string fields must be non-empty

**Process Flow:**
```
1. Validate claim amount
    ↓
2. Check for duplicate reportCID
    ↓
3. Create ClaimDetails struct
    ↓
4. Assign doctor (msg.sender)
    ↓
5. Create Claim and store in mapping
    ↓
6. Update claimant's claim array
    ↓
7. Increment claim counter
    ↓
8. Emit ClaimSubmitted event
    ↓
9. Emit DoctorNotified event
```

**Events Emitted:**
```solidity
emit ClaimSubmitted(
    claimId, claimant, amount, description,
    doctorName, patientName, doctorId, patientId,
    diagnosis, treatment, reportCID, timestamp
);
emit DoctorNotified(doctor, claimId);
```

**Example Usage (JavaScript/Web3):**
```javascript
const tx = await insuranceContract.submitClaim(
    12345,                          // claimId
    ethers.utils.parseEther("5"),   // 5 ETH
    "Emergency appendectomy",       // description
    "Dr. Sarah Johnson",            // doctorName
    "John Doe",                     // patientName
    67890,                          // doctorId
    11111,                          // patientId
    "K35.80",                       // diagnosis (Acute appendicitis)
    "44950",                        // treatment (CPT code)
    "QmXyZ123abc..."               // reportCID
);

await tx.wait();
console.log("Claim submitted:", tx.hash);
```

---

### 2. verifyClaim()

**Description:** Doctor verifies the authenticity of a claim

**Visibility:** Public  
**Modifiers:** None  
**Gas Cost:** ~50,000 - 100,000 gas

**Parameters:**
```solidity
function verifyClaim(uint256 claimId) public
```

**Requirements:**
- ✅ Only assigned doctor can verify
- ✅ Claim must be in Pending status
- ✅ Runs fraud detection checks

**Fraud Detection:**
```solidity
bool fraudDetected = detectFraud(claimId);
if(fraudDetected) {
    claim.isFraud = true;
    claim.status = ClaimStatus.Rejected;
    emit FraudDetected(claimId, "Fraudulent activity detected");
} else {
    claim.status = ClaimStatus.Verified;
    emit ClaimVerified(claimId);
}
```

**Example:**
```javascript
const tx = await insuranceContract.verifyClaim(12345, {
    from: doctorAddress
});
await tx.wait();
```

---

### 3. approveClaim()

**Description:** Admin approves a verified claim for payment

**Visibility:** Public  
**Modifiers:** `onlyAdmin`  
**Gas Cost:** ~30,000 gas

**Parameters:**
```solidity
function approveClaim(uint256 claimId) public onlyAdmin
```

**Requirements:**
- ✅ Only admin can approve
- ✅ Claim must be Verified
- ✅ Cannot approve rejected claims

**Example:**
```javascript
const tx = await insuranceContract.approveClaim(12345, {
    from: adminAddress
});
```

---

### 4. rejectClaim()

**Description:** Admin rejects a claim with a reason

**Visibility:** Public  
**Modifiers:** `onlyAdmin`  
**Gas Cost:** ~35,000 gas

**Parameters:**
```solidity
function rejectClaim(uint256 claimId, string memory reason) public onlyAdmin
```

**Example:**
```javascript
await insuranceContract.rejectClaim(
    12345,
    "Insufficient medical documentation",
    { from: adminAddress }
);
```

---

### 5. payClaim()

**Description:** Process payment for an approved claim

**Visibility:** Public (Payable)  
**Modifiers:** `onlyAdmin`  
**Gas Cost:** ~60,000 gas

**Parameters:**
```solidity
function payClaim(uint256 claimId) public onlyAdmin payable
```

**Requirements:**
- ✅ Claim must be Approved
- ✅ Contract must have sufficient balance
- ✅ Claim not already paid

**Process:**
1. Verify claim status = Approved
2. Check contract balance >= claim amount
3. Set status to Paid
4. Transfer Ether to claimant
5. Emit ClaimPaid event

**Example:**
```javascript
const claimAmount = ethers.utils.parseEther("5");

// Ensure contract has funds
await admin.sendTransaction({
    to: contractAddress,
    value: claimAmount
});

// Pay the claim
const tx = await insuranceContract.payClaim(12345, {
    from: adminAddress
});

await tx.wait();
console.log("Payment processed!");
```

---

### 6. detectFraud()

**Description:** On-chain fraud detection algorithm

**Visibility:** Public View  
**Returns:** bool (true if fraud detected)

**Fraud Detection Rules:**

```solidity
function detectFraud(uint256 claimId) public view returns (bool) {
    Claim storage claim = claims[claimId];
    
    // Rule 1: Unusually high claim amount
    if (claim.amount > 10000 ether) {
        return true;
    }
    
    // Rule 2: Duplicate reportCID
    for (uint256 i = 0; i < claimantClaims[claim.claimant].length; i++) {
        uint256 otherClaimId = claimantClaims[claim.claimant][i];
        if (otherClaimId != claimId) {
            Claim storage otherClaim = claims[otherClaimId];
            if (keccak256(abi.encodePacked(otherClaim.details.reportCID)) 
                == keccak256(abi.encodePacked(claim.details.reportCID))) {
                return true; // Duplicate report detected
            }
        }
    }
    
    return false;
}
```

**Fraud Indicators:**
1. **High Amount:** Claims > 10,000 ETH flagged
2. **Duplicate Reports:** Same IPFS CID used multiple times
3. **Frequent Claims:** Multiple claims in short period (future enhancement)
4. **Suspicious Patterns:** Unusual diagnosis-treatment combinations

---

### 7. detectDuplicateReportCID()

**Description:** Check if reportCID already exists for claimant

**Visibility:** Public View  
**Returns:** bool

```solidity
function detectDuplicateReportCID(string memory reportCID) public view returns (bool)
```

**Usage:**
- Called during submitClaim() to prevent duplicate submissions
- Compares using keccak256 hash for gas efficiency

---

### 8. getClaim()

**Description:** Retrieve complete claim details

**Visibility:** Public View  
**Returns:** Claim memory

```solidity
function getClaim(uint256 claimId) public view returns (Claim memory)
```

**Example:**
```javascript
const claim = await insuranceContract.getClaim(12345);

console.log("Claim ID:", claim.claimId.toString());
console.log("Claimant:", claim.claimant);
console.log("Amount:", ethers.utils.formatEther(claim.amount), "ETH");
console.log("Status:", claim.status); // 0=Pending, 1=Verified, etc.
console.log("Doctor:", claim.doctor);
console.log("Fraud Flag:", claim.isFraud);
console.log("IPFS CID:", claim.details.reportCID);
```

---

### 9. getClaimantClaims()

**Description:** Get all claim IDs for a specific claimant

**Visibility:** Public View  
**Returns:** uint256[]

```solidity
function getClaimantClaims(address claimant) public view returns (uint256[] memory)
```

**Example:**
```javascript
const claimIds = await insuranceContract.getClaimantClaims(patientAddress);
console.log("Patient's Claims:", claimIds); // [12345, 12350, 12367]
```

---

### 10. withdrawFunds()

**Description:** Admin withdraws excess funds from contract

**Visibility:** Public  
**Modifiers:** `onlyAdmin`

```solidity
function withdrawFunds(uint256 amount) public onlyAdmin
```

---

## 🔒 Access Control

### Modifiers

```solidity
modifier onlyAdmin() {
    require(msg.sender == admin, "Not authorized");
    _;
}

modifier onlyInsurer() {
    require(msg.sender == insurer, "Not authorized");
    _;
}
```

### Role Management

```solidity
// Change admin (only current admin)
function setAdmin(address newAdmin) public onlyAdmin {
    admin = newAdmin;
}
```

**Roles:**
- **Admin:** Deploy contract, approve/reject claims, pay claims, withdraw funds
- **Doctor:** Verify claims assigned to them
- **Patient/Claimant:** Submit claims, view their claims
- **Insurer:** (Future) Advanced claim validation

---

## 📡 Events

All events enable off-chain tracking and frontend notifications:

```solidity
// Main events
event ClaimSubmitted(...);
event ClaimVerified(uint256 indexed claimId);
event ClaimApproved(uint256 indexed claimId);
event ClaimRejected(uint256 indexed claimId, string reason);
event ClaimPaid(uint256 indexed claimId);
event DoctorNotified(address indexed doctor, uint256 indexed claimId);
event FraudDetected(uint256 indexed claimId, string reason);
```

**Listening to Events (Frontend):**
```javascript
insuranceContract.on("ClaimSubmitted", (claimId, claimant, amount, event) => {
    console.log(`New claim ${claimId} from ${claimant} for ${amount} wei`);
    // Update UI, send notification, etc.
});

insuranceContract.on("FraudDetected", (claimId, reason, event) => {
    alert(`Fraud detected in claim ${claimId}: ${reason}`);
});
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v16+ and npm
- Ganache (for local blockchain)
- MetaMask (for testing)

---

### Installation

```bash
# Navigate to smart contracts directory
cd smartcontracts

# Install dependencies
npm install

# Key dependencies installed:
# - hardhat: Ethereum development environment
# - @nomicfoundation/hardhat-toolbox: Hardhat plugins
# - @openzeppelin/contracts: Secure smart contract library
# - ethers: Ethereum library
```

---

### Compile Contracts

```bash
# Compile Solidity contracts
npx hardhat compile

# Output:
# Compiled 1 Solidity file successfully
# Artifacts saved to: artifacts/
# Contract ABI saved to: artifacts/contracts/InsuranceClaim.sol/InsuranceClaim.json
```

---

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/InsuranceClaim.test.js
```

**Example Test:**
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceClaim", function () {
    let insuranceClaim, admin, patient, doctor;
    
    beforeEach(async function () {
        [admin, patient, doctor] = await ethers.getSigners();
        
        const InsuranceClaim = await ethers.getContractFactory("InsuranceClaim");
        insuranceClaim = await InsuranceClaim.deploy();
        await insuranceClaim.deployed();
    });
    
    it("Should submit a claim successfully", async function () {
        const tx = await insuranceClaim.connect(patient).submitClaim(
            1, ethers.utils.parseEther("5"), "Test claim",
            "Dr. Smith", "John Doe", 123, 456,
            "A01", "T01", "QmTest123"
        );
        
        await expect(tx)
            .to.emit(insuranceClaim, "ClaimSubmitted")
            .withArgs(1, patient.address, ethers.utils.parseEther("5"), ...);
    });
});
```

---

### Run Local Blockchain

```bash
# Start Hardhat node
npx hardhat node

# Output:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# Accounts with 10000 ETH each...
```

**Or use Ganache:**
```bash
# Download and start Ganache
# GUI: http://127.0.0.1:7545
# CLI: ganache-cli -p 7545
```

---

### Deploy Contract

**Using Hardhat Script:**
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Deploy Script (`scripts/deploy.js`):**
```javascript
const hre = require("hardhat");

async function main() {
    console.log("Deploying InsuranceClaim contract...");
    
    const InsuranceClaim = await hre.ethers.getContractFactory("InsuranceClaim");
    const contract = await InsuranceClaim.deploy();
    
    await contract.deployed();
    
    console.log("✅ InsuranceClaim deployed to:", contract.address);
    console.log("Admin address:", await contract.admin());
    console.log("Insurer address:", await contract.insurer());
    
    // Save contract address and ABI for backend
    const fs = require('fs');
    const contractData = {
        address: contract.address,
        abi: contract.interface.format('json')
    };
    
    fs.writeFileSync(
        '../backend/routes/contractABI.json',
        JSON.stringify(contractData, null, 2)
    );
    
    console.log("Contract ABI saved to backend/");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

---

## 🌐 Network Configuration

**Edit `hardhat.config.js`:**

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: [process.env.PRIVATE_KEY] // Use .env for security
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111
        },
        mumbai: {
            url: process.env.MUMBAI_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 80001
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};
```

**Environment Variables (.env):**
```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

**⚠️ SECURITY WARNING:**
- Never commit private keys to Git
- Use `.env` file and add to `.gitignore`
- Use separate wallets for development/production

---

## 🔌 Backend Integration

### Web3 Connection

```javascript
// backend/services/blockchain.js
const Web3 = require('web3');
const contractABI = require('../routes/contractABI.json');

const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(
    contractABI.abi,
    contractABI.address
);

// Submit claim to blockchain
async function submitClaimToBlockchain(claimData) {
    const accounts = await web3.eth.getAccounts();
    
    const tx = await contract.methods.submitClaim(
        claimData.claimId,
        web3.utils.toWei(claimData.amount.toString(), 'ether'),
        claimData.description,
        claimData.doctorName,
        claimData.patientName,
        claimData.doctorId,
        claimData.patientId,
        claimData.diagnosis,
        claimData.treatment,
        claimData.reportCID
    ).send({
        from: accounts[0],
        gas: 500000
    });
    
    return tx.transactionHash;
}

module.exports = { submitClaimToBlockchain };
```

---

## 📊 Gas Optimization

### Gas Costs (Approximate)

| Function | Gas Cost | USD (at $2000 ETH, 50 gwei) |
|----------|----------|-------------------------------|
| submitClaim() | ~400,000 | ~$0.04 |
| verifyClaim() | ~80,000 | ~$0.008 |
| approveClaim() | ~30,000 | ~$0.003 |
| payClaim() | ~60,000 | ~$0.006 |
| getClaim() (view) | 0 (read-only) | $0 |

**Optimization Tips:**
1. Use `memory` instead of `storage` when possible
2. Batch operations to reduce transaction count
3. Use events instead of storing data on-chain
4. Implement Layer 2 solutions (Polygon) for lower fees

---

## 🚢 Deployment Checklist

- [ ] Update Solidity version if needed
- [ ] Remove hardcoded private keys
- [ ] Set correct admin address
- [ ] Test all functions on local network
- [ ] Run security audit (Slither, MythX)
- [ ] Deploy to testnet (Sepolia/Mumbai)
- [ ] Verify contract on Etherscan
- [ ] Test with frontend integration
- [ ] Deploy to mainnet
- [ ] Monitor gas prices before deployment

---

## 🔒 Security Best Practices

1. **Access Control:** Always use modifiers for admin functions
2. **Reentrancy Protection:** Use checks-effects-interactions pattern
3. **Integer Overflow:** Solidity 0.8+ has built-in overflow protection
4. **Input Validation:** Require statements for all inputs
5. **Audit Logs:** Emit events for all state changes
6. **Upgradability:** Consider using proxy patterns for future upgrades

---

## 📚 Additional Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum Gas Tracker](https://etherscan.io/gastracker)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
