// Responsive navigation functionality

export function setupNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (menuToggle && navList) {
    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navList.classList.toggle('active');
      
      // Set aria-expanded attribute for accessibility
      const isExpanded = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navList.classList.contains('active') && 
          !e.target.closest('.main-nav')) {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
  }
  
  // Highlight current page in navigation
  highlightCurrentPage();
}

// Highlight the current page in the navigation
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-list a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    // Check if the link's href matches the current path
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || 
        (currentPath.includes(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
    
    // Special case for homepage
    if (currentPath === '/' && linkPath === '/') {
      link.classList.add('active');
    }
  });
}

// Setup keyboard navigation for accessibility
function setupKeyboardNavigation() {
  const navLinks = document.querySelectorAll('.nav-list a');
  
  navLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      // Handle keyboard navigation between menu items
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          // Focus next link or wrap to first
          if (index < navLinks.length - 1) {
            navLinks[index + 1].focus();
          } else {
            navLinks[0].focus();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          // Focus previous link or wrap to last
          if (index > 0) {
            navLinks[index - 1].focus();
          } else {
            navLinks[navLinks.length - 1].focus();
          }
          break;
        case 'Escape':
          // Close menu if open
          const navList = document.querySelector('.nav-list');
          const menuToggle = document.querySelector('.menu-toggle');
          if (navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
            menuToggle.focus();
          }
          break;
      }
    });
  });
}

// Handle fixed header on scroll
export function setupScrollHeader() {
  const header = document.querySelector('.site-header');
  
  if (header) {
    let lastScrollPosition = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.scrollY;
      
      // Add shadow and background when scrolled
      if (currentScrollPosition > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll direction
      if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
        // Scrolling down, hide header
        header.classList.add('header-hidden');
      } else {
        // Scrolling up, show header
        header.classList.remove('header-hidden');
      }
      
      lastScrollPosition = currentScrollPosition;
    });
  }
}

// Initialize scroll header behavior
setupScrollHeader();