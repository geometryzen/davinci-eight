import AttribMetaInfos = require('../core/AttribMetaInfos');
import setAttributes = require('../programs/setAttributes');
/**
 * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
 *
 * Example:
 *
 *     var programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs");
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *     };
 *
 *     var bufferInfo = createBufferInfoFromArrays(gl, arrays);
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setBuffersAndAttributes(programInfo.attribSetters, bufferInfo);
 *
 * For the example above it is equivilent to
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 *     gl.enableVertexAttribArray(a_positionLocation);
 *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
 *     gl.enableVertexAttribArray(a_texcoordLocation);
 *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {Object.<string, function>} setters Attribute setters as returned from `createAttributeSetters`
 * @param {module:webgl-utils.BufferInfo} buffers a BufferInfo as returned from `createBufferInfoFromArrays`.
 * @memberOf module:webgl-utils
 */
function setBuffersAndAttributes(gl: WebGLRenderingContext, setters, buffers: {[name:string]: WebGLBuffer}, metas: AttribMetaInfos) {
  setAttributes(setters, buffers, metas);
  if (buffers['indices']) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers['indices']);
  }
}

export = setBuffersAndAttributes;
