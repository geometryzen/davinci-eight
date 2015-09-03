import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderAttribSetter = require('../core/ShaderAttribSetter');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ShaderUniformSetter = require('../core/ShaderUniformSetter');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * The role of a ShaderProgram is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The ShaderProgram must be able to provide introspection information that describes the program.
 * @class ShaderProgram
 * @extends RenderingContextUser
 */
interface ShaderProgram extends RenderingContextUser {
  /**
   * @property program
   * @type WebGLProgram
   */
  program: WebGLProgram;
  /**
   * @property programId
   * @type string
   */
  programId: string;
  /**
   * @property vertexShader
   * @type string
   */
  vertexShader: string;
  /**
   * @property fragmentShader
   * @type string
   */
  fragmentShader: string;
  /**
   * Makes the ShaderProgram the current program for WebGL.
   * @method use
   */
  use(): ShaderProgram;
  /**
   * Sets the attributes provided into the appropriate locations.
   */
  setAttributes(values: AttribDataInfos);
  /**
   * Sets the uniforms provided into the appropriate locations.
   * @param values {UniformDataInfos}
   */
  setUniforms(values: UniformDataInfos);
  uniform1f(name: string, x: number, picky?: boolean);
  uniform1fv(name: string, value: number[], picky?: boolean);
  uniform2f(name: string, x: number, y: number, picky?: boolean);
  uniform2fv(name: string, value: number[], picky?: boolean);
  uniform3f(name: string, x: number, y: number, z: number, picky?: boolean);
  uniform3fv(name: string, value: number[], picky?: boolean);
  uniform4f(name: string, x: number, y: number, z: number, w: number, picky?: boolean);
  uniform4fv(name: string, value: number[], picky?: boolean);
  uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
  uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
  uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
  /**
   *
   */
  attributeLocations: { [name: string]: ShaderAttribLocation };
  /**
   *
   */
  uniformLocations: { [name: string]: ShaderUniformLocation };
  /**
   *
   */
  uniformSetters: { [name: string]: ShaderUniformSetter };
}

export = ShaderProgram;
