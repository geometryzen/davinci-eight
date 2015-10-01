import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
declare let createMaterial: (monitors: IContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IMaterial;
export = createMaterial;
