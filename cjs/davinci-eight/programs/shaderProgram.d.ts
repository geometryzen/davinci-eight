import Program = require('../core/Program');
import ContextManager = require('../core/ContextManager');
declare let shaderProgram: (monitor: ContextManager, vertexShader: string, fragmentShader: string, attribs: string[]) => Program;
export = shaderProgram;
