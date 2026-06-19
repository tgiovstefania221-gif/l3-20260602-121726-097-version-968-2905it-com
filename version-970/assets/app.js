(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, current) {
            dot.addEventListener("click", function () {
                show(current);
                play();
            });
        });
        play();
    }

    function initPageFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var section = panel.parentElement;
            if (!section) {
                return;
            }
            var cards = Array.prototype.slice.call(section.querySelectorAll("[data-card]"));
            var input = panel.querySelector("[data-filter-input]");
            var typeSelect = panel.querySelector("[data-filter-type]");
            var yearSelect = panel.querySelector("[data-filter-year]");

            function apply() {
                var keyword = normalize(input && input.value);
                var type = normalize(typeSelect && typeSelect.value);
                var year = normalize(yearSelect && yearSelect.value);
                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-category")
                    ].join(" "));
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedType = !type || normalize(card.getAttribute("data-type")).indexOf(type) !== -1;
                    var matchedYear = !year || normalize(card.getAttribute("data-year")) === year;
                    card.classList.toggle("is-hidden", !(matchedKeyword && matchedType && matchedYear));
                });
            }

            [input, typeSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    function initGlobalSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-global-search]"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var target = "./search.html";
                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });
    }

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<article class=\"movie-card\">",
            "<a class=\"poster-link\" href=\"" + movie.url + "\" title=\"" + escapeHtml(movie.title) + "\">",
            "<img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
            "<span class=\"poster-shade\"></span>",
            "<span class=\"poster-play\">▶</span>",
            "</a>",
            "<div class=\"movie-card-body\">",
            "<div class=\"movie-meta-line\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
            "<h3><a href=\"" + movie.url + "\">" + escapeHtml(movie.title) + "</a></h3>",
            "<p>" + escapeHtml(movie.oneLine) + "</p>",
            "<div class=\"tag-row\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function escapeHtml(value) {
        return (value || "").toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function initSearchPage() {
        var results = document.getElementById("searchResults");
        var input = document.getElementById("searchPageInput");
        var count = document.getElementById("searchCount");
        var form = document.querySelector("[data-search-page-form]");
        if (!results || !input || !window.SEARCH_DATA) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        input.value = initial;

        function render() {
            var keyword = normalize(input.value);
            if (!keyword) {
                results.innerHTML = "";
                if (count) {
                    count.textContent = "输入关键词开始搜索";
                }
                return;
            }
            var matched = window.SEARCH_DATA.filter(function (movie) {
                var text = normalize([
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.category,
                    (movie.tags || []).join(" ")
                ].join(" "));
                return text.indexOf(keyword) !== -1;
            }).slice(0, 96);
            results.innerHTML = matched.map(cardTemplate).join("");
            if (count) {
                count.textContent = "找到 " + matched.length + " 条相关内容";
            }
        }

        input.addEventListener("input", render);
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                render();
            });
        }
        render();
    }

    ready(function () {
        initMenu();
        initHero();
        initPageFilters();
        initGlobalSearchForms();
        initSearchPage();
    });
})();
