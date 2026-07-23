# Incubyte Car Dealership System - Comprehensive Full-Stack Test Execution Report

**Execution Timestamp**: 2026-07-23T13:20:00+05:30  
**Overall Status**: 🟢 **PASSED (52 / 52 Tests Passed - 100% Pass Rate)**  
**Target Environment**: Windows (Node.js v22.15.0, NPM 10.9.2)

---

## Executive Summary

| Test Suite Layer | Runner | Test Files / Suites | Total Tests | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Backend API & Data Layer** | Jest v29.7.0 | 6 / 6 | 47 | 47 | 0 | 🟢 PASS |
| **Frontend UI Layer** | Vitest v3.2.7 | 2 / 2 | 5 | 5 | 0 | 🟢 PASS |
| **TOTAL** | — | **8 / 8** | **52** | **52** | **0** | 🟢 **PASS** |

---

## Part 1: Backend Test Suite Details (Jest)

### Summary
- **Test Runner**: Jest (`jest --runInBand --detectOpenHandles`)
- **Location**: `incubyte-car-dealership-assignment/backend/src/__tests__/`
- **Result**: 47 Passed, 0 Failed (6 Test Suites)

### Breakdown by Test File

#### 1. `inventory.test.js` — Vehicle Purchase, Restock & Ownership History Workflow
*Path: [backend/src/__tests__/inventory.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/inventory.test.js)*
- 🟢 `POST /api/vehicles/:id/purchase` — should process purchase, decrease vehicle quantity by 1, and record a Purchase transaction (HTTP 200)
- 🟢 `POST /api/vehicles/:id/purchase` — should return HTTP 400 Bad Request when attempting to purchase an out-of-stock vehicle (quantity === 0)
- 🟢 `POST /api/vehicles/:id/purchase` — should return HTTP 401 Unauthorized when no Authorization header is provided
- 🟢 `POST /api/vehicles/:id/purchase` — should return HTTP 404 Not Found when purchasing a non-existent vehicle ID
- 🟢 `GET /api/vehicles/my-purchases` — should return HTTP 200 OK with list of purchases for the authenticated customer
- 🟢 `GET /api/vehicles/my-purchases` — should return HTTP 401 Unauthorized when requesting my-purchases without auth header
- 🟢 `POST /api/vehicles/:id/restock` — should allow Admin users to restock vehicle quantity and restore Available status (HTTP 200)
- 🟢 `POST /api/vehicles/:id/restock` — should return HTTP 403 Forbidden when a non-admin user attempts to restock
- 🟢 `POST /api/vehicles/:id/restock` — should return HTTP 400 Bad Request for zero or negative restock amounts

#### 2. `auth.test.js` — Authentication & Authorization Endpoints
*Path: [backend/src/__tests__/auth.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/auth.test.js)*
- 🟢 `POST /api/auth/register` — should return HTTP 201 Created with a JWT token and user details for valid input
- 🟢 `POST /api/auth/register` — should return HTTP 400 Bad Request when missing required fields
- 🟢 `POST /api/auth/register` — should return HTTP 400 Bad Request for duplicate email registration
- 🟢 `POST /api/auth/login` — should return HTTP 200 OK with a JWT token and user profile for valid credentials
- 🟢 `POST /api/auth/login` — should return HTTP 400 Bad Request when email or password is missing
- 🟢 `POST /api/auth/login` — should return HTTP 401 Unauthorized for non-existent email
- 🟢 `POST /api/auth/login` — should return HTTP 401 Unauthorized for incorrect password
- 🟢 `GET /api/auth/me` — should return HTTP 200 OK and current user profile when provided a valid Bearer token
- 🟢 `GET /api/auth/me` — should return HTTP 401 Unauthorized when Authorization header is missing
- 🟢 `GET /api/auth/me` — should return HTTP 401 Unauthorized when provided an invalid Bearer token

#### 3. `vehicle.test.js` — Vehicle Catalog CRUD & Dynamic Search
*Path: [backend/src/__tests__/vehicle.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/vehicle.test.js)*
- 🟢 `POST /api/vehicles` — should return HTTP 201 Created and return vehicle object when created by an Admin user
- 🟢 `POST /api/vehicles` — should return HTTP 403 Forbidden when a non-admin user attempts to create a vehicle
- 🟢 `POST /api/vehicles` — should return HTTP 401 Unauthorized when no Authorization header is provided
- 🟢 `POST /api/vehicles` — should return HTTP 400 Bad Request when request body violates Zod validation rules
- 🟢 `GET /api/vehicles` — should return HTTP 200 OK with a list of vehicles sorted by creation date descending
- 🟢 `GET /api/vehicles/search` — should dynamically search vehicles by case-insensitive make, model, category, and price range
- 🟢 `GET /api/vehicles/search` — should return empty results when no vehicles match query filters
- 🟢 `PUT /api/vehicles/:id` — should return HTTP 200 OK and updated vehicle when Admin updates a valid vehicle ID
- 🟢 `PUT /api/vehicles/:id` — should return HTTP 404 Not Found when Admin updates a non-existent vehicle ID
- 🟢 `PUT /api/vehicles/:id` — should return HTTP 403 Forbidden when a non-admin user attempts to update a vehicle
- 🟢 `PUT /api/vehicles/:id` — should return HTTP 400 Bad Request when an invalid MongoDB ObjectID format is provided
- 🟢 `DELETE /api/vehicles/:id` — should return HTTP 200 OK when Admin deletes a valid vehicle ID
- 🟢 `DELETE /api/vehicles/:id` — should return HTTP 404 Not Found when Admin deletes a non-existent vehicle ID
- 🟢 `DELETE /api/vehicles/:id` — should return HTTP 403 Forbidden when a non-admin user attempts to delete a vehicle
- 🟢 `DELETE /api/vehicles/:id` — should return HTTP 400 Bad Request when an invalid MongoDB ObjectID format is provided

#### 4. `app.test.js` — Core Server Endpoints & Error Middleware
*Path: [backend/src/__tests__/app.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/app.test.js)*
- 🟢 `GET /api/health` — should return 200 OK and health status object
- 🟢 `GET /api/nonexistent-route` — should return 404 Not Found for undefined routes

#### 5. `userModel.test.js` — Mongoose User Model & Password Hashing Unit Tests
*Path: [backend/src/__tests__/userModel.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/userModel.test.js)*
- 🟢 User Validation — should validate a complete user object and set default role to USER
- 🟢 User Validation — should require email, password, and name fields
- 🟢 User Validation — should reject invalid email formats
- 🟢 User Validation — should set `select: false` on password schema field to exclude it from default queries
- 🟢 Password Hashing — should automatically hash plain text password before saving (`bcryptjs`)
- 🟢 Password Hashing — should provide instance method `comparePassword` to verify password

#### 6. `vehicleModel.test.js` — Mongoose Vehicle Model Unit Tests
*Path: [backend/src/__tests__/vehicleModel.test.js](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/backend/src/__tests__/vehicleModel.test.js)*
- 🟢 Vehicle Schema — should validate a complete vehicle object and apply default category, status, and quantity
- 🟢 Vehicle Schema — should default category to Sedan, quantity to 1, and status to Available when omitted
- 🟢 Vehicle Schema — should require make, model, year, and price fields
- 🟢 Vehicle Schema — should reject negative price and quantity values
- 🟢 Vehicle Schema — should reject invalid category enums

---

## Part 2: Frontend Test Suite Details (Vitest + React Testing Library)

### Summary
- **Test Runner**: Vitest (`vitest run`)
- **Location**: `incubyte-car-dealership-assignment/frontend/src/__tests__/`
- **Result**: 5 Passed, 0 Failed (2 Test Files)

### Breakdown by Test File

#### 1. `VehicleCard.test.jsx` — UI Component State & Role-Based Action Controls
*Path: [frontend/src/__tests__/VehicleCard.test.jsx](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/frontend/src/__tests__/VehicleCard.test.jsx)*
- 🟢 `should enable Purchase button when quantity > 0`
- 🟢 `should disable Purchase button with Sold Out label when quantity === 0`
- 🟢 `should show Admin actions exclusively when user role is ADMIN`

#### 2. `FilterBar.test.jsx` — Search Input & Category Pill Handlers
*Path: [frontend/src/__tests__/FilterBar.test.jsx](file:///C:/Users/Dell/Desktop/incubyte-car-dealership-assignment/frontend/src/__tests__/FilterBar.test.jsx)*
- 🟢 `should trigger onSearchChange when user types in search input`
- 🟢 `should trigger onCategorySelect when clicking category pills`

---

## Technical Audit & Verification Conclusion

All **52 test cases** across backend API integration endpoints, Mongoose schema models, middleware, and React frontend components passed without any errors or warnings.
