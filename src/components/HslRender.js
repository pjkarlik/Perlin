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
    this.size = options.resolution;
    this.setSimplexSize(options.resolution);
  };

  setSimplexSize = (value) => {
    this.smplxwidth = this.perlinCanvas.width / value;
    this.smplxheight = this.perlinCanvas.height / value;
  }

  createGUI = () => {
    this.options = {
      iteration: 90,
      factor: 200,
      resolution: 6,
      shaderType: 'octal',
      distort: false,
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(this.options, 'iteration', 1, 200).step(1)
      .onFinishChange((value) => { this.iteration = value; });
    folderRender.add(this.options, 'resolution', 3, 50).step(1)
      .onFinishChange((value) => { this.size = value; this.setSimplexSize(value); });
    folderRender.add(this.options, 'shaderType',
      ['storm', 'offset', 'octal', 'polar', 'rainbow', 'default'])
      .onFinishChange((value) => { this.shaderType = value; });
    folderRender.add(this.options, 'distort')
      .onFinishChange((value) => { this.distort = value; });
    folderRender.add(this.options, 'factor', 1, 1000).step(1)
      .onFinishChange((value) => { this.factor = value; });
    folderRender.open();

    this.setOptions(this.options);
  };

  resetCanvas = () => {
    window.cancelAnimationFrame(this.animation);
    this.perlinCanvas = this.can.setViewport(this.canvas);
    this.surface = this.perlinCanvas.surface;
    this.canvas = this.perlinCanvas.canvas;
    this.smplxwidth = this.perlinCanvas.width / this.size;
    this.smplxheight = this.perlinCanvas.height / this.size;
    this.renderLoop();
  }
  distance = (x1, y1, x2, y2) => {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distance;
  };

  shader = (dx, dy, w, h) => {
    let size;
    let n;
    let shaderColor;
    // Advance time stop in filter
    this.time += 0.001;
    // Normalize coordinates
    let x = dx / w;
    let y = dy / h;
    if (this.distort) {
      // Rec Coord Mouse x/y
      const firstmouse = this.mouse.pointer();
      const mouse = {
        x: (firstmouse.x) / this.size,
        y: (firstmouse.y) / this.size,
      };
      const factor = 0.0001;
      // const angle = Math.atan2(mouse.x - dx, mouse.y - dy);
      const angle = Math.atan2(dx - mouse.x, dy - mouse.y);
      const baseDiff = this.distance(dx, dy, mouse.x, mouse.y);

      const dist = this.factor / baseDiff;
      // switch cos/sin for fun
      // const shiftx = (Math.sin(angle) * dist) + (dx - mouse.x) * factor;
      // const shifty = (Math.cos(angle) * dist) + (dy - mouse.y) * factor;
      const shiftx = (Math.cos(angle) * dist) + (dx - mouse.x) * factor;
      const shifty = (Math.sin(angle) * dist) + (dy - mouse.y) * factor;
      // Normalize coordinates
      x = Math.floor(dx + shiftx) / w;
      y = Math.floor(dy + shifty) / h;
    }
    switch (this.shaderType) {
      case 'storm':
        {
          size = this.iteration * 0.02;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
          const o = Math.cos(n);
          shaderColor = `hsla(${360 / o}, 100%, 50%, ${n}`;
          break;
        }
      case 'octal':
        {
          size = this.iteration * 0.04;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
          const m = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 500));
          shaderColor = `hsla(${180 / m / 360}, ${m * 50 / n}%, 50%, ${n}`;
          break;
        }
      case 'offset':
        {
          size = this.iteration * 0.03;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
          const v = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 500));
          const mult = 0.89;
          const m = Math.cos(v * mult);
          shaderColor = `hsla(${240 - (m * 540)}, ${Math.sin(n) * 100}%, 50%, ${n}`;
          break;
        }
      case 'rainbow':
        {
          size = this.iteration * 0.04;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
          const mult = 3;
          const m = Math.cos(n * mult);
          const o = Math.sin(n * mult);
          shaderColor = `hsla(${m * 120}, 100%, 50%, ${n + o}`;
          break;
        }
      case 'polar':
        {
          size = this.iteration * 0.02;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 1000));
          const mult = 10;
          const m = Math.cos(n * mult);
          shaderColor = `hsla(${255 - m * 50}, 100%, 50%, ${m}`;
          break;
        }
      case 'default':
        {
          size = this.iteration * 0.04;
          n = Math.abs(this.generator.simplex3(size * x, size * y, this.time / 100));
          shaderColor = `hsla(${0}, ${0}%, 50%, ${n}`;
          break;
        }
      default:
        break;
    }
    return {
      shader: shaderColor,
    };
  };
  reset = () => {
    this.surface.fillStyle = 'rgba(0,0,0,1)';
    this.surface.fillRect(0, 0, this.perlinCanvas.width, this.perlinCanvas.height);
  };
  renderLoop = () => {
    this.surface.clearRect(0, 0, this.perlinCanvas.width, this.perlinCanvas.height);

    for (let x = 0; x < this.smplxwidth; x++) {
      for (let y = 0; y < this.smplxheight; y++) {
        const pixel = this.shader(x, y, this.smplxwidth, this.smplxheight);
        this.surface.fillStyle = pixel.shader;
        this.surface.fillRect(x * this.size, y * this.size, this.size, this.size);
      }
    }
    this.animation = window.requestAnimationFrame(this.renderLoop);
  };
}
