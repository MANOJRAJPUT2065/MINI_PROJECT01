import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// **NOTE:** Replace these with your actual contract ABI and address
const contractABI = [
    // ... Your contract ABI ...
];
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

export const createSmartContract = async () => {
    try {
        // Assuming your contract has a constructor that takes some initial data
        const accounts = await web3.eth.getAccounts();
        const initialData = 'Some initial data'; // Replace with your actual data

        const result = await contractInstance.deploy({
            data: contractBytecode, // Replace with your compiled contract bytecode
            arguments: [initialData],
        }).send({
            from: accounts[0],
            gas: '5000000', // Adjust gas limit as needed
        });

        console.log('Contract deployed at address:', result.options.address);
        return result.options.address; // Return the deployed contract address
    } catch (error) {
        console.error('Error deploying contract:', error);
        throw error;
    }
};

export const getUserBlockchainData = async (walletAddress) => {
    try {
        // Assuming your contract has a function named 'getUserData'
        const data = await contractInstance.methods.getUserData().call({ from: walletAddress });
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
