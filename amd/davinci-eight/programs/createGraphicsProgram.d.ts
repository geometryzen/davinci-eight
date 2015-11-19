import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
declare let createGraphicsProgram: (monitors: IContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IGraphicsProgram;
export = createGraphicsProgram;
