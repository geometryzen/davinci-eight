import AttribDataInfo = require('../core/AttribDataInfo');
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
function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram): {[name: string]: ShaderAttribSetter} {
  
  let attribSetters:{[name: string]: ShaderAttribSetter} = {};

  // An attribute setter function binds a buffer, enables the attribute and describes the attribute property.
  // This implementation captures the context so it would have to be refreshed on context gain.
  // The setter does not actually transfer the attribute data but instead defined how the transfer occurs.
  // Buffers don't exist before we create the setters, but do when they are called.
  function createAttribSetter(index: number): ShaderAttribSetter {
    // TODO: Separate into the WebGLBuffer and the meta data?
    return function(data: AttribDataInfo) {
        data.buffer.bindBuffer();
//      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, data.size, data.type || gl.FLOAT, data.normalized || false, data.stride || 0, data.offset || 0);
      };
  }

  // We discover the attributesnd create a setter for each one.
  var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var ii = 0; ii < numAttribs; ++ii) {
    let attribInfo: WebGLActiveInfo = gl.getActiveAttrib(program, ii);
    if (!attribInfo) {
      break;
    }
    let index = gl.getAttribLocation(program, attribInfo.name);
    attribSetters[attribInfo.name] = createAttribSetter(index);
  }

  return attribSetters;
}

export =  createAttributeSetters;
