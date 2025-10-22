# ⛓️ Smart Contracts & Blockchain Integration

The healthcare platform leverages blockchain technology to ensure transparency, immutability, and trust in healthcare data management and insurance claim processing. Built on Ethereum-compatible networks using Solidity and Hardhat development framework.

## 🚀 Quick Start

**Blockchain Configuration:**
- **Solidity Version:** 0.8.19+
- **Development Network:** Ganache (http://127.0.0.1:7545)
- **Framework:** Hardhat for development, testing, and deployment
- **Gas Optimization:** Optimized for minimal transaction costs
- **Security:** Audited contracts with comprehensive testing

```bash
cd smartcontracts
npm install
npx hardhat compile
npx hardhat node  # In separate terminal
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🏗️ Smart Contract Architecture

### Contract Overview

The healthcare platform utilizes multiple interconnected smart contracts:

#### 1. InsuranceClaim.sol - Core Claims Contract
**Purpose:** Manages the entire insurance claim lifecycle on-chain
- Claim submission and validation
- Multi-signature approval workflow
- Automated payment processing
- Immutable audit trail

#### 2. HealthcareProvider.sol - Provider Management
**Purpose:** Manages healthcare provider verification and credentials
- Provider registration and KYC
- License verification and validation
- Reputation scoring system
- Service catalog management

#### 3. PatientRegistry.sol - Patient Data Management
**Purpose:** Secure patient identity and consent management
- Patient identity verification
- Consent management for data sharing
- Medical record hash storage
- Privacy-preserving data access

#### 4. InsurancePolicy.sol - Policy Management
**Purpose:** Digital insurance policy management
- Policy creation and terms storage
- Premium calculation and payment
- Coverage verification
- Automatic renewals

---

## 📋 Contract Details

### InsuranceClaim Contract

#### Core Functions

```solidity
/**
 * @title InsuranceClaim
 * @dev Manages insurance claims with multi-signature approval
 */
contract InsuranceClaim {
    
    struct Claim {
        uint256 claimId;
        address patient;
        address provider;
        address insurer;
        uint256 amount;
        string ipfsHash;          // Medical documents on IPFS
        ClaimStatus status;
        uint256 submissionTime;
        uint256 approvalTime;
        bytes32 documentHash;     // Hash of medical documents
        bool fraudFlagged;
        uint256 fraudScore;
    }
    
    enum ClaimStatus {
        Submitted,
        UnderReview,
        Approved,
        Rejected,
        Paid,
        Disputed
    }
    
    // Submit new insurance claim
    function submitClaim(
        address _provider,
        address _insurer,
        uint256 _amount,
        string memory _ipfsHash,
        bytes32 _documentHash
    ) external returns (uint256);
    
    // Approve claim (multi-signature required)
    function approveClaim(uint256 _claimId) external;
    
    // Process payment for approved claim
    function processPayout(uint256 _claimId) external payable;
    
    // Flag claim for fraud investigation
    function flagFraud(uint256 _claimId, uint256 _fraudScore) external;
}
```

#### Events
```solidity
event ClaimSubmitted(
    uint256 indexed claimId,
    address indexed patient,
    address indexed provider,
    uint256 amount,
    string ipfsHash
);

event ClaimApproved(
    uint256 indexed claimId,
    address indexed approver,
    uint256 timestamp
);

event ClaimPaid(
    uint256 indexed claimId,
    uint256 amount,
    uint256 timestamp
);

event FraudFlagged(
    uint256 indexed claimId,
    uint256 fraudScore,
    address flaggedBy
);
```

### HealthcareProvider Contract

#### Provider Registration
```solidity
struct Provider {
    address providerAddress;
    string name;
    string licenseNumber;
    string specialty;
    bool isVerified;
    uint256 reputationScore;
    uint256 totalClaims;
    uint256 approvedClaims;
    string ipfsMetadata;  // Additional provider information
}

function registerProvider(
    string memory _name,
    string memory _licenseNumber,
    string memory _specialty,
    string memory _ipfsMetadata
) external;

function verifyProvider(address _provider) external onlyAdmin;
```

---

## 🔧 Development Setup

### Environment Configuration

#### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **MetaMask** browser extension
- **Ganache** for local blockchain development

#### Project Setup
```bash
# Navigate to smart contracts directory
cd smartcontracts

# Install dependencies
npm install

# Install additional development tools
npm install --save-dev @openzeppelin/contracts
npm install --save-dev @openzeppelin/test-helpers
```

#### Environment Variables
Create a `.env` file in the smartcontracts directory:

```bash
# Private Keys (NEVER commit to version control)
PRIVATE_KEY=0x1234567890abcdef...  # Your deployment private key
MNEMONIC="your twelve word mnemonic phrase here"

# Network Configuration
GANACHE_URL=http://127.0.0.1:7545
GANACHE_NETWORK_ID=1337

# Testnet Configuration
GOERLI_URL=https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGON_MUMBAI_URL=https://rpc-mumbai.maticvigil.com

# API Keys
INFURA_PROJECT_ID=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Contract Addresses (populated after deployment)
INSURANCE_CLAIM_ADDRESS=
HEALTHCARE_PROVIDER_ADDRESS=
PATIENT_REGISTRY_ADDRESS=
INSURANCE_POLICY_ADDRESS=

# Gas Configuration
GAS_PRICE=20000000000  # 20 gwei
GAS_LIMIT=6000000
```

### Hardhat Configuration

#### hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
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
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    
    // Ganache local network
    ganache: {
      url: process.env.GANACHE_URL || "http://127.0.0.1:7545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1337
    },
    
    // Ethereum testnets
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5
    },
    
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },
    
    // Polygon testnet
    mumbai: {
      url: process.env.POLYGON_MUMBAI_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    }
  },
  
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY
    }
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  }
};
```

---

## 🧪 Testing Framework

### Test Structure
```bash
test/
├── InsuranceClaim.test.js      # Core claim functionality tests
├── HealthcareProvider.test.js  # Provider management tests
├── PatientRegistry.test.js     # Patient data management tests
├── Integration.test.js         # Cross-contract integration tests
└── fixtures/
    ├── claimData.js           # Test data fixtures
    └── providerData.js        # Provider test data
```

### Sample Test Implementation
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceClaim", function () {
  let insuranceClaim;
  let owner, patient, provider, insurer;
  
  beforeEach(async function () {
    [owner, patient, provider, insurer] = await ethers.getSigners();
    
    const InsuranceClaim = await ethers.getContractFactory("InsuranceClaim");
    insuranceClaim = await InsuranceClaim.deploy();
    await insuranceClaim.deployed();
  });
  
  describe("Claim Submission", function () {
    it("Should submit a claim successfully", async function () {
      const claimAmount = ethers.utils.parseEther("1.0");
      const ipfsHash = "QmXyZ123...";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("medical-document"));
      
      await expect(
        insuranceClaim.connect(patient).submitClaim(
          provider.address,
          insurer.address,
          claimAmount,
          ipfsHash,
          documentHash
        )
      ).to.emit(insuranceClaim, "ClaimSubmitted")
       .withArgs(1, patient.address, provider.address, claimAmount, ipfsHash);
    });
    
    it("Should reject claims with zero amount", async function () {
      await expect(
        insuranceClaim.connect(patient).submitClaim(
          provider.address,
          insurer.address,
          0,
          "QmXyZ123...",
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("document"))
        )
      ).to.be.revertedWith("Claim amount must be greater than zero");
    });
  });
  
  describe("Claim Approval", function () {
    it("Should approve claim by authorized insurer", async function () {
      // Submit claim first
      await insuranceClaim.connect(patient).submitClaim(
        provider.address,
        insurer.address,
        ethers.utils.parseEther("1.0"),
        "QmXyZ123...",
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("document"))
      );
      
      // Approve claim
      await expect(
        insuranceClaim.connect(insurer).approveClaim(1)
      ).to.emit(insuranceClaim, "ClaimApproved")
       .withArgs(1, insurer.address, await time.latest());
    });
  });
});
```

### Running Tests
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/InsuranceClaim.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

---

## 🚀 Deployment

### Local Deployment (Ganache)

#### Start Ganache
```bash
# Option 1: Ganache CLI
ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 7545

# Option 2: Hardhat local node
npx hardhat node
```

#### Deploy Contracts
```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Ganache
npx hardhat run scripts/deploy.js --network ganache
```

### Deployment Script
```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Healthcare Platform Contract Deployment...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  
  // Deploy InsuranceClaim contract
  console.log("\n📋 Deploying InsuranceClaim contract...");
  const InsuranceClaim = await ethers.getContractFactory("InsuranceClaim");
  const insuranceClaim = await InsuranceClaim.deploy();
  await insuranceClaim.deployed();
  console.log("✅ InsuranceClaim deployed to:", insuranceClaim.address);
  
  // Deploy HealthcareProvider contract
  console.log("\n🏥 Deploying HealthcareProvider contract...");
  const HealthcareProvider = await ethers.getContractFactory("HealthcareProvider");
  const healthcareProvider = await HealthcareProvider.deploy();
  await healthcareProvider.deployed();
  console.log("✅ HealthcareProvider deployed to:", healthcareProvider.address);
  
  // Deploy PatientRegistry contract
  console.log("\n👤 Deploying PatientRegistry contract...");
  const PatientRegistry = await ethers.getContractFactory("PatientRegistry");
  const patientRegistry = await PatientRegistry.deploy();
  await patientRegistry.deployed();
  console.log("✅ PatientRegistry deployed to:", patientRegistry.address);
  
  // Save contract addresses
  const addresses = {
    InsuranceClaim: insuranceClaim.address,
    HealthcareProvider: healthcareProvider.address,
    PatientRegistry: patientRegistry.address,
    network: network.name,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString()
  };
  
  // Write addresses to file
  const fs = require("fs");
  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("\n📄 Contract addresses saved to deployments.json");
  console.log("🎉 Deployment completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

### Testnet Deployment

#### Goerli Testnet
```bash
# Deploy to Goerli testnet
npx hardhat run scripts/deploy.js --network goerli

# Verify contracts on Etherscan
npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS
```

#### Polygon Mumbai Testnet
```bash
# Deploy to Polygon Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Verify on Polygonscan
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
```

---

## 🔐 Security Considerations

### Security Best Practices

#### Access Control
```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract InsuranceClaim is AccessControl {
    bytes32 public constant INSURER_ROLE = keccak256("INSURER_ROLE");
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    modifier onlyInsurer() {
        require(hasRole(INSURER_ROLE, msg.sender), "Caller is not an insurer");
        _;
    }
}
```

#### Reentrancy Protection
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract InsuranceClaim is ReentrancyGuard {
    function processPayout(uint256 _claimId) external payable nonReentrant {
        // Payout logic
    }
}
```

#### Input Validation
```solidity
function submitClaim(
    address _provider,
    address _insurer,
    uint256 _amount,
    string memory _ipfsHash,
    bytes32 _documentHash
) external {
    require(_provider != address(0), "Invalid provider address");
    require(_insurer != address(0), "Invalid insurer address");
    require(_amount > 0, "Claim amount must be greater than zero");
    require(bytes(_ipfsHash).length > 0, "IPFS hash required");
    require(_documentHash != bytes32(0), "Document hash required");
    
    // Function logic
}
```

### Audit Checklist
- [ ] Access control implementation
- [ ] Reentrancy protection
- [ ] Integer overflow/underflow protection
- [ ] Input validation and sanitization
- [ ] Gas optimization
- [ ] Event emission for transparency
- [ ] Emergency pause functionality
- [ ] Upgrade mechanism (if applicable)

---

## 📊 Gas Optimization

### Gas Usage Analysis
```bash
# Generate gas report
REPORT_GAS=true npx hardhat test

# Sample gas costs (approximate)
Contract Deployment:
├── InsuranceClaim: ~2,100,000 gas
├── HealthcareProvider: ~1,800,000 gas
└── PatientRegistry: ~1,600,000 gas

Function Calls:
├── submitClaim(): ~150,000 gas
├── approveClaim(): ~80,000 gas
├── processPayout(): ~120,000 gas
└── flagFraud(): ~60,000 gas
```

### Optimization Techniques
- **Struct packing** - Optimize storage layout
- **Event indexing** - Limit indexed parameters
- **Function modifiers** - Reuse common checks
- **Batch operations** - Process multiple claims together
- **IPFS storage** - Store large data off-chain

---

## 🔗 Integration with Backend

### Web3.js Integration
```javascript
// services/blockchain.js
const Web3 = require('web3');
const contractABI = require('./contractABI.json');

class BlockchainService {
  constructor() {
    this.web3 = new Web3(process.env.NETWORK_URL);
    this.contract = new this.web3.eth.Contract(
      contractABI,
      process.env.CONTRACT_ADDRESS
    );
  }
  
  async submitClaim(claimData) {
    const accounts = await this.web3.eth.getAccounts();
    
    try {
      const result = await this.contract.methods.submitClaim(
        claimData.provider,
        claimData.insurer,
        claimData.amount,
        claimData.ipfsHash,
        claimData.documentHash
      ).send({
        from: accounts[0],
        gas: 200000
      });
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        claimId: result.events.ClaimSubmitted.returnValues.claimId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

### Frontend Integration
```javascript
// React component for claim submission
import Web3 from 'web3';

const ClaimSubmission = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
        
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(contractInstance);
      }
    };
    
    initWeb3();
  }, []);
  
  const submitClaim = async (claimData) => {
    const accounts = await web3.eth.getAccounts();
    
    const result = await contract.methods.submitClaim(
      claimData.provider,
      claimData.insurer,
      web3.utils.toWei(claimData.amount.toString(), 'ether'),
      claimData.ipfsHash,
      claimData.documentHash
    ).send({ from: accounts[0] });
    
    return result;
  };
};
```

---

## 🔍 Monitoring & Analytics

### Event Monitoring
```javascript
// Monitor contract events
const monitorEvents = () => {
  contract.events.ClaimSubmitted({
    fromBlock: 'latest'
  }, (error, event) => {
    if (error) {
      console.error('Event monitoring error:', error);
      return;
    }
    
    console.log('New claim submitted:', {
      claimId: event.returnValues.claimId,
      patient: event.returnValues.patient,
      amount: event.returnValues.amount
    });
    
    // Update database or trigger notifications
  });
};
```

### Analytics Dashboard
- **Transaction volume** - Track claim submissions over time
- **Gas usage** - Monitor transaction costs
- **Success rates** - Track approval/rejection ratios
- **Fraud detection** - Monitor flagged claims
- **Network performance** - Track confirmation times

---

## 🚀 Future Enhancements

### Planned Features
- **Layer 2 Integration** - Polygon/Arbitrum for lower costs
- **Cross-chain Compatibility** - Multi-blockchain support
- **Decentralized Identity** - Self-sovereign identity integration
- **Automated Oracles** - Real-time data feeds
- **Governance Token** - Decentralized platform governance

### Upgrade Strategy
- **Proxy Patterns** - Upgradeable contract architecture
- **Migration Scripts** - Data migration between versions
- **Backward Compatibility** - Support for legacy integrations
- **Gradual Rollout** - Phased deployment strategy
