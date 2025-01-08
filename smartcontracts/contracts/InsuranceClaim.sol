// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceClaim {
    // Struct to represent a Claim
    struct Claim {
        uint256 claimId;
        address claimant;
        uint256 amount;
        string description;
        ClaimDetails details;
        ClaimStatus status;
        uint256 timestamp;
        address doctor;  // Address of the doctor who needs to verify the claim
        bool isFraud;    // Mark if the claim is flagged as fraud
    }

    // Struct to represent claim details when submitting a new claim
    struct ClaimDetails {
        string doctorName;
        string patientName;
        uint256 doctorId;
        uint256 patientId;
        string diagnosis;
        string treatment;
        string reportCID;
    }

    // Enum to represent claim statuses
    enum ClaimStatus { Pending, Verified, Approved, Rejected, Paid }

    uint256 public claimCount = 0; // Track the number of claims
    mapping(uint256 => Claim) public claims; // Mapping from claimId to claim data
    mapping(address => uint256[]) public claimantClaims; // Mapping from claimant address to list of claim IDs
    mapping(address => uint256) public claimCountPerClaimant; // Mapping from claimant address to claim count

    address public admin; // The admin address (could be a contract manager or owner)
    address public insurer; // The insurer's address for validation and payouts

    // Events for various actions
    event ClaimSubmitted(
        uint256 indexed claimId,    
        address indexed claimant,
        uint256 amount,
        string description,
        string doctorName,
        string patientName,
        uint256 doctorId,
        uint256 patientId,
        string diagnosis,
        string treatment,
        string reportCID,
        uint256 timestamp
    );

    event ClaimVerified(uint256 indexed claimId);
    event ClaimApproved(uint256 indexed claimId);
    event ClaimRejected(uint256 indexed claimId, string reason);
    event ClaimPaid(uint256 indexed claimId);
    event DoctorNotified(address indexed doctor, uint256 indexed claimId); // Notify doctor about pending claim verification
    event FraudDetected(uint256 indexed claimId, string reason); // Event to log fraud detection

    // Modifier to restrict access to admin functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // Modifier to restrict access to insurer functions
    modifier onlyInsurer() {
        require(msg.sender == insurer, "Not authorized");
        _;
    }

    // Constructor sets the deployer as the admin and insurer
    constructor() {
        admin = msg.sender;
        insurer = msg.sender; // Initially setting insurer to the contract deployer (could be changed later)
    }

    // Function to submit a new claim
    // Function to submit a new claim
function submitClaim(
    uint256 claimId,  // Keep claimId as passed from backend
    uint256 amount,
    string memory description,
    string memory doctorName,
    string memory patientName,
    uint256 doctorId,
    uint256 patientId,
    string memory diagnosis,
    string memory treatment,
    string memory reportCID
) public {
    require(amount > 0, "Claim amount must be greater than zero");

    // Check if the reportCID is already used for another claim
    bool isDuplicate = detectDuplicateReportCID(reportCID);
    require(!isDuplicate, "This reportCID has already been used for another claim");

    // Creating claim details struct
    ClaimDetails memory details = ClaimDetails({
        doctorName: doctorName,
        patientName: patientName,
        doctorId: doctorId,
        patientId: patientId,
        diagnosis: diagnosis,
        treatment: treatment,
        reportCID: reportCID
    });

    // Assign a doctor for verification
    address doctor = msg.sender;

    // Creating claim and adding to claims mapping
    claims[claimId] = Claim(
        claimId, 
        msg.sender,
        amount,
        description,
        details,
        ClaimStatus.Pending,
        block.timestamp,
        doctor,
        false // Initially, the claim is not flagged as fraud
    );

    // Store claimId for the claimant
    claimantClaims[msg.sender].push(claimId); // Storing uint256 claimId

    // Increment claim count for claimant
    claimCountPerClaimant[msg.sender]++;

    // Emit the claim submission event
    emit ClaimSubmitted(
        claimId, 
        msg.sender, 
        amount, 
        description, 
        details.doctorName, 
        details.patientName, 
        details.doctorId, 
        details.patientId, 
        details.diagnosis, 
        details.treatment, 
        details.reportCID, 
        block.timestamp
    );

    // Notify the doctor about pending verification
    emit DoctorNotified(doctor, claimId);
}


  
    // Add this function to allow the admin to be updated
    function setAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
    }

// Function to detect duplicate reportCID across all claims of a claimant
function detectDuplicateReportCID(string memory reportCID) public view returns (bool) {
    for (uint256 i = 0; i < claimantClaims[msg.sender].length; i++) {
        uint256 otherClaimId = claimantClaims[msg.sender][i];
        Claim storage otherClaim = claims[otherClaimId];

        // Compare the reportCID using keccak256 to avoid the storage reference issue
        if (keccak256(abi.encodePacked(otherClaim.details.reportCID)) == keccak256(abi.encodePacked(reportCID))) {
            return true; // Flag as duplicate if the same reportCID is used for different claims
        }
    }
    return false;
}

    // Function to get the details of a specific claim by claimId
    function getClaim(uint256 claimId) public view returns (Claim memory) {
        Claim storage claim = claims[claimId];
        require(claim.claimant != address(0), "Claim does not exist");
        return claim;
    }

    // Function for the doctor to verify a claim
    function verifyClaim(uint256 claimId) public {
        Claim storage claim = claims[claimId];
        require(claim.doctor == msg.sender, "Only the assigned doctor can verify the claim");
        require(claim.status == ClaimStatus.Pending, "Claim is not pending");

        // Fraud detection mechanism: You can add logic here to check for duplicate claims or overbilling
        bool fraudDetected = detectFraud(claimId);
        if(fraudDetected) {
            claim.isFraud = true;
            claim.status = ClaimStatus.Rejected; // Automatically reject if fraud is detected
            emit FraudDetected(claimId, "Fraudulent activity detected");
        } else {
            claim.status = ClaimStatus.Verified;
            emit ClaimVerified(claimId);
        }
    }

    // Function to approve a claim (only admin can approve claims)
    function approveClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Verified, "Claim not verified");

        claim.status = ClaimStatus.Approved;
        emit ClaimApproved(claimId);
    }

    // Function to reject a claim (only admin can reject claims)
    function rejectClaim(uint256 claimId, string memory reason) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Pending || claim.status == ClaimStatus.Verified, "Claim cannot be rejected");

        claim.status = ClaimStatus.Rejected;
        emit ClaimRejected(claimId, reason);
    }

    // Function to pay a claim (only admin can pay claims)
    function payClaim(uint256 claimId) public onlyAdmin payable {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Approved, "Claim not approved");
        require(claim.amount <= address(this).balance, "Insufficient contract balance");
        require(claim.status != ClaimStatus.Paid, "Claim already paid");

        claim.status = ClaimStatus.Paid;
        payable(claim.claimant).transfer(claim.amount); // Transfer the claim amount to the claimant
        emit ClaimPaid(claimId);
    }

    // Function to detect fraudulent activities (e.g., duplicate claims, overbilling)
    function detectFraud(uint256 claimId) public view returns (bool) {
        Claim storage claim = claims[claimId];

        // Fraud detection logic (this is just an example, you should implement your own rules)
        if (claim.amount > 10000) {
            return true; // Flag as fraud if the claim amount is unusually high
        }

        // Duplicate claims detection (you can add more advanced checks here)
        for (uint256 i = 0; i < claimantClaims[claim.claimant].length; i++) {
            uint256 otherClaimId = claimantClaims[claim.claimant][i];
            if (otherClaimId != claimId) {
                Claim storage otherClaim = claims[otherClaimId];

                // Compare the reportCID using keccak256 to avoid the storage reference issue
                if (keccak256(abi.encodePacked(otherClaim.details.reportCID)) == keccak256(abi.encodePacked(claim.details.reportCID))) {
                    return true; // Flag as fraud if the same reportCID is used for different claims
                }
            }
        }
        return false;
    }

    // Function to get all claims of a claimant
    function getClaimantClaims(address claimant) public view returns (uint256[] memory) {
        return claimantClaims[claimant];
    }

    // Function to get the total number of claims for a claimant
    function getClaimCountForClaimant(address claimant) public view returns (uint256) {
        return claimCountPerClaimant[claimant];
    }

    // Function to withdraw funds from the contract (only admin can withdraw)
    function withdrawFunds(uint256 amount) public onlyAdmin {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(admin).transfer(amount);
    }

    // Fallback function to accept Ether sent to the contract
    receive() external payable {}

    // Function to validate the reportCID (example, validation logic could be off-chain)
    function validateReportCID(string memory reportCID) public pure returns (bool) {
        // Example: A simple check to ensure the reportCID is non-empty or some other condition
        // You could integrate an off-chain oracle here to check the CID validity
        return bytes(reportCID).length > 0;
    }
}
