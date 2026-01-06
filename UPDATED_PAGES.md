# Updated Website Pages - Copy and Paste Guide

## 1. views/partials/navbar.ejs
```html
<header>
  <nav>
    <a href="/" class="brand" aria-label="Rotorize Aviation Home">
      <img src="/images/logo2.png" alt="Rotorize Aviation Logo">
    </a>
    <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div id="nav-links" class="nav-links">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/courses">Courses</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/application">Application</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </nav>
</header>
```

## 2. views/partials/footer.ejs
```html
<footer>
  <p>© 2025 Rotorize Aviation | info@rotorize.in</p>
</footer>
```

## 3. app.js (Main server file)
```javascript
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));
app.get("/about", (req, res) => res.render("about"));
app.get("/courses", (req, res) => res.render("courses"));
app.get("/services", (req, res) => res.render("services"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/portfolio", (req, res) => res.render("portfolio"));
app.get("/application", (req, res) => res.render("application"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 4. public/js/script.js
```javascript
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

// ===========================
// Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===========================
// FAQ Toggle (if FAQ items exist)
// ===========================
document.querySelectorAll(".faq-item h3").forEach((item) => {
  item.addEventListener("click", () => {
    const parent = item.parentElement;
    parent.classList.toggle("active");
  });
});

// ===========================
// Button Hover Animation
// ===========================
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
  });
  btn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// ===========================
// Fade-in on Scroll Animation
// ===========================
const fadeElements = document.querySelectorAll(".card, .stat, .value-item");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

fadeElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  fadeObserver.observe(el);
});
```

---

## All page files are already updated in your project:
- ✅ views/index.ejs
- ✅ views/about.ejs  
- ✅ views/courses.ejs
- ✅ views/services.ejs
- ✅ views/portfolio.ejs
- ✅ views/faq.ejs
- ✅ views/contact.ejs
- ✅ views/application.ejs
- ✅ public/css/style.css (with white subtitles)
- ✅ app.js (with all routes)

## How to verify your updates:
1. Stop the server (Ctrl+C in terminal)
2. Restart: `node app.js`
3. Open browser: http://localhost:3000
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Check each page to see all updates

All pages have been updated with:
- White subtitle colors
- Application page with drone background
- Contact page with symbols for social media
- All routes working properly

