<img width="593" height="274" alt="Screenshot 2026-05-21 131215" src="https://github.com/user-attachments/assets/88aa18bf-c8c4-451d-9895-b1802a261adf" />
# AI-Powered Task Management Portal

A production-style full-stack task management application with AI-powered task generation using Google Gemini.

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Security, JPA  |
| Frontend  | React 18, Vite, Tailwind CSS, React Router      |
| Database  | MySQL                                           |
| Auth      | JWT (JJWT 0.12)                                 |
| AI        | Google Gemini 1.5 Flash                         |
| Docs      | SpringDoc OpenAPI (Swagger UI)                  |

## Project Structure

```
├── task-portal-backend/      # Spring Boot backend
│   └── src/main/java/com/taskportal/
│       ├── controller/       # REST controllers
│       ├── service/          # Business logic
│       ├── repository/       # JPA repositories
│       ├── entity/           # JPA entities
│       ├── dto/              # Request/Response DTOs
│       ├── security/         # JWT filter, UserDetailsService
│       ├── config/           # Security, CORS, OpenAPI config
│       └── exception/        # Global exception handler
│
└── task-portal-frontend/     # React + Vite frontend
    └── src/
        ├── pages/            # Login, Register, Dashboard, Tasks
        ├── components/       # Reusable UI components
        ├── services/         # Axios API services
        ├── hooks/            # useTasks custom hook
        ├── context/          # AuthContext
        └── routes/           # PrivateRoute guard
```

## Database Schema

```sql
CREATE DATABASE taskportal;

-- users table
CREATE TABLE users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
);

-- tasks table
CREATE TABLE tasks (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  priority    ENUM('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  due_date    DATE,
  status      ENUM('TODO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TODO',
  user_id     BIGINT NOT NULL,
  created_at  DATETIME,
  updated_at  DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Auth
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/register    | Register new user  |
| POST   | /api/auth/login       | Login, get JWT     |

### Tasks (🔒 JWT required)
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | /api/tasks                | Get all tasks (+ search)|
| GET    | /api/tasks/stats          | Task count statistics   |
| GET    | /api/tasks/{id}           | Get task by ID          |
| POST   | /api/tasks                | Create task             |
| PUT    | /api/tasks/{id}           | Update task             |
| PATCH  | /api/tasks/{id}/status    | Update task status      |
| DELETE | /api/tasks/{id}           | Delete task             |

### AI (🔒 JWT required)
| Method | Endpoint         | Description                      |
|--------|------------------|----------------------------------|
| POST   | /api/ai/generate | Generate task details via Gemini |

## Environment Variables

### Backend (`task-portal-backend/.env` or system env)
```
DB_URL=jdbc:mysql://localhost:3306/taskportal?useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=<64-char-hex-string>
JWT_EXPIRATION=86400000
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173
```

### Frontend (`task-portal-frontend/.env`)
```
VITE_API_URL=http://localhost:8080/api
```

## Local Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### 1. Database
```sql
CREATE DATABASE taskportal;
```

### 2. Backend
```bash
cd task-portal-backend
cp .env.example .env   # fill in your values
mvn spring-boot:run
# Runs at http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### 3. Frontend
```bash
cd task-portal-frontend
npm install
cp .env.example .env   # set VITE_API_URL if needed
npm run dev
# Runs at http://localhost:5173
```



## AI Integration

The AI feature calls Google Gemini 1.5 Flash via the backend only — the API key is never exposed to the frontend.

Flow:
1. User types a task title and clicks **Generate with AI**
2. Frontend sends `POST /api/ai/generate` with JWT header
3. Backend builds a structured prompt and calls Gemini API
4. Gemini returns description, priority, and estimated time
5. Frontend auto-fills the task form
6. Graceful fallback if Gemini is unavailable

## Features

- JWT authentication with BCrypt password hashing
- Full CRUD task management per user
- Task filtering by status & priority, search by title/description
- Grid and table views with sortable columns
- Click status badge to cycle status (TODO → IN_PROGRESS → DONE)
- AI task description + priority generation via Gemini
- Pie chart and bar chart on dashboard
- Responsive mobile-first design
- Swagger/OpenAPI documentation
- Global exception handling with structured error responses
- Pagination support (`GET /api/tasks/paged`)

  
ER diagram for database schema:
<img width="593" height="274" alt="Screenshot 2026-05-21 131215" src="https://github.com/user-attachments/assets/9fdbd34c-4c8a-4143-a36e-248338620c22" />
