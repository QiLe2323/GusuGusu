// JSFeat's browser bundle exports through window, including inside this worker.
self.window = self;
importScripts("vendor/jsfeat-0.0.8.min.js");

const referenceLevels = [];
const homography = new jsfeat.motion_model.homography2d();
const cornerPool = [];
const detectorOutput = new Proxy(cornerPool, {
  get(points, index) { return points[index] ||= new jsfeat.keypoint_t(); }
});

function featureAngle(gray, point) {
  const { data, cols } = gray;
  let momentX = 0;
  let momentY = 0;
  for (let y = -12; y <= 12; y += 1) {
    const half = Math.floor(Math.sqrt(144 - y * y));
    const row = (point.y + y) * cols + point.x;
    for (let x = -half; x <= half; x += 1) {
      momentX += x * data[row + x];
      momentY += y * data[row + x];
    }
  }
  return Math.atan2(momentY, momentX);
}

function describe({ width, height, buffer }, limit) {
  const gray = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
  jsfeat.imgproc.grayscale(new Uint8ClampedArray(buffer), width, height, gray);
  jsfeat.imgproc.gaussian_blur(gray, gray, 3);
  const count = jsfeat.yape06.detect(gray, detectorOutput, 24);
  const points = cornerPool.slice(0, count).sort((a, b) => b.score - a.score).slice(0, limit)
    .map(point => new jsfeat.keypoint_t(point.x, point.y, point.score));
  points.forEach(point => { point.angle = featureAngle(gray, point); });
  const descriptor = new jsfeat.matrix_t(32, points.length, jsfeat.U8C1_t);
  if (points.length) jsfeat.orb.describe(gray, points, points.length, descriptor);
  return { points, width, height, descriptor: descriptor.buffer.i32 };
}

function hammingBits(value) {
  value -= (value >>> 1) & 0x55555555;
  value = (value & 0x33333333) + ((value >>> 2) & 0x33333333);
  return Math.imul((value + (value >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
}

function matchPoints(reference, frame) {
  const matches = new Map();
  for (let i = 0; i < frame.points.length; i += 1) {
    let best = 256, second = 256, match = -1;
    for (let j = 0; j < reference.points.length; j += 1) {
      let distance = 0;
      for (let word = 0; word < 8; word += 1) {
        distance += hammingBits(frame.descriptor[i * 8 + word] ^ reference.descriptor[j * 8 + word]);
        if (distance >= second) break;
      }
      if (distance < best) {
        second = best;
        best = distance;
        match = j;
      } else if (distance < second) {
        second = distance;
      }
    }
    if (best > 76 || best >= second * .79) continue;
    if (!matches.has(match) || best < matches.get(match).distance) {
      matches.set(match, { from: reference.points[match], to: frame.points[i], distance: best });
    }
  }
  return [...matches.values()];
}

function projectQuad(matrix, reference, frame) {
  const { width, height } = reference;
  const corners = [[0, 0], [width, 0], [width, height], [0, height]].map(([x, y]) => {
    const depth = matrix[6] * x + matrix[7] * y + matrix[8];
    return [(matrix[0] * x + matrix[1] * y + matrix[2]) / depth / frame.width,
      (matrix[3] * x + matrix[4] * y + matrix[5]) / depth / frame.height];
  });
  if (corners.flat().some(value => !Number.isFinite(value) || value < -.25 || value > 1.25)) return null;
  let area = 0;
  for (let i = 0; i < 4; i += 1) {
    const [x, y] = corners[i];
    const [nextX, nextY] = corners[(i + 1) % 4];
    const [lastX, lastY] = corners[(i + 2) % 4];
    if ((nextX - x) * (lastY - nextY) - (nextY - y) * (lastX - nextX) <= 0) return null;
    area += x * nextY - nextX * y;
  }
  return area > .055 && area < 2.2 ? corners : null;
}

function findTarget(frame) {
  let result = null;
  for (const reference of referenceLevels) {
    const matches = matchPoints(reference, frame);
    if (matches.length < 10) continue;
    const from = matches.map(match => match.from);
    const to = matches.map(match => match.to);
    const matrix = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t);
    const mask = new jsfeat.matrix_t(matches.length, 1, jsfeat.U8C1_t);
    const params = new jsfeat.ransac_params_t(4, 4, .5, .99);
    if (!jsfeat.motion_estimator.ransac(params, homography, from, to, matches.length, matrix, mask, 100)) continue;
    const inliers = matches.filter((_, index) => mask.data[index]);
    if (inliers.length < 10 || inliers.length < matches.length * .38 || inliers.length <= (result?.count || 0)) continue;
    const xs = inliers.map(match => match.from.x);
    const ys = inliers.map(match => match.from.y);
    if (Math.max(...xs) - Math.min(...xs) < reference.width * .22 ||
        Math.max(...ys) - Math.min(...ys) < reference.height * .22) continue;
    homography.run(inliers.map(match => match.from), inliers.map(match => match.to), matrix, inliers.length);
    const corners = projectQuad(matrix.data, reference, frame);
    if (corners) result = { corners, count: inliers.length };
  }
  return result?.corners || null;
}

self.onmessage = ({ data }) => {
  if (data.type === "reference") {
    referenceLevels.splice(0, referenceLevels.length, ...data.frames.map(frame => describe(frame, 340)));
    self.postMessage({ type: "ready", usable: referenceLevels.some(level => level.points.length >= 18) });
  } else if (data.type === "frame") {
    self.postMessage({ type: "match", corners: findTarget(describe(data.frame, 430)) });
  }
};
