// Cart page functionality

import { loadCart, updateCartItemQuantity, removeFromCart, formatCartPrice } from './cart.js';

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  // Load and render cart
  renderCartPage();
  
  // Setup event listeners
  setupCartEvents();
});

// Render cart page
function renderCartPage() {
  const cart = loadCart();
  const cartContainer = document.getElementById('cart-container');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyMessage = document.querySelector('.cart-empty');
  const cartContent = document.querySelector('.cart-content');
  
  // Clear loading skeletons
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';
  }
  
  // If cart is empty, show empty message
  if (cart.items.length === 0) {
    if (cartEmptyMessage && cartContent) {
      cartEmptyMessage.classList.remove('hide');
      cartContent.classList.add('hide');
    }
    return;
  }
  
  // Otherwise, show cart content
  if (cartEmptyMessage && cartContent) {
    cartEmptyMessage.classList.add('hide');
    cartContent.classList.remove('hide');
  }
  
  // Render cart items
  if (cartItemsContainer) {
    cart.items.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.dataset.id = item.id;
      
      cartItemElement.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3><a href="../pages/product-details.html?id=${item.id}">${item.name}</a></h3>
        </div>
        <div class="item-price">
          ${formatCartPrice(item.price)}
        </div>
        <div class="item-quantity">
          <div class="quantity-selector">
            <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
            <input type="number" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
            <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="item-total">
          ${formatCartPrice(item.price * item.quantity)}
        </div>
        <div class="item-remove">
          <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItemElement);
    });
  }
  
  // Update order summary
  updateOrderSummary(cart);
}

// Update order summary
function updateOrderSummary(cart) {
  const subtotalElement = document.getElementById('cart-subtotal');
  const shippingElement = document.getElementById('cart-shipping');
  const taxElement = document.getElementById('cart-tax');
  const totalElement = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (subtotalElement && shippingElement && taxElement && totalElement) {
    const subtotal = cart.totalPrice;
    // Calculate shipping (free over $50, otherwise $5)
    const shipping = subtotal > 50 ? 0 : 5;
    // Calculate tax (8.25%)
    const tax = subtotal * 0.0825;
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update elements
    subtotalElement.textContent = formatCartPrice(subtotal);
    shippingElement.textContent = formatCartPrice(shipping);
    taxElement.textContent = formatCartPrice(tax);
    totalElement.textContent = formatCartPrice(total);
    
    // Disable checkout button if cart is empty
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.items.length === 0;
    }
  }
}

// Setup cart event listeners
function setupCartEvents() {
  // Event delegation for cart items container
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      // Handle quantity decrease button
      if (e.target.classList.contains('minus') || e.target.closest('.minus')) {
        const input = e.target.closest('.quantity-selector').querySelector('input');
        const id = parseInt(input.dataset.id, 10);
        let value = parseInt(input.value, 10);
        
        if (value > 1) {
          value--;
          input.value = value;
          updateCartItemQuantity(id, value);
          updateCartItem(id);
        }
      }
      
      // Handle quantity increase button
      if (e.target.classList.contains('plus') || e.target.closest('.plus')) {
        const input = e.target.closest('.quantity-selector').querySelector('input');
        const id = parseInt(input.dataset.id, 10);
        let value = parseInt(input.value, 10);
        
        if (value < 10) {
          value++;
          input.value = value;
          updateCartItemQuantity(id, value);
          updateCartItem(id);
        }
      }
      
      // Handle remove button
      if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
        const id = parseInt(button.dataset.id, 10);
        
        removeFromCart(id);
        
        // Re-render cart page
        renderCartPage();
      }
    });
    
    // Handle quantity input changes
    cartItemsContainer.addEventListener('change', (e) => {
      if (e.target.type === 'number') {
        const id = parseInt(e.target.dataset.id, 10);
        let value = parseInt(e.target.value, 10);
        
        // Validate value
        if (isNaN(value) || value < 1) {
          value = 1;
          e.target.value = value;
        } else if (value > 10) {
          value = 10;
          e.target.value = value;
        }
        
        // Update cart
        updateCartItemQuantity(id, value);
        updateCartItem(id);
      }
    });
  }
}

// Update a single cart item
function updateCartItem(id) {
  const cart = loadCart();
  const item = cart.items.find(item => item.id === id);
  
  if (!item) return;
  
  // Update item total
  const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (cartItem) {
    const itemTotal = cartItem.querySelector('.item-total');
    if (itemTotal) {
      itemTotal.textContent = formatCartPrice(item.price * item.quantity);
    }
  }
  
  // Update order summary
  updateOrderSummary(cart);
}