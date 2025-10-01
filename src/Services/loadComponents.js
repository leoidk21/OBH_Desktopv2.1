const pageConfig = {
  LandingPage: {
    path: '../Pages/LandingPage.html',
    title: 'Dashboard'
  },
  EventPage: {
    path: '../Pages/EventPage.html',
    title: 'Events'
  },
  SchedulePage: {
    path: '../Pages/SchedulePage.html',
    title: 'Schedule'
  },
  GuestPage: {
    path: '../Pages/GuestPage.html',
    title: 'Guests'
  },
  BudgetPage: {
    path: '../Pages/BudgetPage.html',
    title: 'Budget'
  },
  GalleryPage: {
    path: '../Pages/GalleryPage.html',
    title: 'Gallery'
  },
  NotificationPage: {
    path: '../Pages/NotificationPage.html',
    title: 'Notifications'
  },
  QRPage: {
    path: '../Pages/QRPage.html',
    title: 'QR Code'
  },
  ClientsPage: {
    path: '../Pages/ClientsPage.html',
    title: 'Clients'
  },
  AdminAccountPage: {
    path: '../Pages/Admin/AdminAccountPage.html',
    title: 'Account'
  }
};

// Dynamically load components
document.addEventListener("DOMContentLoaded", () => {
  loadSidebar();

  const lastPage = localStorage.getItem("lastPage") || "LandingPage";
  navigateToPage(lastPage);
});

async function loadSidebar() {
  const sidebarContainer = document.getElementById("sidebar-container");

  if (sidebarContainer) {
    try {
      const response = await fetch("../components/Sidebar.html");
      const data = await response.text();
      sidebarContainer.innerHTML = data;

      // Highlight active link
      const currentPage = document.body.getAttribute("data-page");
      if (currentPage) {
        const activeLink = sidebarContainer.querySelector(`[data-page="${currentPage}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }

      // Setup navigation AFTER sidebar is loaded
      setupNavigation();
      setupSmoothScrolling();

    } catch (err) {
      console.error("Error loading sidebar:", err);
    }
  }
}

function setupNavigation() {
  // Get all navigation links in the sidebar
  const navLinks = document.querySelectorAll('.sidebar a[data-page]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const pageName = this.getAttribute('data-page');
      const href = this.getAttribute('href');
      
      // If it's an internal page navigation
      if (pageName) {
        navigateToPage(pageName);
      } 
      // If it's an anchor link for smooth scrolling
      else if (href && href.startsWith('#')) {
        smoothScrollToAnchor(href);
      }
    });
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Only add if not already handled by navigation
    if (!anchor.hasAttribute('data-page')) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScrollToAnchor(this.getAttribute('href'));
      });
    }
  });
}

function smoothScrollToAnchor(anchorId) {
  const targetElement = document.querySelector(anchorId);
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Navigation handler
function navigateToPage(pageName) {
  console.log('Navigating to:', pageName);
  
  localStorage.setItem("lastPage", pageName);
  
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current link
  const activeLink = document.querySelector(`.sidebar a[data-page="${pageName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Update body data attribute
  document.body.setAttribute('data-page', pageName);
  
  // Hide current content with transition
  const contentContainer = document.querySelector('.content-container');
  if (contentContainer) {
    contentContainer.classList.add('loading');
    
    // Load new content after transition
    setTimeout(() => {
      loadPageContent(pageName);
      contentContainer.classList.remove('loading');
    }, 200);
  } else {
    // Fallback if no content container
    loadPageContent(pageName);
  }
}

function loadPageContent(pageName) {
  const page = pageConfig[pageName];
  const contentContainer = document.querySelector('.content-container');

  if (!page || !contentContainer) {
    console.error(`Page "${pageName}" not found in pageConfig`);
    return;
  }

  fetch(page.path)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const mainContent = doc.querySelector("#content, main, .page-content");

      contentContainer.innerHTML = mainContent ? mainContent.innerHTML : html;
      document.title = page.title;

      // ✅ Run profile loader kapag nasa AdminAccountPage
      if (pageName === "AdminAccountPage") {
        console.log("👤 Initializing Admin Profile...");
        if (typeof loadAdminProfile === "function") {
          loadAdminProfile();
        } else {
          console.warn("⚠️ loadAdminProfile function not found");
        }
      }
    })
    .catch(err => {
      console.error(err);
      contentContainer.innerHTML = `<p>Error loading ${page.title}</p>`;
    });
}