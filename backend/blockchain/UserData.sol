// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserData {
    struct User {
        string name;
        string email;
        address userAddress;
        bool consentGiven;
    }

    mapping(address => User) private users;

    function registerUser(string memory _name, string memory _email) public {
        users[msg.sender] = User(_name, _email, msg.sender, false);
    }

    function giveConsent() public {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        users[msg.sender].consentGiven = true;
    }

    function getUserData(address _user) public view returns (string memory, string memory) {
        require(users[_user].consentGiven, "Consent not given");
        return (users[_user].name, users[_user].email);
    }
}
