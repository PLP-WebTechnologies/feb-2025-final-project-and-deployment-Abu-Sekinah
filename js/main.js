// Main JavaScript file for shared functionality across the site

// Import modules
import { loadCart, updateCartCount } from "./cart.js";
import { setupNavigation } from "./navigation.js";

// Initialize site functionality
document.addEventListener("DOMContentLoaded", () => {
  // Setup responsive navigation
  setupNavigation();

  // Initialize cart and update count
  loadCart();
  updateCartCount();

  // Setup search toggle
  setupSearch();

  // Setup newsletter form
  setupNewsletterForm();
});

// Setup search functionality
function setupSearch() {
  const searchToggle = document.querySelector(".search-toggle");
  const searchContainer = document.querySelector(".search-container");

  if (searchToggle && searchContainer) {
    searchToggle.addEventListener("click", () => {
      searchContainer.classList.toggle("active");
      // Focus the input when opened
      if (searchContainer.classList.contains("active")) {
        searchContainer.querySelector("input").focus();
      }
    });

    // Close search when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".search-container") &&
        !e.target.closest(".search-toggle") &&
        searchContainer.classList.contains("active")
      ) {
        searchContainer.classList.remove("active");
      }
    });

    // Setup search form submission
    const searchForm = document.querySelector(".search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchQuery = searchForm.querySelector("input").value.trim();
        if (searchQuery) {
          window.location.href = `../pages/products.html?search=${encodeURIComponent(
            searchQuery
          )}`;
        }
      });
    }
  }
}

// Setup newsletter form submission
function setupNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const feedbackDiv = newsletterForm.querySelector(".form-feedback");

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value)) {
        feedbackDiv.textContent = "Please enter a valid email address.";
        feedbackDiv.classList.add("error");
        return;
      }

      // Simulate form submission
      feedbackDiv.textContent = "Thank you for subscribing!";
      feedbackDiv.classList.remove("error");
      feedbackDiv.classList.add("success");
      emailInput.value = "";

      // Reset feedback after 5 seconds
      setTimeout(() => {
        feedbackDiv.textContent = "";
        feedbackDiv.classList.remove("success");
      }, 5000);
    });
  }
}

// Export utility functions
export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Utility function to animate elements when they come into view
export function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Set up scroll animations
setupScrollAnimations();
