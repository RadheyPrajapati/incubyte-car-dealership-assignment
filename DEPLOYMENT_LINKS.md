# Incubyte Car Dealership System - Deployment Links

Below are the live production deployment URLs and API endpoint specifications for the **Incubyte Car Dealership System**.

---

## 🚀 Live Production Links

| Service / Layer | Deployment Platform | Live Production URL | Health Check / Base Endpoint |
| :--- | :--- | :--- | :--- |
| **Frontend Web service** | Render | [Frontend_URL](https://incubyte-car-dealership-assignment-1.onrender.com/) | `/` |
| **Backend REST API Service** | Render | [Backend_URL](https://incubyte-car-dealership-assignment.onrender.com) | `/api/health` |

---

## 🔑 Pre-Configured Demo Credentials

### 1. Dealer Admin Account (Full CRUD & Restock Privileges)
- **Email**: `radheym2006@gmail.com`
- **Password**: `123456`
- **Role**: `ADMIN`

### 2. Demo Customer Account (Purchase & Garage History)
- **Email**: `customer@gmail.com`
- **Password**: `123456`
- **Role**: `USER`

---

## 📡 API Base Specification
- **Base REST API Endpoint**: `https://incubyte-car-dealership-assignment.onrender.com/api`
- **Auth Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Vehicle Routes**: `/api/vehicles`, `/api/vehicles/search`
- **Inventory & Purchase Routes**: `/api/vehicles/:id/purchase`, `/api/vehicles/:id/restock`, `/api/vehicles/my-purchases`
