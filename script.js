/**
 * ═══════════════════════════════════════════════════════
 * Auto Portfolio — Main JavaScript
 * ═══════════════════════════════════════════════════════
 * Features:
 *  - Typing animation in hero section
 *  - Scroll-triggered reveal animations (Intersection Observer)
 *  - Mobile hamburger menu toggle
 *  - Smooth scroll for anchor links
 *  - Active navigation link highlighting
 *  - Animated stat counters
 *  - Skill bar fill animation
 *  - Back-to-top button
 *  - Contact form handling
 * ═══════════════════════════════════════════════════════
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── DOM REFERENCES ────────────────────────────────
  const navbar       = document.getElementById("navbar");
  const navToggle    = document.getElementById("nav-toggle");
  const navMenu      = document.getElementById("nav-menu");
  const navLinks     = document.querySelectorAll(".nav-link");
  const typingText   = document.getElementById("typing-text");
  const backToTopBtn = document.getElementById("back-to-top");
  const contactForm  = document.getElementById("contact-form");
  const formStatus   = document.getElementById("form-status");


  // ═══════════════════════════════════════════════════
  // 1. TYPING ANIMATION
  // ═══════════════════════════════════════════════════
  const titles = [
    "Full Stack Developer",
    "React.js Developer",
    "Cloud Enthusiast",
    "AWS Certified",
    "DevOps Engineer"
  ];

  let titleIndex   = 0;   // which title we're on
  let charIndex    = 0;   // which character we're typing
  let isDeleting   = false;
  const typeSpeed  = 80;  // ms per character when typing
  const deleteSpeed = 40; // ms per character when deleting
  const pauseTime  = 1800; // ms to pause after a full word

  function typeWriter() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      // Remove one character
      typingText.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typingText.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

    // Finished typing the full word
    if (!isDeleting && charIndex === currentTitle.length) {
      nextDelay = pauseTime; // pause before deleting
      isDeleting = true;
    }

    // Finished deleting the full word
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length; // move to next title
      nextDelay = 400; // short pause before next word
    }

    setTimeout(typeWriter, nextDelay);
  }

  // Start typing animation
  if (typingText) {
    typeWriter();
  }


  // ═══════════════════════════════════════════════════
  // 2. SCROLL-TRIGGERED REVEAL ANIMATIONS
  //    Uses Intersection Observer for performance
  // ═══════════════════════════════════════════════════
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Optional: stop observing after reveal for performance
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,    // trigger when 12% of element is visible
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  // ═══════════════════════════════════════════════════
  // 3. MOBILE NAVIGATION TOGGLE
  // ═══════════════════════════════════════════════════
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when a nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }


  // ═══════════════════════════════════════════════════
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = targetEl.offsetTop - navHeight;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });


  // ═══════════════════════════════════════════════════
  // 5. NAVBAR: Shrink on scroll + active section
  // ═══════════════════════════════════════════════════
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const scrollY = window.scrollY;

    // — Navbar background on scroll —
    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 50);
    }

    // — Back-to-top button visibility —
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollY > 500);
    }

    // — Highlight active nav link based on scroll position —
    sections.forEach((section) => {
      const sectionTop    = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Run once on load


  // ═══════════════════════════════════════════════════
  // 6. BACK TO TOP BUTTON
  // ═══════════════════════════════════════════════════
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  // ═══════════════════════════════════════════════════
  // 7. ANIMATED STAT COUNTERS
  //    Counts up from 0 to data-count when visible
  // ═══════════════════════════════════════════════════
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          animateCounter(el, target);
          statObserver.unobserve(el); // only animate once
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => statObserver.observe(el));

  function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target; // ensure exact final value
      }
    }

    requestAnimationFrame(update);
  }


  // ═══════════════════════════════════════════════════
  // 8. SKILL BAR FILL ANIMATION
  //    Fills the progress bars when they scroll into view
  // ═══════════════════════════════════════════════════
  const skillBars = document.querySelectorAll(".skill-bar-fill[data-width]");

  const skillBarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.getAttribute("data-width");
          bar.style.width = width + "%";
          skillBarObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => skillBarObserver.observe(bar));


  // ═══════════════════════════════════════════════════
  // 9. CONTACT FORM HANDLING
  //    Uses Formspree or falls back to mailto
  // ═══════════════════════════════════════════════════
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const submitBtn = document.getElementById("form-submit-btn");

      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          formStatus.textContent = "✅ Message sent successfully! I'll get back to you soon.";
          formStatus.className = "form-status success";
          contactForm.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        // Fallback: open mailto link
        const name    = formData.get("name");
        const email   = formData.get("email");
        const subject = formData.get("subject");
        const message = formData.get("message");
        const mailtoLink = `mailto:justusfaby@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoLink;

        formStatus.textContent = "📧 Opening your email client as a fallback...";
        formStatus.className = "form-status info";
      } finally {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;

        // Clear status after 5 seconds
        setTimeout(() => {
          formStatus.textContent = "";
          formStatus.className = "form-status";
        }, 5000);
      }
    });
  }


  // ═══════════════════════════════════════════════════
  // 10. PRELOADER (optional — fade out after load)
  // ═══════════════════════════════════════════════════
  document.body.classList.add("loaded");

});
