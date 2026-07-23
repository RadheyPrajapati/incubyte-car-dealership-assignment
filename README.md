# Incubyte Car Dealership System

An end-to-end, enterprise-grade Car Dealership Inventory System built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB/Mongoose**, **Zod**, and **JWT**.

---

## Technical Stack & Architecture

### Backend (`/backend`)
- **Runtime**: Node.js (v22.15.0)
- **Framework**: Express.js (v4.21.2)
- **Database / ODM**: MongoDB with Mongoose (v8.9.5)
- **Validation**: Zod (v3.24.1)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` password hashing
- **Testing**: Jest (v29.7.0) & Supertest (v7.0.0) — **45 / 45 Tests Passing**

### Frontend (`/frontend`)
- **Framework**: React 18 (Vite 6)
- **Styling**: Tailwind CSS (v3.4) with luxury dark-mode aesthetics
- **Icons**: `lucide-react`
- **HTTP Client**: Axios with Bearer token interceptor (`src/services/api.js`)
- **Testing**: Vitest + React Testing Library — **5 / 5 Component Tests Passing**

---

## Project Structure

```
incubyte-car-dealership-assignment/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection & environment setup
│   │   ├── controllers/        # Handlers (auth, vehicle, inventory)
│   │   ├── middleware/         # Auth guards, admin RBAC, Zod validation
│   │   ├── models/             # Mongoose schemas (User, Vehicle, Purchase)
│   │   ├── routes/             # Express API route endpoints
│   │   ├── validators/         # Zod validation schemas
│   │   └── __tests__/          # Jest backend unit & integration tests
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, FilterBar, VehicleCard, AdminModals, Dashboard
│   │   ├── services/           # Axios instance & API helper methods
│   │   ├── __tests__/          # Vitest component tests
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── PROMPTS.md
```

---

## Setup & Running Instructions

### 1. Backend Service
```bash
cd incubyte-car-dealership-assignment/backend

# Install dependencies
npm install

# Run backend development server (Port 5000)
npm run dev

# Run backend test suite (45 Jest tests)
npm test
```

### 2. Frontend Application
```bash
cd incubyte-car-dealership-assignment/frontend

# Install dependencies
npm install

# Run frontend development server (Port 3000)
npm run dev

# Run frontend unit tests (5 Vitest tests)
npm test

# Build production bundle
npm run build
```

---

## UI Components & Key Features

1. **`Navbar.jsx`**:
   - Logo, user profile pill, role indicator badge (`ADMIN` / `CUSTOMER`).
   - Quick Demo Switcher buttons ("Demo Admin", "Demo Customer") to easily toggle roles during evaluation.
2. **`FilterBar.jsx`**:
   - Make & model search input.
   - Clickable category pills (`All`, `Sedan`, `SUV`, `Truck`, `Coupe`, `Electric`, `Hybrid`, etc.).
   - Price range inputs (`minPrice` / `maxPrice`).
   - Sorting dropdown (Newest First, Price: Low to High, High to Low).
3. **`VehicleCard.jsx`**:
   - Vehicle cover image, make, model, year, category, VIN, and formatted MSRP (`$XX,XXX`).
   - Live stock badge: Green `In Stock: X` vs Red `Out of Stock`.
   - **"Purchase" Button**: Active when `quantity > 0`. Disabled with visual out-of-stock styling when `quantity === 0`.
   - **Admin Action Toolbar**: Edit, Restock, and Delete buttons visible exclusively for Admin users.
4. **`AdminModals.jsx` (`VehicleModal` & `RestockModal`)**:
   - Add/Edit vehicle form modal with live validation.
   - Inventory restock modal for Admin users.
5. **`Dashboard.jsx`**:
   - Hero banner with summary metrics (Total Models, Total Units, Out of Stock Count, Total Fleet Valuation).
   - Assembles Navbar, Hero banner, FilterBar, Vehicle Grid, Modals, and toast notifications.

---

## Comprehensive Test Execution Summary

### Backend Jest Tests: 🟢 45 / 45 Passed
```bash
PASS src/__tests__/inventory.test.js (7 tests)
PASS src/__tests__/vehicle.test.js (15 tests)
PASS src/__tests__/auth.test.js (10 tests)
PASS src/__tests__/app.test.js (2 tests)
PASS src/__tests__/userModel.test.js (6 tests)
PASS src/__tests__/vehicleModel.test.js (5 tests)
```

### Frontend Vitest Tests: 🟢 5 / 5 Passed
```bash
PASS src/__tests__/FilterBar.test.jsx (2 tests)
PASS src/__tests__/VehicleCard.test.jsx (3 tests)
```

---

## My AI Usage

### AI Pair Programming Paradigm
The entire Incubyte Car Dealership System was constructed using AI pair programming following strict Test-Driven Development (TDD) guidelines.

### Key Contributions:
1. **TDD Cycle Execution**: Designed failing unit & integration tests prior to implementing controllers, models, and middleware across backend and frontend.
2. **Modular Architecture & UX Aesthetics**: Built a luxury dark-themed React frontend with clear component boundaries, role-based controls, and quick demo role switchers.
3. **Robust Input Validation & Error Handling**: Integrated Zod validation schemas and uniform error response handling across all endpoints.
