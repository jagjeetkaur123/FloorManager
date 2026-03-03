# Node.js REST API

A fully functional REST API built with **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Rename `.env.example` to `.env` and fill in your values:
```env
APP_PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/node_api_db?schema=public"
JWT_SECRET=your-long-random-secret-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Set up the database
```bash
# Run migrations (creates tables)
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 📁 Project Structure

```
├── server.js                  # Entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Sample data seeder
├── src/
│   ├── config/
│   │   ├── config.js          # App configuration
│   │   └── prisma.js          # Prisma client singleton
│   ├── controllers/
│   │   ├── userController.js  # User request handlers
│   │   └── jobController.js   # Job request handlers
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication & authorisation
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   ├── index.js           # Base API route
│   │   ├── userRoutes.js      # /api/users routes
│   │   └── jobRoutes.js       # /api/jobs routes
│   ├── services/
│   │   ├── userService.js     # User business logic
│   │   └── jobService.js      # Job business logic
│   └── utils/
│       ├── logger.js          # Console logger
│       └── response.js        # Standard response helpers
```

---

## 🔑 API Endpoints

### Health
| Method | Endpoint  | Description   |
|--------|-----------|---------------|
| GET    | /health   | Health check  |
| GET    | /api      | API info      |

### Users `/api/users`
| Method | Endpoint          | Auth     | Description           |
|--------|-------------------|----------|-----------------------|
| POST   | /register         | Public   | Register new user     |
| POST   | /login            | Public   | Login & get JWT token |
| GET    | /me               | Required | Get own profile       |
| PUT    | /:id              | Required | Update own profile    |
| GET    | /                 | Admin    | List all users        |
| GET    | /:id              | Admin    | Get user by ID        |
| DELETE | /:id              | Admin    | Delete user           |

### Jobs `/api/jobs`
| Method | Endpoint          | Auth     | Description           |
|--------|-------------------|----------|-----------------------|
| GET    | /                 | Public   | List all jobs (filter/paginate) |
| GET    | /:id              | Public   | Get job by ID         |
| POST   | /                 | Required | Create a job listing  |
| GET    | /my/listings      | Required | Get my job listings   |
| PUT    | /:id              | Required | Update job listing    |
| DELETE | /:id              | Required | Delete job listing    |

---

## 🔍 Query Parameters (Jobs listing)

```
GET /api/jobs?page=1&limit=10&status=OPEN&type=FULL_TIME&location=Brisbane&search=engineer
```

| Param    | Values                                   | Description         |
|----------|------------------------------------------|---------------------|
| page     | number (default: 1)                      | Page number         |
| limit    | number (default: 10)                     | Results per page    |
| status   | OPEN, CLOSED, DRAFT                      | Filter by status    |
| type     | FULL_TIME, PART_TIME, CONTRACT, CASUAL   | Filter by job type  |
| location | string                                   | Filter by location  |
| search   | string                                   | Search title/desc   |

---

## 🔐 Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

Get a token by calling `POST /api/users/login`.

---

## 📦 Seed Accounts

After running `npm run db:seed`:

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@example.com   | Admin123!  |
| User  | user@example.com    | User123!   |
