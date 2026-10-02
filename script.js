// BlogSpace Frontend - Backend API
const API_URL = "https://blog-application-y6dk.onrender.com";

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);
            window.location.href = "login.html";

        } catch (error) {
            alert("Unable to connect to the server.");
            console.error(error);
        }
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("loggedInUser", JSON.stringify(data.user));

            alert(data.message);
            window.location.href = "dashboard.html";

        } catch (error) {
            alert("Unable to connect to the server.");
            console.error(error);
        }
    });
}


// CREATE BLOG
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const author = document.getElementById("blogAuthor").value;
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value;

        try {
            const response = await fetch(`${API_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    author,
                    category,
                    content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);

            blogForm.reset();

            window.location.href = "dashboard.html";

        } catch (error) {
            alert("Unable to connect to the server.");
            console.error(error);
        }
    });
}


// DASHBOARD
const dashboardBlogs = document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    async function loadBlogs() {

        try {

            const response = await fetch(`${API_URL}/api/blogs`);

            const blogs = await response.json();

            if (blogs.length === 0) {
                dashboardBlogs.innerHTML =
                    "<p>No blogs available yet.</p>";
                return;
            }

            dashboardBlogs.innerHTML = "";

            blogs.forEach(function (blog) {

                const article = document.createElement("article");

                article.className = "blog-card";

                article.innerHTML = `
                    <h3>${blog.title}</h3>

                    <p>
                        <strong>Author:</strong>
                        ${blog.author}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${blog.category}
                    </p>

                    <p>
                        ${blog.content}
                    </p>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">

                        <a href="blog-details.html?id=${blog._id}" class="btn">
                            Read More
                        </a>

                        <button
                            class="btn"
                            onclick="editBlog('${blog._id}')">
                            Edit
                        </button>

                        <button
                            class="btn"
                            onclick="deleteBlog('${blog._id}')">
                            Delete
                        </button>

                    </div>
                `;

                dashboardBlogs.appendChild(article);
            });

        } catch (error) {

            console.error("Error loading blogs:", error);

            dashboardBlogs.innerHTML =
                "<p>Unable to load blogs.</p>";
        }
    }

    loadBlogs();
}


// EDIT BLOG
async function editBlog(id) {

    try {

        const response = await fetch(`${API_URL}/api/blogs/${id}`);

        const blog = await response.json();

        if (!response.ok) {
            alert(blog.message);
            return;
        }

        const title = prompt("Enter blog title:", blog.title);

        if (title === null) {
            return;
        }

        const author = prompt("Enter author name:", blog.author);

        if (author === null) {
            return;
        }

        const category = prompt("Enter category:", blog.category);

        if (category === null) {
            return;
        }

        const content = prompt("Enter blog content:", blog.content);

        if (content === null) {
            return;
        }

        if (!title || !author || !category || !content) {
            alert("All blog fields are required.");
            return;
        }

        const updateResponse = await fetch(`${API_URL}/api/blogs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                author,
                category,
                content
            })
        });

        const data = await updateResponse.json();

        if (!updateResponse.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        location.reload();

    } catch (error) {

        console.error("Error updating blog:", error);

        alert("Unable to update blog.");
    }
}


// DELETE BLOG
async function deleteBlog(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/blogs/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        location.reload();

    } catch (error) {

        console.error("Error deleting blog:", error);

        alert("Unable to delete blog.");
    }
}
