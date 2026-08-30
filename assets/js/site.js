(function () {
  const projectRoot = window.location.pathname.startsWith("/caoyujia.github.io") ? "/caoyujia.github.io" : "";
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const overlay = document.querySelector(".mobile-overlay");
  const searchInput = document.querySelector("[data-search-input]");
  const postCards = [...document.querySelectorAll("[data-searchable]")];

  const storedTheme = window.localStorage.getItem("caoyujia-theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    root.dataset.theme = storedTheme;
  } else {
    root.dataset.theme = "light";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    const isLight = root.dataset.theme === "light";
    themeButton.textContent = isLight ? "◑" : "◐";
    themeButton.setAttribute("aria-label", isLight ? "切换为暗色模式" : "切换为浅色模式");
    themeButton.title = themeButton.getAttribute("aria-label");
  }

  updateThemeLabel();

  themeButton?.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    window.localStorage.setItem("caoyujia-theme", root.dataset.theme);
    updateThemeLabel();
  });

  function closeMenu() {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  menuButton?.addEventListener("click", function () {
    const open = body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  overlay?.addEventListener("click", closeMenu);
  document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.setAttribute("href", projectRoot + link.getAttribute("href"));
  });

  searchInput?.addEventListener("input", function (event) {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;
    postCards.forEach((card) => {
      const match = !query || card.dataset.searchable.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });
    const list = document.querySelector(".post-list");
    list?.classList.toggle("search-active", Boolean(query && visible === 0));
  });

  searchInput?.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !postCards.length && searchInput.value.trim()) {
      window.location.href = `${projectRoot}/?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });

  const queryParam = new URLSearchParams(window.location.search).get("q");
  if (queryParam && searchInput && postCards.length) {
    searchInput.value = queryParam;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });
})();
