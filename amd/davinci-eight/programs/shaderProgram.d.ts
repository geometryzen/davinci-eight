import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
declare let shaderProgram: (monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IProgram;
export = shaderProgram;
