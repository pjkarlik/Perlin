
import simplexNoise from './simplexNoise';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width;
    this.height = height;
    this.time = 0;
    // Set Up canvas and surface object //
    this.perlinCanvas = this.createCanvas('perlin');
    this.surface = this.perlinCanvas.getContext('2d');
    this.surface.scale(1, 1);
    // Bind Stuff //
    this.shader = this.shader.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    // Control Stuff //
    const iteration = document.getElementById('iteration');
    this.iteration = iteration.value * 0.1;
    iteration.addEventListener('change', () => {
      this.iteration = iteration.value * 0.1;
    });
    const shaderType = document.getElementById('shader');
    this.shaderType = shaderType.value;
    shaderType.addEventListener('change', () => {
      this.shaderType = shaderType.value;
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
  shader(x, y, w, h) {
    this.time += 0.003;
    x /= w;
    y /= h; // normalize
    const size = this.iteration;  // pick a scaling value
    const n = simplexNoise(size * x, size * y, this.time / 1000);
    let r;
    let g;
    let b;
    switch (this.shaderType) {
      case 'octal': {
        // render octowave
        // const m = Math.cos(n * 45);
        // const o = Math.sin(n * 45);
        g = Math.round(Math.cos(n * 45) * 255);
        b = g;
        r = Math.round(Math.sin(n * 45) * 255);
        break;
      }
      case 'rainbow': {
        // rainbow
        b = Math.round(255 - 255 * (1 + Math.sin(n + 6.3 * x)) / 2);
        g = Math.round(255 - 255 * (1 + Math.cos(n + 6.3 * x)) / 2);
        r = Math.round(255 - 255 * (1 - Math.sin(n + 6.3 * x)) / 2);
        break;
      }
      case 'storm': {
        // storm
        x = (1 + Math.cos(n + 2 * Math.PI * x - 0.5));
        x = Math.sqrt(x); y *= y;
        r = Math.round(255 - x * 255);
        g = Math.round(155 - n * x * 255);
        b = Math.round(y * 255);
        break;
      }
      case 'default': {
        // default
        r = g = b = Math.round(255 * n);
        break;
      }
      default:
        break;
    }
    return {
      r, g, b, a: 255,
    };
  }
  renderLoop() {
    const size = 5;
    const w = this.perlinCanvas.width / size;
    const h = this.perlinCanvas.height / size;

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const pixel = this.shader(x, y, w, h);
        this.surface.fillStyle = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a})`;
        this.surface.fillRect(x * size, y * size, size, size);
      }
    }
    window.requestAnimationFrame(this.renderLoop);
  }
}
