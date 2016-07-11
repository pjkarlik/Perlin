import Perlin from './Perlin';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width;
    this.height = height;
    this.PerlinNoise = new Perlin();
    // Set Up canvas and surface object //
    this.perlinCanvas = this.createCanvas('perlin');
    this.surface = this.perlinCanvas.getContext('2d');
    this.surface.scale(1, 1);
    // Bind Stuff //
    this.shader = this.shader.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    const iteration = document.getElementById('iteration');
    this.iteration = iteration.value * 0.1;
    iteration.addEventListener('change', () => {
      this.iteration = iteration.value * 0.1;
      this.renderLoop();
    });
    // run function //
    this.renderLoop();
  }

  createCanvas(name) {
    const canvasElement = document.createElement('canvas');
    canvasElement.id = name;
    canvasElement.width = this.width;
    canvasElement.height = this.height;
    this.element.appendChild(canvasElement);
    return canvasElement;
  }
  /* eslint no-param-reassign: 0 */
  shader(r, g, b, a, x, y, w, h) {
    x /= w;
    y /= h; // normalize
    const size = this.iteration;  // pick a scaling value
    const n = this.PerlinNoise.noise(size * x, size * y, 0.5);
    // render normal
    // r = g = b Math.round(255 * n);
    // rainbow
    // b = 255 - 255 * (1 + Math.sin(n + 6.3 * x)) / 2;
    // g = 255 - 255 * (1 + Math.cos(n + 6.3 * x)) / 2;
    // r = 255 - 255 * (1 - Math.sin(n + 6.3 * x)) / 2;
    // render storm
    // x = (1 + Math.cos(n + 2 * Math.PI * x - 0.5));
    // x = Math.sqrt(x); y *= y;
    // r = 255 - x * 255; g = 255 - n * x * 255; b = y * 255;
    // render octowave
    const m = Math.cos(n * 45);
    const o = Math.sin(n * 45);
    g = Math.round(m * 255);
    b = g;
    r = Math.round(o * 255);

    return {
      r, g, b, a: 255,
    };
  }
  renderLoop() {
    const w = this.perlinCanvas.width;
    const h = this.perlinCanvas.height;

    const imageData = this.surface.createImageData(w, h);

    for (let i = 0, l = imageData.data.length; i < l; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / w / 4);

      const r = imageData.data[i + 0];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      const pixel = this.shader(r, g, b, a, x, y, w, h);

      imageData.data[i] = pixel.r;
      imageData.data[i + 1] = pixel.g;
      imageData.data[i + 2] = pixel.b;
      imageData.data[i + 3] = pixel.a;
    }

    this.surface.putImageData(imageData, 0, 0);
  }
}
