import simplexNoise from '../functions/simplexNoise';
import Canvas from './Canvas';
// vendor //
import dat from 'dat-gui';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width;
    this.height = height;
    this.time = 0;
    // Set Up canvas and surface object //
    this.can = new Canvas();
    this.perlinCanvas = this.can.createCanvas('canvas');
    this.surface = this.perlinCanvas.surface;
    this.canvas = this.perlinCanvas.canvas;
    // Bind Stuff //
    this.shader = this.shader.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    // run function //
    this.createGUI();
    this.renderLoop();
  }

  setOptions = (options) => {
    this.iteration = options.iteration;
    this.shaderType = options.shaderType;
  };

  createGUI = () => {
    this.options = {
      iteration: 90,
      shaderType: 'storm',
      reset: () => {
        this.reset();
      }
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(this.options, 'iteration', 1, 200).step(1)
      .onFinishChange((value) => { this.iteration = value; });
    folderRender.add(this.options, 'shaderType',
      ['storm', 'offset', 'octal', 'rainbow', 'default'])
      .onFinishChange((value) => { this.shaderType = value; });
    this.gui.add(this.options, 'reset');
    folderRender.open();

    this.setOptions(this.options);
  };

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
    const size = this.iteration * 0.5;  // pick a scaling value
    let n;
    let r;
    let g;
    let b;
    switch (this.shaderType) {
    case 'octal': {
      n = simplexNoise(size * x, size * y, this.time / 1000);
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
      n = simplexNoise(size * x, size * y, this.time / 1000);
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
      n = simplexNoise(size * 2 * x, size * 2 * y, this.time / 1000);
      // rainbow
      b = ~~(255 - 255 * (1 - Math.sin(n - 6.3 * x)) / 2);
      g = ~~(255 - 255 * (1 + Math.cos(n + 6.3 * x)) / 2);
      r = ~~(255 - 255 * (1 - Math.sin(n + 6.3 * x)) / 2);
      break;
    }
    case 'storm': {
      n = simplexNoise(size * x, size * y, this.time / 1000);
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
      n = simplexNoise(size * x, size * y, this.time / 1000);
      // default
      r = g = b = Math.round(255 * n);
      break;
    }
    default:
      break;
    }
    return {
      r, g, b, a: 255
    };
  }
  reset = () => {
    this.surface.fillStyle = 'rgba(0,0,0,1)';
    this.surface.fillRect(0, 0, this.perlinCanvas.width, this.perlinCanvas.height);
  };
  renderLoop() {
    const size = 10;
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
