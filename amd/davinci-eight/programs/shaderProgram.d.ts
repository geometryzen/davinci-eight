import ShaderProgram = require('../core/ShaderProgram');
declare var shaderProgram: (vertexShader: string, fragmentShader: string, uuid?: string) => ShaderProgram;
export = shaderProgram;
