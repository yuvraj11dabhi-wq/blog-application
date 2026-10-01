const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = [];
let blogs = [];

// Home / test API
app.get("/", (req, res) => {
    res.json({
        message: "BlogSpace Backend API is running successfully!"
    });
});

// Register API
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists."
        });
    }

    const user = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(user);

    res.status(201).json({
        message: "Registration successful!",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }

    res.json({
        message: "Login successful!",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Create Blog API
app.post("/api/blogs", (req, res) => {
    const { title, author, category, content } = req.body;

    if (!title || !author || !category || !content) {
        return res.status(400).json({
            message: "All blog fields are required."
        });
    }

    const blog = {
        id: blogs.length + 1,
        title,
        author,
        category,
        content
    };

    blogs.push(blog);

    res.status(201).json({
        message: "Blog published successfully!",
        blog
    });
});

// Get all blogs
app.get("/api/blogs", (req, res) => {
    res.json(blogs);
});

app.listen(PORT, () => {
    console.log(`BlogSpace backend running on port ${PORT}`);
});
