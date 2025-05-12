// Shopping cart functionality

// Get cart from localStorage or initialize empty cart
export function loadCart() {
  let cart = localStorage.getItem('cart');
  if (!cart) {
    cart = { items: [], totalItems: 0, totalPrice: 0 };
    saveCart(cart);
  } else {
    try {
      cart = JSON.parse(cart);
      
      // Make sure the cart has the expected structure
      if (!cart.items || !Array.isArray(cart.items)) {
        cart = { items: [], totalItems: 0, totalPrice: 0 };
      }
      
      // Recalculate totals (in case prices were updated)
      recalculateCart(cart);
    } catch (error) {
      console.error('Error parsing cart:', error);
      cart = { items: [], totalItems: 0, totalPrice: 0 };
    }
  }
  return cart;
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
export function addToCart(product, quantity = 1) {
  const cart = loadCart();
  
  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  // Recalculate cart totals
  recalculateCart(cart);
  
  // Save updated cart
  saveCart(cart);
  
  // Update cart count
  updateCartCount();
  
  // Return the updated cart
  return cart;
}

// Remove product from cart
export function removeFromCart(productId) {
  const cart = loadCart();
  
  // Find the item to remove
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    // Remove the item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate cart totals
    recalculateCart(cart);
    
    // Save updated cart
    saveCart(cart);
    
    // Update cart count
    updateCartCount();
  }
  
  return cart;
}

// Update product quantity in cart
export function updateCartItemQuantity(productId, quantity) {
  const cart = loadCart();
  
  // Find the item to update
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    if (quantity > 0) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    }
    
    // Recalculate cart totals
    recalculateCart(cart);
    
    // Save updated cart
    saveCart(cart);
    
    // Update cart count
    updateCartCount();
  }
  
  return cart;
}

// Recalculate cart totals
function recalculateCart(cart) {
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in header
export function updateCartCount() {
  const cart = loadCart();
  const cartCountElement = document.querySelector('.cart-count');
  
  if (cartCountElement) {
    cartCountElement.textContent = cart.totalItems;
    
    // Add visible class if cart has items
    if (cart.totalItems > 0) {
      cartCountElement.classList.add('visible');
    } else {
      cartCountElement.classList.remove('visible');
    }
  }
}

// Clear the entire cart
export function clearCart() {
  const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
  saveCart(emptyCart);
  updateCartCount();
  return emptyCart;
}

// Format price with currency symbol
export function formatCartPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart count
  updateCartCount();
});