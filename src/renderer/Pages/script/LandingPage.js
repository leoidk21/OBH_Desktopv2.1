document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-requested-modal")) {
    const modal = document.getElementById("event-modal");
    if (modal) {
      modal.style.display = "flex";
      console.log("Modal opened via delegation");
    }
  }

  if (e.target.classList.contains("close-modal")) {
    const modal = document.getElementById("event-modal");
    if (modal) {
      modal.style.display = "none";
      console.log("Modal closed via delegation");
    }
  }
});
