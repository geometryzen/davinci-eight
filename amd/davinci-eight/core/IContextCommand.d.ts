import IUnknown = require('../core/IUnknown');
interface IContextCommand extends IUnknown {
    name: string;
    execute(gl: WebGLRenderingContext): void;
}
export = IContextCommand;
