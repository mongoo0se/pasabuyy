const slides = [];

const riders = [];

let currentSlide = 0;
const slideshow = document.getElementById("slideshow");

// Slideshow functionality - only on dashboard
if (slideshow) {
  if (slides.length > 0) {
    function showSlide() {
      slideshow.style.backgroundImage = `url(${slides[currentSlide]})`;
      currentSlide = (currentSlide + 1) % slides.length;
    }

    showSlide();
    setInterval(showSlide, 5000);
  }
}

// Render riders - only on dashboard
function renderRiders() {
  const ridersContainer = document.getElementById("ridersContainer");
  if (!ridersContainer) return;
  
  ridersContainer.innerHTML = riders
    .sort((a, b) => b.rating - a.rating)
    .map(
      (rider) => `
    <div class="rider-card">
      <img src="${rider.avatar}" alt="${rider.name}" class="rider-avatar" />
      <h3>${rider.name}</h3>
      <p>${rider.status}</p>
      <div class="rating">
        <i class="fa-solid fa-star"></i>${rider.rating} (${rider.reviews})
      </div>
    </div>
  `
    )
    .join("");
}

renderRiders();

// Add click handlers for food cards
function attachCardHandlers() {
  const foodCards = document.querySelectorAll(".food-card");
  foodCards.forEach((card, index) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const productName = card.querySelector("h3").textContent;
      const storeName = card.querySelectorAll("p")[0].textContent;
      
      // Show modal or dialog for add to cart
      showProductModal(productName, storeName, index);
    });
  });
}

// Add click handlers for rider cards
function attachRiderHandlers() {
  const riderCards = document.querySelectorAll(".rider-card");
  riderCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const riderName = card.querySelector("h3").textContent;
      const riderRating = card.querySelector(".rating").textContent;
      
      // Show rider profile
      showRiderProfile(riderName, riders[index]);
    });
  });
}

// Product modal
function showProductModal(productName, storeName, index) {
  const action = confirm(
    `${productName} from ${storeName}\n\nWould you like to:\nOK = Add to Cart\nCancel = Checkout Now`
  );
  
  if (action) {
    alert(`Added "${productName}" to cart!`);
    // In a real app, this would add to cart
  } else {
    // Simulate adding to cart and going to checkout
    alert(`Proceeding to checkout for "${productName}"`);
    window.location.href = "checkout.html";
  }
}

// Rider profile modal
function showRiderProfile(riderName, riderData) {
  const profileInfo = `
    Rider: ${riderName}
    Rating: ${riderData.rating} ⭐ (${riderData.reviews} reviews)
    Status: ${riderData.status}
    
    Acceptance Rate: 98%
    On-time Rate: 96%
    Previous Deliveries: 1,250+
  `;
  
  alert(profileInfo);
}

// Attach handlers when cards are available
if (document.querySelectorAll(".food-card").length > 0) {
  attachCardHandlers();
}

// Re-attach rider handlers after rendering
const riderCardObserver = setInterval(() => {
  const riderCards = document.querySelectorAll(".rider-card");
  if (riderCards.length > 0) {
    attachRiderHandlers();
    clearInterval(riderCardObserver);
  }
}, 100);

// Navigation event listeners - works on all pages
function setupNavigation() {
  const homeLink = document.getElementById("homeLink");
  const cartIcon = document.getElementById("cartIcon");
  const messagesIcon = document.getElementById("messagesIcon");
  const profileIcon = document.getElementById("profileIcon");

  if (homeLink) {
    homeLink.addEventListener("click", () => {
      window.location.href = "clientDashboard.html";
    });
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }

  if (messagesIcon) {
    messagesIcon.addEventListener("click", () => {
      window.location.href = "messages.html";
    });
  }

  if (profileIcon) {
    profileIcon.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }
}

// Call setup navigation on all pages
document.addEventListener("DOMContentLoaded", setupNavigation);

// If DOM is already loaded (in some cases)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupNavigation);
} else {
  setupNavigation();
}

// Bottom navigation (only works on dashboard)
const navBtns = document.querySelectorAll(".nav-btn");
if (navBtns.length > 0) {
  navBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      const page = e.target.dataset.page;
      if (page === "stores") {
        window.location.href = "stores.html";
      } else if (page === "delivery") {
        window.location.href = "delivery.html";
      } else if (page === "pickup") {
        window.location.href = "pickup.html";
      }
    });
  });
}

// Search functionality (only on dashboard)
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      performSearch(query);
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        performSearch(query);
      }
    }
  });
}

// Search functionality
function performSearch(query) {
  const foodCards = document.querySelectorAll(".food-card");
  let resultsFound = 0;
  
  // Sample products removed; backend should provide search index
  const allProducts = [];
  
  // Filter products
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.store.toLowerCase().includes(query) ||
    product.type.toLowerCase().includes(query)
  );
  
  if (filteredProducts.length === 0) {
    alert(`No results found for "${searchInput.value}".`);
    return;
  }
  
  // Show results
  let resultsMessage = `Found ${filteredProducts.length} result(s):\n\n`;
  filteredProducts.forEach(product => {
    resultsMessage += `• ${product.name}\n  from ${product.store}\n\n`;
  });
  
  alert(resultsMessage);
  searchInput.value = "";
}
