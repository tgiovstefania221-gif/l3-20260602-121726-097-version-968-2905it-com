(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let current = 0;

  function activateSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      activateSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      activateSlide(current + 1);
    }, 5200);
  }

  const searchRoot = document.querySelector('[data-search-results]');
  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');

  function createCard(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.detail + '" aria-label="查看' + escapeHtml(movie.title) + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
      '    <span class="card-category">' + escapeHtml(movie.category) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="' + movie.detail + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-meta">',
      '      <span>' + escapeHtml(String(movie.year)) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>评分 ' + escapeHtml(movie.rating) + '</span>',
      '    </div>',
      '    <div class="card-actions">',
      '      <a href="' + movie.play + '">立即播放</a>',
      '      <a href="' + movie.detail + '">查看详情</a>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSearch(query) {
    if (!searchRoot || !window.SEARCH_INDEX) {
      return;
    }

    const normalized = String(query || '').trim().toLowerCase();
    const results = window.SEARCH_INDEX.filter(function (movie) {
      if (!normalized) {
        return true;
      }

      const source = [
        movie.title,
        movie.category,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(' ').toLowerCase();

      return source.indexOf(normalized) !== -1;
    }).slice(0, 80);

    if (!results.length) {
      searchRoot.innerHTML = '<div class="no-results">未找到匹配内容，可以尝试输入影片名、题材、地区或年份。</div>';
      return;
    }

    searchRoot.innerHTML = results.map(createCard).join('\n');
  }

  if (searchForm && searchInput) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    searchInput.value = initial;
    renderSearch(initial);

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const query = searchInput.value.trim();
      const nextUrl = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
      window.history.replaceState(null, '', nextUrl);
      renderSearch(query);
    });
  }
})();
