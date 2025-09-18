const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

document.getElementById('adminKey').addEventListener('input', function(e) {
  // Remove any non-numeric characters
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
  
  // Limit to 4 digits
  if (e.target.value.length > 4) {
    e.target.value = e.target.value.slice(0, 4);
  }
});