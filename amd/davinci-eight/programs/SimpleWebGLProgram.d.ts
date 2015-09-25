import AttribLocation = require('../core/AttribLocation');
import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import UniformLocation = require('../core/UniformLocation');
import Shareable = require('../utils/Shareable');
/**
 * This class is "simple because" it assumes exactly one vertex shader and on fragment shader.
 * This class assumes that it will only be supporting a single WebGL rendering context.
 * The existence of the manager in the constructor enables it to enforce this invariant.
 */
declare class SimpleWebGLProgram extends Shareable implements IContextConsumer {
    private manager;
    private vertexShader;
    private fragmentShader;
    private attribs;
    private program;
    attributes: {
        [name: string]: AttribLocation;
    };
    uniforms: {
        [name: string]: UniformLocation;
    };
    constructor(manager: IContextProvider, vertexShader: string, fragmentShader: string, attribs: string[]);
    protected destructor(): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    contextFree(canvasId: number): void;
    use(): void;
}
export = SimpleWebGLProgram;
