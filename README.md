# Healthcare System

A comprehensive healthcare platform for managing health records, insurance claims, and policies. It provides a user-friendly experience for patients, insurers, and admins while ensuring security and privacy. The platform integrates advanced features like blockchain for insurance claims, real-time chatbot support, and a fully responsive UI.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Hosting](#hosting)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This healthcare system is designed to streamline the management of healthcare services for patients, healthcare professionals, and insurers. It provides a secure, user-friendly platform where users can manage their health insurance claims, access their medical records, and interact with healthcare professionals. The platform uses blockchain technology to ensure transparency and security in the claims process.

### Key Features

- **User Management**: 
  - Registration, login, and authentication for patients, insurers, and admins using JWT and MetaMask for blockchain-based authentication.
  
- **Health Insurance Management**: 
  - Users can view and manage their health insurance plans, submit claims, track claim status, and download reports.
  
- **Blockchain Integration**: 
  - Blockchain-based insurance claims for added transparency and security.
  - Ethereum integration to verify insurance claims, doctor verifications, and appointments.
  
- **Dashboards**:
  - **Patient Dashboard**: Access personalized health information, claim statuses, recent activities, and more.
  - **Insurer Dashboard**: Manage claims, policies, and view analytics for claim submissions.
  - **Admin Dashboard**: Oversee users, insurance policies, claims, and system settings.

- **Real-time Chatbot**: 
  - AI-powered chatbot for answering health-related queries and assisting patients with basic medical information.

- **Secure Health Data**: 
  - End-to-end encryption to ensure data privacy and security for all users.

- **Responsive UI**: 
  - Designed to work seamlessly across devices, including mobile and desktop.

---

## Tech Stack

### **Frontend**

- React.js (with hooks and context for state management)
- Tailwind CSS (for styling)
- Framer Motion (for animations)
- Axios (for API requests)

### **Backend**

- Node.js (server-side)
- Express.js (backend framework)
- MongoDB (NoSQL database)
- Mongoose (ODM for MongoDB)
- JSON Web Tokens (JWT) for authentication
- Alchemy (for blockchain integration)

### **Additional Tools**

- GitHub (for version control)
- npm (for package management)
- Ganache (for local blockchain testing)

---

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/healthcare-system.git
cd healthcare-system/backend
