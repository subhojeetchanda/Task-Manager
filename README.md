# Task Management System

A full-stack, responsive task management application built as a job assignment. It features a clean, mobile-first React frontend with dark mode support, powered by an Express.js backend using an in-memory data store.

## Tech Stack

- **Frontend:** React (Vite), React Router, vanilla CSS Modules.
- **Backend:** Node.js, Express, ES Modules, Zod (Validation), Swagger UI.
- **Storage:** In-memory Array (no external database required).

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Instructions

### 1. Backend

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

Copy the example environment variables:

```bash
cp .env.example .env
```

Start the backend development server:

```bash
npm run dev
```

The backend server will start on `http://localhost:5001`.

### 2. Frontend

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Copy the example environment variables:

```bash
cp .env.example .env
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`.

## Architecture & Design Decisions

- **Layered Backend Architecture:** The backend strictly follows a `route -> controller -> service` pattern. This keeps business logic (in the service layer) separated from HTTP request handling, making the app much easier to test and scale if we were to swap the in-memory array for a real database.
- **In-Memory Store:** To minimize setup friction and dependencies for review, the backend uses an ephemeral array for storage. Seed data is loaded automatically on server start.
- **CSS Modules & Variables:** Styling is handled purely via CSS Modules to prevent global scope clashes, paired with CSS variables (`variables.css`) for consistent design tokens and seamless theme switching. No heavy UI frameworks or utility classes like Tailwind were used.
- **URL-Driven State:** Search, filters, sorting, and pagination state are synchronized perfectly with the browser's URL query string. This enables users to bookmark, refresh, and share precise views without losing their exact dashboard state.

## API Documentation

Interactive Swagger UI documentation is available when the backend is running at:  
👉 `http://localhost:5001/api/docs`

Additionally, a Postman collection is included for testing:  
📁 `backend/docs/task-manager.postman_collection.json`

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports pagination, filtering, sorting, and search) |
| GET | `/api/tasks/:id` | Get a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Fully update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example Request (POST `/api/tasks`)

```json
{
  "title": "Complete code review",
  "description": "Review the latest pull requests.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

### Example Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete code review",
    "description": "Review the latest pull requests.",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-11-01T10:00:00.000Z",
    "updatedAt": "2024-11-01T10:00:00.000Z"
  }
}
```

### Example Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be 3-100 characters"
    }
  ]
}
```

## Features

- **Full CRUD Operations:** Create, read, update, and delete tasks.
- **Validation:** Strict client-side and server-side validation rules mirrored perfectly.
- **Centralized Error Handling:** Consistent API error shapes natively mapped to UI fields.
- **Responsive Layout:** Mobile-first approach using native CSS grid and flexbox capabilities.
- **Accessible Components:** Focus trapping in modals, keyboard navigation, and semantic HTML labels.
- **Bonus:** **Debounced Search:** 300ms delayed API lookups to prevent request spam.
- **Bonus:** **Advanced Filtering & Sorting:** Sort by priority, date, or created time alongside status and priority filtering.
- **Bonus:** **Pagination:** API-driven pagination with synchronized URL routing.
- **Bonus:** **Dark Mode:** Native CSS-variable powered dark mode matching system preference by default, persisted securely to `localStorage` without FOUC (Flash of Unstyled Content).

## Known Limitations & Future Improvements

- **Data Persistence:** Because storage is entirely in-memory, all created or modified tasks will be reset to the original seed data if the Node.js backend restarts.
- **Authentication:** There is currently no user authentication or multi-tenancy. All users share the same global list of tasks.
- **Future Improvements:** Integrate a permanent datastore (e.g., PostgreSQL or MongoDB), add Firebase/JWT authentication for user-specific boards, and implement drag-and-drop KanBan board views.
