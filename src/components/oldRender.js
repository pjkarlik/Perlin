
/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width;
    this.height = height;
    // Set Up canvas and surface object //
    this.perlinCanvas = this.createCanvas('perlin');
    this.surface = this.perlinCanvas.getContext('2d');
    this.saved_alpha = this.surface.globalAlpha;
    this.surface.scale(1, 1);
    this.offscreenCanvas = this.createCanvas('perlin');
    this.offscreen = this.offscreenCanvas.getContext('2d');
    this.offscreen.scale(1, 1);
    // Bind Stuff //
    this.renderLoop = this.renderLoop.bind(this);
    const iteration = document.getElementById('iteration');
    iteration.addEventListener('change', () => {
      this.iteration = iteration.value / 100;
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

  renderLoop() {
    this.surface.clearRect(0, 0, this.width, this.height);
    /* Fill the offscreen buffer with random noise. */
    this.offscreen.width = this.perlinCanvas.width;
    this.offscreen.height = this.perlinCanvas.height;

    const offscreenData = this.offscreen.getImageData(0, 0, this.offscreen.width, this.offscreen.height);
    const offscreenPixels = offscreenData.data;

    for (let i = 0; i < offscreenPixels.length; i += 4) {
      offscreenPixels[i] =
      offscreenPixels[i + 1] =
      offscreenPixels[i + 2] = Math.floor(Math.random() * 256);
      offscreenPixels[i + 3] = 255;
    }

    this.offscreen.putImageData(offscreenData, 0, 0);

    /* Scale random iterations onto the canvas to generate Perlin noise. */
    for (let size = 4; size <= this.offscreenCanvas.width; size *= 2) {
      const x = Math.floor(Math.random() * (this.offscreenCanvas.width - size));
      const y = Math.floor(Math.random() * (this.offscreenCanvas.height - size));

      this.surface.globalAlpha = this.iteration / size;
      this.surface.drawImage(this.offscreenCanvas, x, y, size, size, 0, 0,
        this.perlinCanvas.width, this.perlinCanvas.height);
    }

    this.surface.globalAlpha = this.saved_alpha;
    window.requestAnimationFrame(this.renderLoop);
  }
}
