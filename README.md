# 🐦 Chirp

A full-stack social media application inspired by Twitter, built with React and ASP.NET Core Web API.

![Chirp](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![.NET](https://img.shields.io/badge/.NET-8-purple)

---

## ✨ Features

- **Authentication** — Register and login with JWT-based authentication
- **Chirps** — Create and delete posts in real time
- **Likes** — Like and unlike posts with live count updates
- **Comments** — Reply to posts with inline comment sections
- **Explore** — Discover and search for users
- **Profile Page** — View your posts, follower and following counts
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

### Frontend

- React 18 + Vite
- React Router DOM
- React Icons
- Context API for global state
- CSS animations & responsive layout

### Backend

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQLite
- JWT Authentication
- BCrypt password hashing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- .NET 8 SDK

### Backend Setup

```bash
cd backend/TwitterClone
dotnet restore
dotnet ef database update
dotnet watch
```

The API will run on `http://localhost:5283`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5174`

---

## 📁 Project Structure

```
Chirp/
├── backend/
│   ├── Controllers/
│   │   ├── UsersController.cs
│   │   ├── PostsController.cs
│   │   ├── LikesController.cs
│   │   ├── CommentsController.cs
│   │   └── FollowsController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Post.cs
│   │   ├── Like.cs
│   │   ├── Comment.cs
│   │   └── DTOs/
│   └── Data/
│       └── AppDbContext.cs
└── frontend/
    └── src/
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── HomePage.jsx
        │   ├── ExplorePage.jsx
        │   └── ProfilePage.jsx
        ├── Components/
        │   ├── Sidebar.jsx
        │   ├── Feed.jsx
        │   ├── RightPanel.jsx
        │   └── Logo.jsx
        └── context/
            └── AuthContext.jsx
```

---

## 🔐 API Endpoints

| Method | Endpoint               | Auth | Description   |
| ------ | ---------------------- | ---- | ------------- |
| POST   | /api/users/register    | ❌   | Register      |
| POST   | /api/users/login       | ❌   | Login         |
| GET    | /api/posts             | ❌   | Get all posts |
| POST   | /api/posts             | ✅   | Create post   |
| DELETE | /api/posts/{id}        | ✅   | Delete post   |
| POST   | /api/likes/{postId}    | ✅   | Like post     |
| DELETE | /api/likes/{postId}    | ✅   | Unlike post   |
| GET    | /api/comments/{postId} | ❌   | Get comments  |
| POST   | /api/comments/{postId} | ✅   | Add comment   |

---

## 👤 Author

Built by Amin — learning full-stack development one project at a time.
