// Product-related functionality

// Import utility functions from main.js
import { formatPrice } from './main.js';
import { addToCart } from './cart.js';

// Sample product data (in a real app, this would come from a server/API)
const productsData = [
  {
    id: 1,
    name: "Premium Smartphone Pro",
    category: "smartphones",
    price: 999.99,
    description: "Our flagship smartphone with a stunning 6.7-inch Super Retina display, advanced camera system, and all-day battery life.",
    image: "../assets/product-imgs/pexels-photo-1647976.jpg",
    details: {
      display: "6.7-inch Super Retina XDR display",
      processor: "A16 Bionic chip",
      camera: "Pro camera system: 48MP main, 12MP ultra wide, 12MP telephoto",
      battery: "Up to 29 hours video playback",
      storage: ["128GB", "256GB", "512GB", "1TB"],
      colors: ["Graphite", "Silver", "Gold", "Sierra Blue"]
    },
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: "Professional Laptop",
    category: "laptops",
    price: 1799.99,
    description: "Powerful laptop for creative professionals with Retina display, high-performance processor and graphics.",
    image: "../assets/product-imgs/2.jpg",
    details: {
      display: "16-inch Liquid Retina XDR display",
      processor: "M2 Pro or M2 Max chip",
      memory: "16GB unified memory (configurable up to 64GB)",
      storage: ["512GB", "1TB", "2TB", "4TB", "8TB"],
      battery: "Up to 22 hours of battery life",
      colors: ["Space Gray", "Silver"]
    },
    featured: true,
    inStock: true
  },
  {
    id: 3,
    name: "Wireless Earbuds Pro",
    category: "accessories",
    price: 249.99,
    description: "Immersive sound with active noise cancellation and adaptive EQ that automatically tunes music to your ears.",
    image: "../assets/product-imgs/3.jpg",
    details: {
      audio: "Active Noise Cancellation and Transparency mode",
      battery: "Up to 6 hours of listening time with one charge",
      charging: "Wireless charging case with up to 30 hours of battery life",
      fit: "Multiple ear tip sizes for comfortable, customizable fit",
      connectivity: "Bluetooth 5.0",
      colors: ["White", "Black"]
    },
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: "Pro Tablet",
    category: "tablets",
    price: 799.99,
    description: "Powerful tablet with edge-to-edge Liquid Retina display and pro-level performance.",
    image: "../assets/product-imgs/4.jpg",
    details: {
      display: "11-inch Liquid Retina display",
      processor: "M2 chip",
      storage: ["128GB", "256GB", "512GB", "1TB"],
      camera: "12MP Wide camera, 10MP Ultra Wide camera",
      connectivity: "Wi-Fi 6E and optional 5G cellular",
      colors: ["Space Gray", "Silver"]
    },
    featured: true,
    inStock: true
  },
  {
    id: 5,
    name: "Smart Watch Series 8",
    category: "accessories",
    price: 399.99,
    description: "Advanced health and fitness features including temperature sensing and Crash Detection.",
    image: "../assets/product-imgs/5.jpg",
    details: {
      display: "Always-On Retina LTPO OLED display",
      health: "Temperature sensing, Blood Oxygen app, ECG app",
      battery: "Up to 18 hours of battery life, 36 hours in Low Power Mode",
      connectivity: "GPS and Cellular models available",
      water: "Water resistant 50 meters",
      colors: ["Midnight", "Starlight", "Silver", "Product Red"]
    },
    featured: false,
    inStock: true
  },
  {
    id: 6,
    name: "Budget Smartphone",
    category: "smartphones",
    price: 499.99,
    description: "Feature-packed smartphone with great camera, battery life, and performance at an affordable price.",
    image: "../assets/product-imgs/6.jpg",
    details: {
      display: "6.1-inch Super Retina XDR display",
      processor: "A15 Bionic chip",
      camera: "Dual-camera system: 12MP Wide, 12MP Ultra Wide",
      battery: "Up to 19 hours video playback",
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Midnight", "Starlight", "Blue", "Pink", "Product Red"]
    },
    featured: false,
    inStock: true
  },
  {
    id: 7,
    name: "Lightweight Laptop Air",
    category: "laptops",
    price: 999.99,
    description: "Thin and light laptop with incredible performance and battery life in a sleek design.",
    image: "../assets/product-imgs/pexels-photo.jpg",
    details: {
      display: "13.6-inch Liquid Retina display",
      processor: "M2 chip with 8-core CPU, 8-core GPU",
      memory: "8GB unified memory (configurable up to 24GB)",
      storage: ["256GB", "512GB", "1TB", "2TB"],
      battery: "Up to 18 hours of battery life",
      colors: ["Midnight", "Starlight", "Space Gray", "Silver"]
    },
    featured: false,
    inStock: true
  },
  {
    id: 8,
    name: "Wireless Charging Pad",
    category: "accessories",
    price: 39.99,
    description: "Fast wireless charging for compatible smartphones and earbuds.",
    image: "../assets/product-imgs/8.jpg",
    details: {
      power: "15W fast charging",
      compatibility: "Works with Qi-certified devices",
      design: "Slim, non-slip surface",
      features: "LED charging indicator",
      colors: ["White", "Black"]
    },
    featured: false,
    inStock: true
  }
];

// Get all products or filter by category, search query, etc.
export function getProducts(options = {}) {
  let filteredProducts = [...productsData];
  
  // Filter by category if specified
  if (options.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === options.category.toLowerCase()
    );
  }
  
  // Filter by search query if specified
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by featured status if specified
  if (options.featured !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.featured === options.featured
    );
  }
  
  // Sort products if sorting option is specified
  if (options.sort) {
    switch (options.sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (featured first, then alphabetically)
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
    }
  }
  
  return filteredProducts;
}

// Get a single product by ID
export function getProductById(productId) {
  return productsData.find(product => product.id === parseInt(productId, 10));
}

// Render products in a grid
export function renderProducts(products, container) {
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // If no products, show message
  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    `;
    return;
  }
  
  // Create product cards
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Add out of stock class if needed
    if (!product.inStock) {
      productCard.classList.add('out-of-stock');
    }
    
    productCard.innerHTML = `
      <a href="../pages/product-details.html?id=${product.id}" class="product-link">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">${formatPrice(product.price)}</p>
        </div>
      </a>
      <div class="product-actions">
        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    
    // Add to container
    container.appendChild(productCard);
    
    // Add event listener to Add to Cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(addToCartBtn.dataset.productId, 10);
        const product = getProductById(productId);
        if (product) {
          addToCart(product, 1);
          
          // Show success message
          showAddToCartMessage(product.name);
        }
      });
    }
  });
}

// Show message when product is added to cart
function showAddToCartMessage(productName) {
  // Create message element
  const message = document.createElement('div');
  message.className = 'cart-message';
  message.innerHTML = `
    <div class="cart-message-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>${productName} has been added to your cart</p>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(message);
  
  // Show message
  setTimeout(() => {
    message.classList.add('show');
  }, 100);
  
  // Remove message after delay
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
}

// Initialize product page
export function initializeProductsPage() {
  const productsContainer = document.getElementById('products-grid');
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');
  const searchForm = document.querySelector('.products-search-form');
  
  if (!productsContainer) return;
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  
  // Set filter values from URL parameters
  if (categoryParam && categoryFilter) {
    categoryFilter.value = categoryParam;
  }
  
  // Set search field value from URL parameter
  if (searchParam && searchForm) {
    searchForm.querySelector('input').value = searchParam;
  }
  
  // Get products with filters
  const filteredProducts = getProducts({
    category: categoryParam,
    search: searchParam
  });
  
  // Render products
  renderProducts(filteredProducts, productsContainer);
  
  // Update product count
  updateProductCount(filteredProducts.length);
  
  // Set up filter change events
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  
  if (sortOptions) {
    sortOptions.addEventListener('change', applyFilters);
  }
  
  // Set up search form
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
}

// Apply filters and update product display
function applyFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');
  const searchInput = document.querySelector('.products-search-form input');
  
  // Get filter values
  const category = categoryFilter ? categoryFilter.value : null;
  const sort = sortOptions ? sortOptions.value : null;
  const search = searchInput ? searchInput.value.trim() : null;
  
  // Update URL parameters
  const urlParams = new URLSearchParams();
  if (category) urlParams.set('category', category);
  if (search) urlParams.set('search', search);
  
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.pushState({}, '', newUrl);
  
  // Get filtered products
  const filteredProducts = getProducts({
    category: category === 'all' ? null : category,
    search: search || null,
    sort: sort
  });
  
  // Render products
  const productsContainer = document.getElementById('products-grid');
  renderProducts(filteredProducts, productsContainer);
  
  // Update product count
  updateProductCount(filteredProducts.length);
}

// Update product count display
function updateProductCount(count) {
  const countElement = document.querySelector('.product-count');
  if (countElement) {
    countElement.textContent = `${count} product${count !== 1 ? 's' : ''}`;
  }
}

// Initialize product details page
export function initializeProductDetailsPage() {
  const productContainer = document.getElementById('product-details');
  if (!productContainer) return;
  
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    // No product ID, redirect to products page
    window.location.href = '../pages/products.html';
    return;
  }
  
  // Get product by ID
  const product = getProductById(parseInt(productId, 10));
  
  if (!product) {
    // Product not found, show error
    productContainer.innerHTML = `
      <div class="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <a href="../pages/products.html" class="btn btn-primary">Back to Products</a>
      </div>
    `;
    return;
  }
  
  // Render product details
  renderProductDetails(product, productContainer);
  
  // Set up quantity selector
  setupQuantitySelector();
  
  // Set up add to cart button
  setupAddToCartButton(product);
  
  // Set up image gallery
  setupImageGallery();
  
  // Set page title
  document.title = `${product.name} | AbsoTech`;
}

// Render product details
function renderProductDetails(product, container) {
  // Create multiple images for gallery (in real app, product would have multiple images)
  const galleryImages = [
    product.image,
    // Simulate additional images with the same image
    product.image,
    product.image
  ];
  
  // Create markup for product details
  const detailsHtml = Object.entries(product.details || {}).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `
        <div class="detail-item">
          <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
          <ul>
            ${value.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      return `
        <div class="detail-item">
          <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
          <p>${value}</p>
        </div>
      `;
    }
  }).join('');
  
  // Create HTML for product details
  container.innerHTML = `
    <div class="product-details-container">
      <div class="product-gallery">
        <div class="main-image">
          <img src="${product.image}" alt="${product.name}" id="main-product-image">
        </div>
        <div class="thumbnail-gallery">
          ${galleryImages.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}">
              <img src="${img}" alt="${product.name} view ${index + 1}" data-index="${index}">
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="product-status">
          ${product.inStock ? 
            '<span class="in-stock">In Stock</span>' : 
            '<span class="out-of-stock">Out of Stock</span>'
          }
        </div>
        
        <div class="product-description">
          ${product.description}
        </div>
        
        <div class="product-actions">
          <div class="quantity-selector">
            <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
            <input type="number" value="1" min="1" max="10" id="product-quantity">
            <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
          </div>
          
          <button class="btn btn-primary add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
    
    <div class="product-details-tabs">
      <div class="tabs-header">
        <button class="tab-btn active" data-tab="details">Details</button>
        <button class="tab-btn" data-tab="specifications">Specifications</button>
      </div>
      
      <div class="tab-content active" id="details-content">
        <p>${product.description}</p>
      </div>
      
      <div class="tab-content" id="specifications-content">
        <div class="details-grid">
          ${detailsHtml}
        </div>
      </div>
    </div>
  `;
  
  // Set up tab switching
  setupTabs();
}

// Set up quantity selector
function setupQuantitySelector() {
  const quantityInput = document.getElementById('product-quantity');
  const minusBtn = document.querySelector('.quantity-btn.minus');
  const plusBtn = document.querySelector('.quantity-btn.plus');
  
  if (quantityInput && minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });
    
    // Ensure quantity is valid when manually entered
    quantityInput.addEventListener('change', () => {
      let value = parseInt(quantityInput.value, 10);
      
      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 10) {
        value = 10;
      }
      
      quantityInput.value = value;
    });
  }
}

// Set up add to cart button
function setupAddToCartButton(product) {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const quantityInput = document.getElementById('product-quantity');
  
  if (addToCartBtn && quantityInput) {
    addToCartBtn.addEventListener('click', () => {
      if (!product.inStock) return;
      
      const quantity = parseInt(quantityInput.value, 10);
      addToCart(product, quantity);
      
      // Show success message
      showAddToCartMessage(product.name);
    });
  }
}

// Set up tabs for product details
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.getElementById(`${tabId}-content`).classList.add('active');
    });
  });
}

// Set up image gallery
function setupImageGallery() {
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.thumbnail img');
  
  if (mainImage && thumbnails.length) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        // Update main image
        mainImage.src = thumbnail.src;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.parentElement.classList.add('active');
      });
    });
  }
}