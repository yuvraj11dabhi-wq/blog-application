 # BlogSpace – Full Stack Blog Application

A full-stack Blog Application developed as part of my Full-Stack Web Development learning journey.

BlogSpace allows users to register, login securely, create blogs, view their blogs, edit and delete them, and manage their profile through an authenticated dashboard.

## 🚀 Live Demo

Frontend:
https://yuvraj11dabhi-wq.github.io/blog-application/index.html

Backend:
https://blog-application-y6dk.onrender.com/

## 📌 Features

- User Registration
- Secure User Login
- JWT-based Authentication
- Protected Dashboard
- User Profile
- Logout Functionality
- Create Blog
- View Blogs
- View Individual Blog Details
- Edit Blog
- Delete Blog
- User-specific Blog Management
- MongoDB Database Integration
- REST API Integration
- Responsive Design
- Mobile-friendly Interface

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcryptjs

### Deployment
- GitHub Pages – Frontend
- Render – Backend

## 🔐 Authentication

BlogSpace uses JWT-based authentication.

After successful login:

1. The server verifies the user's credentials.
2. A JWT token is generated.
3. The token is stored on the frontend.
4. Protected API requests include the token.
5. The backend verifies the token before allowing access.

This ensures that users can access and manage only their authenticated blog data.

## 📝 Blog Management

Authenticated users can:

- Create new blogs
- View their blogs
- Open individual blog details
- Edit existing blogs
- Delete blogs

Each blog is associated with the authenticated user's account.

## 📂 Project Structure

```text
blog-application/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── style.css
├── script.js
├── README.md
│
└── Backend
    └── server.js
