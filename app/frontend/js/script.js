document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")

      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.style.color = "var(--text-dark)"
      })

      document.querySelectorAll(".auth-buttons .btn-outline").forEach((btn) => {
        btn.style.color = "var(--primary-color)"
        btn.style.borderColor = "var(--primary-color)"
      })

      document.querySelectorAll(".mobile-menu-toggle span").forEach((span) => {
        span.style.backgroundColor = "var(--text-dark)"
      })

      const logoText = document.querySelector(".logo a span")
      if (logoText) {
        logoText.style.color = "var(--text-dark)"
      }
    } else {
      header.classList.remove("scrolled")

      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.style.color = "var(--text-light)"
      })

      document.querySelectorAll(".auth-buttons .btn-outline").forEach((btn) => {
        btn.style.color = "var(--text-light)"
        btn.style.borderColor = "var(--text-light)"
      })

      document.querySelectorAll(".mobile-menu-toggle span").forEach((span) => {
        span.style.backgroundColor = "var(--text-light)"
      })

      const logoText = document.querySelector(".logo a span")
      if (logoText) {
        logoText.style.color = "var(--text-light)"
      }
    }
  })

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const navLinks = document.querySelector(".nav-links")
  const authButtons = document.querySelector(".auth-buttons")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active")

      if (this.classList.contains("active")) {
        const mobileMenu = document.createElement("div")
        mobileMenu.className = "mobile-menu"

        const navLinksClone = navLinks.cloneNode(true)
        const authButtonsClone = authButtons.cloneNode(true)

        mobileMenu.appendChild(navLinksClone)
        mobileMenu.appendChild(authButtonsClone)

        document.body.appendChild(mobileMenu)
        document.body.style.overflow = "hidden"

        setTimeout(() => {
          mobileMenu.classList.add("active")
        }, 10)
      } else {
        const mobileMenu = document.querySelector(".mobile-menu")
        if (mobileMenu) {
          mobileMenu.classList.remove("active")

          setTimeout(() => {
            document.body.removeChild(mobileMenu)
            document.body.style.overflow = ""
          }, 300)
        }
      }
    })
  }

  function initCategoryCarousel() {
    const slider = document.getElementById("categorySlider")
    const prevBtn = document.getElementById("prevCategory")
    const nextBtn = document.getElementById("nextCategory")
    const dotsContainer = document.getElementById("categoryDots")
    const progressBar = document.getElementById("carouselProgress")

    if (!slider || !prevBtn || !nextBtn || !dotsContainer) return

    const cards = slider.querySelectorAll(".category-card")
    if (cards.length === 0) return

    cards.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("slider-dot")
      if (index === 0) dot.classList.add("active")
      dot.dataset.index = index
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })

    const dots = dotsContainer.querySelectorAll(".slider-dot")

    let activeIndex = 0
    let isAnimating = false

    function getCardsToShow() {
      if (window.innerWidth >= 1200) return 4
      if (window.innerWidth >= 992) return 3
      if (window.innerWidth >= 768) return 2
      return 1
    }

    function updateCardWidths() {
      const cardsToShow = getCardsToShow()
      const cardWidth = 100 / cardsToShow
      const cardGap = 30 
      const containerWidth = slider.offsetWidth
      const gapPercentage = ((cardGap * (cardsToShow - 1)) / containerWidth) * 100

      const actualCardWidth = (100 - gapPercentage) / cardsToShow

      cards.forEach((card) => {
        card.style.flex = `0 0 ${actualCardWidth}%`
      })
    }

    window.addEventListener("resize", updateCardWidths)

    updateCardWidths()

    function goToSlide(index) {
      if (isAnimating) return
      isAnimating = true

      if (index < 0) {
        index = cards.length - getCardsToShow()
      } else if (index > cards.length - getCardsToShow()) {
        index = 0
      }

      activeIndex = index
      updateActiveDot()

      const cardsToShow = getCardsToShow()
      const cardWidth = slider.querySelector(".category-card").offsetWidth
      const cardGap = 30 // Gap between cards in pixels
      const scrollLeft = index * (cardWidth + cardGap)

      slider.style.transition = "transform 0.5s ease"
      slider.style.transform = `translateX(-${scrollLeft}px)`

      setTimeout(() => {
        isAnimating = false
      }, 500)

      updateProgressBar()
    }

    function updateProgressBar() {
      if (progressBar) {
        const maxIndex = cards.length - getCardsToShow()
        const progress = (activeIndex / maxIndex) * 100
        progressBar.style.width = `${progress}%`
      }
    }

    function updateActiveDot() {
      dots.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("active")
        } else {
          dot.classList.remove("active")
        }
      })
    }

    prevBtn.addEventListener("click", () => {
      if (isAnimating) return
      activeIndex--
      goToSlide(activeIndex)
    })

    nextBtn.addEventListener("click", () => {
      if (isAnimating) return
      activeIndex++
      goToSlide(activeIndex)
    })

    let touchStartX = 0
    let touchEndX = 0

    slider.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    slider.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    })

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextBtn.click()
      } else if (touchEndX > touchStartX + 50) {
        prevBtn.click()
      }
    }

    let autoScrollInterval

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        activeIndex++
        goToSlide(activeIndex)
      }, 5000)
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval)
    }

    startAutoScroll()

    slider.addEventListener("mouseenter", stopAutoScroll)
    slider.addEventListener("touchstart", stopAutoScroll)

    slider.addEventListener("mouseleave", startAutoScroll)
    slider.addEventListener("touchend", startAutoScroll)

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevBtn.click()
      } else if (e.key === "ArrowRight") {
        nextBtn.click()
      }
    })

    goToSlide(0)
    updateProgressBar()
  }

  initCategoryCarousel()

  // FAQ functionality
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      // Close other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item with animation
      item.classList.toggle("active")
    })
  })

  // Team cards hover effect enhancement
  const teamCards = document.querySelectorAll(".team-card")

  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Add a subtle scale effect to other cards
      teamCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.style.opacity = "0.7"
        }
      })
    })

    card.addEventListener("mouseleave", () => {
      // Reset all cards
      teamCards.forEach((otherCard) => {
        otherCard.style.opacity = ""
      })
    })
  })

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    })
  })

  // Enhanced plant card hover effect
  const plantCards = document.querySelectorAll(".plant-card")

  plantCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.zIndex = "1"
    })

    card.addEventListener("mouseleave", () => {
      card.style.zIndex = ""
    })
  })

  const sections = document.querySelectorAll("section[id]")
  const navItems = document.querySelectorAll(".nav-links a")

  function setActiveNavItem() {
    const scrollPosition = window.scrollY + 100

    if (scrollPosition < 150) {
      navItems.forEach((item) => {
        item.classList.remove("active")
        if (item.getAttribute("href") === "#" || item.getAttribute("href") === "#home") {
          item.classList.add("active")
        }
      })
      return
    }

    let currentSection = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = sectionId
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      const href = item.getAttribute("href")
      if (href === `#${currentSection}` || (href === "#" && currentSection === "home")) {
        item.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", setActiveNavItem)
  window.addEventListener("load", setActiveNavItem)

  // Scroll reveal animation
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".fade-in")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 50) {
        element.classList.add("animate")
      }
    })
  }

  // Add fade-in class to elements that should animate on scroll
  const addFadeInClass = () => {
    document.querySelectorAll(".category-card, .plant-card, .team-card, .faq-item, .team-intro").forEach((el) => {
      el.classList.add("fade-in")
    })
  }

  // Initialize animations
  addFadeInClass()
  animateOnScroll()
  window.addEventListener("scroll", animateOnScroll)

  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY
      if (scrollPosition < window.innerHeight) {
        const leaves = document.querySelectorAll(".leaf")
        leaves.forEach((leaf, index) => {
          const speed = 0.2 + index * 0.1
          leaf.style.transform = `translateY(${scrollPosition * speed}px)`
        })
      }
    })
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector(".newsletter-input")

      if (emailInput && emailInput.value) {
        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "newsletter-success"
        successMessage.textContent = "Thank you for subscribing to our newsletter!"
        successMessage.style.color = "#4caf50"
        successMessage.style.fontWeight = "600"
        successMessage.style.marginTop = "10px"

        // Remove any existing message
        const existingMessage = newsletterForm.querySelector(".newsletter-success")
        if (existingMessage) {
          newsletterForm.removeChild(existingMessage)
        }

        newsletterForm.appendChild(successMessage)
        emailInput.value = ""

        // Remove message after 3 seconds
        setTimeout(() => {
          if (successMessage.parentNode === newsletterForm) {
            newsletterForm.removeChild(successMessage)
          }
        }, 3000)
      }
    })
  }
})

// hero section animations
function enhanceHeroSection() {
  const heroText = document.querySelector(".hero-text")
  const heroVisual = document.querySelector(".hero-visual")

  if (heroText && heroVisual) {
    // Add parallax effect on scroll
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY
      const translateY = scrollY * 0.3

      heroText.style.transform = `translateY(${translateY * 0.2}px)`
      heroVisual.style.transform = `translateY(${-translateY * 0.1}px)`
    })

    const heroButtons = document.querySelectorAll(".hero-buttons .btn")
    heroButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-5px) scale(1.05)"
      })

      button.addEventListener("mouseleave", () => {
        button.style.transform = ""
      })
    })

    // glow effect to hero title on hover
    const heroTitle = document.querySelector(".hero-title")
    if (heroTitle) {
      heroTitle.addEventListener("mouseenter", () => {
        heroTitle.style.textShadow = "0 0 15px rgba(255, 255, 255, 0.5)"
      })

      heroTitle.addEventListener("mouseleave", () => {
        heroTitle.style.textShadow = ""
      })
    }
  }
}

// Initialize hero enhancements
enhanceHeroSection()

// Image optimization and loading
document.addEventListener("DOMContentLoaded", () => {
  // Lazy load images with IntersectionObserver
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = img.getAttribute("data-src")

            if (src) {
              img.src = src
              img.removeAttribute("data-src")
              img.classList.add("loaded")
            }

            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    )

    // Observe all images with data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.getAttribute("data-src")
      img.removeAttribute("data-src")
    })
  }

  // Handle image loading errors
  document.querySelectorAll(".category-image img").forEach((img) => {
    img.addEventListener("error", function () {
      // Replace with a placeholder if image fails to load
      this.src = "images/placeholder-category.jpg"
      this.alt = "Category image placeholder"

      this.closest(".category-image").classList.add("image-error")
    })
  })
})

function adjustCategoryCardHeights() {
  const categoryCards = document.querySelectorAll(".category-card")

  categoryCards.forEach((card) => {
    card.style.height = "auto"
  })

  if (window.innerWidth >= 768) {
    let maxHeight = 0
    categoryCards.forEach((card) => {
      const cardHeight = card.offsetHeight
      if (cardHeight > maxHeight) {
        maxHeight = cardHeight
      }
    })

    categoryCards.forEach((card) => {
      card.style.height = `${maxHeight + 20}px` 
    })
  }
}

window.addEventListener("load", adjustCategoryCardHeights)
window.addEventListener("resize", adjustCategoryCardHeights)

function checkTextOverflow() {
  const descriptions = document.querySelectorAll(".category-content p")

  descriptions.forEach((desc) => {
    const style = window.getComputedStyle(desc)

    const isOverflowing = desc.scrollHeight > desc.clientHeight

    if (isOverflowing) {
      const currentSize = Number.parseFloat(style.fontSize)
      desc.style.fontSize = `${currentSize * 0.95}px`
    }
  })
}

window.addEventListener("load", () => {
  setTimeout(checkTextOverflow, 100) // Small delay to ensure content is rendered
})

document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll(".category-card")

  categoryCards.forEach((card) => {
    const link = card.querySelector(".card-link")
    const title = card.querySelector("h3").textContent

    if (link) {
      link.setAttribute("title", `View details about ${title}`)

      link.addEventListener("focus", () => {
        card.classList.add("keyboard-focus")
      })

      link.addEventListener("blur", () => {
        card.classList.remove("keyboard-focus")
      })
    }
  })
})
