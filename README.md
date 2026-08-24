# 🎓 StudyBuddy — Full-Stack Study Abroad Discovery & Application Planning Platform

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLAlchemy 2.0](https://img.shields.io/badge/SQLAlchemy-2.0%2B-red.svg)](https://www.sqlalchemy.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6%2B-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Ownership](https://img.shields.io/badge/Status-Private%20%26%20Proprietary-red.svg)](#-copyright--ownership-notice)

**StudyBuddy** is a premium, full-stack study-abroad discovery and application decision platform. It combines an ultra-fast, framework-free **HTML5/CSS3/Vanilla JS** frontend with a robust, production-grade **FastAPI + SQLAlchemy 2.x + PostgreSQL** REST backend powered by secure **HTTP-only session cookie authentication**.

---

## 🚀 Quick Start (TL;DR)

Get StudyBuddy up and running locally in **3 easy steps**:

```bash
# 1. Start PostgreSQL (in Docker or WSL/Local)
docker run -d --name studybuddy-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=study_abroad -p 5432:5432 postgres:16-alpine

# 2. Start Backend API (Port 8000)
cd backend
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --port 8000 --reload

# 3. Start Frontend Website (Port 8080)
# Open a new terminal in root directory:
python -m http.server 8080
```

👉 Visit your website at **`http://localhost:8080`** and Swagger API docs at **`http://localhost:8000/docs`**!

---

## 📖 Table of Contents

- [✨ Key Features & Capabilities](#-key-features--capabilities)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack & System Requirements](#️-tech-stack--system-requirements)
- [📂 Detailed Directory Structure](#-detailed-directory-structure)
- [💻 Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [1. Database Setup (PostgreSQL)](#1-database-setup-postgresql)
  - [2. Backend API Setup (FastAPI)](#2-backend-api-setup-fastapi)
  - [3. Frontend Setup (Static Web Server)](#3-frontend-setup-static-web-server)
- [🔑 API Reference & Endpoints](#-api-reference--endpoints)
- [🔒 Authentication & Security Architecture](#-authentication--security-architecture)
- [🧪 Testing & Verification](#-testing--verification)
- [❓ Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)

---

## ✨ Key Features & Capabilities

### 🎨 Frontend Experience
* **Minimalist Apple-Inspired UI**: Clean typography, system color tokens, and instant pre-render theme persistence (**Dark `#090D16` / Light `#F8FAFC`**) with zero FOUC (flash of unstyled content).
* **Global Search Overlay (`Cmd/Ctrl + K`)**: Instant autocomplete search across countries, universities, and courses with keyboard shortcuts (`ArrowUp`/`ArrowDown`/`Enter`/`Esc`).
* **Multi-Criteria Course Discovery**: Comprehensive filtering by Country, University, Degree Level, Field of Study, Language, Tuition Budget, and Intake Deadlines.
* **Smart Academic Eligibility Engine**: Real-time evaluation of student profiles against university requirements to compute match fits:
  * 🟢 **Strong Match**: Exceeds GPA, IELTS/TOEFL, and GRE expectations.
  * 🟡 **Possible Match**: Meets core requirements with minor gaps.
  * 🔴 **Weak Match**: Below minimum threshold requirements.
  * ⚪ **Unknown Fit**: Incomplete profile inputs.
* **Side-by-Side Comparison Matrix (`/compare.html`)**: Persistent floating comparison tray enabling detailed spec comparison of up to 4 programs simultaneously.
* **Saved Shortlist Workspace (`/shortlist.html`)**: Organize and save target programs categorized by fit.
* **Interactive Application Planner (`/planner.html`)**: Kanban board workflow (*Shortlisted*, *Preparing*, *Applied*, *Accepted*) with document submission tracking (SOP, LORs, Transcripts, Financial Proof).

### 🔒 Backend Engine & Security
* **Production-Grade PostgreSQL Persistence**: Full relational database schema enforcing UUID primary keys, UTC timestamps, and cascading foreign key relations.
* **HTTP-Only Session Cookie Security**: Secure session tokens generated via `secrets.token_hex(32)`. Raw tokens are transmitted exclusively in `HttpOnly`, `SameSite=Lax` cookies (`study_abroad_session`).
* **Database SHA-256 Token Hashing**: Session tokens are hashed with SHA-256 before storage in PostgreSQL (`sessions.session_token_hash`). Raw tokens are never stored in the database.
* **Argon2id & bcrypt Password Security**: Passwords hashed securely using `passlib`. Plaintext passwords are never logged or stored.
* **Cross-Origin Credential Support (CORS)**: Explicit CORS configuration supporting credentials (`credentials: "include"`) for local development (`http://localhost:8080`).

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           BROWSER FRONTEND                              │
│         HTML5 · CSS3 · Vanilla JS (ES Modules) · Port 8080              │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ HTTP REST API (credentials: "include")
                                     │ Session Cookie: study_abroad_session
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FASTAPI BACKEND                               │
│              Python 3.10+ · Pydantic v2 · Port 8000                     │
│                                                                         │
│  ├── /api/v1/auth    (Register, Login, Logout, /me)                     │
│  └── /api/v1/profile (GET /profile, PUT /profile)                      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ ORM Queries (SQLAlchemy 2.x + Psycopg)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL DATABASE                             │
│                  Port 5432 · Database: study_abroad                     │
│                                                                         │
│  ├── users         (id, email, password_hash, is_active, created_at)   │
│  ├── user_profiles (id, user_id, gpa, degree, budget, field)            │
│  └── sessions      (id, user_id, session_token_hash, expires_at)       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & System Requirements

### Frontend Stack
* **HTML5**: Semantic markup across 16 responsive templates.
* **CSS3**: Modern custom properties (tokens), Flexbox, Grid, container queries, backdrop filters.
* **Vanilla JavaScript**: Modular ES6+ JavaScript modules without heavy framework overhead.

### Backend Stack
* **Python 3.10+**: Core programming environment.
* **FastAPI**: Async-ready microframework for REST APIs.
* **SQLAlchemy 2.x**: Modern Python ORM for database interaction.
* **Pydantic v2 & Pydantic-Settings**: Strict input validation and environment configuration.
* **Alembic**: Database revision and migration control.
* **PostgreSQL (`psycopg`)**: Enterprise relational database engine.
* **Passlib (bcrypt / Argon2id)**: Security hashing suite.

---

## 📂 Detailed Directory Structure

```text
ab_help/
├── index.html                  # Landing / Home Page
├── countries.html              # Country Discovery Catalog
├── country.html                # Country Detail View (?slug=...)
├── universities.html          # University Directory Catalog
├── university.html            # University Detail View (?slug=...)
├── courses.html               # Course Catalog with Filter Sidebar
├── course.html                # Course Detail View (?slug=...)
├── compare.html               # Multi-Program Side-by-Side Comparison
├── shortlist.html             # Student Shortlist Workspace
├── profile.html               # Student Academic Profile Management
├── planner.html               # Application Planner Kanban Board
├── login.html                 # Account Sign In
├── signup.html                # Account Registration
├── forgot-password.html       # Password Recovery Request
├── verify-email.html          # Email Verification Screen
├── 404.html                   # Custom 404 Error Page
├── README.md                  # Comprehensive Documentation
│
├── css/                        # Modular CSS Styling Suite
│   ├── tokens.css             # Color, Typography, and Spacing Variables
│   ├── reset.css              # Standard Modern CSS Reset
│   ├── typography.css         # Text Styles and Font Scale
│   ├── layout.css             # Grid, Flex Containers, and Page Shells
│   ├── components.css         # Navbar, Buttons, Cards, Modals, Toasts
│   └── pages.css              # Page-Specific Page Layout Styles
│
├── js/                         # Frontend Vanilla JS Modules
│   ├── api/
│   │   ├── client.js          # Fetch wrapper with credentials: "include"
│   │   └── auth.js            # Auth and Profile REST API Endpoints
│   ├── state/
│   │   ├── auth.js            # Reactive Authentication State Manager
│   │   ├── profile.js         # Reactive Profile State Manager
│   │   ├── shortlist.js       # Shortlist Local & Sync Manager
│   │   └── compare.js         # Floating Compare Tray State Manager
│   └── app.js                 # Global Application Entry Bootstrap
│
└── backend/                    # FastAPI Backend Monolith
    ├── app/
    │   ├── main.py            # FastAPI App Definition & CORS Middleware
    │   ├── config.py          # Environment Settings (.env)
    │   ├── database.py        # SQLAlchemy Engine & Session Generator
    │   ├── dependencies.py    # Request Authentication Dependencies
    │   ├── security.py        # Password & Token Cryptography
    │   ├── api/v1/            # API Route Handlers (Auth & Profile)
    │   ├── models/            # SQLAlchemy Database Models
    │   ├── schemas/           # Pydantic Input/Output Schemas
    │   └── services/          # Core Business Services Layer
    ├── alembic/               # Database Migration Scripts
    ├── tests/                 # Pytest Test Suite
    ├── alembic.ini            # Alembic CLI Configuration
    ├── requirements.txt       # Python Dependencies Manifest
    ├── .env.example           # Environment Template
    └── test_e2e_flow.py       # End-to-End Verification Test Script
```

---

## 💻 Step-by-Step Setup Guide

### 1. Database Setup (PostgreSQL)

Ensure PostgreSQL is running locally on port `5432`.

#### Option A: Docker (Recommended)
```bash
docker run -d \
  --name studybuddy-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=study_abroad \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Option B: Native PostgreSQL / WSL
```bash
# Start PostgreSQL service
sudo service postgresql start

# Create user and database
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE study_abroad;"
```

---

### 2. Backend API Setup (FastAPI)

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   
   # Windows (PowerShell):
   .venv\Scripts\activate

   # Linux / macOS:
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   Verify settings inside `.env`:
   ```env
   APP_NAME=StudyBuddy API
   APP_ENV=development
   DEBUG=True
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/study_abroad
   SECRET_KEY=super-secret-development-key-change-in-production
   SESSION_COOKIE_NAME=study_abroad_session
   SESSION_EXPIRE_HOURS=168
   CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
   FRONTEND_ORIGIN=http://localhost:8080
   ```

5. Run Alembic Database Migrations:
   ```bash
   alembic upgrade head
   ```

6. Start FastAPI Development Server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

---

### 3. Frontend Setup (Static Web Server)

1. Open a new terminal in the root project directory (`ab_help/`).

2. Start the HTTP static server on port `8080`:
   ```bash
   python -m http.server 8080
   ```

3. Access the web app in your browser:
   * **Frontend Website**: `http://localhost:8080`
   * **Swagger API Documentation**: `http://localhost:8000/docs`

---

## 🔑 API Reference & Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System health check and status |
| `POST` | `/api/v1/auth/register` | Public | Register new student, create profile, issue session cookie |
| `POST` | `/api/v1/auth/login` | Public | Authenticate credentials, issue session cookie |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke active session in DB, clear cookie |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetch current user session details |
| `GET` | `/api/v1/profile` | Authenticated | Get current student academic profile |
| `PUT` | `/api/v1/profile` | Authenticated | Update student academic profile fields in DB |

---

## 🔒 Authentication & Security Architecture

1. **Session Cookie Security**:
   * Session tokens are sent exclusively via `HttpOnly`, `SameSite=Lax` cookies.
   * `HttpOnly` protects tokens from client-side XSS scripting theft.
   * Session state is checked automatically on frontend bootstrap (`GET /api/v1/auth/me`).

2. **Database Hashing**:
   * Raw session tokens are never saved to PostgreSQL.
   * The database stores a SHA-256 digest (`sessions.session_token_hash`).

3. **Password Protection**:
   * Passwords are hashed using `passlib` with `bcrypt` / `argon2`.
   * Email addresses are normalized to lowercase before lookup or storage to prevent spoofing.

---

## 🧪 Testing & Verification

### Run Pytest Backend Unit Tests
```bash
cd backend
python -m pytest tests
```

### Run End-to-End Test Suite
```bash
cd backend
python test_e2e_flow.py
```

The E2E test script validates:
1. API Health Check (`/health`)
2. Account Registration (`POST /api/v1/auth/register`)
3. Session Cookie Validation (`GET /api/v1/auth/me`)
4. Profile Updates (`PUT /api/v1/profile`)
5. Logout & Session Revocation (`POST /api/v1/auth/logout`)
6. Login & Data Restoration (`POST /api/v1/auth/login`)

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>Q: Do I need Node.js or npm to run the frontend?</b></summary>
<p>No! The frontend is built with pure Vanilla HTML5, CSS3, and standard ES Modules. No build steps, bundlers, or Node.js required.</p>
</details>

<details>
<summary><b>Q: How are user sessions persisted across page reloads?</b></summary>
<p>When any page loads, <code>js/app.js</code> calls <code>AuthState.loadCurrentUser()</code>, which executes an authenticated <code>GET /api/v1/auth/me</code> request using the browser's HTTP-only session cookie. The navbar and UI automatically update based on the server response.</p>
</details>

<details>
<summary><b>Q: Where can I view the API documentation?</b></summary>
<p>FastAPI automatically generates interactive Swagger UI docs at <a href="http://localhost:8000/docs">http://localhost:8000/docs</a> and ReDoc at <a href="http://localhost:8000/redoc">http://localhost:8000/redoc</a>.</p>
</details>

---

## 🔒 Copyright & Ownership Notice

**All Rights Reserved © StudyBuddy**

This repository, source code, database architecture, assets, design files, and documentation are **strictly private property** owned solely by the author. 

- **Private & Personal Use Only**: Built exclusively for personal ownership and private use.
- **No License Granted**: No open-source or commercial license (including MIT, Apache, GPL, or Creative Commons) is granted or implied.
- **Strictly Prohibited**: Any public reproduction, distribution, cloning, sublicensing, modification, or commercial deployment without prior written permission is strictly prohibited.
