// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ===========================
// FAQ Accordion Toggle
// ===========================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
    let answer = item.querySelector("p");
    if (item.classList.contains("active")) {
      answer.style.display = "block";
    } else {
      answer.style.display = "none";
    }
  });
});

// ===========================
// Button Hover Animation
// ===========================
document.querySelectorAll("button, .btn").forEach(btn => {
  btn.addEventListener("mouseover", () => {
    btn.style.transform = "scale(1.05)";
    btn.style.transition = "transform 0.2s ease-in-out";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "scale(1)";
  });
});

// ===========================
// Fade-in Animation on Scroll
// ===========================
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => {
  observer.observe(card);
});
// ===========================
// Preloader
// ===========================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ===========================
// App Ready Log
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Rotorize Aviation site loaded successfully.");
});

// ===========================
// Mobile Menu Toggle
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!menuButton || !navLinks) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
});

// ===========================
// Sticky Header on Scroll
// ===========================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});