# 🍔 Canteen Management System

A modern, full-stack web application designed to streamline canteen operations for students, staff, and administrators. Built with a React frontend and a Node.js/Express backend powered by MySQL.

## ✨ Features

*   **Secure Authentication:** JWT-based login and registration system.
*   **Role-Based Access Control:** Distinct dashboards and permissions for **Students**, **Staff**, and **Admins**.
*   **Multi-Canteen Support:** Seamlessly switch between different canteens (e.g., A-Block, C-Block).
*   **Interactive Menu & Cart:** Browse the menu, add items to the cart, and proceed to checkout smoothly.
*   **Order Tracking:** View order history and real-time status updates.
*   **Digital Wallet:** Integrated wallet system for quick, cashless payments.
*   **Responsive Design:** Beautiful, mobile-friendly UI that looks great on any device.

## 🛠️ Technology Stack

**Frontend:**
*   React.js (Vite)
*   React Router DOM (Navigation)
*   Axios (API Requests)
*   Modern Vanilla CSS (Custom Design System)

**Backend:**
*   Node.js & Express.js
*   MySQL (mysql2 promise wrapper)
*   JWT (JSON Web Tokens for secure authentication)
*   Bcryptjs (Password hashing)
*   Cors (Cross-Origin Resource Sharing)

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v16+)
*   MySQL Server

### 1. Database Setup
Create a MySQL database and import your schema (if applicable).

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MYSQL_URL=mysql://user:password@localhost:3306/your_database
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

## 🌍 Deployment

*   **Frontend:** Designed to be easily deployed on **Vercel** or **Netlify**.
*   **Backend:** Designed for seamless deployment on **Railway**, **Render**, or any Node.js hosting platform. 
*   **Database:** Compatible with any hosted MySQL provider (e.g., Railway MySQL, PlanetScale, AWS RDS).

---
*Built with ❤️ for better campus dining.*
