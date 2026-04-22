/* ══════════════════════════════════════════
   YGYM — app.js
   ══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── Mobile nav toggle ───────────────────── */
  const toggle = document.getElementById("toggle");
  const navUl  = document.getElementById("navigation");

  toggle.addEventListener("click", () => navUl.classList.toggle("active"));

  // Close nav when any link clicked
  navUl.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navUl.classList.remove("active"))
  );

  /* ── Active nav link on scroll ───────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav ul li a");

  function setActiveLink() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinks.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current)
    );
  }

  /* ── Scroll reveal ───────────────────────── */
  const reveals = document.querySelectorAll(".reveal, .trainer-card, .tip-card, .price-card");

  function handleReveal() {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60)
        el.classList.add("show");
    });
  }

  /* ── Progress bar ────────────────────────── */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + "%";
  }

  /* ── Back to top ─────────────────────────── */
  const backTop = document.getElementById("backTop");
  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ── Master scroll handler ───────────────── */
  function onScroll() {
    setActiveLink();
    handleReveal();
    updateProgress();
    backTop.classList.toggle("visible", window.scrollY > 400);
  }

  window.addEventListener("scroll", onScroll);
  handleReveal(); // Run on load

  /* ── Counter animation ───────────────────── */
  function animateCounters() {
    document.querySelectorAll(".stat-num[data-target]").forEach(el => {
      const target = +el.dataset.target;
      const suffix = target >= 100 ? "+" : "";
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + suffix;
        if (count >= target) clearInterval(timer);
      }, 25);
    });
  }
  setTimeout(animateCounters, 1200);

  /* ── Training systems tabs ───────────────── */
  const tabBtns   = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });


  /* ── System picker cards (new UI) ─────────── */
  const pickerCards = document.querySelectorAll(".picker-card");

  pickerCards.forEach(card => {
    card.addEventListener("click", () => {
      const target = card.dataset.tab;

      // Update picker active state
      pickerCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      // Update tab panels
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");

      // Also sync hidden tab buttons
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === target);
      });
    });
  });


  /* ── Day card focus / expand ─────────────── */
  function initDayCards() {
    document.querySelectorAll(".days-grid").forEach(grid => {
      grid.querySelectorAll(".day-card").forEach(card => {
        // Make card clickable
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
          // If already in focus mode, ignore click on the focused card
          if (grid.classList.contains("focus-mode")) return;
          focusDay(grid, card);
        });
      });
    });
  }

  function focusDay(grid, activeCard) {
    const panel   = grid.closest(".tab-panel");
    const backBar = panel.querySelector(".days-back-bar");
    const label   = panel.querySelector(".days-back-label");
    const dayName = activeCard.querySelector(".day-name")?.textContent || "";
    const dayMuscle = activeCard.querySelector(".day-muscle")?.textContent || "";

    // Hide all cards except chosen one
    grid.querySelectorAll(".day-card").forEach(c => {
      if (c !== activeCard) {
        c.classList.add("day-hidden");
      }
    });

    // Expand the chosen card
    activeCard.classList.add("day-focused");

    // Show back bar with day name
    label.textContent = dayName + (dayMuscle ? " — " + dayMuscle : "");
    backBar.style.display = "flex";

    // Mark grid in focus mode
    grid.classList.add("focus-mode");

    // Scroll card into view smoothly
    setTimeout(() => activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  }

  // Global function called by back button onclick
  window.resetDayCards = function(btn) {
    const panel   = btn.closest(".tab-panel");
    const grid    = panel.querySelector(".days-grid");
    const backBar = panel.querySelector(".days-back-bar");

    grid.querySelectorAll(".day-card").forEach(c => {
      c.classList.remove("day-hidden", "day-focused");
    });
    grid.classList.remove("focus-mode");
    backBar.style.display = "none";
  };

  initDayCards();

});
