(function () {
  var hlsLoaderPromise = null;

  function loadHlsLibrary() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsLoaderPromise) {
      return hlsLoaderPromise;
    }

    hlsLoaderPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsLoaderPromise;
  }

  function destroyCurrentHls(video) {
    if (video._hlsInstance) {
      video._hlsInstance.destroy();
      video._hlsInstance = null;
    }
  }

  function bindSource(video, source) {
    if (!source) {
      return Promise.reject(new Error('empty source'));
    }

    destroyCurrentHls(video);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    return loadHlsLibrary().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) {
        video.src = source;
        return;
      }

      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      video._hlsInstance = hls;
    });
  }

  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var playButton = shell.querySelector('[data-play]');
    var sourceButtons = Array.prototype.slice.call(document.querySelectorAll('[data-source]'));
    var currentSource = shell.dataset.src;

    if (!video || !currentSource) {
      return;
    }

    function activateSource(source) {
      currentSource = source;
      shell.dataset.src = source;

      sourceButtons.forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.source === source);
      });

      return bindSource(video, source);
    }

    sourceButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activateSource(button.dataset.source).then(function () {
          video.play().catch(function () {});
          shell.classList.add('is-playing');
        });
      });
    });

    if (playButton) {
      playButton.addEventListener('click', function () {
        activateSource(currentSource).then(function () {
          video.play().catch(function () {});
          shell.classList.add('is-playing');
        });
      });
    }

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime <= 0 || video.ended) {
        shell.classList.remove('is-playing');
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
