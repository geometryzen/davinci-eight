import IUnknown = require('../core/IUnknown');

interface IContextCommand extends IUnknown {
  execute(gl: WebGLRenderingContext): void;
}

export = IContextCommand;