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

// Screenshot gallery lightbox (shared by every page with .screenshot-panel buttons)
const galleryModal = document.getElementById("galleryModal");

if (galleryModal) {
  const galleryContent = galleryModal.querySelector(".gallery-modal-content");
  const galleryImage = galleryModal.querySelector("#galleryImage");
  const galleryTitle = galleryModal.querySelector("#galleryTitle");
  const galleryClose = galleryModal.querySelector(".gallery-close");
  const panels = Array.from(document.querySelectorAll(".screenshot-panel"));
  let galleryIndex = -1;
  let galleryTrigger = null;

  const galleryFooter = document.createElement("div");
  galleryFooter.className = "gallery-footer";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.className = "gallery-arrow";
  prevButton.textContent = "← Prev";

  const counter = document.createElement("span");
  counter.className = "gallery-counter";
  counter.setAttribute("aria-live", "polite");

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "gallery-arrow";
  nextButton.textContent = "Next →";

  galleryFooter.append(prevButton, counter, nextButton);
  galleryContent.append(galleryFooter);

  galleryImage.addEventListener("load", () => {
    galleryImage.classList.add("is-loaded");
  });

  const isGalleryOpen = () => galleryModal.classList.contains("is-open");

  const showGallerySlide = (index) => {
    const total = panels.length;
    galleryIndex = ((index % total) + total) % total;
    const panel = panels[galleryIndex];
    const title = panel.getAttribute("data-title") || "";
    const panelImage = panel.querySelector("img");

    galleryImage.classList.remove("is-loaded");
    galleryImage.src = panel.getAttribute("data-image");
    galleryImage.alt = (panelImage && panelImage.alt) || title;
    galleryTitle.textContent = title;
    counter.textContent = galleryIndex + 1 + " / " + total;

    if (galleryImage.complete && galleryImage.naturalWidth > 0) {
      galleryImage.classList.add("is-loaded");
    }
  };

  const openGallery = (index, trigger) => {
    if (!panels.length) return;
    galleryTrigger = trigger;
    showGallerySlide(index);
    galleryModal.classList.add("is-open");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    galleryClose.focus();
  };

  const closeGallery = () => {
    if (!isGalleryOpen()) return;
    galleryModal.classList.remove("is-open");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    galleryIndex = -1;
    galleryImage.src = "";
    galleryImage.classList.remove("is-loaded");
    if (galleryTrigger) galleryTrigger.focus();
  };

  panels.forEach((panel, index) => {
    panel.addEventListener("click", () => openGallery(index, panel));
  });

  galleryModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-gallery]")) closeGallery();
  });

  prevButton.addEventListener("click", () => showGallerySlide(galleryIndex - 1));
  nextButton.addEventListener("click", () => showGallerySlide(galleryIndex + 1));

  document.addEventListener("keydown", (event) => {
    if (!isGalleryOpen()) return;

    if (event.key === "Escape") {
      closeGallery();
      return;
    }

    if (event.key === "ArrowLeft" && panels.length > 1) {
      event.preventDefault();
      showGallerySlide(galleryIndex - 1);
    }

    if (event.key === "ArrowRight" && panels.length > 1) {
      event.preventDefault();
      showGallerySlide(galleryIndex + 1);
    }

    if (event.key === "Tab") {
      const focusable = Array.from(
        galleryModal.querySelectorAll("button:not(:disabled)")
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

