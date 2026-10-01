// BlogSpace JavaScript

// Register Form
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("blogUser", JSON.stringify(user));

        alert("Registration successful! You can now login.");
        window.location.href = "login.html";
    });
}


// Login Form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const savedUser = JSON.parse(
            localStorage.getItem("blogUser")
        );

        if (
            savedUser &&
            savedUser.email === email &&
            savedUser.password === password
        ) {
            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}


// Create Blog Form
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const author = document.getElementById("blogAuthor").value;
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value;

        const newBlog = {
            title: title,
            author: author,
            category: category,
            content: content
        };

        let blogs =
            JSON.parse(localStorage.getItem("blogs")) || [];

        blogs.push(newBlog);

        localStorage.setItem("blogs", JSON.stringify(blogs));

        alert("Blog published successfully!");

        blogForm.reset();

        window.location.href = "dashboard.html";
    });
}


// Display Blogs on Dashboard
const dashboardBlogs =
    document.getElementById("dashboardBlogs");

if (dashboardBlogs) {

    const blogs =
        JSON.parse(localStorage.getItem("blogs")) || [];

    if (blogs.length > 0) {

        dashboardBlogs.innerHTML = "";

        blogs.forEach(function (blog) {

            const article = document.createElement("article");

            article.className = "blog-card";

            article.innerHTML = `
                <h3>${blog.title}</h3>

                <p>
                    <strong>Author:</strong> ${blog.author}
                </p>

                <p>
                    <strong>Category:</strong> ${blog.category}
                </p>

                <p>${blog.content}</p>
            `;

            dashboardBlogs.appendChild(article);
        });
    }
}
