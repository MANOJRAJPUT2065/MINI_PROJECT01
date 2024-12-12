# Healthcare System

A comprehensive healthcare platform that enables users to manage their health records, insurers to handle claims and policies, and admins to oversee the entire system. The platform integrates key features such as user authentication, health insurance management, real-time chatbot support, and more, ensuring secure and efficient management of healthcare services.

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

This healthcare system provides a one-stop solution for managing healthcare services, including health insurance claims, patient profiles, doctor verification, and health data management. The system integrates with blockchain for enhanced security and transparency in the claims process and allows users to interact with healthcare professionals in real time via an AI-powered chatbot.

### The platform includes:

- A user-friendly interface for patients, insurers, and admins.
- Real-time claim tracking, document management, and notifications.
- Blockchain-powered health insurance claims and medical record verification.

---

## Key Features

- **User Management**:
  - Registration, login, and authentication for patients, insurers, and admins using JWT and MetaMask for blockchain-based authentication.
  
- **Health Insurance Management**:
  - Users can view and manage health insurance plans, file claims, track claim status, and view/download reports.
  
- **Blockchain Integration**:
  - Blockchain-based insurance claims and doctor verifications for added transparency and security.
  
- **Dashboards**:
  - **Patient Dashboard**: Manage health records, track claims, view notifications, and access real-time updates.
  - **Insurer Dashboard**: Process claims, manage policies, and view claim-related analytics.
  - **Admin Dashboard**: Monitor and manage users, insurance policies, claims, and system settings.

- **Real-time Chatbot**:
  - AI-powered chatbot assists users with health-related queries and insurance-related information.

- **Secure Health Data**:
  - Data is encrypted to ensure privacy and security for all users, including sensitive health information and insurance details.

- **Responsive UI**:
  - The platform is designed to be fully responsive, ensuring smooth user experience across devices (mobile and desktop).

---

## Tech Stack

### **Frontend**

- **React.js** - For building interactive user interfaces.
- **Tailwind CSS** - For utility-first styling.
- **Framer Motion** - For creating smooth animations and transitions.
- **Axios** - For making API requests to the backend.

### **Backend**

- **Node.js** - For server-side development.
- **Express.js** - Backend framework to handle HTTP requests.
- **MongoDB** - NoSQL database for storing user data and claims.
- **Mongoose** - ODM to interact with MongoDB.
- **JWT** - For authentication.
- **METAMASK** - Blockchain service for Ethereum integration.
- **Ganache** - Local blockchain testing.

### **Additional Tools**

- **GitHub** - Version control.
- **npm** - Package management.
- **Heroku / AWS (In progress)** - For cloud hosting (depending on your setup). still i have to do work 

---

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/healthcare-system.git
   cd healthcare-system/backend
