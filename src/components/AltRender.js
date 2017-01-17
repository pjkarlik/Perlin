import { Generator } from './simplexTwo';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width;
    this.height = height;
    this.time = 0;
    this.generator = new Generator(0);
    // Set Up canvas and surface object //
    this.perlinCanvas = this.createCanvas('perlin');
    this.surface = this.perlinCanvas.getContext('2d');
    this.surface.scale(1, 1);
    // Bind Stuff //
    this.shader = this.shader.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    // Control Stuff //
    const iteration = document.getElementById('iteration');
    this.iteration = iteration.value * 0.01;
    iteration.addEventListener('change', () => {
      this.iteration = iteration.value * 0.01;
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
    this.time += 0.001;
    x /= w;
    y /= h; // normalize
    const size = this.iteration;  // pick a scaling value
    let n;
    let r;
    let g;
    let b;
    switch (this.shaderType) {
      case 'octal': {
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // render octowave
        const mult = 25;
        const m = Math.cos(n * mult);
        const o = Math.sin(n * mult);
        r = ~~(m * 255);
        b = ~~(o * 255);
        g = b;
        break;
      }
      case 'offset': {
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // render octowave
        const mult = 15;
        const m = Math.cos(n * mult);
        const o = Math.sin(n * mult + this.time);
        r = ~~(m * 255);
        g = ~~(o * 255);
        b = 0;
        break;
      }
      case 'rainbow': {
        n = Math.abs(this.generator.simplex3(size * 2 * x, size * 2 * y, this.time / 1000));
        // rainbow
        b = ~~(255 - 255 * (1 - Math.sin(n - 6.3 * x)) / 2);
        g = ~~(255 - 255 * (1 + Math.cos(n + 6.3 * x)) / 2);
        r = ~~(255 - 255 * (1 - Math.sin(n + 6.3 * x)) / 2);
        break;
      }
      case 'storm': {
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // storm
        x = (1 + Math.cos(n + 2 * Math.PI * x - (this.time * 0.001)));
        // y = (1 + Math.sin(n + 2 * Math.PI * y - this.time));
        x = Math.sqrt(x); y *= y;
        r = ~~(255 - x * 255);
        b = ~~(n * x * 255);
        g = b; // Math.round(y * 255);
        break;
      }
      case 'default': {
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
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
    this.surface.clearRect(0, 0, w, h);
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