import UniformSetter = require('../core/UniformSetter');
declare function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram): {
    [name: string]: UniformSetter;
};
export = createUniformSetters;
