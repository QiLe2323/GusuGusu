const spatialAR = (() => {
  const root = document.getElementById("gusu-ar");
  const status = document.getElementById("gusu-ar-status");
  const reticle = document.getElementById("gusu-ar-reticle");
  const placeButton = document.getElementById("gusu-ar-place-photo");
  const resetButton = document.getElementById("gusu-ar-reset");
  const adjust = document.getElementById("gusu-ar-adjust");
  const opacity = document.getElementById("gusu-ar-opacity");
  const size = document.getElementById("gusu-ar-size");
  let active = null;

  function makeRenderer(gl, image) {
    const vertex = `
      attribute vec2 aPosition;
      uniform mat4 uProjection, uView, uModel;
      uniform vec2 uSize;
      uniform float uStand;
      varying vec2 vUV;
      void main() {
        vUV = aPosition + vec2(0.5);
        vec2 point = (aPosition + vec2(0.0, uStand)) * uSize;
        gl_Position = uProjection * uView * uModel * vec4(point, 0.0, 1.0);
      }
    `;
    const fragment = `
      precision mediump float;
      uniform sampler2D uPhoto;
      uniform float uOpacity;
      varying vec2 vUV;
      void main() {
        vec4 photo = texture2D(uPhoto, vUV);
        gl_FragColor = vec4(photo.rgb, photo.a * uOpacity);
      }
    `;
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-.5, -.5, .5, -.5, -.5, .5, .5, .5]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(gl.getUniformLocation(program, "uPhoto"), 0);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const uniforms = Object.fromEntries(["Projection", "View", "Model", "Size", "Stand", "Opacity"]
      .map(name => [name, gl.getUniformLocation(program, "u" + name)]));
    const aspect = image.naturalWidth / image.naturalHeight;
    return {
      draw(layer, viewer, matrix, stand) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!viewer || !matrix) return;
        const width = Number(size.value);
        gl.uniformMatrix4fv(uniforms.Model, false, matrix);
        gl.uniform2f(uniforms.Size, width, width / aspect);
        gl.uniform1f(uniforms.Stand, stand ? .5 : 0);
        gl.uniform1f(uniforms.Opacity, Number(opacity.value));
        for (const view of viewer.views) {
          const viewport = layer.getViewport(view);
          gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
          gl.uniformMatrix4fv(uniforms.Projection, false, view.projectionMatrix);
          gl.uniformMatrix4fv(uniforms.View, false, view.transform.inverse.matrix);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      },
      dispose() {
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
    };
  }

  function placePhoto(state, frame, hit, viewer) {
    const { position, matrix } = hit.transform;
    const eye = viewer.transform.position;
    // The hit pose's +Y is the surface normal. A wall gets an upright, wall-facing card.
    const wall = Math.abs(matrix[5]) < .45;
    const towardX = eye.x - position.x;
    const towardZ = eye.z - position.z;
    const side = matrix[4] * towardX + matrix[6] * towardZ >= 0 ? 1 : -1;
    const yaw = Math.atan2(wall ? side * matrix[4] : towardX, wall ? side * matrix[6] : towardZ);
    const transform = new XRRigidTransform(
      { x: position.x + .02 * Math.sin(yaw), y: position.y, z: position.z + .02 * Math.cos(yaw) },
      { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) }
    );
    const placement = { matrix: transform.matrix, stand: matrix[5] > .65, anchor: null };
    state.placement = placement;
    state.wasPlaced = true;
    if (typeof frame.createAnchor === "function") {
      try {
        frame.createAnchor(transform, state.local).then(anchor => {
          if (state.ended || state.placement !== placement) anchor.delete();
          else placement.anchor = anchor;
        }).catch(() => {});
      } catch {
        // The local reference space still tracks the same pose for this session.
      }
    }
  }

  function clearPlacement(state) {
    state.placement?.anchor?.delete();
    state.placement = null;
    state.placeRequested = false;
  }

  function describe(state, ready, tracking) {
    const placed = Boolean(state.placement);
    const message = placed
      ? (tracking ? "旧照已固定。移动手机观察，也可以调整宽度和透明度。" : "追踪暂时中断，请慢慢转回放置位置。")
      : (ready ? "已找到表面。对准想放置的位置，再点下方按钮。" : "缓慢移动手机，扫描墙面或地面。");
    if (status.textContent === message) return;
    status.textContent = message;
    reticle.hidden = !ready || placed;
    placeButton.hidden = placed;
    placeButton.disabled = !ready;
    adjust.hidden = !placed;
    resetButton.hidden = !placed;
  }

  function renderFrame(state, frame) {
    const { session, local, hitSource, layer, renderer } = state;
    const pose = frame.getViewerPose(local);
    const viewer = pose?.emulatedPosition ? null : pose;
    const hit = viewer && !state.placement ? frame.getHitTestResults(hitSource)[0]?.getPose(local) : null;
    if (state.placeRequested && hit) placePhoto(state, frame, hit, viewer);
    state.placeRequested = false;
    const placement = state.placement;
    const anchorPose = viewer && placement?.anchor ? frame.getPose(placement.anchor.anchorSpace, local) : null;
    const matrix = placement?.anchor
      ? (anchorPose?.emulatedPosition ? null : anchorPose?.transform.matrix)
      : placement?.matrix;
    describe(state, Boolean(hit), Boolean(viewer && matrix));
    renderer.draw(layer, viewer, matrix, placement?.stand);
  }

  function scheduleFrame(state) {
    state.session.requestAnimationFrame((time, frame) => {
      if (state.ended || state.closing) return;
      try {
        renderFrame(state, frame);
        scheduleFrame(state);
      } catch {
        state.message = "AR 追踪已中断，可以重试或切换到手动叠加。";
        endSession(state);
      }
    });
  }

  function endSession(state) {
    if (!state.session || state.ended || state.closing) return Promise.resolve();
    state.closing = true;
    return state.session.end().catch(() => {});
  }

  async function setup(state, place) {
    const { session } = state;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", { alpha: true, xrCompatible: true });
    if (!gl) throw new Error("WebGL unavailable");
    const [local, viewer, image] = await Promise.all([
      session.requestReferenceSpace("local"),
      session.requestReferenceSpace("viewer"),
      loadImage(place.oldPhoto),
      gl.makeXRCompatible()
    ]);
    if (state.ended) return;
    const hitSource = await session.requestHitTestSource({ space: viewer, entityTypes: ["plane"] });
    if (state.ended) return;
    state.local = local;
    state.hitSource = hitSource;
    state.layer = new XRWebGLLayer(session, gl, { alpha: true });
    state.renderer = makeRenderer(gl, image);
    session.updateRenderState({ baseLayer: state.layer });
    local.addEventListener("reset", () => {
      if (!state.placement?.anchor) clearPlacement(state);
    });
  }

  async function start(place) {
    if (!window.isSecureContext || !navigator.xr) {
      return { message: "当前浏览器无法启动空间 AR。可在支持 WebXR 的设备上打开 HTTPS 页面，或使用手动叠加。" };
    }
    if (active) return {};
    const state = { ended: false, closing: false, placement: null, placeRequested: false, wasPlaced: false };
    active = state;
    root.hidden = false;
    document.getElementById("gusu-ar-place").textContent = place.cn;
    document.getElementById("gusu-ar-credit").textContent = place.oldCredit;
    describe(state, false, false);
    status.textContent = "正在启动空间 AR…";
    opacity.value = ".65";
    size.value = "2.4";
    try {
      // Request inside the click activation so the browser can present its permission UI.
      state.session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        optionalFeatures: ["anchors"],
        domOverlay: { root }
      });
      const ended = new Promise(resolve => state.session.addEventListener("end", () => {
        state.ended = true;
        resolve();
      }, { once: true }));
      if (state.cancelled) await endSession(state);
      else {
        root.setAttribute("data-running", "");
        await Promise.race([setup(state, place), ended]);
        if (!state.ended && !state.closing) scheduleFrame(state);
      }
      await ended;
      return { placed: state.wasPlaced, message: state.message };
    } catch (error) {
      await endSession(state);
      const message = error.name === "NotAllowedError" || error.name === "SecurityError"
        ? "空间 AR 权限未开启。可检查浏览器权限后重试，或使用手动叠加。"
        : "此设备未能开启空间 AR。可使用支持 WebXR 的设备，或切换到手动叠加。";
      return { message };
    } finally {
      clearPlacement(state);
      state.renderer?.dispose();
      root.hidden = true;
      root.removeAttribute("data-running");
      active = null;
    }
  }

  function stop() {
    if (!active) return;
    active.cancelled = true;
    endSession(active);
  }

  document.getElementById("gusu-ar-exit").addEventListener("click", stop);
  placeButton.addEventListener("click", () => {
    if (active) active.placeRequested = true;
  });
  resetButton.addEventListener("click", () => {
    if (active) clearPlacement(active);
  });
  window.addEventListener("pagehide", stop);
  return { start };
})();
