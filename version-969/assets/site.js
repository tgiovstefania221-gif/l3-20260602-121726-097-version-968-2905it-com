import { H as Hls } from "./hls.js";

const ready = (callback) => {
  if (document.readyState !== "loading") {
    callback();
    return;
  }
  document.addEventListener("DOMContentLoaded", callback);
};

const getText = (node) => (node.dataset.search || node.textContent || "").toLowerCase();

const setupMenu = () => {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!button || !menu) {
    return;
  }
  button.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
};

const setupSearch = () => {
  document.querySelectorAll("[data-search-input]").forEach((input) => {
    const scopeSelector = input.dataset.searchInput;
    const scope = document.querySelector(scopeSelector) || document;
    const cards = Array.from(scope.querySelectorAll("[data-search-card]"));
    const empty = document.querySelector(input.dataset.emptyTarget || "");

    input.addEventListener("input", () => {
      const value = input.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach((card) => {
        const matched = !value || getText(card).includes(value);
        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    });
  });
};

const setupFilters = () => {
  document.querySelectorAll("[data-filter-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]");
      const scope = document.querySelector(button.dataset.scope || "#movie-grid") || document;
      const cards = Array.from(scope.querySelectorAll("[data-search-card]"));
      const filter = button.dataset.filterValue || "all";

      if (group) {
        group.querySelectorAll("[data-filter-button]").forEach((item) => item.classList.remove("is-active"));
      }
      button.classList.add("is-active");

      cards.forEach((card) => {
        const type = card.dataset.type || "";
        const matched = filter === "all" || type.includes(filter);
        card.hidden = !matched;
      });
    });
  });
};

const setupHero = () => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  let active = 0;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => show(index));
  });

  show(0);
  if (slides.length > 1) {
    window.setInterval(() => show(active + 1), 5800);
  }
};

const loadVideo = async (video, button) => {
  const source = video.dataset.hls || button?.dataset.hls || "";
  if (!source) {
    return;
  }

  if (video.dataset.loaded !== "true") {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    }
    video.dataset.loaded = "true";
  }

  video.controls = true;
  try {
    await video.play();
    if (button) {
      button.classList.add("is-playing");
      button.textContent = "正在播放";
    }
  } catch (error) {
    if (button) {
      button.textContent = "点击播放";
    }
  }
};

const setupPlayers = () => {
  document.querySelectorAll("[data-player]").forEach((player) => {
    const video = player.querySelector("video");
    const button = player.querySelector("[data-play-button]");
    if (!video) {
      return;
    }

    const handler = () => loadVideo(video, button);
    video.addEventListener("click", handler);
    if (button) {
      button.addEventListener("click", handler);
    }
  });
};

const setupImageFallback = () => {
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-hidden-image");
    });
  });
};

ready(() => {
  setupMenu();
  setupSearch();
  setupFilters();
  setupHero();
  setupPlayers();
  setupImageFallback();
});
