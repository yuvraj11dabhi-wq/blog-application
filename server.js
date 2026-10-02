const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model("Blog", blogSchema);


// ===============================
// JWT AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login first."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Invalid or expired token."
        });

    }
}


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

        const {
            name,
            email,
            password
        } = req.body;

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

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

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

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Server error during registration."
        });

    }

});


// ===============================
// LOGIN WITH JWT
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }

        const user = await User.findOne({

            email: email.toLowerCase()

        });

        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        // CREATE JWT TOKEN

        const token = jwt.sign(

            {
                userId: user._id,
                name: user.name,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.json({

            message: "Login successful!",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message:
                "Server error during login."

        });

    }

});


// ===============================
// GET CURRENT USER PROFILE
// ===============================

app.get(
    "/api/profile",
    authenticateToken,
    async (req, res) => {

        try {

            const user = await User.findById(
                req.user.userId
            ).select("-password");

            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found."

                });

            }

            res.json(user);

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error while loading profile."

            });

        }

    }
);


// ===============================
// CREATE BLOG
// ===============================

app.post(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                author,
                category,
                content
            } = req.body;

            if (
                !title ||
                !author ||
                !category ||
                !content
            ) {

                return res.status(400).json({

                    message:
                        "All blog fields are required."

                });

            }

            const blog = await Blog.create({

                title,

                author,

                category,

                content,

                userId: req.user.userId

            });

            res.status(201).json({

                message:
                    "Blog published successfully!",

                blog

            });

        } catch (error) {

            console.error(
                "Blog creation error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error while publishing blog."

            });

        }

    }
);


// ===============================
// GET LOGGED-IN USER'S BLOGS
// ===============================

app.get(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const blogs = await Blog
                .find({
                    userId: req.user.userId
                })
                .sort({
                    createdAt: -1
                });

            res.json(blogs);

        } catch (error) {

            console.error(
                "Error loading blogs:",
                error
            );

            res.status(500).json({

                message:
                    "Server error while loading blogs."

            });

        }

    }
);


// ===============================
// GET SINGLE BLOG
// ===============================

app.get(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const blog = await Blog.findOne({

                _id: req.params.id,

                userId: req.user.userId

            });

            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found."

                });

            }

            res.json(blog);

        } catch (error) {

            console.error(
                "Error loading blog:",
                error
            );

            res.status(400).json({

                message:
                    "Invalid blog ID."

            });

        }

    }
);


// ===============================
// UPDATE BLOG
// ===============================

app.put(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                author,
                category,
                content
            } = req.body;

            if (
                !title ||
                !author ||
                !category ||
                !content
            ) {

                return res.status(400).json({

                    message:
                        "All blog fields are required."

                });

            }

            const blog =
                await Blog.findOneAndUpdate(

                    {
                        _id: req.params.id,

                        userId: req.user.userId

                    },

                    {
                        title,
                        author,
                        category,
                        content
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );

            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found."

                });

            }

            res.json({

                message:
                    "Blog updated successfully!",

                blog

            });

        } catch (error) {

            console.error(
                "Blog update error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error while updating blog."

            });

        }

    }
);


// ===============================
// DELETE BLOG
// ===============================

app.delete(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const blog =
                await Blog.findOneAndDelete({

                    _id: req.params.id,

                    userId: req.user.userId

                });

            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found."

                });

            }

            res.json({

                message:
                    "Blog deleted successfully!"

            });

        } catch (error) {

            console.error(
                "Blog deletion error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error while deleting blog."

            });

        }

    }
);


// ===============================
// CONNECT MONGODB & START SERVER
// ===============================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully!"
        );

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `BlogSpace backend running on port ${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });
