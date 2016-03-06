import ContextProvider from './ContextProvider';
import Engine from './Engine'
import mustBeObject from '../checks/mustBeObject';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextConsumer from './ShareableContextConsumer';

/**
 * @module EIGHT
 * @submodule core
 */

// TODO: Does this suggest an API for the contextProvider?
function bufferVertexData(contextProvider: ContextProvider, buffer: WebGLBuffer, data: Float32Array) {
  if (contextProvider) {
    const gl = contextProvider.gl
    if (gl) {
      if (buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        if (data) {
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
      }
    }
  }
}

/**
 * <p>
 * A wrapper around a WebGLBuffer with bunding to ARRAY_BUFFER.
 * </p>
 *
 * @class VertexBuffer
 * @extends ShareableContextConsumer
 */
export default class VertexBuffer extends ShareableContextConsumer {

  /**
   * @property _buffer
   * @type WebGLBuffer
   * @private
   */
  private _buffer: WebGLBuffer;

  /**
   * @property _data
   * @type Float32Array
   * @private
   */
  private _data: Float32Array;

  /**
   * @class VertexBuffer
   * @constructor
   * @param engine {Engine}
   */
  constructor(engine: Engine) {
    super('VertexBuffer', engine)
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
    mustBeUndefined(this._type, this._buffer)
  }

  /**
   * @property data
   * @type Float32Array
   */
  get data(): Float32Array {
    return this._data
  }
  set data(data: Float32Array) {
    // TODO: If the buffer is bound and data is set, should we re-bind?
    // But how do we know that we haven't been unbound?
    // Centralizing in the contextProvider might help?
    this._data = data
    bufferVertexData(this.contextProvider, this._buffer, this._data)
  }

  contextFree(contextProvider: ContextProvider): void {
    mustBeObject('contextProvider', contextProvider)
    if (this._buffer) {
      const gl = contextProvider.gl
      if (gl) {
        gl.deleteBuffer(this._buffer)
      }
      else {
        console.error(`${this._type} must leak WebGLBuffer because WebGLRenderingContext is ` + typeof gl)
      }
      this._buffer = void 0
    }
    else {
      // It's a duplicate, ignore.
    }
    super.contextFree(contextProvider)
  }

  contextGain(contextProvider: ContextProvider): void {
    mustBeObject('contextProvider', contextProvider)
    const gl = contextProvider.gl
    if (!this._buffer) {
      this._buffer = gl.createBuffer()
      bufferVertexData(contextProvider, this._buffer, this._data)
    }
    else {
      // It's a duplicate, ignore the call.
    }
    super.contextGain(contextProvider)
  }

  contextLost(): void {
    this._buffer = void 0
    super.contextLost()
  }

  /**
   * @method bind
   * @return {void}
   */
  bind(): void {
    const gl = this.gl
    if (gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
    }
    else {
      console.warn(`${this._type}.bind() ignored because no context.`)
    }
  }

  /**
   * @method unbind
   * @return {void}
   */
  unbind() {
    const gl = this.gl
    if (gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
    else {
      console.warn(`${this._type}.unbind() ignored because no context.`)
    }
  }
}
