// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsuranceClaim {
    struct Claim {
        uint256 id;
        address patient;
        string diagnosis;
        string treatment;
        uint256 claimAmount;
        bool approved;
        string reportCID; // CID for IPFS or Cloudinary URL
    }

    mapping(uint256 => Claim) public claims;
    uint256 public nextClaimId;

    address public admin;

    constructor() {
        admin = msg.sender; // The deployer is the admin
    }

    function fileClaim(
        string memory _diagnosis,
        string memory _treatment,
        uint256 _claimAmount,
        string memory _reportCID
    ) public {
        claims[nextClaimId] = Claim(
            nextClaimId,
            msg.sender,
            _diagnosis,
            _treatment,
            _claimAmount,
            false,
            _reportCID
        );
        nextClaimId++;
    }

    function approveClaim(uint256 _claimId) public {
        require(msg.sender == admin, "Only admin can approve claims");
        Claim storage claim = claims[_claimId];
        require(!claim.approved, "Claim already approved");
        claim.approved = true;
    }

    function getClaim(uint256 _claimId)
        public
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            uint256,
            bool,
            string memory
        )
    {
        Claim memory claim = claims[_claimId];
        return (
            claim.id,
            claim.patient,
            claim.diagnosis,
            claim.treatment,
            claim.claimAmount,
            claim.approved,
            claim.reportCID
        );
    }
}
