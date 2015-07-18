import ShaderProgram = require('../programs/ShaderProgram');
declare var shaderProgram: (vertexShader: string, fragmentShader: string) => ShaderProgram;
export = shaderProgram;
