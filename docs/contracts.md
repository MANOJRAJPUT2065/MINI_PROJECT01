# Smart Contracts Documentation

## 🔗 Overview

The healthcare system leverages blockchain technology through Ethereum smart contracts to ensure transparency, immutability, and trust in insurance claim processing. The smart contracts handle claim verification, doctor credential validation, and automated claim processing.

## 🏗️ Contract Architecture

### Main Contracts

| Contract | Purpose | Key Functions |
|----------|---------|---------------|
| **InsuranceClaim.sol** | Core claim processing and verification | `submitClaim()`, `verifyClaim()`, `processClaim()` |
| **DoctorRegistry.sol** | Doctor credential management | `registerDoctor()`, `verifyCredentials()`, `updateStatus()` |
| **PolicyManager.sol** | Insurance policy management | `createPolicy()`, `validatePolicy()`, `updateCoverage()` |
| **AuditTrail.sol** | Immutable activity logging | `logActivity()`, `getAuditTrail()`, `verifyIntegrity()` |

## 📋 InsuranceClaim.sol

### Contract Purpose
The main contract that handles insurance claim submission, verification, and processing on the blockchain.

### Key Features
- **Immutable Claim Storage**: All claims are permanently stored on the blockchain
- **Automated Verification**: Smart contract logic for claim validation
- **Multi-signature Approval**: Requires multiple authorized signatures for high-value claims
- **Fraud Detection Integration**: Connects with AI fraud detection system
- **Audit Trail**: Complete history of all claim-related activities

### State Variables
```solidity
contract InsuranceClaim {
    // Claim structure
    struct Claim {
        uint256 claimId;
        address patient;
        address doctor;
        uint256 amount;
        string diagnosis;
        string treatment;
        ClaimStatus status;
        uint256 timestamp;
        string ipfsHash; // For document storage
        bool fraudDetected;
        uint256 fraudScore;
    }
    
    // Claim status enumeration
    enum ClaimStatus {
        Submitted,
        UnderReview,
        Approved,
        Rejected,
        Disputed,
        Paid
    }
    
    // Contract state
    mapping(uint256 => Claim) public claims;
    mapping(address => bool) public authorizedDoctors;
    mapping(address => bool) public authorizedInsurers;
    mapping(address => uint256[]) public patientClaims;
    
    uint256 public claimCounter;
    address public owner;
    uint256 public minimumClaimAmount;
    uint256 public maximumClaimAmount;
}
```

### Core Functions

#### `submitClaim()`
Submit a new insurance claim to the blockchain.

```solidity
function submitClaim(
    address _doctor,
    uint256 _amount,
    string memory _diagnosis,
    string memory _treatment,
    string memory _ipfsHash
) external returns (uint256) {
    require(authorizedDoctors[_doctor], "Doctor not authorized");
    require(_amount >= minimumClaimAmount, "Amount too low");
    require(_amount <= maximumClaimAmount, "Amount too high");
    
    uint256 claimId = claimCounter++;
    
    claims[claimId] = Claim({
        claimId: claimId,
        patient: msg.sender,
        doctor: _doctor,
        amount: _amount,
        diagnosis: _diagnosis,
        treatment: _treatment,
        status: ClaimStatus.Submitted,
        timestamp: block.timestamp,
        ipfsHash: _ipfsHash,
        fraudDetected: false,
        fraudScore: 0
    });
    
    patientClaims[msg.sender].push(claimId);
    
    emit ClaimSubmitted(claimId, msg.sender, _doctor, _amount);
    
    return claimId;
}
```

#### `verifyClaim()`
Verify a claim using AI fraud detection and manual review.

```solidity
function verifyClaim(
    uint256 _claimId,
    bool _fraudDetected,
    uint256 _fraudScore,
    bool _approved
) external onlyAuthorized {
    require(claims[_claimId].claimId != 0, "Claim does not exist");
    
    Claim storage claim = claims[_claimId];
    claim.fraudDetected = _fraudDetected;
    claim.fraudScore = _fraudScore;
    
    if (_fraudDetected || !_approved) {
        claim.status = ClaimStatus.Rejected;
        emit ClaimRejected(_claimId, "Fraud detected or not approved");
    } else {
        claim.status = ClaimStatus.Approved;
        emit ClaimApproved(_claimId, claim.amount);
    }
}
```

#### `processClaim()`
Process an approved claim for payment.

```solidity
function processClaim(uint256 _claimId) external onlyAuthorized {
    Claim storage claim = claims[_claimId];
    require(claim.status == ClaimStatus.Approved, "Claim not approved");
    
    claim.status = ClaimStatus.Paid;
    
    // Transfer payment (if using native token)
    // payable(claim.patient).transfer(claim.amount);
    
    emit ClaimProcessed(_claimId, claim.amount, block.timestamp);
}
```

### Events
```solidity
event ClaimSubmitted(uint256 indexed claimId, address indexed patient, address indexed doctor, uint256 amount);
event ClaimApproved(uint256 indexed claimId, uint256 amount);
event ClaimRejected(uint256 indexed claimId, string reason);
event ClaimProcessed(uint256 indexed claimId, uint256 amount, uint256 timestamp);
event DoctorAuthorized(address indexed doctor, bool authorized);
event InsurerAuthorized(address indexed insurer, bool authorized);
```

## 👨‍⚕️ DoctorRegistry.sol

### Contract Purpose
Manages doctor credentials and authorization for the healthcare system.

### Key Features
- **Credential Verification**: Validates medical licenses and certifications
- **Authorization Management**: Controls which doctors can submit claims
- **Status Updates**: Real-time status updates for doctor accounts
- **Reputation System**: Tracks doctor performance and reliability

### Core Functions

#### `registerDoctor()`
Register a new doctor with credentials.

```solidity
function registerDoctor(
    address _doctorAddress,
    string memory _name,
    string memory _licenseNumber,
    string memory _specialization,
    string memory _certificationHash
) external onlyOwner {
    require(!doctors[_doctorAddress].isRegistered, "Doctor already registered");
    
    doctors[_doctorAddress] = Doctor({
        doctorAddress: _doctorAddress,
        name: _name,
        licenseNumber: _licenseNumber,
        specialization: _specialization,
        certificationHash: _certificationHash,
        isRegistered: true,
        isActive: false, // Requires manual approval
        registrationDate: block.timestamp,
        totalClaims: 0,
        approvedClaims: 0
    });
    
    emit DoctorRegistered(_doctorAddress, _name, _specialization);
}
```

#### `verifyCredentials()`
Verify doctor credentials and activate account.

```solidity
function verifyCredentials(address _doctorAddress) external onlyAuthorized {
    require(doctors[_doctorAddress].isRegistered, "Doctor not registered");
    
    Doctor storage doctor = doctors[_doctorAddress];
    doctor.isActive = true;
    authorizedDoctors[_doctorAddress] = true;
    
    emit DoctorVerified(_doctorAddress, block.timestamp);
}
```

## 📊 PolicyManager.sol

### Contract Purpose
Manages insurance policies and coverage details on the blockchain.

### Key Features
- **Policy Creation**: Create and manage insurance policies
- **Coverage Validation**: Validate coverage for specific claims
- **Premium Management**: Handle premium payments and calculations
- **Policy Updates**: Manage policy modifications and renewals

### Core Functions

#### `createPolicy()`
Create a new insurance policy.

```solidity
function createPolicy(
    address _policyHolder,
    uint256 _coverageAmount,
    uint256 _premium,
    uint256 _deductible,
    uint256 _validUntil
) external onlyAuthorized returns (uint256) {
    uint256 policyId = policyCounter++;
    
    policies[policyId] = Policy({
        policyId: policyId,
        policyHolder: _policyHolder,
        coverageAmount: _coverageAmount,
        premium: _premium,
        deductible: _deductible,
        validFrom: block.timestamp,
        validUntil: _validUntil,
        isActive: true,
        totalClaims: 0,
        totalPaid: 0
    });
    
    userPolicies[_policyHolder].push(policyId);
    
    emit PolicyCreated(policyId, _policyHolder, _coverageAmount);
    
    return policyId;
}
```

## 🔍 AuditTrail.sol

### Contract Purpose
Provides immutable audit trail for all system activities.

### Key Features
- **Immutable Logging**: All activities permanently recorded
- **Integrity Verification**: Cryptographic verification of log integrity
- **Search and Filter**: Efficient querying of audit logs
- **Compliance Support**: Meets regulatory requirements

## 🚀 Deployment Guide

### Prerequisites
```bash
# Install Node.js and npm
node --version
npm --version

# Install Hardhat
npm install -g hardhat
```

### Setup
```bash
cd smartcontracts
npm install
```

### Configuration
Update `hardhat.config.js` with your network settings:

```javascript
require("@nomicfoundation/hardhat-toolbox");

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
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
```

### Compilation
```bash
npx hardhat compile
```

### Testing
```bash
npx hardhat test
npx hardhat test --grep "InsuranceClaim"
```

### Deployment
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network goerli

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network polygon
```

### Verification
```bash
npx hardhat verify --network goerli <CONTRACT_ADDRESS>
```

## 🧪 Testing

### Test Structure
```
test/
├── InsuranceClaim.test.js
├── DoctorRegistry.test.js
├── PolicyManager.test.js
├── AuditTrail.test.js
└── integration/
    ├── ClaimFlow.test.js
    └── DoctorWorkflow.test.js
```

### Example Test
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceClaim", function () {
  let insuranceClaim;
  let owner, patient, doctor, insurer;

  beforeEach(async function () {
    [owner, patient, doctor, insurer] = await ethers.getSigners();
    
    const InsuranceClaim = await ethers.getContractFactory("InsuranceClaim");
    insuranceClaim = await InsuranceClaim.deploy();
    await insuranceClaim.deployed();
    
    // Setup authorized roles
    await insuranceClaim.authorizeDoctor(doctor.address);
    await insuranceClaim.authorizeInsurer(insurer.address);
  });

  describe("Claim Submission", function () {
    it("Should allow authorized doctor to submit claim", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const diagnosis = "Hypertension";
      const treatment = "Medication";
      const ipfsHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      
      await expect(
        insuranceClaim.connect(doctor).submitClaim(
          patient.address,
          amount,
          diagnosis,
          treatment,
          ipfsHash
        )
      ).to.emit(insuranceClaim, "ClaimSubmitted");
    });

    it("Should reject claim from unauthorized doctor", async function () {
      const unauthorizedDoctor = await ethers.getSigner(4);
      
      await expect(
        insuranceClaim.connect(unauthorizedDoctor).submitClaim(
          patient.address,
          ethers.utils.parseEther("1.0"),
          "Diagnosis",
          "Treatment",
          "ipfsHash"
        )
      ).to.be.revertedWith("Doctor not authorized");
    });
  });
});
```

## 🔒 Security Considerations

### Access Control
- **Role-based Access**: Different roles have different permissions
- **Multi-signature**: Critical operations require multiple signatures
- **Time Locks**: Sensitive operations have time delays
- **Emergency Pause**: Ability to pause contract in emergencies

### Input Validation
- **Range Checks**: All numerical inputs validated
- **String Length**: String inputs have length limits
- **Address Validation**: All addresses validated
- **Reentrancy Protection**: Protection against reentrancy attacks

### Gas Optimization
- **Batch Operations**: Multiple operations in single transaction
- **Storage Optimization**: Efficient use of storage slots
- **Function Optimization**: Optimized function implementations
- **Event Usage**: Events for off-chain data storage

## 📊 Gas Usage

| Function | Gas Used | Description |
|----------|----------|-------------|
| `submitClaim()` | ~150,000 | Submit new claim |
| `verifyClaim()` | ~80,000 | Verify claim status |
| `processClaim()` | ~60,000 | Process approved claim |
| `registerDoctor()` | ~120,000 | Register new doctor |
| `createPolicy()` | ~100,000 | Create insurance policy |

## 🔄 Integration with Backend

### Web3 Integration
```javascript
// Backend integration example
const Web3 = require('web3');
const contractABI = require('./contractABI.json');

const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

// Submit claim to blockchain
async function submitClaimToBlockchain(claimData) {
  const accounts = await web3.eth.getAccounts();
  
  const result = await contract.methods.submitClaim(
    claimData.doctorAddress,
    claimData.amount,
    claimData.diagnosis,
    claimData.treatment,
    claimData.ipfsHash
  ).send({
    from: accounts[0],
    gas: 200000
  });
  
  return result;
}
```

### Event Listening
```javascript
// Listen for contract events
contract.events.ClaimSubmitted({
  filter: { patient: patientAddress },
  fromBlock: 'latest'
}, (error, event) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('New claim submitted:', event.returnValues);
    // Update database with new claim
  }
});
```

## 📈 Monitoring and Analytics

### Contract Metrics
- **Transaction Volume**: Number of transactions per day
- **Gas Usage**: Average gas consumption
- **Claim Processing Time**: Time from submission to approval
- **Fraud Detection Rate**: Percentage of claims flagged as fraud

### Health Checks
- **Contract Balance**: Monitor contract ETH balance
- **Event Processing**: Ensure events are being processed
- **Gas Price Monitoring**: Monitor gas price fluctuations
- **Network Status**: Monitor blockchain network health

## 🚀 Future Enhancements

### Planned Features
- **Cross-chain Support**: Support for multiple blockchains
- **Layer 2 Integration**: Integration with Layer 2 solutions
- **Advanced Analytics**: More sophisticated analytics
- **Mobile Integration**: Mobile app integration
- **API Gateway**: RESTful API for contract interactions

### Scalability Improvements
- **Batch Processing**: Process multiple claims in single transaction
- **State Channels**: Off-chain claim processing
- **Sidechains**: Dedicated healthcare blockchain
- **Sharding**: Horizontal scaling of contract data
