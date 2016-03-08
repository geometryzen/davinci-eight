import ContextProvider from './ContextProvider';
import Engine from './Engine';
import incLevel from '../base/incLevel';
import mustBeObject from '../checks/mustBeObject';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextConsumer from './ShareableContextConsumer';

/**
 * @module EIGHT
 * @submodule core
 */

// TODO: Does this suggest an API for the contextProvider?
function bufferIndexData(contextProvider: ContextProvider, buffer: WebGLBuffer, data: Uint16Array) {
  if (contextProvider) {
    const gl = contextProvider.gl
    if (gl) {
      if (buffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
        if (data) {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      }
    }
  }
}

/**
 * <p>
 * A wrapper around a WebGLBuffer with bunding to ELEMENT_ARRAY_BUFFER.
 * </p>
 *
 * @class IndexBuffer
 * @extends ShareableContextConsumer
 */
export default class IndexBuffer extends ShareableContextConsumer {

  /**
   * @property _buffer
   * @type WebGLBuffer
   * @private
   */
  private _buffer: WebGLBuffer;

  /**
   * @property _data
   * @type Uint16Array
   * @private
   */
  private _data: Uint16Array;

  /**
   * @class IndexBuffer
   * @constructor
   * @param engine {Engine}
   * @param level {number} Set to zero if this is the last class in a hierachy.
   */
  constructor(engine: Engine, level: number) {
    super('IndexBuffer', engine, incLevel(level))
    if (level === 0) {
      this.synchUp()
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    if (level === 0) {
      this.cleanUp()
    }
    // Verify that the cleanUp did its work.
    mustBeUndefined(this._type, this._buffer)
    super.destructor(incLevel(level))
  }

  /**
   * @property data
   * @type Uint16Array
   */
  get data(): Uint16Array {
    return this._data
  }
  set data(data: Uint16Array) {
    // TODO: If the buffer is bound and data is set, should we re-bind?
    // But how do we know that we haven't been unbound?
    // Centralizin in the contextProvider might help?
    this._data = data
    bufferIndexData(this.contextProvider, this._buffer, this._data)
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
      bufferIndexData(contextProvider, this._buffer, this._data)
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
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer)
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
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    else {
      console.warn(`${this._type}.unbind() ignored because no context.`)
    }
  }
}
