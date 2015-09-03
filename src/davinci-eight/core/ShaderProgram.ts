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
  /**
   * Sets the uniform of the specied name to the specified value.
   */
  setUniform3fv(name: string, value: number[]);
  /**
   *
   */
  setUniformMatrix4fv(name: string, matrix: Float32Array, transpose: boolean);
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
