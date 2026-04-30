<div align="center">

# 🗂️ TaskFlow

**A modern full-stack task management application built with Go & Next.js**

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/) [![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TaskFlow** is a full-stack task management web application designed to help individuals and teams organize, track, and manage their work efficiently. It features a RESTful API backend built with Go and a responsive frontend powered by Next.js and TypeScript.

### ✨ Key Features

- 📝 **Task Management** — Create, update, delete, and organize tasks with ease
- 🔐 **Authentication** — Secure user authentication using JWT (JSON Web Tokens)
- 👤 **User Management** — Individual user accounts with personalized task views
- 🐘 **Persistent Storage** — Reliable data persistence with PostgreSQL
- 🐳 **Containerized** — Fully Dockerized for seamless development and deployment

---

## Tech Stack

| Layer        | Technology                  |
| ------------ | --------------------------- |
| **Frontend** | Next.js 14, TypeScript, CSS |
| **Backend**  | Go (Golang)                 |
| **Database** | PostgreSQL 16               |
| **Auth**     | JWT (JSON Web Token)        |
| **DevOps**   | Docker, Docker Compose      |
| **DB Admin** | pgAdmin 4                   |

---

## Project Structure

```
TaskFlow/
├── backend/                # Go REST API
│   ├── Dockerfile
│   └── ...
├── frontend/               # Next.js application
│   ├── Dockerfile
│   └── ...
├── docker-compose.yaml     # Multi-container orchestration
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/) (recommended)
- [Go 1.21+](https://golang.org/dl/) (for local backend development)
- [Node.js 18+](https://nodejs.org/) & npm/yarn (for local frontend development)

### Environment Variables

Create a `.env` file in the root directory based on the following template:

```env
# Database
DB_HOST=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=taskflow
DB_PORT=5432

# Backend
BACKEND_PORT=8080
SECRET_KEY=your_super_secret_jwt_key

# Frontend
NEXT_PUBLIC_API=http://localhost:8080
NODE_ENV=development

# pgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
```

### Running with Docker

The easiest way to get started is with Docker Compose. It will spin up all services automatically.

```bash
# Clone the repository
git clone https://github.com/mubasyir19/TaskFlow.git
cd TaskFlow

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up --build
```

Once running, the services will be available at:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| pgAdmin     | http://localhost:5050 |
| PostgreSQL  | localhost:5432        |

To stop all services:

```bash
docker compose down
```

To stop and remove volumes (reset database):

```bash
docker compose down -v
```

### Running Locally

**Backend (Go)**

```bash
cd backend
go mod tidy
go run main.go
```

**Frontend (Next.js)**

```bash
cd frontend
npm install
npm run dev
```

Make sure PostgreSQL is running and the `.env` is configured correctly before starting the services.

---

## API Reference

The backend exposes a RESTful API running on port `8080`.

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| `POST` | `/api/auth/register` | Register a new user         |
| `POST` | `/api/auth/login`    | Login and receive JWT token |

### Tasks

> All task endpoints require a valid `Authorization: Bearer <token>` header.

| Method   | Endpoint         | Description                          |
| -------- | ---------------- | ------------------------------------ |
| `GET`    | `/api/tasks`     | Get all tasks for authenticated user |
| `POST`   | `/api/tasks`     | Create a new task                    |
| `GET`    | `/api/tasks/:id` | Get a specific task                  |
| `PUT`    | `/api/tasks/:id` | Update a task                        |
| `DELETE` | `/api/tasks/:id` | Delete a task                        |

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add some feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your code follows the existing code style and includes appropriate tests where applicable.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made by [mubasyir19](https://github.com/mubasyir19)

</div>
