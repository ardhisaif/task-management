# 📝 Task Management System

A robust RESTful API built with NestJS for efficient task management with advanced features like authentication, role-based access control, and external integrations.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Features

### Core Capabilities

- **User Management** - Complete registration and authentication flow
- **Role-Based Access Control** - Admin and User role separation
- **Task Management** - Create, assign, update, and delete tasks
- **External API Integration** - Automatic motivational quotes for new tasks
- **Data Persistence** - PostgreSQL via Supabase with TypeORM
- **Performance Optimization** - Redis caching for frequently accessed data

### Advanced Features

- **Comprehensive Documentation** - Swagger/OpenAPI integration
- **Robust Error Handling** - Global exception filters
- **Security** - JWT-based authentication
- **Logging** - Request tracking and activity monitoring
- **Transactional Operations** - Ensures data integrity

## 🏗️ Architecture

```
src/
│
├── auth/              # Authentication & authorization
├── users/             # User management
├── tasks/             # Task management
├── common/            # Shared utilities
├── config/            # Configuration
├── external/          # External API integrations
├── app.module.ts      # Root module
└── main.ts            # Entry point
```

## 🔧 Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: TypeORM
- **Caching**: Redis
- **Authentication**: JWT with role-based strategy
- **Documentation**: Swagger/OpenAPI

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager
- Redis server
- PostgreSQL database (Supabase account)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/task-management-api.git
cd task-management-api
```

2. **Install dependencies**

```bash
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```
DATABASE_URL=your_supabase_postgresql_url
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

4. **Run database migrations**

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

The API will be available at: `http://localhost:3000`

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Key Endpoints

- **Authentication**

  - `POST /auth/register` - Create new user account
  - `POST /auth/login` - Get authentication token

- **Tasks**
  - `GET /tasks` - List all tasks (with filtering)
  - `POST /tasks` - Create new task
  - `GET /tasks/:id` - Get task details
  - `PATCH /tasks/:id` - Update task
  - `DELETE /tasks/:id` - Remove task

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 🌐 External Integration

When creating tasks, the system automatically fetches inspirational quotes from [ZenQuotes API](https://zenquotes.io) and incorporates them into task descriptions.

## 🔮 Future Enhancements

- Task scheduling and reminders
- Advanced analytics dashboard
- Team collaboration features
- Mobile app integration

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Developed by Ahmad Saifudin Ardhiansyah

Feel free to reach out with questions or suggestions!
