(function () {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector(".floating-nav");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const themeButton = document.querySelector("[data-theme-toggle]");
  const savedTheme = window.localStorage.getItem("jackyyujia-theme");

  root.dataset.theme = savedTheme === "dark" ? "dark" : "light";

  function syncThemeLabel() {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", dark ? "切换为浅色模式" : "切换为暗色模式");
  }

  syncThemeLabel();

  themeButton?.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("jackyyujia-theme", root.dataset.theme);
    syncThemeLabel();
  });

  menuButton?.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const panels = [...document.querySelectorAll(".accordion-panel")];

  function activatePanel(panel) {
    panels.forEach((item) => {
      const active = item === panel;
      item.classList.toggle("is-active", active);
      item.querySelector("button")?.setAttribute("aria-expanded", String(active));
    });
  }

  panels.forEach((panel) => {
    panel.addEventListener("mouseenter", () => {
      if (window.innerWidth > 760) activatePanel(panel);
    });
    panel.querySelector("button")?.addEventListener("click", () => activatePanel(panel));
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activatePanel(panel);
      }
    });
  });

  const slides = [...document.querySelectorAll(".principle-slide")];
  const indexLabel = document.querySelector("[data-carousel-index]");
  let slideIndex = 0;

  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, itemIndex) => slide.classList.toggle("is-active", itemIndex === slideIndex));
    if (indexLabel) indexLabel.textContent = `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }

  document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => showSlide(slideIndex - 1));
  document.querySelector("[data-carousel-next]")?.addEventListener("click", () => showSlide(slideIndex + 1));

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  const observedSections = [...document.querySelectorAll("section[id]")];
  const navigationLinks = [...document.querySelectorAll(".nav-links a")];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navigationLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-38% 0px -52% 0px", threshold: [0, .2, .6] });
    observedSections.forEach((section) => observer.observe(section));
  }

  if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  root.dataset.motion = "gsap";

  window.gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".floating-nav", { y: -30, opacity: 0, duration: .7 })
    .from(".hero-intro", { y: 24, opacity: 0, duration: .55 }, "-=.25")
    .from(".hero h1", { y: 54, opacity: 0, duration: .85 }, "-=.3")
    .from(".hero-lead, .hero-actions", { y: 24, opacity: 0, stagger: .1, duration: .55 }, "-=.42")
    .from(".portrait-frame", { scale: .76, opacity: 0, rotate: 8, duration: .8 }, "-=.72")
    .from(".hero-project", { y: 80, scale: .82, opacity: 0, stagger: .12, duration: .72 }, "-=.56");

  window.gsap.utils.toArray(".bento-card").forEach((card, index) => {
    window.gsap.from(card, {
      y: 55 + index * 5,
      opacity: 0,
      scale: .94,
      duration: .7,
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true
      }
    });
  });

  const mediaQuery = window.gsap.matchMedia();

  mediaQuery.add("(min-width: 1025px)", () => {
    const heading = document.querySelector("[data-pin-heading]");
    const stream = document.querySelector(".experience-stream");
    if (heading && stream) {
      window.ScrollTrigger.create({
        trigger: ".experience-layout",
        start: "top 105px",
        end: () => `+=${Math.max(0, stream.offsetHeight - heading.offsetHeight)}`,
        pin: heading
      });
    }

    const cards = window.gsap.utils.toArray(".stack-card");
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;
      window.gsap.to(card, {
        scale: .9 + index * .018,
        opacity: .35,
        filter: "brightness(.72)",
        ease: "none",
        scrollTrigger: {
          trigger: cards[index + 1],
          start: "top 82%",
          end: "top 18%",
          scrub: true
        }
      });
    });
  });
})();
