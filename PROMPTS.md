# Engineering Prompts & TDD Log

This file records the chronological prompt history, architectural decisions, and TDD sprint milestones for the **Incubyte Car Dealership System**.

---

## Sprint Milestones & Prompt Trajectory

### Sprint 1: Project Setup & Workspace Initialization
- **Prompt**: "Initialize the backend project directory inside incubyte-car-dealership-assignment/backend. Create package.json with main dependencies (express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, zod) and dev dependencies (jest, supertest, nodemon). Create the project folder structure (src/config, src/controllers, src/middleware, src/models, src/routes, src/utils, src/__tests__). Create src/app.js, server.js, .env.example, and configure Jest (jest.config.js) for running backend tests cleanly."
- **Action**: Established backend directory structure, created `package.json`, configured `jest.config.js`, created `app.js` and `server.js`, installed 416 npm packages.

### Sprint 2: User Model & Password Hashing (TDD Cycle 1)
- **Prompt (Red)**: "Create src/__tests__/userModel.test.js using Jest and Supertest. Write failing test cases to verify User model creation, requiring email, password, name, and default role 'USER', and ensuring passwords are auto-hashed with bcryptjs before saving."
- **Prompt (Green)**: "Implement src/models/User.js using Mongoose schema definitions and a pre('save') hook to hash passwords with bcryptjs so that all userModel.test.js tests pass."
- **Prompt (Refactor)**: "Refactor src/models/User.js to exclude password fields from default JSON queries (select: false) and add an instance method comparePassword(candidatePassword)."
- **Outcome**: 6/6 tests passing in `userModel.test.js`.

### Sprint 3: Authentication & Registration (TDD Cycle 2)
- **Prompt (Red)**: "Add failing integration tests in src/__tests__/auth.test.js for POST /api/auth/register. Test that valid input returns HTTP 201 with JWT token, duplicate emails return HTTP 400, and missing fields return HTTP 400."
- **Prompt (Green/Refactor)**: "Implement src/controllers/authController.js (register method) and src/routes/authRoutes.js to process registration and return a JWT token so that tests pass."
- **Outcome**: 3/3 registration tests passing.

### Sprint 4: JWT Login & Current User Profile (TDD Cycle 3)
- **Prompt (Login)**: "Add failing test cases in src/__tests__/auth.test.js for POST /api/auth/login. Test that valid credentials return HTTP 200 with JWT token, while invalid emails or incorrect passwords return HTTP 401 Unauthorized. Implement the login function in src/controllers/authController.js using bcrypt.compare and return the user profile and JWT token so that tests pass. Refactor auth error handling in authController.js to return uniform error message formats."
- **Prompt (Me Endpoint & Middleware)**: "Add failing test cases in src/__tests__/auth.test.js for GET /api/auth/me. Test that a valid Bearer token returns the user profile (HTTP 200), whereas missing or invalid tokens return HTTP 401 Unauthorized. Implement src/middleware/authMiddleware.js for JWT token verification and the getMe method in authController.js so that tests pass. Refactor authMiddleware.js to attach decoded user details cleanly to req.user."
- **Outcome**: 10/10 auth integration tests passing.

### Sprint 5: Vehicle Domain Model & Management (TDD Cycle 4)
- **Prompt (Vehicle Model)**: "Create src/__tests__/vehicleModel.test.js. Write failing unit tests for Vehicle schema requiring make, model, year, category, price, quantity. Implement src/models/Vehicle.js using Mongoose with proper type validation and defaults so that tests pass."
- **Prompt (Vehicle Creation & RBAC)**: "Add failing integration tests in src/__tests__/vehicle.test.js for POST /api/vehicles. Test that Admin users can create vehicles (HTTP 201), non-admin users receive HTTP 403 Forbidden, and unauthenticated requests receive HTTP 401. Implement src/middleware/adminMiddleware.js, src/controllers/vehicleController.js (createVehicle), and src/routes/vehicleRoutes.js so that tests pass. Add request body validation middleware using Zod schemas (src/middleware/validateMiddleware.js)."
- **Prompt (Vehicle Listing & Search)**: "Add failing test cases in src/__tests__/vehicle.test.js for GET /api/vehicles expecting a list of all stored vehicles (HTTP 200). Implement getAllVehicles in src/controllers/vehicleController.js so that tests pass. Refactor getAllVehicles to return sorted items by creation date descending."
- **Prompt (Dynamic Search)**: "Add failing test cases in src/__tests__/vehicle.test.js for GET /api/vehicles/search. Test filtering by make, model, category, and price range (minPrice, maxPrice). Implement searchVehicles in vehicleController.js building dynamic Mongoose search queries so that tests pass. Refactor search query construction to support case-insensitive regex searches for make and model."
- **Prompt (Update, Delete & ObjectID Error Handling)**: "Add failing tests in src/__tests__/vehicle.test.js for PUT /api/vehicles/:id and DELETE /api/vehicles/:id. Verify Admin success, 404 for missing IDs, and 403 for non-admin users. Implement updateVehicle and deleteVehicle methods in vehicleController.js so that tests pass. Refactor error handling to ensure invalid MongoDB ObjectIDs return 400 Bad Request instead of 500."
- **Outcome**: 15/15 vehicle integration tests + 5/5 vehicle model tests passing.

### Sprint 6: Inventory Transactions & Restock Workflow (TDD Cycle 5)
- **Prompt (Purchase Workflow)**: "Add failing tests in src/__tests__/inventory.test.js for POST /api/vehicles/:id/purchase. Test that authenticated users can purchase a vehicle (decreasing quantity by 1), and that purchasing an out-of-stock vehicle (quantity === 0) returns HTTP 400. Implement src/controllers/inventoryController.js (purchaseVehicle), src/models/Purchase.js, and src/routes/inventoryRoutes.js so that tests pass. Refactor purchase logic to record transaction records in Purchase model."
- **Prompt (Admin Restock Workflow)**: "Add failing tests in src/__tests__/inventory.test.js for POST /api/vehicles/:id/restock. Test that Admin users can increase vehicle quantity, while non-admin users receive HTTP 403. Implement restockVehicle in inventoryController.js so that tests pass. Refactor restock input validation to reject zero or negative restock amounts."
- **Outcome**: 7/7 inventory integration tests passing.

### Sprint 7: React (Vite) Frontend Single-Page Application
- **Prompt**: "Build a modern, single-page frontend application for a Car Dealership Inventory System inside incubyte-car-dealership-assignment/frontend using React (Vite), Tailwind CSS, Lucide React icons, and Axios..."
- **Action**: Created frontend directory structure, configured Vite, Tailwind CSS, PostCSS, Axios API client with Bearer token interceptor, built `Navbar.jsx`, `AuthModal.jsx`, `FilterBar.jsx`, `VehicleCard.jsx`, `AdminModals.jsx`, `Dashboard.jsx`, and written Vitest unit tests in `src/__tests__/`.
- **Outcome**: 5/5 Vitest component tests passing + production bundle built successfully in 7.24s.

---

## Final Project Verification Summary

- **Backend Jest Test Suites**: 🟢 **45 / 45 Passed**
- **Frontend Vitest Test Suites**: 🟢 **5 / 5 Passed**
- **Production Build (`dist/`)**: 🟢 **Successfully Built**
