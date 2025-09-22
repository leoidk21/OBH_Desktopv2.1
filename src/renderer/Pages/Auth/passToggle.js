// PASSWORD TOGGLE
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    const type =
        password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("EditAdminAcc.js is loaded!");
  
  const modal = document.getElementById("editProfileModal");
  const editButtons = document.querySelectorAll(".edit-btn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Loop through all edit buttons
  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("✅ Edit button clicked:", btn);
      modal.classList.add("show"); // Use class instead of style.display
    });
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.remove("show"); // Remove class instead of style.display
    });
  }

  // Close if clicking outside modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show"); // Remove class instead of style.display
    }
  });
});