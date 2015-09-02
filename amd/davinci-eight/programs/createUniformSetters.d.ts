import ShaderUniformSetter = require('../core/ShaderUniformSetter');
declare function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram): {
    [name: string]: ShaderUniformSetter;
};
export = createUniformSetters;
