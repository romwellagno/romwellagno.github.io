document.documentElement.classList.add("js-enabled");

const revealElements = document.querySelectorAll(
  ".reveal-section, .hero, .section, .project-item, .card, .detail-card, .dashboard-card, .live-panel, .timeline-item, .screenshot-panel, .media-frame"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -30px 0px"
  }
);

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 28, 280)}ms`);
  revealObserver.observe(element);
});

const glowCards = document.querySelectorAll(
  ".glow-card, .dashboard-card, .live-card, .project-item, .card, .detail-card, .timeline-content"
);

glowCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "0%");
  });
});
