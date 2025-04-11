# Task Management API

A RESTful API backend for a task management application with user authentication and task CRUD operations.

## Features

- User registration and authentication using JWT
- Secure password storage with bcrypt
- User profile management
- Task creation, reading, updating, and deletion
- Task filtering, sorting, and searching
- PostgreSQL database integration with Neon

## Technologies Used

- Node.js with Express
- PostgreSQL (Neon serverless)
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for request validation

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL database (or a Neon account)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the given template and fill in your database credentials and JWT secret:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

4. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

#### Register a New User

- **URL:** `POST /api/users/register`
- **Description:** Creates a new user account
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
  ```

#### Login

- **URL:** `POST /api/users/login`
- **Description:** Authenticates a user and returns a JWT token
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
  ```

### User Management

#### Get Current User

- **URL:** `GET /api/users/me`
- **Description:** Gets current user information
- **Authentication:** Required
- **Response:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-04-11T10:00:00Z"
  }
  ```

#### Update User Profile

- **URL:** `PUT /api/users/profile`
- **Description:** Updates user profile information
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "name": "John Updated",
    "email": "updated@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": 1,
      "name": "John Updated",
      "email": "updated@example.com",
      "created_at": "2025-04-11T10:00:00Z"
    }
  }
  ```

#### Change Password

- **URL:** `PUT /api/users/password`
- **Description:** Changes user password
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

### Task Management

#### Create Task

- **URL:** `POST /api/tasks`
- **Description:** Creates a new task
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "title": "Complete project",
    "description": "Finish the backend implementation",
    "dueDate": "2025-04-30T12:00:00Z",
    "status": "pending"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete project",
      "description": "Finish the backend implementation",
      "status": "pending",
      "due_date": "2025-04-30T12:00:00Z",
      "created_at": "2025-04-11T10:00:00Z",
      "updated_at": "2025-04-11T10:00:00Z"
    }
  }
  ```

#### Get All Tasks

- **URL:** `GET /api/tasks`
- **Description:** Gets all tasks for authenticated user
- **Authentication:** Required
- **Query Parameters:**
  - `status` - Filter by status (pending, in_progress, completed)
  - `searchTerm` - Search in title and description
  - `sortBy` - Field to sort by (created_at, updated_at, due_date, title, status)
  - `sortOrder` - Sort direction (ASC or DESC)
  - `limit` - Number of results (default: 50)
  - `offset` - Pagination offset (default: 0)
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete project",
      "description": "Finish the backend implementation",
      "status": "pending",
      "due_date": "2025-04-30T12:00:00Z",
      "created_at": "2025-04-11T10:00:00Z",
      "updated_at": "2025-04-11T10:00:00Z"
    }
  ]
  ```

#### Get Task Statistics

- **URL:** `GET /api/tasks/stats`
- **Description:** Gets task statistics for the authenticated user
- **Authentication:** Required
- **Response:**
  ```json
  {
    "total": 10,
    "pending": 5,
    "in_progress": 3,
    "completed": 2
  }
  ```

#### Get Task by ID

- **URL:** `GET /api/tasks/:id`
- **Description:** Gets a specific task by ID
- **Authentication:** Required
- **Response:**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the backend implementation",
    "status": "pending",
    "due_date": "2025-04-30T12:00:00Z",
    "created_at": "2025-04-11T10:00:00Z",
    "updated_at": "2025-04-11T10:00:00Z"
  }
  ```

#### Update Task

- **URL:** `PUT /api/tasks/:id`
- **Description:** Updates a task
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "in_progress",
    "dueDate": "2025-05-15T12:00:00Z"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Updated title",
      "description": "Updated description",
      "status": "in_progress",
      "due_date": "2025-05-15T12:00:00Z",
      "created_at": "2025-04-11T10:00:00Z",
      "updated_at": "2025-04-11T10:30:00Z"
    }
  }
  ```

#### Delete Task

- **URL:** `DELETE /api/tasks/:id`
- **Description:** Deletes a task
- **Authentication:** Required
- **Response:**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Error Handling

The API uses standard HTTP status codes and returns error messages in a consistent format:

```json
{
  "message": "Error message here",
  "errors": [] // Optional array of validation errors
}
```

## Authentication

All protected endpoints require a valid JWT token sent in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
