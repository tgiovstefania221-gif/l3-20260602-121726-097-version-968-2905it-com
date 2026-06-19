(function () {
  var body = document.body;
  var navToggle = document.querySelector('[data-nav-toggle]');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      body.classList.toggle('is-nav-open');
    });
  }

  function setupHero(hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  document.querySelectorAll('[data-hero]').forEach(setupHero);

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilter(scope) {
    var input = scope.querySelector('[data-search-input]');
    var yearFilter = scope.querySelector('[data-year-filter]');
    var typeFilter = scope.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var resultCount = scope.querySelector('[data-result-count]');

    if (!input && !yearFilter && !typeFilter) {
      return;
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var year = yearFilter ? yearFilter.value : '';
      var type = normalize(typeFilter ? typeFilter.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.textContent
        ].join(' '));
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchYear = !year || String(card.dataset.year) === String(year);
        var matchType = !type || normalize(card.dataset.type) === type;
        var keep = matchQuery && matchYear && matchType;

        card.classList.toggle('is-hidden', !keep);

        if (keep) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = '共 ' + visible + ' 部内容';
      }
    }

    [input, yearFilter, typeFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  document.querySelectorAll('main, body').forEach(setupFilter);
})();
