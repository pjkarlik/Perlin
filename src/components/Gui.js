// vendor //
import dat from 'dat-gui';

/** Parent Render Class */
export default class Render {
  constructor(options) {
    this.options = options;
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
}
