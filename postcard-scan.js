function scanPostcard({ imageUrl, video, field, update }) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  let worker, stream, timer, lastCorners, stopped = false, recognized = false, hits = 0;

  function stop() {
    stopped = true;
    clearTimeout(timer);
    worker?.terminate();
    stream?.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  function fail(message) {
    if (stopped) return;
    stop();
    update({ message: field ? `${message} 也可以返回完成观察题。` : message, failed: true });
  }

  function pixels(source, width, height, maxSide) {
    const ratio = Math.min(1, maxSide / Math.max(width, height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    return { width: canvas.width, height: canvas.height, buffer: data.buffer };
  }

  function requestFrame() {
    if (stopped) return;
    timer = setTimeout(() => {
      if (!video.videoWidth || video.readyState < 2) {
        requestFrame();
        return;
      }
      try {
        const frame = pixels(video, video.videoWidth, video.videoHeight, 600);
        worker.postMessage({ type: "frame", frame }, [frame.buffer]);
      } catch {
        fail("画面暂时无法读取，请重新扫描。");
      }
    }, 140);
  }

  async function start() {
    if (stopped) return;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.Worker || !context) {
      fail("当前浏览器无法扫描明信片。请用支持相机的 HTTPS 页面。");
      return;
    }
    try {
      worker = new Worker("postcard-tracker-worker.js?v=2");
      worker.onerror = () => fail("图像识别未能启动，请重新扫描。");
      worker.onmessage = ({ data }) => {
        if (stopped) return;
        if (data.type === "ready") {
          if (!data.usable) return fail("这张照片可追踪的细节太少，无法扫描。");
          update({ message: "对准明信片正面的老照片，让照片占画面一半以上。", referenceAspect: image.naturalWidth / image.naturalHeight });
        } else {
          const { corners } = data;
          const aligned = corners && lastCorners && corners.every(([x, y], index) =>
            Math.hypot(x - lastCorners[index][0], y - lastCorners[index][1]) < .16);
          hits = corners ? (aligned ? hits + 1 : 1) : 0;
          lastCorners = corners;
          recognized ||= hits >= 2;
          update({
            corners: recognized ? corners : null,
            recognized,
            message: "对准正面老照片，避开反光并稍停一下。"
          });
        }
        requestFrame();
      };
      const image = await loadImage(imageUrl);
      if (stopped) return;
      const camera = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 } }, audio: false
      });
      if (stopped) {
        camera.getTracks().forEach(track => track.stop());
        return;
      }
      stream = camera;
      stream.getVideoTracks().forEach(track => track.addEventListener("ended", () =>
        fail("相机已关闭，请重新扫描。")));
      video.srcObject = stream;
      await video.play();
      if (stopped) return;
      const frames = [520, 390, 285, 205].map(size =>
        pixels(image, image.naturalWidth, image.naturalHeight, size));
      worker.postMessage({ type: "reference", frames }, frames.map(frame => frame.buffer));
    } catch (error) {
      fail(error.name === "NotAllowedError" ? "请允许相机权限后重新扫描。" : "相机未能开启，请重试。");
    }
  }

  queueMicrotask(start);
  return { stop };
}
