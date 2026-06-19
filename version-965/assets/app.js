(function() {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var previous = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startTimer() {
    if (!slides.length) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function() {
      showSlide(current + 1);
    }, 6500);
  }

  if (previous) {
    previous.addEventListener('click', function() {
      showSlide(current - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', function() {
      showSlide(current + 1);
      startTimer();
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      startTimer();
    });
  });

  showSlide(0);
  startTimer();

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]')).forEach(function(area) {
    var input = area.querySelector('.movie-search-input');
    var buttons = Array.prototype.slice.call(area.querySelectorAll('[data-filter-value]'));
    var cards = Array.prototype.slice.call(area.querySelectorAll('.movie-card'));
    var activeFilter = 'all';

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function matchFilter(cardText, filterText) {
      if (filterText === 'all') {
        return true;
      }
      return filterText.split(' ').some(function(part) {
        return part && cardText.indexOf(part) !== -1;
      });
    }

    function updateCards() {
      var query = normalize(input ? input.value : '');
      var filter = normalize(activeFilter);
      cards.forEach(function(card) {
        var searchText = normalize(card.getAttribute('data-search'));
        var genreText = normalize(card.getAttribute('data-genre'));
        var combined = searchText + ' ' + genreText;
        var visible = (!query || combined.indexOf(query) !== -1) && matchFilter(combined, filter);
        card.classList.toggle('is-hidden', !visible);
      });
    }

    if (input) {
      input.addEventListener('input', updateCards);
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        buttons.forEach(function(item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = button.getAttribute('data-filter-value') || 'all';
        updateCards();
      });
    });
  });
})();
