import ContextProgramConsumer from './ContextProgramConsumer';
import config from '../core'
import ErrorMode from '../core/ErrorMode'
import isNull from '../checks/isNull';
import mustBeObject from '../checks/mustBeObject';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * A wrapper around a <code>WebGLUniformLocation</code>.
 * </p>
 *
 * @class UniformLocation
 */
export default class UniformLocation implements ContextProgramConsumer {

  /**
   * @property gl
   * @type WebGLRenderingContext
   * @private
   */
  private gl: WebGLRenderingContext;

  /**
   * @property location
   * @type WebGLUniformLocation
   * @private
   */
  private location: WebGLUniformLocation;

  /**
   * @property name
   * @type string
   * @private
   */
  private name: string;

  /**
   * @class UniformLocation
   * @constructor
   * @param info {WebGLActiveInfo}
   */
  constructor(info: WebGLActiveInfo) {
    if (!isNull(info)) {
      mustBeObject('info', info)
      this.name = info.name
    }
    else {
      const msg = "UniformLocation constructor called with null info: WebGLActiveInfo."
      switch (config.errorMode) {
        case ErrorMode.IGNORE: {
          this.name = null
        }
          break
        case ErrorMode.WARNME: {
          console.warn(msg)
          this.name = null
        }
          break
        default: {
          throw new Error(msg)
        }
      }
    }
  }

  /**
   * @method contextFree
   * @return {void}
   */
  contextFree(): void {
    this.contextLost()
  }

  /**
   * @method contextGain
   * @param gl {WebGLRenderingContext}
   * @param program {WebGLProgram}
   * @return {void}
   */
  contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void {
    this.contextLost()
    this.gl = gl
    // If the location is null, no uniforms are updated and no error code is generated.
    if (!isNull(this.name)) {
      this.location = gl.getUniformLocation(program, this.name)
    }
    else {
      this.location = null
    }
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    this.gl = void 0
    this.location = void 0
  }

  /**
   * @method uniform1f
   * @param x {number}
   * @return {void}
   */
  uniform1f(x: number): void {
    this.gl.uniform1f(this.location, x)
  }

  /**
   * @method uniform2f
   * @param x {number}
   * @param y {number}
   * @return {void}
   */
  uniform2f(x: number, y: number): void {
    this.gl.uniform2f(this.location, x, y)
  }

  /**
   * @method uniform3f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @return {void}
   */
  uniform3f(x: number, y: number, z: number): void {
    this.gl.uniform3f(this.location, x, y, z)
  }

  /**
   * @method uniform4f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param w {number}
   * @return {void}
   */
  uniform4f(x: number, y: number, z: number, w: number): void {
    this.gl.uniform4f(this.location, x, y, z, w)
  }

  /**
   * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
   *
   * @method matrix2fv
   * @param transpose {boolean}
   * @param value {Float32Array}
   * @return {void}
   */
  matrix2fv(transpose: boolean, value: Float32Array): void {
    this.gl.uniformMatrix2fv(this.location, transpose, value)
  }

  /**
   * Sets a uniform location of type <code>mat3</code> in a <code>WebGLProgram</code>.
   *
   * @method matrix3fv
   * @param transpose {boolean}
   * @param value {Float32Array}
   * @return {void}
   */
  matrix3fv(transpose: boolean, value: Float32Array): void {
    this.gl.uniformMatrix3fv(this.location, transpose, value)
  }

  /**
   * Sets a uniform location of type <code>mat4</code> in a <code>WebGLProgram</code>.
   *
   * @method matrix4fv
   * @param transpose {boolean}
   * @param value {Float32Array}
   * @return {void}
   */
  matrix4fv(transpose: boolean, value: Float32Array): void {
    this.gl.uniformMatrix4fv(this.location, transpose, value)
  }

  /**
   * @method uniform1fv
   * @param data {Float32Array}
   * @return {void}
   */
  uniform1fv(data: Float32Array): void {
    this.gl.uniform1fv(this.location, data)
  }

  /**
   * @method uniform2fv
   * @param data {Float32Array}
   * @return {void}
   */
  uniform2fv(data: Float32Array): void {
    this.gl.uniform2fv(this.location, data)
  }

  /**
   * @method uniform3fv
   * @param data {Float32Array}
   * @return {void}
   */
  uniform3fv(data: Float32Array): void {
    this.gl.uniform3fv(this.location, data)
  }

  /**
   * @method uniform4fv
   * @param data {Float32Array}
   * @return {void}
   */
  uniform4fv(data: Float32Array): void {
    this.gl.uniform4fv(this.location, data)
  }

  /**
   * @method toString
   * @return {string}
   */
  toString(): string {
    return ['uniform', this.name].join(' ');
  }
}
