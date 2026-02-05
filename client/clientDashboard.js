const slides = [
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1521305916504-4a1121188589"
];

let currentSlide = 0;
const slideshow = document.getElementById("slideshow");

function showSlide() {
  slideshow.style.backgroundImage = `url(${slides[currentSlide]})`;
  currentSlide = (currentSlide + 1) % slides.length;
}

showSlide();
setInterval(showSlide, 3000);
