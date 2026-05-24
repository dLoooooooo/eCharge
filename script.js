/* ============================================================
   script.js — eCharge Moldova
   Sections:
   1.  EmailJS Configuration
   2.  Loader
   3.  Navbar (scroll state + active link highlighting)
   4.  Mobile Menu
   5.  Smooth Scroll (all anchor links)
   6.  Scroll Reveal (IntersectionObserver)
   7.  Hero Parallax (subtle mouse tracking)
   8.  Contact Form — EmailJS submission
   ============================================================ */

/* ============================================================
   1. EMAILJS CONFIGURATION
   ─────────────────────────────────────────────────────────────
   Steps to activate email sending:
   1. Go to https://www.emailjs.com and create a free account
   2. Click "Add New Service" → choose Gmail → follow the OAuth
      flow → copy the SERVICE ID shown after connection
   3. Click "Email Templates" → Create Template
      Use these variables in your template body:
        {{from_name}}    — sender's full name
        {{from_email}}   — sender's email address (Reply-To)
        {{phone}}        — sender's phone number
        {{request_type}} — selected request type
        {{message}}      — the message body
   4. Copy the TEMPLATE ID from the template dashboard
   5. Click "Account" in the top nav → "API Keys"
      Copy your PUBLIC KEY
   6. Paste all three values below where indicated ↓
   ============================================================ */

const EMAILJS_PUBLIC_KEY = "VAuXNzF2_Ec3v07Hc"; // ← paste here
const EMAILJS_SERVICE_ID = "service_zehwphp"; // ← paste here
const EMAILJS_TEMPLATE_ID = "template_17i29ac"; // ← paste here

/* ============================================================
   2. LOADER
   ============================================================ */

/**
 * Hides the full-screen loader after the page has fully loaded.
 * The CSS transition handles the fade-out animation.
 */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    // Small delay so the progress bar animation completes visibly
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 1800);
  });
}

/* ============================================================
   3. NAVBAR
   ============================================================ */

/**
 * Adds a frosted-glass background to the navbar once the
 * user has scrolled past the fold, and highlights the
 * nav link whose section is currently in view.
 */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!navbar) return;

  // ── Scroll background ──────────────────────────────────────
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // ── Active link highlighting ────────────────────────────────
  const sections = Array.from(
    document.querySelectorAll("section[id], footer[id]"),
  );

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.45;

    let current = sections[0]?.id || "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollMid) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  }

  // Run once on page load
  updateActiveLink();
}

/* ============================================================
   4. MOBILE MENU
   ============================================================ */

/**
 * Toggles the mobile navigation drawer.
 * Closes on any mobile link click or outside click.
 */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    hamburger.classList.contains("open") ? closeMenu() : openMenu();
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when a link is tapped
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close when clicking outside the menu
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ============================================================
   5. SMOOTH SCROLL
   ============================================================ */

/**
 * Intercepts all same-page anchor clicks and smoothly scrolls
 * to the target section, accounting for the fixed navbar height.
 */
function initSmoothScroll() {
  const NAVBAR_HEIGHT = 70; // px — keep in sync with nav height in CSS

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        // Plain "#" or logo → scroll to very top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */

/**
 * Uses IntersectionObserver to add the `.visible` class to
 * any element with `.reveal` once it enters the viewport.
 * CSS handles the actual fade-up transition.
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -36px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   7. HERO PARALLAX
   ============================================================ */

/**
 * Subtle mouse-parallax on the hero background orbs.
 * Keeps movement very gentle — no cyberpunk jitter.
 */
function initHeroParallax() {
  const hero = document.getElementById("hero");
  const orbs = document.querySelectorAll(".hero-orb");

  if (!hero || !orbs.length) return;

  // Only on devices that support hover (not touch-only)
  const mediaQuery = window.matchMedia("(hover: hover)");
  if (!mediaQuery.matches) return;

  hero.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { width, height } = hero.getBoundingClientRect();
    const xRatio = (clientX / width - 0.5) * 2; // -1 to 1
    const yRatio = (clientY / height - 0.5) * 2; // -1 to 1

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.008; // Very low depth multiplier
      const tx = xRatio * depth * 80;
      const ty = yRatio * depth * 80;
      orb.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  hero.addEventListener("mouseleave", () => {
    orbs.forEach((orb) => {
      orb.style.transform = "translate(0, 0)";
    });
  });
}

/* ============================================================
   8. CONTACT FORM — EMAILJS
   ============================================================ */

/**
 * Handles the contact form:
 *  - Client-side validation before sending
 *  - Sends via EmailJS using the credentials defined at top of file
 *  - Shows success / error feedback inline (no page reload)
 *  - Manages the submit button's loading state
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const label = document.getElementById("submitLabel");
  const feedback = document.getElementById("formFeedback");

  if (!form) return;

  // ── Initialise EmailJS with your Public Key ─────────────────
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.warn(
      "EmailJS SDK not loaded. Check your internet connection or the CDN URL.",
    );
  }

  // ── Form submission ─────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent full page reload

    // Hide any previous feedback
    hideFeedback();

    // ── Validate required fields ──────────────────────────────
    const name = form.from_name.value.trim();
    const email = form.from_email.value.trim();
    const type = form.request_type.value;
    const message = form.message.value.trim();

    if (!name || !email || !type || !message) {
      showFeedback(
        "error",
        "⚠️ Please fill in all required fields before sending.",
      );
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback("error", "⚠️ Please enter a valid email address.");
      return;
    }

    // ── Loading state ─────────────────────────────────────────
    setLoading(true);

    // ── Send via EmailJS ──────────────────────────────────────
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form, // passes all named inputs as template variables
      );

      // Success
      showFeedback(
        "success",
        "✅ Message sent successfully! Our team will be in touch within 24 hours.",
      );
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showFeedback(
        "error",
        "❌ Sending failed. Please try again or email us directly at hello@echarge.md",
      );
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ──────────────────────────────────────────────────

  /** Toggle the submit button between its default and loading state. */
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    label.textContent = isLoading ? "Sending…" : "Send Message";
  }

  /** Render a feedback message of the given type ('success' | 'error'). */
  function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /** Clear and hide the feedback element. */
  function hideFeedback() {
    feedback.textContent = "";
    feedback.className = "form-feedback";
  }

  /** Basic email format check. */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ============================================================
   INIT — run everything once the DOM is ready
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initHeroParallax();
  initContactForm();
});
