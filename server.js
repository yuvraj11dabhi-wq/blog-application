const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// ==================== MONGODB CONNECTION ====================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `BlogSpace backend running on port ${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });


// ==================== USER MODEL ====================

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


// ==================== BLOG MODEL ====================

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


// ==================== HOME / TEST API ====================

app.get("/", (req, res) => {
    res.json({
        message: "BlogSpace Backend API is running successfully!"
    });
});


// ==================== REGISTER API ====================

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

        // Hash password before storing
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


// ==================== LOGIN API ====================

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

        // Compare entered password with hashed password
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


// ==================== CREATE BLOG API ====================

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
            author,
            category,
            content
        });

        res.status(201).json({
            message: "Blog published successfully!",
            blog
        });

    } catch (error) {

        console.error("Blog creation error:", error);

        res.status(500).json({
            message: "Server error while publishing blog."
        });
    }
});


// ==================== GET ALL BLOGS ====================

app.get("/api/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {

        console.error("Error loading blogs:", error);

        res.status(500).json({
            message: "Server error while loading blogs."
        });
    }
});


// ==================== GET SINGLE BLOG ====================

app.get("/api/blogs/:id", async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json(blog);

    } catch (error) {

        console.error("Error loading blog:", error);

        res.status(400).json({
            message: "Invalid blog ID."
        });
    }
});
