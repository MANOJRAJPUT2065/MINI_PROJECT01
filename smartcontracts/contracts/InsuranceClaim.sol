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

    // Modifier to restrict access to admin functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // Constructor sets the deployer as the admin
    constructor() {
        admin = msg.sender;
    }

    // Function to submit a new claim
    function submitClaim(
        uint256 claimId,             // Backend-generated claimId
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

        claimCount++; // Increment the claim counter

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

        // Creating claim and adding to claims mapping
        claims[claimId] = Claim(
            claimId,               // Using backend-generated claimId
            msg.sender,
            amount,
            description,
            details,
            ClaimStatus.Pending,
            block.timestamp
        );

        // Storing claim id for the claimant for easy access
        claimantClaims[msg.sender].push(claimId);
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
    }

    // Function to get the details of a specific claim by claimId
    function getClaim(uint256 claimId) public view returns (Claim memory) {
        Claim storage claim = claims[claimId];
        require(claim.claimant != address(0), "Claim does not exist");
        return claim;
    }

    // Function to verify a claim (only admin can verify claims)
    function verifyClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.claimant != address(0), "Claim does not exist");
        require(claim.status == ClaimStatus.Pending, "Claim is not pending");

        claim.status = ClaimStatus.Verified;
        emit ClaimVerified(claimId);
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
}
