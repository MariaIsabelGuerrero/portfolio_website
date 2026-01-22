# Portfolio Website

A bilingual (EN/FR) dynamic portfolio website with admin dashboard for managing content.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Setup

1. Clone the repository
2. Create `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your values
4. Run the entire stack:
   ```bash
   docker compose up --build
   ```

### Services

Once started, access the services at:

- **Portfolio (Public)**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Auth Service**: http://localhost:3001
- **Backend API**: http://localhost:3003
- **portfolio-db** (PostgreSQL): localhost:5433
- **auth-db** (PostgreSQL): localhost:5434

### Stop Services

```bash
docker compose down
```

To remove volumes (erases database data):

```bash
docker compose down -v
```

## Features

### Public Pages
- Skills display
- Projects showcase
- Work experience timeline
- Education history
- Downloadable resume/CV
- Hobbies section
- Contact form with database storage

### Admin Dashboard
- Secure login system
- CRUD operations for all content sections
- Testimonial approval system
- Resume upload management
- Contact message inbox

### Technical Features
- Fully dynamic content (no hardcoded data)
- Bilingual support (English/French)
- Responsive design (desktop, tablet, mobile)
- Secure authentication with Better Auth
- PostgreSQL database with Prisma ORM

## Project Structure

```
.
├─ docker-compose.yml         # Main compose file (dev stack)
├─ .env                       # Environment variables (create from .env.example)
├─ README.md                  # This file
│
├─ frontend/                  # Next.js Frontend Application
│   ├─ src/
│   │   ├─ app/               # Next.js app router pages
│   │   │   ├─ login/         # Login page
│   │   │   ├─ signup/        # Signup page
│   │   │   ├─ dashboard/     # Dashboard (post-login)
│   │   │   ├─ admin/         # Admin dashboard
│   │   │   └─ api/           # Frontend API routes
│   │   ├─ components/        # React components
│   │   └─ lib/               # Utilities and helpers
│   ├─ Dockerfile
│   └─ package.json
│
├─ backend/                   # Nest.js Backend API
│   ├─ src/
│   │   ├─ app/api/           # API routes
│   │   └─ lib/
│   │       ├─ auth/          # JWT verification
│   │       └─ db/            # Database schema (Prisma)
│   ├─ Dockerfile
│   └─ package.json
│
└─ auth-service/              # Better Auth Service
    ├─ src/
    │   ├─ app/api/auth/      # Auth API routes
    │   └─ lib/
    │       ├─ auth/          # Better Auth configuration
    │       └─ db/            # Auth database schema
    ├─ scripts/               # Database setup scripts
    ├─ Dockerfile
    └─ package.json
```

## Development

### Frontend Changes

After editing code in `frontend/`, rebuild the container:

```bash
docker compose up --build frontend
```

### Backend Changes

After editing code in `backend/`, rebuild the container:

```bash
docker compose up --build backend
```

### Auth Service Changes

After editing code in `auth-service/`, rebuild the container:

```bash
docker compose up --build auth-service
```

## Database Access (Development)

To access pgAdmin for database management:

```bash
docker compose --profile pgadmin up -d
```

Then access pgAdmin at: http://localhost:5050
