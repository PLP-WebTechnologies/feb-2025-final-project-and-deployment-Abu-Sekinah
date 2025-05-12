// Homepage specific functionality

import { getProducts, renderProducts } from './products.js';

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
  // Load featured products
  loadFeaturedProducts();
  
  // Setup category animations
  setupCategoryAnimations();
  
  // Setup hero animations
  setupHeroAnimation();
});

// Load featured products
function loadFeaturedProducts() {
  const featuredProductsContainer = document.getElementById('featured-products');
  if (!featuredProductsContainer) return;
  
  // Get featured products
  const featuredProducts = getProducts({ featured: true });
  
  // Remove skeleton loading placeholders
  featuredProductsContainer.innerHTML = '';
  
  // Render products
  renderProducts(featuredProducts, featuredProductsContainer);
}

// Setup animations for category cards
function setupCategoryAnimations() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
    // Add hover animation
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover');
    });
    
    // Add class for CSS animation on scroll
    // card.classList.add('animate-on-scroll');
  });
}

// Setup hero section animations
function setupHeroAnimation() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    // Add class for CSS animation
    heroContent.classList.add('animate-on-scroll');
    
    // Trigger animation immediately for hero (it's above the fold)
    setTimeout(() => {
      heroContent.classList.add('animated');
    }, 300);
  }
}