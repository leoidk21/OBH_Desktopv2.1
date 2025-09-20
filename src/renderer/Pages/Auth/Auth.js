// auth.js - Safe Version
const API_BASE = "http://localhost:3000/api";

console.log("✅ Auth.js is loaded!");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Auth.js loaded, current page:", window.location.pathname);

  // SIGNUP FORM
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    console.log("📝 Signup form found");

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📤 Signup form submitted");

      const payload = {
        firstName: document.getElementById("firstName")?.value.trim(),
        lastName: document.getElementById("lastName")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        phone: document.getElementById("phone")?.value.trim(),
        password: document.getElementById("password")?.value,
      };

      console.log("📦 Signup payload:", payload);

      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("📨 Signup response:", data);

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("adminData", JSON.stringify(data.admin));
          alert("Signup successful! Please login now.");
          window.location.href = "./LoginPage.html";
        } else {
          alert(data.error || "Registration failed");
        }
      } catch (error) {
        console.error("❌ Signup network error:", error);
        alert("Network error. Please try again.");
      }
    });
  }

  // LOGIN FORM
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    console.log("🔑 Login form found");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📤 Login form submitted");

      const payload = {
        email: document.getElementById("email")?.value.trim(),
        password: document.getElementById("password")?.value,
      };

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("📨 Login response:", data);

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("adminData", JSON.stringify(data.admin));
          alert("Login successful!");
          window.location.href = "../../Pages/LandingPage.html";
        } else {
          alert(data.error || "Login failed");
        }
      } catch (error) {
        console.error("❌ Login network error:", error);
        alert("Network error. Please try again.");
      }
    });
  }

  // LOGOUT BUTTON (optional)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // ADMIN PROFILE PAGE
  if (isAdminAccountPage()) {
    console.log("👤 On Admin Account Page - Loading profile...");
    loadAdminProfile();
  }
});

// Helper: Check if on AdminAccountPage
function isAdminAccountPage() {
  return document.body.dataset.page === "AdminAccountPage";
}

// Load admin profile
function loadAdminProfile() {
  console.log("👤 Loading admin profile...");

  const storedAdmin = localStorage.getItem("adminData");
  if (storedAdmin) {
    updateProfileElements(JSON.parse(storedAdmin));
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return handleLogout("No token found. Please login.");
  }

  fetch(`${API_BASE}/admin/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("📥 API profile data:", data);
      updateProfileElements(data);
      localStorage.setItem("adminData", JSON.stringify(data));
    })
    .catch((err) => {
      console.error("❌ Profile fetch failed:", err.message);
      handleLogout("Session expired. Please login again.");
    });
}

// Update profile UI
function updateProfileElements(data) {
  const fullName = `${data.first_name} ${data.last_name}`;
  document.querySelectorAll("#profile-account-name, .profile-account-name")
    .forEach(el => el.textContent = fullName);

  document.querySelectorAll("#profile-email, .profile-account-email")
    .forEach(el => el.textContent = data.email);

  document.querySelectorAll("#profile-phone, .profile-account-phone")
    .forEach(el => el.textContent = data.phone || "Not provided");

  const roleText = data.role.replace("_", " ").toUpperCase();
  document.querySelectorAll("#profile-role, .profile-account-role")
    .forEach(el => el.textContent = roleText);

  console.log("✅ UI updated successfully!");
}

// Logout
function handleLogout(message) {
  localStorage.removeItem("token");
  localStorage.removeItem("adminData");
  alert(message);
  window.location.href = "../../Pages/Auth/LoginPage.html";
}


















  // PASSWORD TOGGLE
  // const togglePassword = document.querySelector("#togglePassword");
  // const password = document.querySelector("#password");

  // togglePassword.addEventListener("click", function () {
  //   const type = password.getAttribute("type") === "password" ? "text" : "password";
  //   password.setAttribute("type", type);
  //   this.classList.toggle("fa-eye-slash");
  // });

  // document.getElementById('adminKey').addEventListener('input', function(e) {
  //   // Remove any non-numeric characters
  //   e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
  //   // Limit to 4 digits
  //   if (e.target.value.length > 4) {
  //     e.target.value = e.target.value.slice(0, 4);
  //   }
  // });
