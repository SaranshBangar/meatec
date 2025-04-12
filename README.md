# Meatec - Task Management System

## Overview

Meatec is a full-stack task management application that enables users to create, manage, and track tasks efficiently. This system features user authentication, task management, and a responsive user interface.

## Project Structure

```
meatec/
├── frontend/          # React/TypeScript frontend application
└── backend/           # Express.js backend API
```

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives
- **React Router Dom v7** for routing
- **Vite** as the build tool

### Backend

- **Node.js** with Express.js
- **JSON Web Tokens (JWT)** for authentication
- **bcrypt** for password hashing
- **@neondatabase/serverless** for database connectivity
- **Express Validator** for request validation

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/SaranshBangar/meatec.git
cd meatec
```

2. Set up the backend

```bash
cd backend
npm install
# Configure environment variables
cp .env.example .env
# Update .env with your database credentials and JWT secret
```

3. Set up the frontend

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server

```bash
cd backend
npm run dev
```

2. Start the frontend development server

```bash
cd ../frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:3000 by default.

## Features

- **User Authentication**: Registration, login, and profile management
- **Task Management**: Create, read, update, and delete tasks
- **User Dashboard**: Overview of tasks and activities
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme toggle for user preference

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (requires authentication)

### Tasks

- `GET /api/tasks` - Get all tasks for a user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Development

### Backend

The backend follows a modular structure:

- `database/` - Database connection and schema
- `middleware/` - Authentication and error handling middleware
- `models/` - Data models
- `routes/` - API route handlers

### Frontend

The frontend is organized by features:

- `components/` - Reusable UI components
- `pages/` - Page components
- `api/` - API integration
- `store/` - Redux store and slices
- `hooks/` - Custom React hooks

## Deployment

Instructions for deploying to production environments:

1. Backend:

   - Set up environment variables for production
   - Deploy to your preferred Node.js hosting (e.g., Heroku, Render, DigitalOcean)

2. Frontend:
   - Build the production bundle: `npm run build`
   - Deploy the contents of the `dist` directory to a static hosting service

## Contributors

- [Saransh Bangar](https://www.saransh-bangar.xyz/)

## License

ISC
