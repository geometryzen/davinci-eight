import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
declare let createMaterial: (monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IMaterial;
export = createMaterial;
