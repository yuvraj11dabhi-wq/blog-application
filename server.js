const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ===============================
// USER MODEL
// ===============================

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);


// ===============================
// BLOG MODEL
// ===============================

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model("Blog", blogSchema);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "BlogSpace Backend API is running successfully!"
    });
});


// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        res.status(201).json({

            message: "Registration successful!",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration."
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({

            message: "Login successful!",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
});


// ===============================
// CREATE BLOG
// ===============================

app.post("/api/blogs", async (req, res) => {

    try {

        const {
            title,
            author,
            category,
            content
        } = req.body;

        if (!title || !author || !category || !content) {

            return res.status(400).json({
                message: "All blog fields are required."
            });

        }

        const blog = await Blog.create({
            title,
            author
