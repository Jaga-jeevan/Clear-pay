
<p align="center">
  <h1 align="center">🏦 NexusBank</h1>
  <p align="center">
    Secure • Smart • Modern Digital Banking Platform
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19-blue?logo=react">
    <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js">
    <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb">
    <img src="https://img.shields.io/badge/JWT-Authentication-orange">
    <img src="https://img.shields.io/badge/License-MIT-blue">
  </p>
</p>

---
# 🏦 NexusBank - Smart Digital Banking Platform

NexusBank is a full-stack digital banking application built using the MERN Stack. It provides secure banking operations with JWT authentication, fraud detection, transaction analytics, beneficiary management, and an admin dashboard.

---

## ✨ Features

- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 💳 Fund Transfer
- 👥 Beneficiary Management
- 📜 Transaction History
- 🚨 Fraud Detection Engine
- 📊 Analytics Dashboard
- 🛡️ Role-Based Access (Admin/User)
- 📱 Responsive UI
- ⚡ RESTful API Architecture

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Helmet
- Express Validator

---
---

## 📸 Project Preview

> Screenshots will be added soon.

| Login | Dashboard |
|--------|-----------|
| Coming Soon | Coming Soon |

| Transfer Money | Transaction History |
|----------------|---------------------|
| Coming Soon | Coming Soon |

| Admin Dashboard | Fraud Detection |
|-----------------|-----------------|
| Coming Soon | Coming Soon |

---

## 📂 Project Structure

```
NexusBank-mern/
│
├── Frontend/
├── Backend/
└── README.md
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/shashwatjha-dev/NexusBank-mern.git
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Input Validation
- Rate Limiting
- Helmet Security Middleware
- Protected Routes

---

## 🚨 Fraud Detection

The application detects suspicious transactions using rule-based fraud analysis, including:

- High-value transactions
- Rapid transaction frequency
- New beneficiary transfers
- Unusual transaction timings
- Risk score calculation

---

## 📈 Future Enhancements

- OTP Verification
- Email Notifications
- AI-Based Fraud Detection
- Fixed Deposit Module
- UPI Payments
- Mobile Banking App

---

## 👨‍💻 Developer

**Shashwat Jha**

GitHub: https://github.com/shashwatjha-dev
---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |

### Banking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get account details |
| POST | `/api/transfers` | Transfer money |
| GET | `/api/transactions` | Transaction history |
| GET | `/api/beneficiaries` | Get beneficiaries |
| POST | `/api/beneficiaries` | Add beneficiary |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/fraud` | Fraud monitoring |