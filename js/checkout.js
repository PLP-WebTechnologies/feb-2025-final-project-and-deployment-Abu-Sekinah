// Checkout page functionality

import { loadCart, formatCartPrice, clearCart } from './cart.js';

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
  // Load cart items in the order summary
  loadCheckoutItems();
  
  // Setup checkout steps
  setupCheckoutSteps();
  
  // Setup form validation
  setupFormValidation();
  
  // Handle place order button
  setupPlaceOrderButton();
});

// Load checkout items in the order summary
function loadCheckoutItems() {
  const cart = loadCart();
  const checkoutItemsContainer = document.getElementById('checkout-items');
  
  if (!checkoutItemsContainer) return;
  
  // Clear container
  checkoutItemsContainer.innerHTML = '';
  
  // If cart is empty, redirect to cart page
  if (cart.items.length === 0) {
    window.location.href = '../pages/cart.html';
    return;
  }
  
  // Add each item to the container
  cart.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'checkout-item';
    
    itemElement.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-quantity">Qty: ${item.quantity}</p>
      </div>
      <div class="item-price">
        ${formatCartPrice(item.price * item.quantity)}
      </div>
    `;
    
    checkoutItemsContainer.appendChild(itemElement);
  });
  
  // Update order summary
  updateOrderSummary(cart);
}

// Update order summary in checkout
function updateOrderSummary(cart) {
  const subtotalElement = document.getElementById('checkout-subtotal');
  const shippingElement = document.getElementById('checkout-shipping');
  const taxElement = document.getElementById('checkout-tax');
  const totalElement = document.getElementById('checkout-total');
  
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
  }
}

// Setup checkout steps
function setupCheckoutSteps() {
  const steps = document.querySelectorAll('.checkout-steps .step');
  const forms = document.querySelectorAll('.checkout-form');
  
  // Handle shipping form submission
  const shippingForm = document.getElementById('shipping-form');
  if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate form
      if (validateForm(shippingForm)) {
        // Switch to payment step
        switchToStep(1);
      }
    });
  }
  
  // Handle payment form submission
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate form
      if (validateForm(paymentForm)) {
        // Populate review form
        populateReviewForm();
        
        // Switch to review step
        switchToStep(2);
      }
    });
    
    // Handle back button
    const backButton = paymentForm.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        switchToStep(0);
      });
    }
  }
  
  // Handle review form back button
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    const backButton = reviewForm.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        switchToStep(1);
      });
    }
    
    // Handle edit buttons
    const editButtons = reviewForm.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const step = button.dataset.step;
        if (step === 'shipping') {
          switchToStep(0);
        } else if (step === 'payment') {
          switchToStep(1);
        }
      });
    });
  }
  
  // Setup payment method toggle
  setupPaymentMethodToggle();
}

// Switch to a specific checkout step
function switchToStep(stepIndex) {
  const steps = document.querySelectorAll('.checkout-steps .step');
  const forms = document.querySelectorAll('.checkout-form');
  
  // Update step indicators
  steps.forEach((step, index) => {
    if (index === stepIndex) {
      step.classList.add('active');
    } else if (index < stepIndex) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
  
  // Show the correct form
  forms.forEach((form, index) => {
    if (index === stepIndex) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
  
  // Scroll to top of form
  window.scrollTo({
    top: document.querySelector('.checkout-form.active').offsetTop - 100,
    behavior: 'smooth'
  });
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  const creditCardForm = document.getElementById('credit-card-form');
  const paypalForm = document.getElementById('paypal-form');
  
  if (paymentMethods.length && creditCardForm && paypalForm) {
    paymentMethods.forEach(method => {
      method.addEventListener('change', () => {
        if (method.value === 'credit-card') {
          creditCardForm.style.display = 'block';
          paypalForm.style.display = 'none';
        } else if (method.value === 'paypal') {
          creditCardForm.style.display = 'none';
          paypalForm.style.display = 'block';
        }
      });
    });
  }
}

// Setup form validation
function setupFormValidation() {
  // Setup input validation events
  document.querySelectorAll('.checkout-form input, .checkout-form select').forEach(input => {
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    input.addEventListener('input', () => {
      // Remove error when typing
      const errorMessage = input.parentElement.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.textContent = '';
      }
      input.classList.remove('error');
    });
  });
  
  // Format credit card number
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Add spaces after every 4 digits
      let formattedValue = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      
      // Limit to 16 digits
      if (value.length > 16) {
        formattedValue = formattedValue.substring(0, 19);
      }
      
      e.target.value = formattedValue;
    });
  }
  
  // Format card expiry date
  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Add slash after first 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      
      // Limit to MM/YY format
      if (value.length > 5) {
        value = value.substring(0, 5);
      }
      
      e.target.value = value;
    });
  }
  
  // Limit CVV to 3-4 digits
  const cardCvvInput = document.getElementById('card-cvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 4 digits
      if (value.length > 4) {
        value = value.substring(0, 4);
      }
      
      e.target.value = value;
    });
  }
}

// Validate a single input
function validateInput(input) {
  const errorMessage = input.parentElement.querySelector('.error-message');
  if (!errorMessage) return true;
  
  let isValid = true;
  let message = '';
  
  // Skip validation for non-required fields if empty
  if (!input.required && input.value.trim() === '') {
    input.classList.remove('error');
    errorMessage.textContent = '';
    return true;
  }
  
  // Required validation
  if (input.required && input.value.trim() === '') {
    isValid = false;
    message = 'This field is required';
  } 
  // Email validation
  else if (input.type === 'email' && input.value.trim() !== '') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value.trim())) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
  }
  // Phone validation
  else if (input.id === 'phone' && input.value.trim() !== '') {
    const phonePattern = /^\d{10,15}$/;
    const cleanPhone = input.value.replace(/\D/g, '');
    if (!phonePattern.test(cleanPhone)) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  // Postal code validation
  else if (input.id === 'zip' && input.value.trim() !== '') {
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(input.value.trim())) {
      isValid = false;
      message = 'Please enter a valid postal code (e.g., 12345 or 12345-6789)';
    }
  }
  // Credit card validation
  else if (input.id === 'card-number' && input.value.trim() !== '') {
    const cleanCardNumber = input.value.replace(/\D/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 16) {
      isValid = false;
      message = 'Please enter a valid card number';
    }
  }
  // Expiry date validation
  else if (input.id === 'card-expiry' && input.value.trim() !== '') {
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryPattern.test(input.value.trim())) {
      isValid = false;
      message = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if date is in the future
      const parts = input.value.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt('20' + parts[1], 10);
      
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
      const currentYear = now.getFullYear();
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        isValid = false;
        message = 'Card expiration date has passed';
      }
    }
  }
  // CVV validation
  else if (input.id === 'card-cvv' && input.value.trim() !== '') {
    const cvvPattern = /^\d{3,4}$/;
    if (!cvvPattern.test(input.value.trim())) {
      isValid = false;
      message = 'Please enter a valid CVV (3-4 digits)';
    }
  }
  
  // Update UI
  if (!isValid) {
    input.classList.add('error');
    errorMessage.textContent = message;
  } else {
    input.classList.remove('error');
    errorMessage.textContent = '';
  }
  
  return isValid;
}

// Validate an entire form
function validateForm(form) {
  let isValid = true;
  
  // Validate all inputs in the form
  form.querySelectorAll('input, select').forEach(input => {
    if (input.type !== 'checkbox' || input.required) {
      if (!validateInput(input)) {
        isValid = false;
      }
    }
  });
  
  return isValid;
}

// Populate the review form with shipping and payment information
function populateReviewForm() {
  const shippingForm = document.getElementById('shipping-form');
  const paymentForm = document.getElementById('payment-form');
  const shippingSummary = document.getElementById('shipping-summary');
  const paymentSummary = document.getElementById('payment-summary');
  const orderItems = document.getElementById('order-items');
  
  if (shippingForm && shippingSummary) {
    // Get shipping info
    const firstName = shippingForm.querySelector('#first-name').value;
    const lastName = shippingForm.querySelector('#last-name').value;
    const address = shippingForm.querySelector('#address').value;
    const address2 = shippingForm.querySelector('#address2').value;
    const city = shippingForm.querySelector('#city').value;
    const state = shippingForm.querySelector('#state').value;
    const zip = shippingForm.querySelector('#zip').value;
    const country = shippingForm.querySelector('#country').value;
    const email = shippingForm.querySelector('#email').value;
    const phone = shippingForm.querySelector('#phone').value;
    
    // Create shipping summary
    shippingSummary.innerHTML = `
      <p>${firstName} ${lastName}</p>
      <p>${address}${address2 ? ', ' + address2 : ''}</p>
      <p>${city}, ${state} ${zip}</p>
      <p>${getCountryName(country)}</p>
      <p>${email}</p>
      <p>${phone}</p>
    `;
  }
  
  if (paymentForm && paymentSummary) {
    // Get payment method
    const paymentMethod = paymentForm.querySelector('input[name="payment-method"]:checked').value;
    
    if (paymentMethod === 'credit-card') {
      const cardName = paymentForm.querySelector('#card-name').value;
      const cardNumber = paymentForm.querySelector('#card-number').value;
      
      // Mask card number
      const lastFour = cardNumber.replace(/\D/g, '').slice(-4);
      const maskedCardNumber = '•••• •••• •••• ' + lastFour;
      
      paymentSummary.innerHTML = `
        <p>Credit Card</p>
        <p>${cardName}</p>
        <p>${maskedCardNumber}</p>
      `;
    } else if (paymentMethod === 'paypal') {
      const email = shippingForm.querySelector('#email').value;
      paymentSummary.innerHTML = `
        <p>PayPal</p>
        <p>${email}</p>
      `;
    }
  }
  
  if (orderItems) {
    const cart = loadCart();
    
    // Clear container
    orderItems.innerHTML = '';
    
    // Add cart items
    cart.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'review-item';
      
      itemElement.innerHTML = `
        <div class="item-name">${item.name} × ${item.quantity}</div>
        <div class="item-price">${formatCartPrice(item.price * item.quantity)}</div>
      `;
      
      orderItems.appendChild(itemElement);
    });
    
    // Add subtotal, shipping, and tax
    const subtotal = cart.totalPrice;
    const shipping = subtotal > 50 ? 0 : 5;
    const tax = subtotal * 0.0825;
    const total = subtotal + shipping + tax;
    
    const summaryElement = document.createElement('div');
    summaryElement.className = 'review-summary';
    
    summaryElement.innerHTML = `
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatCartPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${formatCartPrice(shipping)}</span>
      </div>
      <div class="summary-row">
        <span>Tax</span>
        <span>${formatCartPrice(tax)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatCartPrice(total)}</span>
      </div>
    `;
    
    orderItems.appendChild(summaryElement);
  }
}

// Get country name from country code
function getCountryName(countryCode) {
  const countries = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan'
  };
  
  return countries[countryCode] || countryCode;
}

// Setup place order button
function setupPlaceOrderButton() {
  const placeOrderBtn = document.getElementById('place-order-btn');
  const termsCheckbox = document.getElementById('terms');
  
  if (placeOrderBtn && termsCheckbox) {
    placeOrderBtn.addEventListener('click', () => {
      // Check if terms are accepted
      if (!termsCheckbox.checked) {
        const errorMessage = termsCheckbox.parentElement.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.textContent = 'You must accept the terms and conditions';
        }
        return;
      }
      
      // Generate random order number
      const orderNumber = 'TVC-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('order-number').textContent = orderNumber;
      
      // Set confirmation email
      const email = document.getElementById('email').value;
      document.getElementById('confirmation-email').textContent = email;
      
      // Show confirmation
      document.querySelectorAll('.checkout-form').forEach(form => {
        form.classList.remove('active');
      });
      document.getElementById('confirmation').classList.add('active');
      
      // Complete step indicators
      document.querySelectorAll('.checkout-steps .step').forEach(step => {
        step.classList.add('completed');
        step.classList.remove('active');
      });
      
      // Clear cart
      clearCart();
      
      // Scroll to top of confirmation
      window.scrollTo({
        top: document.getElementById('confirmation').offsetTop - 100,
        behavior: 'smooth'
      });
    });
  }
}