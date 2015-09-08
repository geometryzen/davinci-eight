import ShaderProgram = require('../core/ShaderProgram');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare var shaderProgram: (monitor: RenderingContextMonitor, vertexShader: string, fragmentShader: string, attribs: string[]) => ShaderProgram;
export = shaderProgram;
