import { Chart } from "@/components/ui/chart"

document.addEventListener("DOMContentLoaded", () => {
  // ===== Sidebar Functionality =====
  initSidebar()

  // ===== User Data =====
  fetchUserData()

  // ===== Recent Scans Navigation =====
  initRecentScans()

  // ===== Dashboard Stats =====
  fetchDashboardStats()

  // ===== Disease List Interaction =====
  initDiseaseList()

  // ===== Accessibility Enhancements =====
  enhanceAccessibility()

  // Update welcome message with user's name
  const welcomeUserName = document.getElementById('welcomeUserName');
  const sidebarUserName = document.querySelector('.sidebar-user-name');
  
  // Get user name from sidebar and update welcome message
  if (sidebarUserName && welcomeUserName) {
    welcomeUserName.textContent = sidebarUserName.textContent;
  }

  // Update health meter animation
  const healthMeterFill = document.querySelector('.health-meter-fill');
  if (healthMeterFill) {
    setTimeout(() => {
      healthMeterFill.style.width = '75%';
    }, 500);
  }

  // Update activity stats
  const totalScans = document.getElementById('totalScans');
  const lastScan = document.getElementById('lastScan');
  
  if (totalScans) {
    animateValue(totalScans, 0, 75, 2000);
  }
  
  if (lastScan) {
    animateValue(lastScan, 0, 2, 1000);
  }

  // Update plant status counts
  const plantStatusCounts = {
    healthy: document.getElementById('healthyPlants'),
    warning: document.getElementById('warningPlants'),
    critical: document.getElementById('criticalPlants'),
    treated: document.getElementById('treatedPlants')
  };

  const plantStatusValues = {
    healthy: 46,
    warning: 15,
    critical: 5,
    treated: 24
  };

  Object.entries(plantStatusCounts).forEach(([status, element]) => {
    if (element) {
      animateValue(element, 0, plantStatusValues[status], 2000);
    }
  });

  // Add hover effects to scan cards
  const scanCards = document.querySelectorAll('.scan-card');
  scanCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  const diseaseCards = document.querySelectorAll('.disease-card');
  diseaseCards.forEach(card => {
    card.addEventListener('click', function() {
      const diseaseName = this.querySelector('.disease-name').textContent;
      showDiseaseDetails(diseaseName);
    });
  });

  const filterButton = document.querySelector('.btn-outline[data-action="filter"]');
  const sortButton = document.querySelector('.btn-outline[data-action="sort"]');

  if (filterButton) {
    filterButton.addEventListener('click', function() {
      showFilterOptions();
    });
  }

  if (sortButton) {
    sortButton.addEventListener('click', function() {
      showSortOptions();
    });
  }

  // New Scan button click handler
  const newScanBtn = document.getElementById("newScanBtn");
  if (newScanBtn) {
    newScanBtn.addEventListener("click", () => {
      window.location.href = "capture.html";
    });
  }

  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("mobile-active");
      sidebarOverlay.classList.add("active");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("mobile-active");
      sidebarOverlay.classList.remove("active");
    });
  }
})

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

/**
 * Get and display user data
 */
function fetchUserData() {
  try {
    // replace with actual API call, here are samples from chatgpt
    // const response = await fetch('/api/user/profile');
    // const userData = await response.json();

    // Simulate API call for demon
    const userData = {
      firstName: "Johnathan",
      role: "Plant Enthusiast",
    }

    const welcomeUserNameElements = document.querySelectorAll("#welcomeUserName")
    welcomeUserNameElements.forEach((element) => {
      element.textContent = userData.firstName
    })

    const userNameElement = document.getElementById("userName")
    if (userNameElement) {
      userNameElement.textContent = userData.firstName
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    //default values as fallback just incase (source: chatgpt)
  }
}

// Replace the entire initRecentScans function with this simplified version
/**
 * Initialize recent scans section with navigation
 */
function initRecentScans() {
  // Mock scan data for demonstration
  const mockScans = [
    {
      id: 1,
      plantName: "Tomato Plant",
      status: "healthy",
      disease: "Healthy",
      description: "Healthy plant with no signs of disease",
      image: "assets/plant/tomato.jpg",
      date: "2023-06-15T10:30:00Z",
      confidence: 98,
      location: "Home Garden",
    },
    {
      id: 2,
      plantName: "Potato Plant",
      status: "unhealthy",
      disease: "Late Blight",
      description: "Late Blight detected - requires immediate treatment",
      image: "assets/plant/potato.jpg",
      date: "2023-06-14T14:45:00Z",
      confidence: 95,
      location: "Home Garden",
    },
    {
      id: 3,
      plantName: "Tomato Plant",
      status: "healthy",
      disease: "Healthy",
      description: "Healthy plant with no signs of disease",
      image: "assets/plant/tomato.jpg",
      date: "2023-06-13T09:15:00Z",
      confidence: 97,
      location: "Backyard",
    },
    {
      id: 4,
      plantName: "Apple Tree",
      status: "warning",
      disease: "Powdery Mildew",
      description: "Powdery Mildew detected - early stage",
      image: "assets/plant/apple.jpg",
      date: "2023-06-12T16:20:00Z",
      confidence: 89,
      location: "Orchard",
    },
  ]

  // Get all scan cards
  const scanCards = document.querySelectorAll(".scan-card")

  // Add click event to each card
  scanCards.forEach((card, index) => {
    // Get the corresponding scan data
    const scanData = mockScans[index % mockScans.length]

    // Make the entire card clickable
    card.style.cursor = "pointer"

    // Add click event to the entire card
    card.addEventListener("click", (e) => {
      // Don't navigate if clicking on a button or link
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A" ||
        e.target.closest("button") ||
        e.target.closest("a")
      ) {
        return
      }

      // Navigate to scan details
      goToScanDetails(scanData)
    })

    // Also make the "View Details" button work
    const viewDetailsBtn = card.querySelector(".btn-view-details")
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent triggering the card's click event
        goToScanDetails(scanData)
      })
    }
  })

  // Simple function to navigate to scan details
  function goToScanDetails(scanData) {
    try {
      console.log(`Navigating to scan details for ${scanData.plantName} with ${scanData.disease}`)

      // Store data in localStorage for retrieval on details page
      localStorage.setItem("scanData", JSON.stringify(scanData))

      // Navigate immediately
      window.location.href = "scan-details.html"
    } catch (error) {
      console.error("Navigation error:", error)
      // Force navigation even if storage fails
      window.location.href = "scan-details.html"
    }
  }
}


function fetchDashboardStats() {
  try {
    // replace with actual API call
    // const response = await fetch('/api/dashboard/stats');
    // const data = await response.json();

    // Simulate API response for demon
    const data = {
      totalScans: 75,
      lastScan: 2,
      healthyPlants: 46,
      healthyPlantsChange: -0.03,
      warningPlants: 15,
      warningPlantsChange: 15.03,
      criticalPlants: 5,
      criticalPlantsChange: 2.5,
      treatedPlants: 24,
      treatedPlantsChange: 8.5,
    }

    // Update dashboard stats
    updateElementText("totalScans", data.totalScans)
    updateElementText("lastScan", data.lastScan)
    updateElementText("healthyPlants", data.healthyPlants)
    updateElementText("warningPlants", data.warningPlants)
    updateElementText("criticalPlants", data.criticalPlants)
    updateElementText("treatedPlants", data.treatedPlants)

    // Update trend indicators
    updateTrendIndicator("healthyPlantsChange", data.healthyPlantsChange)
    updateTrendIndicator("warningPlantsChange", data.warningPlantsChange)
    updateTrendIndicator("criticalPlantsChange", data.criticalPlantsChange)
    updateTrendIndicator("treatedPlantsChange", data.treatedPlantsChange)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // If API fails, use some data
  }

  // Helper function to update element text
  function updateElementText(elementId, value) {
    const element = document.getElementById(elementId)
    if (element) {
      element.textContent = value
    }
  }

  // Helper function to update trend indicators
  function updateTrendIndicator(elementId, changeValue) {
    const element = document.getElementById(elementId)
    if (!element) return

    const isPositive = changeValue > 0

    element.innerHTML = `
      <i class="fas fa-arrow-${isPositive ? "up" : "down"}"></i>
      <span>${Math.abs(changeValue).toFixed(2)}%</span>
    `

    if (isPositive) {
      element.classList.add("positive")
    } else {
      element.classList.remove("positive")
    }
  }
}

function initDiseaseList() {
  const diseaseItems = document.querySelectorAll(".disease-item")
  diseaseItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(8px)"
      this.style.backgroundColor = "var(--color-gray-100)"
    })

    item.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.backgroundColor = ""
    })

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const diseaseName = this.querySelector(".disease-name").textContent
        alert(`Disease details for ${diseaseName} would be displayed here.`)
      }
    })
  })
}

function enhanceAccessibility() {
  const interactiveElements = document.querySelectorAll(".scan-card, .disease-card, .sidebar-menu-item")
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0")
    }

    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        element.click()
      }
    })
  })

  // Addlabels
  document.querySelectorAll(".scan-card").forEach((card) => {
    const plantName = card.getAttribute("data-plant") || "Unknown plant"
    const disease = card.getAttribute("data-disease") || "Unknown condition"
    const status = card.getAttribute("data-status") || "unknown"
    card.setAttribute("aria-label", `Scan of ${plantName} - Status: ${status === "healthy" ? "Healthy" : disease}`)
  })
}


function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.setAttribute("role", "alert")
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}" aria-hidden="true"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" aria-label="Close notification">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
  `

  // Style notification
  Object.assign(notification.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: type === "error" ? "#ff3d00" : "#2979ff",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: "1000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "300px",
    animation: "fadeIn 0.3s ease-out",
  })

  // Add to document
  document.body.appendChild(notification)

  // Add close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "fadeOut 0.3s ease-in forwards"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  })

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = "fadeOut 0.3s ease-in forwards"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }
  }, 5000)
}

// Helper function to animate numeric values
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Show disease details modal
function showDiseaseDetails(diseaseName) {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${diseaseName}</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Loading disease information...</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add close handler
  const closeButton = modal.querySelector('.close-modal');
  closeButton.addEventListener('click', function() {
    modal.remove();
  });

  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Show filter options
function showFilterOptions() {
  const filterOptions = document.createElement('div');
  filterOptions.className = 'filter-options';
  filterOptions.innerHTML = `
    <div class="filter-content">
      <h3>Filter Options</h3>
      <div class="filter-group">
        <label>
          <input type="checkbox" name="status" value="healthy"> Healthy
        </label>
        <label>
          <input type="checkbox" name="status" value="warning"> Warning
        </label>
        <label>
          <input type="checkbox" name="status" value="critical"> Critical
        </label>
      </div>
      <button class="btn btn-primary apply-filter">Apply</button>
    </div>
  `;

  document.body.appendChild(filterOptions);

  // Add apply filter handler
  const applyButton = filterOptions.querySelector('.apply-filter');
  applyButton.addEventListener('click', function() {
    const selectedFilters = Array.from(filterOptions.querySelectorAll('input:checked'))
      .map(input => input.value);
    applyFilters(selectedFilters);
    filterOptions.remove();
  });
}

// Show sort options
function showSortOptions() {
  const sortOptions = document.createElement('div');
  sortOptions.className = 'sort-options';
  sortOptions.innerHTML = `
    <div class="sort-content">
      <h3>Sort Options</h3>
      <div class="sort-group">
        <label>
          <input type="radio" name="sort" value="date"> Date
        </label>
        <label>
          <input type="radio" name="sort" value="status"> Status
        </label>
        <label>
          <input type="radio" name="sort" value="name"> Name
        </label>
      </div>
      <button class="btn btn-primary apply-sort">Apply</button>
    </div>
  `;

  document.body.appendChild(sortOptions);

  // Add apply sort handler
  const applyButton = sortOptions.querySelector('.apply-sort');
  applyButton.addEventListener('click', function() {
    const selectedSort = sortOptions.querySelector('input:checked').value;
    applySort(selectedSort);
    sortOptions.remove();
  });
}

// Apply filters
function applyFilters(filters) {
  const scanCards = document.querySelectorAll('.scan-card');
  scanCards.forEach(card => {
    const status = card.dataset.status;
    if (filters.length === 0 || filters.includes(status)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Apply sort
function applySort(sortBy) {
  const scanCards = document.querySelectorAll('.scan-card');
  const cardsArray = Array.from(scanCards);
  
  cardsArray.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.dataset.date) - new Date(a.dataset.date);
      case 'status':
        const statusOrder = { critical: 0, warning: 1, healthy: 2 };
        return statusOrder[a.dataset.status] - statusOrder[b.dataset.status];
      case 'name':
        return a.dataset.plant.localeCompare(b.dataset.plant);
      default:
        return 0;
    }
  });

  const container = document.querySelector('.recent-scans-grid');
  cardsArray.forEach(card => {
    container.appendChild(card);
  });
}
