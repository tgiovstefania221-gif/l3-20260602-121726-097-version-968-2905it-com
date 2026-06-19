import { H as Hls } from './hls.js';

const video = document.querySelector('video[data-m3u8]');
const message = document.querySelector('[data-player-message]');

function setMessage(text) {
  if (message) {
    message.textContent = text;
  }
}

if (video) {
  const source = video.getAttribute('data-m3u8');

  if (source && Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      setMessage('播放源已就绪，可点击播放器开始观看。');
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setMessage('网络加载异常，正在尝试重新连接播放源。');
        hls.startLoad();
        return;
      }

      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setMessage('媒体解码异常，正在尝试恢复播放。');
        hls.recoverMediaError();
        return;
      }

      setMessage('当前浏览器暂时无法播放该视频源。');
      hls.destroy();
    });
  } else if (source && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    setMessage('播放源已就绪，可点击播放器开始观看。');
  } else {
    setMessage('当前浏览器不支持 HLS 播放。');
  }
}
