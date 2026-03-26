// --- LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = "reservation.html";
    });
}

// --- CAROUSEL ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    
    // Auto Scroll every 4 seconds
    setInterval(() => showSlide(currentSlide + 1), 4000);
}

// --- RESERVATION ---
const resForm = document.getElementById('reservationForm');
if (resForm) {
    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("✨ Booking Successful! Your luxury suite is waiting at Luna Vista.");
        resForm.reset();
    });
}