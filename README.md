# 🏥 Healthcare System

> A **decentralized and intelligent** platform for managing health records, insurance claims, and system administration — powered by **blockchain**, enhanced with **AI**, and built for **scalability and security**.

<div align="center">
  <img src="https://img.shields.io/badge/Platform-Healthcare-blue" />
  <img src="https://img.shields.io/badge/Tech-MERN%20+%20Blockchain-green" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen" />
  <img src="https://img.shields.io/badge/AI%20Chatbot-Enabled-lightgrey" />
</div>

---

## 📚 Table of Contents

- [📌 Project Overview](#project-overview)
- [✨ Key Features](#key-features)
- [🧱 System Architecture](#system-architecture)
- [🧰 Tech Stack](#tech-stack)
- [⚙️ Setup Instructions](#setup-instructions)
  - [📡 Backend Setup](#backend-setup)
  - [🎨 Frontend Setup](#frontend-setup)
- [🚀 Hosting](#hosting)
- [🛠️ Usage](#usage)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## 📌 Project Overview

This **next-generation healthcare platform** provides:

- **Unified dashboards** for patients, insurers, and admins  
- **Secure health insurance processing** with **blockchain verification**  
- **Real-time AI chatbot** for instant medical queries and support  
- **Data analytics and insights** for better decision-making  

---

## ✨ Key Features

| Category         | Features                                                                 |
|------------------|--------------------------------------------------------------------------|
| 👥 **User Management**   | JWT & MetaMask login, role-based access for Patients, Insurers, Admins |
| 🏥 **Health Services**   | Patient record management, doctor profiles, lab integrations       |
| 📄 **Insurance Claims** | File & track claims, digital policy view/download, document uploads |
| 🔐 **Blockchain**       | Smart contract-based claim verification and doctor onboarding      |
| 🤖 **AI Chatbot**       | 24/7 support with real-time health data and claim info retrieval   |
| 📊 **Dashboards**       | Patient/Insurer/Admin dashboards with analytics and notifications  |

---

## 🧱 System Architecture

```plaintext
High-level components

+-------------+      +---------------+      +------------------+
|  Frontend   | <--> |   Backend     | <--> |   MongoDB        |
|  (React.js) |      | (Node/Express)|      |   (Encrypted DB) |
+-------------+      +---------------+      +------------------+
      |                     |
      |                     |-------> Blockchain Network (for claim & identity verification)
      |                     |
      |                     |-------> AI Chatbot (Dialogflow / OpenAI API)
      |
      +---> Auth (JWT + MetaMask)
```

---

## 🧰 Tech Stack

### 💻 Frontend

| Tech                                                                                             | Description        |
| ------------------------------------------------------------------------------------------------ | ------------------ |
| ![React](https://img.shields.io/badge/React-20232A?logo=react\&logoColor=61DAFB)                 | Component-based UI |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css\&logoColor=white) | Utility-first CSS  |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?logo=framer\&logoColor=white)  | UI animations      |
| ![Metamask](https://img.shields.io/badge/MetaMask-E2761B?logo=metamask\&logoColor=white)         | Blockchain login   |

### 🔧 Backend

| Tech                                                                                     | Description       |
| ---------------------------------------------------------------------------------------- | ----------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)    | Server-side JS    |
| ![Express](https://img.shields.io/badge/Express.js-000000?logo=express\&logoColor=white) | API framework     |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb\&logoColor=white)    | NoSQL database    |
| ![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens\&logoColor=white) | Secure token auth |

### 🔐 Blockchain & AI

| Tech                                                                                     | Description                |
| ---------------------------------------------------------------------------------------- | -------------------------- |
| ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum\&logoColor=white) | Smart contracts            |
| ![Web3.js](https://img.shields.io/badge/Web3.js-F16822?logo=web3.js\&logoColor=white)    | Ethereum interactions      |
| ![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai\&logoColor=white)       | AI chatbot or NLP          |
| ![IPFS](https://img.shields.io/badge/IPFS-65C2CB?logo=ipfs\&logoColor=white)             | Decentralized file storage |

---

## 🧭 How It Works (at a glance)

- Authentication
  - Email/password flows issue a JWT stored in `localStorage` on the frontend.
  - Optional MetaMask connect enables signing and submitting claims tied to a wallet.
- Claim submission
  - Patient uploads a report; the file is pinned to IPFS (Pinata) and returns a `reportCID`.
  - Backend generates a unique `claimId`, writes the claim to MongoDB, and calls the smart contract `submitClaim(...)` with the same `claimId` and `reportCID`.
- Claim review and verification
  - Doctors/insurers fetch pending claims from the backend.
  - Verification calls the contract `verifyClaim(claimId)`; rejection/approval are reflected on-chain and mirrored in MongoDB.
  - Optional fraud check hits the Python service (`/predict`) before approval.
- Tracking and notifications
  - Users poll claim status via REST endpoints; backend can surface contract events and DB state.

---

## 🔄 Key Workflows

### Claim submission (patient)
1) Frontend uploads PDF to Pinata → gets `reportCID`.
2) Frontend calls `POST /api/_claims/submit` with claim details, `reportCID`, and wallet address.
3) Backend:
   - Validates payload, generates `claimId`.
   - Calls `InsuranceClaim.submitClaim(...)` using ethers.
   - Saves claim in MongoDB with the same `claimId`.

### Claim verification (doctor/insurer)
1) Frontend fetches pending list: `GET /api/claims/pending`.
2) Verification: `POST /api/claims/pending/validate/:claimId` (invokes `verifyClaim` on-chain, updates DB).
3) Review decision: `POST /api/claims/pending/review/:claimId` with `approve` or `reject` and optional `doctorReview`.

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

* Node.js & npm
* MongoDB
* MetaMask extension
* Ganache or any Ethereum testnet
* `.env` file with keys:

  ```
  MONGO_URI=
  JWT_SECRET=
  INFURA_API_KEY=
  ```

---

### 📡 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

---

## 🔑 Environment variables (quick reference)

- Backend: `PORT`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `PINATA_API_KEY`, `PINATA_SECRET_API_KEY`, `GEMINI_API_KEY`, `ETH_RPC_URL`, `PRIVATE_KEY`, `CONTRACT_ADDRESS`, `FRAUD_API_URL`, `CLIENT_URL`
- Frontend: `REACT_APP_PINATA_API_KEY`, `REACT_APP_PINATA_SECRET_API_KEY`

See `docs/env.example` for a complete, commented template.

---

## 🚀 Hosting

You can deploy:

* Frontend → **Vercel / Netlify**
* Backend → **Render / Railway / Heroku**
* Smart Contracts → **Polygon Mumbai Testnet / Ethereum Goerli**
* DB → **MongoDB Atlas**

---

## 🛠️ Usage

1. **Register/Login** using email or MetaMask
2. **Access dashboard** based on role (patient, insurer, admin)
3. **Upload reports**, view insurance plans, track claims
4. **Chat with AI bot** for instant support
5. **Admin can verify doctors**, approve claims, monitor analytics

---

## 🔒 Security note

- Do NOT hardcode private keys or contract addresses; use environment variables listed above.
- Configure CORS narrowly in production and enable rate limiting on sensitive routes.
- See `docs/security.md` for a full checklist and recommendations.

---

## 🤝 Contributing

We welcome contributions!
Please fork the repo, create a branch, and raise a PR 🙌

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📚 Full Documentation

See the `docs/` folder for detailed guides:

- Backend: `docs/backend.md`
- Frontend: `docs/frontend.md`
- Python Fraud Service: `docs/python.md`
- Smart Contracts: `docs/contracts.md`
- API Reference: `docs/api.md`
- Security & Troubleshooting: `docs/security.md`
- Environment Template: `docs/env.example`

---

## 📊 Optional Component Breakdown (ASCII Graph)

```plaintext
Claim Processing Components

      +-------------------+
      | Blockchain        | ██████████ 40%
      | AI Chatbot        | ███████    30%
      | Dashboard System  | ████       15%
      | File Management   | ██         10%
      | Notifications     | █           5%
      +-------------------+
```

