document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = this.parentElement.querySelector("input")
      const eyeIcon = this.querySelector(".eye-icon")
      const eyeOffIcon = this.querySelector(".eye-off-icon")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        eyeIcon.classList.add("hidden")
        eyeOffIcon.classList.remove("hidden")
      } else {
        passwordInput.type = "password"
        eyeIcon.classList.remove("hidden")
        eyeOffIcon.classList.add("hidden")
      }
    })
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active")
      this.setAttribute("aria-expanded", this.classList.contains("active"))

      // Create or toggle mobile menu
      let mobileMenu = document.querySelector(".mobile-menu")

      if (!mobileMenu) {
        // Create mobile menu
        mobileMenu = document.createElement("div")
        mobileMenu.className = "mobile-menu"

        const navList = document.querySelector(".main-nav ul").cloneNode(true)
        const authLinks = document.querySelector(".auth-links").cloneNode(true)

        mobileMenu.appendChild(navList)
        mobileMenu.appendChild(authLinks)

        // Add to body
        document.body.appendChild(mobileMenu)
        document.body.style.overflow = "hidden"

        // Animation
        setTimeout(() => {
          mobileMenu.classList.add("active")
        }, 10)
      } else {
        // Toggle existing mobile menu
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active")

          // Wait for animation to complete
          setTimeout(() => {
            document.body.removeChild(mobileMenu)
            document.body.style.overflow = ""
          }, 300)
        } else {
          mobileMenu.classList.add("active")
          document.body.style.overflow = "hidden"
        }
      }
    })
  }

  // Form validation
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  // Password strength checker
  const passwordInput = document.getElementById("password")
  if (passwordInput) {
    const passwordStrength = document.getElementById("passwordStrength")

    if (passwordStrength) {
      passwordInput.addEventListener("input", function () {
        const password = this.value

        if (password.length > 0) {
          passwordStrength.classList.add("active")

          // Calculate password strength
          const strength = calculatePasswordStrength(password)

          // Update strength meter
          updateStrengthMeter(strength)
        } else {
          passwordStrength.classList.remove("active")
        }
      })
    }
  }

  // Login form validation
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true

      // Email validation
      const email = document.getElementById("email")
      const emailError = document.getElementById("emailError")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!email.value.trim()) {
        setError(email, emailError, "Email is required")
        isValid = false
      } else if (!emailRegex.test(email.value.trim())) {
        setError(email, emailError, "Please enter a valid email address")
        isValid = false
      } else {
        setSuccess(email, emailError)
      }

      // Password validation
      const password = document.getElementById("password")
      const passwordError = document.getElementById("passwordError")

      if (!password.value.trim()) {
        setError(password, passwordError, "Password is required")
        isValid = false
      } else if (password.value.length < 6) {
        setError(password, passwordError, "Password must be at least 6 characters")
        isValid = false
      } else {
        setSuccess(password, passwordError)
      }

      // If form is valid, submit
      if (isValid) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.innerHTML
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="loading-indicator"></span> Logging in...'

        // Create form data
        const formData = new FormData()
        formData.append("email", email.value.trim())
        formData.append("password", password.value)

        // Call the actual API
        fetch("/login", {
          method: "POST",
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Login failed: ${response.status}`)
            }
            return response.json()
          })
          .then(userData => {
            // Success message
            const message = document.createElement("div")
            message.className = "message message-success"
            message.innerHTML = `
              <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Login successful! Redirecting...</span>
            `

            // Insert message before form
            loginForm.parentNode.insertBefore(message, loginForm)

            // Store user ID in localStorage for later use
            localStorage.setItem("userId", userData.id)

            // Redirect after delay to dashboard with user ID
            setTimeout(() => {
              params = new URLSearchParams()
              params.append("id", userData.id)
              window.location.href = `/dashboard?${params.toString()}`
            }, 2000)
          })
          .catch(error => {
            console.error("Login error:", error)
            
            // Error message
            const message = document.createElement("div")
            message.className = "message message-error"
            message.innerHTML = `
              <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>Invalid email or password. Please try again.</span>
            `

            // Insert message before form
            loginForm.parentNode.insertBefore(message, loginForm)
          })
          .finally(() => {
            // Reset button
            submitBtn.disabled = false
            submitBtn.innerHTML = originalText
          })
      }
    })
  }

  // Sign up form validation
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true

      // First name validation
      const firstName = document.getElementById("firstName")
      const firstNameError = document.getElementById("firstNameError")

      if (!firstName.value.trim()) {
        setError(firstName, firstNameError, "First name is required")
        isValid = false
      } else {
        setSuccess(firstName, firstNameError)
      }

      // Last name validation
      const lastName = document.getElementById("lastName")
      const lastNameError = document.getElementById("lastNameError")

      if (!lastName.value.trim()) {
        setError(lastName, lastNameError, "Last name is required")
        isValid = false
      } else {
        setSuccess(lastName, lastNameError)
      }

      // Email validation
      const email = document.getElementById("email")
      const emailError = document.getElementById("emailError")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!email.value.trim()) {
        setError(email, emailError, "Email is required")
        isValid = false
      } else if (!emailRegex.test(email.value.trim())) {
        setError(email, emailError, "Please enter a valid email address")
        isValid = false
      } else {
        setSuccess(email, emailError)
      }

      // Password validation
      const password = document.getElementById("password")
      const passwordError = document.getElementById("passwordError")

      if (!password.value.trim()) {
        setError(password, passwordError, "Password is required")
        isValid = false
      } else if (password.value.length < 6) {
        setError(password, passwordError, "Password must be at least 6 characters")
        isValid = false
      } else {
        setSuccess(password, passwordError)
      }

      // Terms checkbox validation
      const terms = document.getElementById("terms")
      const termsError = document.getElementById("termsError")

      if (!terms.checked) {
        if (termsError) {
          termsError.textContent = "You must agree to the Terms & Conditions"
        }
        isValid = false
        // Create a shake animation for the checkbox
        terms.parentElement.classList.add("shake")
        setTimeout(() => {
          terms.parentElement.classList.remove("shake")
        }, 500)
      } else {
        if (termsError) {
          termsError.textContent = ""
        }
      }

      // If form is valid, submit
      if (isValid) {
        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]')
        const originalText = submitBtn.innerHTML
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="loading-indicator"></span> Creating account...'

        // Create form data
        const formData = new FormData()
        formData.append("firstName", firstName.value.trim())
        formData.append("lastName", lastName.value.trim())
        formData.append("email", email.value.trim())
        formData.append("password", password.value)

        // Call the actual register API
        fetch("/register", {
          method: "POST",
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              // If the response is 400, it's likely due to email already registered
              if (response.status === 400) {
                throw new Error("Email already registered")
              }
              throw new Error(`Registration failed: ${response.status}`)
            }
            return response.json()
          })
          .then(userData => {
            // Success message
            const message = document.createElement("div")
            message.className = "message message-success"
            message.innerHTML = `
              <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Account created successfully! Redirecting to dashboard...</span>
            `

            // Insert message before form
            signupForm.parentNode.insertBefore(message, signupForm)

            // Store user ID in localStorage for later use
            localStorage.setItem("userId", userData.id)

            // Redirect after delay to dashboard with user ID
            setTimeout(() => {
              params = new URLSearchParams()
              params.append("id", userData.id)
              window.location.href = `/dashboard?${params.toString()}}`
            }, 2000)
          })
          .catch(error => {
            console.error("Registration error:", error)
            
            // Determine error message
            let errorMessage = "An error occurred during registration. Please try again."
            if (error.message.includes("Email already registered")) {
              errorMessage = "This email is already registered. Please use a different email or log in."
            }
            
            // Error message
            const message = document.createElement("div")
            message.className = "message message-error"
            message.innerHTML = `
              <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>${errorMessage}</span>
            `

            // Insert message before form
            signupForm.parentNode.insertBefore(message, signupForm)
          })
          .finally(() => {
            // Reset button
            submitBtn.disabled = false
            submitBtn.innerHTML = originalText
          })
      }
    })
  }

  // Helper functions
  function setError(input, errorElement, message) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("success")
    formGroup.classList.add("error")
    errorElement.textContent = message

    // Add shake animation
    input.classList.add("shake")
    setTimeout(() => {
      input.classList.remove("shake")
    }, 500)
  }

  function setSuccess(input, errorElement) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("error")
    formGroup.classList.add("success")
    errorElement.textContent = ""
  }

  function calculatePasswordStrength(password) {
    let strength = 0

    // Length check
    if (password.length >= 8) {
      strength += 1
    }

    // Contains lowercase letters
    if (/[a-z]/.test(password)) {
      strength += 1
    }

    // Contains uppercase letters
    if (/[A-Z]/.test(password)) {
      strength += 1
    }

    // Contains numbers
    if (/[0-9]/.test(password)) {
      strength += 1
    }

    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) {
      strength += 1
    }

    return Math.min(strength, 4)
  }

  function updateStrengthMeter(strength) {
    const strengthSegments = document.querySelectorAll(".strength-segment")
    const strengthText = document.querySelector(".strength-text")

    // Reset all segments
    strengthSegments.forEach((segment) => {
      segment.className = "strength-segment"
    })

    // Update segments based on strength
    for (let i = 0; i < strength; i++) {
      if (strength === 1) {
        strengthSegments[i].classList.add("weak")
      } else if (strength === 2 || strength === 3) {
        strengthSegments[i].classList.add("medium")
      } else {
        strengthSegments[i].classList.add("strong")
      }
    }

    // Update text
    if (strength === 0) {
      strengthText.textContent = "Password strength"
    } else if (strength === 1) {
      strengthText.textContent = "Weak"
    } else if (strength === 2) {
      strengthText.textContent = "Fair"
    } else if (strength === 3) {
      strengthText.textContent = "Good"
    } else {
      strengthText.textContent = "Strong"
    }
  }

  // smooth transitions when navigating between pages
  document.querySelectorAll("a").forEach((link) => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function (e) {

        if (e.metaKey || e.ctrlKey) return

        const href = this.getAttribute("href")

        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return

        e.preventDefault()

        // Fade out current page
        document.body.style.opacity = "0"
        document.body.style.transition = "opacity 0.3s ease"

        // Navigate after transition
        setTimeout(() => {
          window.location.href = href
        }, 300)
      })
    }
  })

  // Fade in page on load
  document.body.style.opacity = "0"
  setTimeout(() => {
    document.body.style.opacity = "1"
    document.body.style.transition = "opacity 0.5s ease"
  }, 100)

  // Add animations to form inputs
  document.querySelectorAll("input").forEach((input, index) => {
    input.style.opacity = "0"
    input.style.transform = "translateY(10px)"

    setTimeout(
      () => {
        input.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        input.style.opacity = "1"
        input.style.transform = "translateY(0)"
      },
      100 + index * 50,
    )
  })
})
