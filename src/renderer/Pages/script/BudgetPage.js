console.log("BudgetPage.js is loaded!");

// ====== VIEW RECEIPT MODAL ====== //
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-receipt")) {
    const modal = document.getElementById("payment-modal");
    if (modal) {
      modal.style.display = "flex";
      console.log("Modal opened via delegation");
    }
  }

  if (e.target.classList.contains("close-modal")) {
    const modal = document.getElementById("payment-modal");
    if (modal) {
      modal.style.display = "none";
      console.log("Modal closed via delegation");
    }
  }
});
// ====== VIEW RECEIPT MODAL ====== //


// ====== SEND REMINDER MODAL ====== //
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("send-reminder")) {
    const modal = document.getElementById("send-reminder-modal");
    if (modal) {
      modal.style.display = "flex";
      console.log("Modal opened via delegation");
    }
  }

  if (e.target.classList.contains("close-send-reminder")) {
    const modal = document.getElementById("send-reminder-modal");
    if (modal) {
      modal.style.display = "none";
      console.log("Modal closed via delegation");
    }
  }
});
// ====== SEND REMINDER MODAL ====== //