// Dynamically load components
document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");

  if (sidebarContainer) {
    fetch("../components/Sidebar.html")
      .then(response => response.text())
      .then(data => {
        sidebarContainer.innerHTML = data;

        // Highlight active link
        const currentPage = document.body.getAttribute("data-page");
        if (currentPage) {
          const activeLink = sidebarContainer.querySelector(`[data-page="${currentPage}"]`);
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      })
      .catch(err => console.error("Error loading sidebar:", err));
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
