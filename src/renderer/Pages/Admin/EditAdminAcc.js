document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ EditAdminAcc.js is loaded!");

  // Function to initialize modal
  function initializeModal() {
    const modal = document.getElementById("editProfileModal");
    const editButtons = document.querySelectorAll(".edit-btn");
    const cancelBtn = document.getElementById("cancelBtn");

    if (modal && editButtons.length > 0) {
      editButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        e.preventDefault();

        modal.classList.add("show");

        // Get values from profile card spans
        const name = document.getElementById("profile-account-name").textContent.trim();
        const email = document.getElementById("profile-email").textContent.trim();
        const phone = document.getElementById("profile-phone").textContent.trim();

        // Fill modal form inputs
        document.getElementById("editName").value = name;
        document.getElementById("editEmail").value = email;
        document.getElementById("editPhone").value = phone;
        });

      });

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          modal.classList.remove("show");
        });
      }

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
        }
      });

      console.log("✅ Modal initialized successfully!");
      return true;
    }
    return false;
  }

  // Try to initialize immediately
  if (!initializeModal()) {
    console.log("⏳ Elements not found, waiting for loadComponents...");

    setTimeout(() => {
      if (!initializeModal()) {
        console.log("⚠️ Still not found after delay, trying MutationObserver...");

        const observer = new MutationObserver(() => {
          if (initializeModal()) {
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    }, 1000);
  }
});
