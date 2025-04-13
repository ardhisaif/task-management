# 📝 Task Management System

A comprehensive RESTful API built with NestJS for efficient task management with features including JWT authentication, role-based access control, audit logging, and external API integration.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Features

### Core Functionalities

- **User Management**

  - User registration and authentication
  - Profile management (CRUD operations)
  - Password hashing with bcrypt

- **Task Management**

  - Create, read, update, and delete tasks
  - Task assignment to users
  - Task status tracking (completed/incomplete)
  - Soft delete functionality
  - Motivational quotes integration

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (admin & user roles)
  - Protected routes with guards

- **Audit Logging**
  - Comprehensive task action tracking
  - Change history with previous and new values
  - User attribution for all actions

### Technical Features

- **Caching Layer**

  - Redis-backed caching system
  - Cache invalidation strategies
  - Configurable TTL for cached entities

- **Error Handling**

  - Global exception filters
  - Detailed error reporting
  - Structured error responses

- **Logging System**

  - Request/response logging
  - Error logging with stack traces
  - Structured logging format

- **External Integrations**
  - ZenQuotes API for motivational quotes
  - Axios-based HTTP client with error handling

## 📂 Project Structure

```
src/
├── app.module.ts                # Main application module
├── main.ts                      # Application entry point
│
├── common/                      # Shared utilities and services
│   ├── controllers/             # Health check endpoints
│   ├── exceptions/              # Custom exceptions
│   ├── filters/                 # Exception filters
│   ├── interceptors/            # Request/response interceptors
│   └── services/                # Shared services (caching, error reporting)
│
├── modules/                     # Feature modules
│   ├── auth/                    # Authentication & authorization
│   │   ├── auth.controller.ts   # Auth endpoints (login, register)
│   │   ├── auth.module.ts       # Auth module configuration
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── jwt-auth.guard.ts    # JWT authentication guard
│   │   ├── jwt.strategy.ts      # JWT strategy for Passport
│   │   ├── local.strategy.ts    # Username/password strategy
│   │   └── roles.guard.ts       # Role-based authorization guard
│   │
│   ├── users/                   # User management
│   │   ├── user.controller.ts   # User endpoints
│   │   ├── user.entity.ts       # User database entity
│   │   ├── user.module.ts       # User module configuration
│   │   └── user.service.ts      # User business logic
│   │
│   ├── tasks/                   # Task management
│   │   ├── task.controller.ts   # Task endpoints
│   │   ├── task.entity.ts       # Task database entity
│   │   ├── task.module.ts       # Task module configuration
│   │   └── task.service.ts      # Task business logic
│   │
│   ├── task-logs/               # Audit logging
│   │   ├── task-log.controller.ts # Log endpoints
│   │   ├── task-log.entity.ts   # Log database entity
│   │   ├── task-log.module.ts   # Log module configuration
│   │   └── task-log.service.ts  # Log business logic
│   │
│   └── external/                # External API integrations
│       ├── external.module.ts   # External module configuration
│       └── quote.service.ts     # Motivational quotes API client
```

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis with cache-manager
- **Authentication**: JWT with Passport.js

### Key Dependencies

- **@nestjs/cache-manager**: For Redis-based caching
- **@nestjs/axios**: For HTTP requests to external APIs
- **@nestjs/jwt & @nestjs/passport**: For authentication
- **@nestjs/typeorm & typeorm**: For database ORM
- **bcrypt**: For password hashing
- **class-validator**: For DTO validation

## 🚦 Getting Started

### Prerequisites

- Node.js v14+ and npm/yarn
- PostgreSQL database
- Redis server

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=taskmanagement

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
```

### Installation & Running

```bash
yarn typeorm migration:run
```

5. **Start the application**

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod
```

## 🔑 Authentication

The system uses JWT-based authentication. To use protected endpoints:

1. Register a user with `POST /auth/register`
2. Login with `POST /auth/login` to receive a JWT token
3. Include the token in subsequent requests as a Bearer token in the Authorization header

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Role-Based Access

Two main roles exist in the system:

- **User**: Can manage their own tasks
- **Admin**: Has full access to all tasks and user management

## 📊 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Users

- `GET /users` - List all users (admin only)
- `GET /users/:id` - Get user details
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/username/:username` - Find user by username

### Tasks

- `GET /tasks` - List tasks (filters by user for non-admins)
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (soft delete)
- `PATCH /tasks/:id/toggle-completion` - Toggle task completion status

### Task Logs

- `GET /task-logs` - Get activity logs with filters
- `GET /task-logs/task/:taskId` - Get logs for specific task
- `POST /task-logs/mark-viewed` - Mark logs as viewed

### System Health

- `GET /health/redis` - Check Redis connectivity

## 💾 Database Entities

### User

- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `role`: User role (admin/user)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `tasks`: One-to-many relationship with tasks

### Task

- `id`: Primary key
- `title`: Task title
- `description`: Task description
- `quotes`: Motivational quotes
- `completed`: Completion status
- `isDeleted`: Soft delete flag
- `user`: Many-to-one relationship with user
- `taskLogs`: One-to-many relationship with task logs
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### TaskLog

- `id`: Primary key
- `task`: Related task
- `user`: User who performed the action
- `action`: Action type (created, updated, completed, etc.)
- `previousValues`: Previous state (JSON)
- `newValues`: New state (JSON)
- `createdAt`: Action timestamp
- `viewed`: Flag indicating if log has been viewed

## 🧠 Caching Strategy

The system implements Redis-based caching for frequently accessed data:

- User profiles are cached with a 1-hour TTL
- Health checks validate Redis connectivity
- Cache keys follow a consistent format using the `generateKey` utility

## 🔄 External API Integration

Tasks can include motivational quotes fetched from the ZenQuotes API:

- Quote fetching is done automatically when creating a task
- Quotes are stored with the task
- Error handling ensures the system continues to work if the external API is unavailable

## 🛡️ Error Handling

The application implements a robust error handling strategy:

- Global exception filter catches all unhandled exceptions
- HTTP exceptions are transformed into standardized responses
- Detailed error reporting with timestamps and request information
- Error logs are persisted for debugging

## 🔍 Logging

Comprehensive logging throughout the application:

- Request/response logging via interceptors
- Error logging with stack traces
- Cache operations logging (hits/misses)
- Structured log format for easier parsing

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```


## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Developed by Ahmad Saifudin Ardhiansyah

---

For questions, feedback, or contributions, please open an issue or pull request in the repository.
