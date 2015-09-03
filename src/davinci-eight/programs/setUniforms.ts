import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');
import ShaderUniformSetter = require('../core/ShaderUniformSetter');
import isDefined = require('../checks/isDefined');
/**
 * Set uniforms and binds related textures.
 *
 * example:
 *
 *     var programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs");
 *
 *     var tex1 = gl.createTexture();
 *     var tex2 = gl.createTexture();
 *
 *     ... assume we setup the textures with data ...
 *
 *     var uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     gl.useProgram(program);
 *
 * This will automatically bind the textures AND set the
 * uniforms.
 *
 *     setUniforms(programInfo.uniformSetters, uniforms);
 *
 * For the example above it is equivalent to
 *
 *     var texUnit = 0;
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex1);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex2);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
 *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
 *     gl.uniformMatrix4fv(u_someMatrix, false, [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ]);
 *
 * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
 *
 *     var uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *     };
 *
 *     var moreUniforms {
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     setUniforms(programInfo.uniformSetters, uniforms);
 *     setUniforms(programInfo.uniformSetters, moreUniforms);
 *
 * @param {Object.<string, function>} setters the setters returned from
 *        `createUniformSetters`.
 * @param {Object.<string, value>} an object with values for the
 *        uniforms.
 * @memberOf module:webgl-utils
 */
function setUniforms(setters: { [name: string]: ShaderUniformSetter }, values: UniformDataInfos) {
  // We work from the values, not the setters, because uniforms may be set piecemeal.
  Object.keys(values).forEach(function(name: string) {
    var setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
    else {
      // Ignore the fact that the program does not contain the active uniform.
    }
  });
}

export = setUniforms;
