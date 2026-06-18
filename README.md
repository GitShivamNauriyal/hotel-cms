# Multi-Tenant Hotel Management System (PMS)

A zero-trust, multi-tenant Hotel Property Management System built with a React frontend, Node.js stateless backend, PostgreSQL (with Row-Level Security), and Redis.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for PostgreSQL and Redis)
- [Node.js](https://nodejs.org/) (v20.x LTS recommended)
- Git

## How to Run the Project

### 1. Start the Infrastructure (Database & Cache)
The system relies on Docker to provide isolated PostgreSQL and Redis instances. Docker Desktop **must** be running.

```bash
# From the root directory
docker-compose up -d
```
*Note: This spins up PostgreSQL on port 5432 and Redis on port 6379.*

### 2. Start the Stateless Backend
The Node.js backend handles all the API requests, enforces Row-Level Security contexts in PostgreSQL, and generates JWTs.

```bash
cd backend
npm install
npm run dev
```
*The backend will boot up, run diagnostic checks on the database/redis connections, and start listening on `http://localhost:4000`.*

### 3. Start the Frontend Application
The React UI is powered by Vite.

```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

---

## Architecture Overview
- **Zero-Trust Multi-Tenancy:** All queries are strictly scoped using PostgreSQL Row-Level Security policies tied to the current HTTP request context.
- **Stateless Auth:** JSON Web Tokens (JWT) are used for authentication. Sessions are strictly client-side (`sessionStorage`).
- **Atomic Locks:** Room and reservation mutations use `FOR UPDATE` transaction blocks to prevent race conditions or double-bookings.