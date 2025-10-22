## Smart Contracts (Hardhat)

- Solidity: 0.8.x
- Network: Ganache at http://127.0.0.1:7545

Setup:
```bash
cd smartcontracts
npm install
```

Build/Test:
```bash
npx hardhat compile
npx hardhat test
```

Run local node:
```bash
npx hardhat node
```

Deploy:
```bash
node scripts/deploy.js
```

Environment:
- Private keys should be kept in .env and loaded in `hardhat.config.js` (current file contains hardcoded key; replace with process.env.PRIVATE_KEY).
