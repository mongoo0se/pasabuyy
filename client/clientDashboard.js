const slides = [
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1521305916504-4a1121188589",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  "https://images.unsplash.com/photo-1555939594-58d7cb561818",
  "https://images.unsplash.com/photo-1529624190104-dba937c5a919"
];

const riders = [
  {
    name: "John Martinez",
    rating: 4.9,
    reviews: 1250,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    name: "Sarah Chen",
    rating: 4.8,
    reviews: 980,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    name: "Miguel Santos",
    rating: 4.7,
    reviews: 1100,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "On a delivery"
  },
  {
    name: "Alex Johnson",
    rating: 4.9,
    reviews: 1500,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    name: "Lisa Wang",
    rating: 4.6,
    reviews: 850,
    avatar: "https://images.unsplash.com/photo-1517841905240-74386c5a21b6?w=100&h=100&fit=crop",
    status: "Available"
  },
  {
    name: "Carlos Rodriguez",
    rating: 4.8,
    reviews: 1200,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    status: "Available"
  }
];

let currentSlide = 0;
const slideshow = document.getElementById("slideshow");

// Slideshow functionality - only on dashboard
if (slideshow) {
  function showSlide() {
    slideshow.style.backgroundImage = `url(${slides[currentSlide]})`;
    currentSlide = (currentSlide + 1) % slides.length;
  }

  showSlide();
  setInterval(showSlide, 5000);
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
  
  // Sample products database
  const allProducts = [
    { name: "Burger Combo", store: "Bes Burger House", type: "burger" },
    { name: "Cheese Fries", store: "Bes Burger House", type: "fries" },
    { name: "Chicken Rice", store: "Pa-Buy Kitchen", type: "chicken" },
    { name: "Milk Tea Promo", store: "Teal Cup", type: "beverage" },
    { name: "Pizza", store: "Bes Burger House", type: "pizza" },
    { name: "Sushi", store: "Pa-Buy Kitchen", type: "sushi" }
  ];
  
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
