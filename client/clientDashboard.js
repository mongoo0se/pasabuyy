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

// Slideshow functionality
function showSlide() {
  slideshow.style.backgroundImage = `url(${slides[currentSlide]})`;
  currentSlide = (currentSlide + 1) % slides.length;
}

showSlide();
setInterval(showSlide, 5000);

// Render riders
function renderRiders() {
  const ridersContainer = document.getElementById("ridersContainer");
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

// Navigation event listeners
document.getElementById("homeLink").addEventListener("click", () => {
  window.location.href = "clientDashboard.html";
});

document.getElementById("cartIcon").addEventListener("click", () => {
  window.location.href = "cart.html";
});

document.getElementById("messagesIcon").addEventListener("click", () => {
  window.location.href = "messages.html";
});

document.getElementById("profileIcon").addEventListener("click", () => {
  window.location.href = "profile.html";
});

// Bottom navigation
document.querySelectorAll(".nav-btn").forEach((btn) => {
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

// Search functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value;
  if (query.trim()) {
    console.log("Searching for:", query);
    alert("Searching for: " + query);
  }
});

document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchBtn").click();
  }
});
