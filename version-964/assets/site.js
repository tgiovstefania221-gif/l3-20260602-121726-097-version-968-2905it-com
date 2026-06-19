(function () {
  var nav = document.querySelector('.site-nav');
  var menu = document.querySelector('.menu-toggle');

  if (menu && nav) {
    menu.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot) {
      dot.classList.toggle('active', Number(dot.getAttribute('data-hero-index')) === current);
    });
  }

  function startTimer() {
    if (timer || !slides.length) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function resetTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    startTimer();
  }

  if (slides.length) {
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-index')));
        resetTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        resetTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        resetTimer();
      });
    }

    startTimer();
  }

  var filter = document.querySelector('.filter-input');

  if (filter) {
    filter.addEventListener('input', function () {
      var value = filter.value.trim().toLowerCase();
      var items = Array.prototype.slice.call(document.querySelectorAll('.js-filter-item, .library-block li'));

      items.forEach(function (item) {
        var text = (item.getAttribute('data-title') || '') + ' ' + (item.getAttribute('data-meta') || '') + ' ' + item.textContent;
        item.style.display = text.toLowerCase().indexOf(value) === -1 ? 'none' : '';
      });
    });
  }
})();
