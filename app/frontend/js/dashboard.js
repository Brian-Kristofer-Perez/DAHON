document.addEventListener("DOMContentLoaded", () => {
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
  
  // Create a function to sync the username between sidebar and welcome message
  function syncUserName() {
    if (sidebarUserName && welcomeUserName) {
      welcomeUserName.textContent = sidebarUserName.textContent;
    }
  }
  
  // Initial sync
  syncUserName();
  
  // Set up a MutationObserver to detect changes to the sidebar username
  if (sidebarUserName) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || 
            mutation.type === 'characterData' || 
            mutation.target.nodeType === Node.TEXT_NODE) {
          syncUserName();
        }
      });
    });
    
    observer.observe(sidebarUserName, { 
      childList: true,
      characterData: true,
      subtree: true 
    });
    
    // Also manually call syncUserName when the DOM is fully loaded,
    // in case the sidebar name was updated before our observer was attached
    window.addEventListener('load', syncUserName);
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
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  const diseaseCards = document.querySelectorAll('.disease-card');
  diseaseCards.forEach(card => {
    card.addEventListener('click', function () {
      const diseaseName = this.querySelector('.disease-name').textContent;
      showDiseaseDetails(diseaseName);
    });
  });

  const filterButton = document.querySelector('.btn-outline[data-action="filter"]');
  const sortButton = document.querySelector('.btn-outline[data-action="sort"]');

  if (filterButton) {
    filterButton.addEventListener('click', function () {
      showFilterOptions();
    });
  }

  if (sortButton) {
    sortButton.addEventListener('click', function () {
      showSortOptions();
    });
  }

  // New Scan button click handler
  const newScanBtn = document.getElementById("newScanBtn");
  if (newScanBtn) {
    newScanBtn.addEventListener("click", () => {
      window.location.href = "/capture";
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


/**
 * Set default user data if API call fails
 */
function setDefaultUserData() {
  const defaultName = "User";

  const welcomeUserNameElements = document.querySelectorAll("#welcomeUserName");
  welcomeUserNameElements.forEach((element) => {
    element.textContent = defaultName;
  });

  const sidebarUserName = document.querySelector('.sidebar-user-name');
  if (sidebarUserName) {
    sidebarUserName.textContent = defaultName;
  }

  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = defaultName;
  }
}

/**
 * Initialize recent scans section with navigation using real API data
 */
async function initRecentScans() {
  // Show loading state
  const scanContainer = document.querySelector(".recent-scans-grid")
  if (scanContainer) {
    scanContainer.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading recent scans...</div>'
  }

  try {
    // Get user ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('id')
    
    if (!userId) {
      throw new Error("User ID not found in URL parameters")
    }

    // Fetch recent scans from API
    const response = await fetch(`/api/get-recent-scans?user_id=${userId}&limit=8`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.scans || data.scans.length === 0) {
      if (scanContainer) {
        scanContainer.innerHTML = '<div class="no-scans-message">No recent scans found. Start scanning your plants to see them here.</div>'
      }
      return
    }
    
    // Process API data into format our UI needs
    const scans = data.scans.map(scan => {
      // Determine status based on disease
      let status = "healthy"
      if (scan.disease && scan.disease.toLowerCase() !== "healthy") {
        status = scan.disease.toLowerCase().includes("blight") || 
                scan.disease.toLowerCase().includes("rot") ? 
                "unhealthy" : "warning"
      }
      
      return {
        id: scan.id,
        plantName: scan.plant,
        status: status,
        disease: scan.disease,
        description: `${scan.disease} ${status === "healthy" ? "- No treatment needed" : "- Check treatment options"}`,
        image: scan.image, // The API already returns base64 encoded image
        date: scan.date,
        confidence: 95, // Placeholder as API doesn't return confidence
        location: "Garden" // Placeholder as API doesn't return location
      }
    })
    
    // Get all scan cards
    const scanCards = document.querySelectorAll(".scan-card")
    
    // If we have existing scan cards in the HTML, update them
    if (scanCards.length > 0) {
      scanCards.forEach((card, index) => {
        // Get the corresponding scan data or use first scan if index out of bounds
        const scanData = index < scans.length ? scans[index] : scans[0]
        
        // Update card data attributes
        card.setAttribute("data-plant", scanData.plantName)
        card.setAttribute("data-disease", scanData.disease)
        card.setAttribute("data-status", scanData.status)
        card.setAttribute("data-date", scanData.date)
        
        // Update card content
        const plantNameEl = card.querySelector(".plant-name")
        if (plantNameEl) plantNameEl.textContent = scanData.plantName
        
        const diseaseNameEl = card.querySelector(".disease-name")
        if (diseaseNameEl) diseaseNameEl.textContent = scanData.disease
        
        const dateEl = card.querySelector(".scan-date")
        if (dateEl) {
          const scanDate = new Date(scanData.date)
          dateEl.textContent = scanDate.toLocaleDateString()
        }
        
        const confidenceEl = card.querySelector(".confidence-value")
        if (confidenceEl) confidenceEl.textContent = `${scanData.confidence}%`
        
        const statusIndicator = card.querySelector(".status-indicator")
        if (statusIndicator) {
          statusIndicator.className = `status-indicator ${scanData.status}`
        }
        
        const cardImage = card.querySelector(".scan-card-image img")
        if (cardImage && scanData.image) {
          cardImage.src = scanData.image
          cardImage.alt = `${scanData.plantName} - ${scanData.disease}`
        }
        
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
    } else if (scanContainer) {
      // If no cards exist in the DOM, create them from API data
      scanContainer.innerHTML = '' // Clear loading indicator
      
      console.log("scans", scans)
      // Create cards for each scan
      scans.forEach(scan => {
        const scanDate = new Date(scan.date)
        const formattedDate = scanDate.toLocaleDateString()
        
        const scanCard = document.createElement('div')
        scanCard.className = 'scan-card'
        scanCard.setAttribute('data-plant', scan.plantName)
        scanCard.setAttribute('data-disease', scan.disease)
        scanCard.setAttribute('data-status', scan.status)
        scanCard.setAttribute('data-date', scan.date)
        scanCard.setAttribute('tabindex', '0')
        scanCard.setAttribute('aria-label', `Scan of ${scan.plantName} - Status: ${scan.status === "healthy" ? "Healthy" : scan.disease}`)
        
        scanCard.innerHTML = `
          <div class="scan-image">
            <img src="${scan.image}" alt="${scan.plantName} - ${scan.disease}">
            <div class="status-indicator ${scan.status}"></div>
          </div>
          <div class="scan-card-content">
            <h3 class="plant-name">${scan.plantName}</h3>
            <p class="disease-name">${scan.disease}</p>
            <div class="scan-meta">
              <span class="scan-date">${formattedDate}</span>
            </div>
            <button class="btn btn-view-details">View Details</button>
          </div>
        `
        
        scanContainer.appendChild(scanCard)
        
        // Make the entire card clickable
        scanCard.style.cursor = "pointer"
        
        // Add click event to the entire card
        scanCard.addEventListener("click", (e) => {
          if (
            e.target.tagName === "BUTTON" ||
            e.target.tagName === "A" ||
            e.target.closest("button") ||
            e.target.closest("a")
          ) {
            return
          }
          
          // Navigate to scan details
          goToScanDetails(scan)
        })
        
        // Also make the "View Details" button work
        const viewDetailsBtn = scanCard.querySelector(".btn-view-details")
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener("click", (e) => {
            e.stopPropagation() // Prevent triggering the card's click event
            goToScanDetails(scan)
          })
        }
      })
    }
    
    // Enhance scan cards with hover effects
    const allCards = document.querySelectorAll('.scan-card')
    allCards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)'
      })
      
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)'
      })
    })
    
  } catch (error) {
    console.error("Error fetching recent scans:", error)
    showNotification("Failed to load recent scans. Using demo data instead.", "error")
    
    // If API call fails, fall back to mock data
    useMockDataFallback()
  }
    // Simple function to navigate to scan details using proper routing
  function goToScanDetails(scanData) {
    try {
      console.log(`Navigating to scan details for ${scanData.plantName} with ${scanData.disease}`)
      
      // Get user ID from URL parameter
      const urlParams = new URLSearchParams(window.location.search)
      const userId = urlParams.get('id')
      
      if (!userId) {
        throw new Error("User ID not found in URL parameters")
      }
      
      // Navigate to plant-details route with both user ID and scan ID as URL parameters
      window.location.href = `/plant-details?id=${userId}&scan_id=${scanData.id}`
    } catch (error) {
      console.error("Navigation error:", error)
      
      // If there's an error with parameters, fall back to localStorage approach
      try {
        localStorage.setItem("scanData", JSON.stringify(scanData))
        window.location.href = "scan-details.html"
      } catch (fallbackError) {
        // If even localStorage fails, just navigate to scan-details page
        console.error("Fallback navigation error:", fallbackError)
        window.location.href = "scan-details.html"
      }
    }
  }
  
  // Fallback to mock data if API fails
  function useMockDataFallback() {
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
    
    // Get container
    const scanContainer = document.querySelector(".recent-scans-grid")
    
    // Clear loading message if it exists
    if (scanContainer) {
      scanContainer.innerHTML = ''
    }
    
    // Get all scan cards
    const scanCards = document.querySelectorAll(".scan-card")
    
    // If we have existing cards, update them
    if (scanCards.length > 0) {
      scanCards.forEach((card, index) => {
        const scanData = mockScans[index % mockScans.length]
        
        // Update card data
        card.setAttribute("data-plant", scanData.plantName)
        card.setAttribute("data-disease", scanData.disease)
        card.setAttribute("data-status", scanData.status)
        card.setAttribute("data-date", scanData.date)
        
        const plantNameEl = card.querySelector(".plant-name")
        if (plantNameEl) plantNameEl.textContent = scanData.plantName
        
        const diseaseNameEl = card.querySelector(".disease-name")
        if (diseaseNameEl) diseaseNameEl.textContent = scanData.disease
        
        const dateEl = card.querySelector(".scan-date")
        if (dateEl) {
          const scanDate = new Date(scanData.date)
          dateEl.textContent = scanDate.toLocaleDateString()
        }
        
        // Make the entire card clickable
        card.style.cursor = "pointer"
        
        // Add click event
        card.addEventListener("click", (e) => {
          if (
            e.target.tagName === "BUTTON" ||
            e.target.tagName === "A" ||
            e.target.closest("button") ||
            e.target.closest("a")
          ) {
            return
          }
          goToScanDetails(scanData)
        })
        
        const viewDetailsBtn = card.querySelector(".btn-view-details")
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            goToScanDetails(scanData)
          })
        }
      })
    } else if (scanContainer) {
      // Create cards from mock data
      mockScans.forEach(scan => {
        const scanDate = new Date(scan.date)
        const formattedDate = scanDate.toLocaleDateString()
        
        const scanCard = document.createElement('div')
        scanCard.className = 'scan-card'
        scanCard.setAttribute('data-plant', scan.plantName)
        scanCard.setAttribute('data-disease', scan.disease)
        scanCard.setAttribute('data-status', scan.status)
        scanCard.setAttribute('data-date', scan.date)
        scanCard.setAttribute('tabindex', '0')
        
        scanCard.innerHTML = `
          <div class="scan-card-image">
            <img src="${scan.image}" alt="${scan.plantName} - ${scan.disease}">
            <div class="status-indicator ${scan.status}"></div>
          </div>
          <div class="scan-card-content">
            <h3 class="plant-name">${scan.plantName}</h3>
            <p class="disease-name">${scan.disease}</p>
            <div class="scan-meta">
              <span class="scan-date">${formattedDate}</span>
              <span class="confidence">
                <span class="confidence-label">Confidence:</span>
                <span class="confidence-value">${scan.confidence}%</span>
              </span>
            </div>
            <button class="btn btn-view-details">View Details</button>
          </div>
        `
        
        scanContainer.appendChild(scanCard)
        
        // Add click events
        scanCard.style.cursor = "pointer"
        
        scanCard.addEventListener("click", (e) => {
          if (
            e.target.tagName === "BUTTON" ||
            e.target.tagName === "A" ||
            e.target.closest("button") ||
            e.target.closest("a")
          ) {
            return
          }
          goToScanDetails(scan)
        })
        
        const viewDetailsBtn = scanCard.querySelector(".btn-view-details")
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            goToScanDetails(scan)
          })
        }
      })
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
  closeButton.addEventListener('click', function () {
    modal.remove();
  });

  // Close modal when clicking outside
  modal.addEventListener('click', function (e) {
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
  applyButton.addEventListener('click', function () {
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
  applyButton.addEventListener('click', function () {
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
