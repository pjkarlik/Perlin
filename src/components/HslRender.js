import { Generator } from './simplexTwo';
import Canvas from './Canvas';
import Mouse from './Mouse';
// vendor //
import dat from 'dat-gui';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width || ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    this.height = height || ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.time = 0;
    this.size = 10;
    this.mouse = new Mouse();
    this.generator = new Generator(10);
    // Set Up canvas and surface object //
    this.can = new Canvas();
    this.perlinCanvas = this.can.createCanvas('canvas');
    this.surface = this.perlinCanvas.surface;
    this.canvas = this.perlinCanvas.canvas;
    // Bind Stuff //
    this.shader = this.shader.bind(this);
    this.renderLoop = this.renderLoop.bind(this);
    // Control Stuff //
    window.addEventListener('resize', this.resetCanvas);
    // run function //
    this.createGUI();
    this.renderLoop();
  }

  setOptions = (options) => {
    this.iteration = options.iteration;
    this.shaderType = options.shaderType;
    this.factor = options.factor;
    this.distort = options.distort;
  };

  createGUI = () => {
    this.options = {
      iteration: 90,
      factor: 200,
      shaderType: 'storm',
      distort: false,
      reset: () => {
        this.reset();
      },
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(this.options, 'iteration', 1, 200).step(1)
      .onFinishChange((value) => { this.iteration = value; });

    folderRender.add(this.options, 'shaderType',
      ['storm', 'offset', 'octal', 'rainbow', 'default'])
      .onFinishChange((value) => { this.shaderType = value; });
    folderRender.add(this.options, 'distort')
      .onFinishChange((value) => { this.distort = value; });
    folderRender.add(this.options, 'factor', 1, 1000).step(1)
      .onFinishChange((value) => { this.factor = value; });
    this.gui.add(this.options, 'reset');
    folderRender.open();

    this.setOptions(this.options);
  };

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    this.perlinCanvas = this.can.setViewport(this.canvas);
    this.surface = this.perlinCanvas.surface;
    this.canvas = this.perlinCanvas.canvas;
    this.renderLoop();
  }
  distance = (x1, y1, x2, y2) => {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distance;
  };
  /* eslint no-param-reassign: 0 */
  shader(dx, dy, w, h) {
    let size = this.iteration * 0.05;  // pick a scaling value
    let n;
    let shader;
    // Advance time stop in filter
    this.time += 0.001;
    let x = dx / w;
    let y = dy / h; // normalize
    if (this.distort) {
      // Rec Coord Mouse x/y
      const firstmouse = this.mouse.pointer();
      const mouse = {
        x: (firstmouse.x) / this.size,
        y: (firstmouse.y) / this.size,
      };
      const factor = 0.0001;
      const angle = Math.atan2(mouse.x - dx, mouse.y - dy);
      const baseDiff = this.distance(dx, dy, mouse.x, mouse.y);
      // const angle = Math.atan2(dx - mouse.x, dy - mouse.y);
      // const baseDiff = this.distance(mouse.x, mouse.y, dx, dy);
      const dist = this.factor / baseDiff;
      const shiftx = (Math.sin(angle) * dist) + (dx - mouse.x) * factor;
      const shifty = (Math.cos(angle) * dist) + (dy - mouse.y) * factor;

      x = Math.floor(dx + shiftx) / w;
      y = Math.floor(dy + shifty) / h; // normalize
    }
    switch (this.shaderType) {
      case 'storm': {
        size = this.iteration * 0.02;
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // const m = Math.abs(this.generator.simplex3(size * y, size * x, this.time / 500));
        // render octowave
        // const mult = 5;
        const o = Math.cos(n);
        shader = `hsla(${360 / o}, 100%, 50%, ${n}`;
        break;
      }
      case 'octal': {
        size = this.iteration * 0.04;
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        const m = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 100));
        // default
        shader = `hsla(${180 / m / 360}, ${m * 150}%, 50%, ${n}`;
        break;
      }
      case 'offset': {
        size = this.iteration * 0.06;
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // render octowave
        const mult = 0.89;
        const m = Math.cos(n * mult);
        shader = `hsla(${540 - (m * 540)}, ${Math.sin(n) * 100}%, 50%, ${n}`;
        break;
      }
      case 'rainbow': {
        size = this.iteration * 0.04;
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // render octowave
        const mult = 1.2;
        const m = Math.cos(n * mult);
        // const o = Math.sin(n * mult);
        shader = `hsla(${360 / m / 180}, ${n * 100}%, 50%, ${n}`;
        break;
      }
      case 'default': {
        size = this.iteration * 0.01;
        n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
        // default
        shader = `hsla(${0}, ${n * 100}%, 50%, ${n}`;
        break;
      }
      default:
        break;
    }
    return {
      shader,
    };
  }
  reset = () => {
    this.surface.fillStyle = 'rgba(0,0,0,1)';
    this.surface.fillRect(0, 0, this.perlinCanvas.width, this.perlinCanvas.height);
  }
  renderLoop() {
    const size = this.size;
    const w = this.perlinCanvas.width / size;
    const h = this.perlinCanvas.height / size;
    this.surface.clearRect(0, 0, this.perlinCanvas.width, this.perlinCanvas.height);
    // this.time += 0.05;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const pixel = this.shader(x, y, w, h);
        // this.surface.fillStyle = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a})`;
        this.surface.fillStyle = pixel.shader;
        this.surface.fillRect(x * size, y * size, size, size);
        // const pixel = Math.abs(this.generator.simplex3(x / w, y / h, this.time));
        // this.surface.fillStyle = `hsla(${540 - (pixel * 540)}, ${Math.sin(pixel) * 100}%, 40%, ${pixel}`;
        // this.surface.fillRect(x * size, y * size, size, size);
      }
    }
    this.animation = window.requestAnimationFrame(this.renderLoop);
  }
}
