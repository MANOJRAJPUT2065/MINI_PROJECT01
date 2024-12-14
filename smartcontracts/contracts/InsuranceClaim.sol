// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceClaim {

    struct Claim {
        uint256 claimId;
        address claimant;
        uint256 amount;
        string description;
        string doctorName;
        string patientName;
        uint256 doctorId;
        string reportCID;
        bool isVerified;
        bool isApproved;
        bool isPaid;
    }

    uint256 public claimCount = 0;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public claimantClaims;

    address public admin; // Admin who verifies and approves claims

    // Events
    event ClaimSubmitted(uint256 claimId, address indexed claimant, uint256 amount, string description);
    event ClaimVerified(uint256 claimId);
    event ClaimApproved(uint256 claimId);
    event ClaimPaid(uint256 claimId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
    }

    // Submit a new claim
    function submitClaim(
        uint256 amount,
        string memory description,
        string memory doctorName,
        string memory patientName,
        uint256 doctorId,
        string memory reportCID
    ) public {
        claimCount++;
        claims[claimCount] = Claim(
            claimCount,
            msg.sender,
            amount,
            description,
            doctorName,
            patientName,
            doctorId,
            reportCID,
            false, // isVerified
            false, // isApproved
            false  // isPaid
        );
        claimantClaims[msg.sender].push(claimCount);
        emit ClaimSubmitted(claimCount, msg.sender, amount, description);
    }

    // Verify a claim (fraud detection) TODO: this is for small scale data
    function verifyClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.claimant != address(0), "Claim does not exist");
        require(!claim.isVerified, "Claim already verified");

        // Fraud detection example: Preventing multiple claims from the same claimant for the same amount
        for (uint256 i = 0; i < claimantClaims[claim.claimant].length; i++) {
            uint256 previousClaimId = claimantClaims[claim.claimant][i];
            if (claims[previousClaimId].amount == claim.amount) {
                revert("Duplicate claim detected");
            }
        }

        claim.isVerified = true;
        emit ClaimVerified(claimId);
    }

    // Approve a claim
    function approveClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.isVerified, "Claim not verified");
        require(!claim.isApproved, "Claim already approved");

        claim.isApproved = true;
        emit ClaimApproved(claimId);
    }

    // Pay out a claim (simulate)
    function payClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(claim.isApproved, "Claim not approved");
        require(!claim.isPaid, "Claim already paid");

        claim.isPaid = true;
        // Here you would send funds from the contract to the claimant
        // For simplicity, we simulate payment with an event.
        emit ClaimPaid(claimId);
    }

    // Get claim details
    function getClaimDetails(uint256 claimId) public view returns (Claim memory) {
        return claims[claimId];
    }

    // Get all claims submitted by a particular claimant
    function getClaimantClaims(address claimant) public view returns (uint256[] memory) {
        return claimantClaims[claimant];
    }
}
