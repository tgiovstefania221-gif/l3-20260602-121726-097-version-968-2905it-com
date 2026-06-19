(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var video = document.getElementById("moviePlayer");
        var button = document.getElementById("playerStart");
        var config = window.playerConfig || {};
        var streamUrl = config.url || "";
        var started = false;
        var hlsInstance = null;

        if (!video || !button || !streamUrl) {
            return;
        }

        function attachAndPlay() {
            if (!started) {
                started = true;
                button.classList.add("is-hidden");
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        lowLatencyMode: true,
                        enableWorker: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = streamUrl;
                }
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        button.addEventListener("click", attachAndPlay);
        video.addEventListener("click", function () {
            if (!started) {
                attachAndPlay();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    });
})();
