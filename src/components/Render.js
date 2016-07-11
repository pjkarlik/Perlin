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
    this.iteration = iteration.value;
    iteration.addEventListener('change', () => {
      this.iteration = iteration.value;
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
    const n = this.PerlinNoise.noise(size * x, size * y, 0.8);
    const m = this.PerlinNoise.noise(size * x, size * y, 0.5);
    const o = this.PerlinNoise.noise(size * x, size * y, 1);
    r = Math.round(255 * n);
    g = Math.round(255 * m);
    b = Math.round(255 * o);
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
