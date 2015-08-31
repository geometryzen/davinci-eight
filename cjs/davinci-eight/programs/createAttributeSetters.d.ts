import ShaderAttribSetter = require('../core/ShaderAttribSetter');
/**
 * Creates setter functions for all attributes of a shader
 * program. You can pass this to {@link module:webgl-utils.setBuffersAndAttributes} to set all your buffers and attributes.
 *
 * @see {@link module:webgl-utils.setAttributes} for example
 * @param {WebGLProgram} program the program to create setters for.
 * @return {Object.<string, function>} an object with a setter for each attribute by name.
 * @memberOf module:webgl-utils
 */
declare function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram): {
    [name: string]: ShaderAttribSetter;
};
export = createAttributeSetters;
