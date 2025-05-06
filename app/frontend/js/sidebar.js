document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    // Store userId in localStorage if it exists in the URL
    if (userId) {
        localStorage.setItem("userId", userId);
    }

    // Initialize sidebar functionality
    initSidebar();

    // fetches user data
    fetchUserData()   
    
    // Update sidebar links with user ID parameter
    updateSidebarLinks(userId);

    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');

    // Check localStorage for saved sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
        const icon = sidebarToggle.querySelector('i');
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    }

    // Toggle sidebar on desktop
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        
        // Update toggle icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    });

    // Toggle sidebar on mobile
    mobileSidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            const icon = sidebarToggle.querySelector('i');
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
            // Don't save collapsed state on mobile
            localStorage.removeItem('sidebarCollapsed');
        } else {
            // Restore saved state on desktop
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
                const icon = sidebarToggle.querySelector('i');
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
            }
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Update active menu item based on current page
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });
});

/**
 * Update all sidebar links to include the user ID parameter from the URL or localStorage
 * @param {string} passedUserId - User ID passed from the calling function
 */
function updateSidebarLinks(userId) {
  const sidebarLinks = document.querySelectorAll('.sidebar-menu-item');
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip empty hrefs, login/logout links, or links already containing the user ID
    if (!href || href === '/login' || href.includes('id=' + userId)) {
      return;
    }
    
    // Parse the URL to handle existing query parameters
    try {
      const url = new URL(href, window.location.origin);
      
      // Add the user ID to the query parameters
      url.searchParams.set('id', userId);
      
      // Update the href with the new URL that includes the user ID
      link.setAttribute('href', url.pathname + url.search);
      
    } catch (error) {
      console.error(`Error updating sidebar link ${href}:`, error);
    }
  });
}

/**
 * Get and display user data from the API using the user ID from URL
 */
function fetchUserData() {
  try {
    // Get user ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
      console.error("No user ID found in URL parameters");
      return;
    }

    // Store user ID in localStorage for use in other pages
    localStorage.setItem("userId", userId);

    // Fetch user data from the API
    fetch(`/api/get-user?id=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then(userData => {
        // Update UI with user data
        const sidebarUserName = document.querySelector('.sidebar-user-name');
        if (sidebarUserName) {
          sidebarUserName.textContent = userData.first_name;
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        // Fall back to default values if API fails
        setDefaultUserData();
      });
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    setDefaultUserData();
  }
}

function initSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle")
  const sidebarOverlay = document.getElementById("sidebarOverlay")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar-collapsed")

      if (sidebar.classList.contains("sidebar-collapsed")) {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>'
      } else {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>'
      }
    })
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("mobile-open")
      sidebarOverlay.classList.add("active")
    })
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open")
      sidebarOverlay.classList.remove("active")
    })
  }

  function handleResponsiveLayout() {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("sidebar-collapsed")
      if (sidebarToggle) {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>'
      }
    }
  }

  handleResponsiveLayout()
  window.addEventListener("resize", handleResponsiveLayout)
}