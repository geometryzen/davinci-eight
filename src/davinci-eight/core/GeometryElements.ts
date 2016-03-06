import AbstractMaterial from './AbstractMaterial'
import ContextProvider from './ContextProvider'
import core from '../core'
import DrawMode from './DrawMode'
import Engine from './Engine'
import ErrorMode from './ErrorMode'
import Geometry from './Geometry'
import IndexBuffer from './IndexBuffer'
import isArray from '../checks/isArray'
import isNull from '../checks/isNull'
import isNumber from '../checks/isNumber'
import isObject from '../checks/isObject'
import isUndefined from '../checks/isUndefined'
import Matrix4 from '../math/Matrix4'
import mustBeArray from '../checks/mustBeArray'
import mustBeObject from '../checks/mustBeObject'
import notImplemented from '../i18n/notImplemented'
import notSupported from '../i18n/notSupported'
import readOnly from '../i18n/readOnly'
import ShareableContextConsumer from './ShareableContextConsumer'
import VertexArrays from './VertexArrays'
import VertexAttribPointer from './VertexAttribPointer'
import VertexBuffer from './VertexBuffer'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A Geometry that supports interleaved vertex buffers.
 *
 * @class GeometryElements
 * @extends ShareableContextConsumer
 * @extends Geometry
 */
export default class GeometryElements extends ShareableContextConsumer implements Geometry {

  private _drawMode: DrawMode;
  private _indices: number[];
  private _attributes: number[];

  /**
   * <p>
   * The number of <em>bytes</em> for each element.
   * </p>
   * <p>
   * This is used in the vertexAttribPointer method.
   * Normally, we will use gl.FLOAT for each number which takes 4 bytes.
   * </p>
   *
   * @property _stride
   * @type number
   * @private
   */
  private _stride: number;
  private _pointers: VertexAttribPointer[];

  private mode: number;
  private count: number;

  /**
   * Hard-code to zero right now.
   * This suggests that the index buffer could be used for several gl.drawElements(...)
   *
   * @property offset
   * @type number
   * @private
   */
  private offset = 0;
  private ibo: IndexBuffer;
  private vbo: VertexBuffer;

  /**
   * @class GeometryElements
   * @constructor
   * @param data {VertexArrays}
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   */
  constructor(data: VertexArrays, engine: Engine) {
    super('GeometryElements', engine)
    this.ibo = new IndexBuffer(engine)
    this.vbo = new VertexBuffer(engine)

    if (!isNull(data) && !isUndefined(data)) {
      if (isObject(data)) {
        this._drawMode = data.drawMode;
        this.setIndices(data.indices)

        this._attributes = data.attributes;
        this._stride = data.stride
        if (!isNull(data.pointers) && !isUndefined(data.pointers)) {
          if (isArray(data.pointers)) {
            this._pointers = data.pointers
          }
          else {
            mustBeArray('data.pointers', data.pointers)
          }
        }
        else {
          this._pointers = []
        }
        this.vbo.data = new Float32Array(data.attributes)
      }
      else {
        mustBeObject('data', data)
      }
    }
    else {
      this._pointers = []
    }
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.ibo.release()
    this.ibo = void 0
    this.vbo.release()
    this.vbo = void 0
    super.destructor()
  }

  get attributes(): number[] {
    return this._attributes
  }
  set attributes(attributes: number[]) {
    if (isArray(attributes)) {
      this._attributes = attributes
      this.vbo.data = new Float32Array(attributes)
    }
  }

  /**
   * @property data
   * @type VertexArrays
   * @readOnly
   */
  get data(): VertexArrays {
    // FIXME: This should return a deep copy.
    return {
      drawMode: this._drawMode,
      indices: this._indices,
      attributes: this._attributes,
      stride: this._stride,
      pointers: this._pointers
    }
  }
  set data(data: VertexArrays) {
    throw new Error(readOnly('data').message)
  }

  /**
   * @property drawMode
   * @type {DrawMode}
   */
  get drawMode(): DrawMode {
    return this._drawMode
  }
  set drawMode(drawMode: DrawMode) {
    this._drawMode = drawMode
    if (this.contextProvider) {
      this.drawMode = this.contextProvider.drawModeToGL(drawMode)
    }
  }

  /**
   * @property indices
   * @type number[]
   */
  get indices(): number[] {
    return this._indices
  }
  set indices(indices: number[]) {
    this.setIndices(indices)
  }

  /**
   * @method setIndices
   * @param indices {number[]}
   * @return {void}
   * @private
   */
  private setIndices(indices: number[]): void {
    if (!isNull(indices) && !isUndefined(indices)) {
      if (isArray(indices)) {
        this._indices = indices;
        this.count = indices.length
        this.ibo.data = new Uint16Array(indices)
      }
      else {
        mustBeArray('indices', indices)
      }
    }
    else {
      // TBD
    }
  }

  /**
   * @property pointers
   * @type VertexAttribPointer[]
   */
  get pointers(): VertexAttribPointer[] {
    return this._pointers
  }
  set pointers(pointers: VertexAttribPointer[]) {
    this._pointers = pointers
  }

  /**
   * The total number of <em>bytes</em> for each element.
   * 
   * @property stride
   * @type number
   */
  get stride(): number {
    return this._stride
  }
  set stride(stride: number) {
    this._stride = stride
  }

  /**
   * @method isLeaf
   * @return {boolean}
   */
  public isLeaf(): boolean {
    return true
  }

  /**
   * @property partsLength
   * @type number
   * @readOnly
   */
  get partsLength(): number {
    return 0
  }
  set partsLength(unused) {
    throw new Error(readOnly('partsLength').message)
  }

  get scaling() {
    throw new Error(notImplemented('get scaling').message)
  }
  set scaling(scaling: Matrix4) {
    throw new Error(notImplemented('set scaling').message)
  }

  /**
   * @method addPart
   * @param geometry {Geometry}
   * @return {void}
   */
  addPart(geometry: Geometry): void {
    throw new Error(notSupported('addPart').message)
  }

  /**
   * @method removePart
   * @param index {number}
   * @return {void}
   */
  removePart(index: number): void {
    throw new Error(notSupported('removePart').message)
  }

  /**
   * @method getPart
   * @param index {number}
   * @return {Geometry}
   */
  getPart(index: number): Geometry {
    throw new Error(notSupported('getPart').message)
  }

  /**
   * @method contextFree
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  public contextFree(contextProvider: ContextProvider): void {
    this.ibo.contextFree(contextProvider)
    this.vbo.contextFree(contextProvider)
    super.contextFree(contextProvider)
  }

  /**
   * @method contextGain
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  public contextGain(contextProvider: ContextProvider): void {
    if (isNumber(this._drawMode)) {
      this.mode = contextProvider.drawModeToGL(this._drawMode)
    }
    else {
      switch (core.errorMode) {
        case ErrorMode.WARNME: {
          console.warn(`${this._type}.drawMode must be a number.`)
        }
        default: {
          // Do nothing.
        }
      }
    }
    if (!isNumber(this._stride)) {
      switch (core.errorMode) {
        case ErrorMode.WARNME: {
          console.warn(`${this._type}.stride must be a number.`)
        }
        default: {
          // Do nothing.
        }
      }
    }
    this.ibo.contextGain(contextProvider)
    this.vbo.contextGain(contextProvider)
    super.contextGain(contextProvider)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  public contextLost(): void {
    this.ibo.contextLost()
    this.vbo.contextLost()
    super.contextLost()
  }

  /**
   * @method draw
   * @param material {AbstractMaterial}
   * @return {void}
   */
  draw(material: AbstractMaterial): void {
    const contextProvider = this.contextProvider
    if (contextProvider) {
      this.vbo.bind()
      const pointers = this._pointers
      if (pointers) {
        const iLength = pointers.length
        for (let i = 0; i < iLength; i++) {
          const pointer = pointers[i]
          const attribLoc = material.getAttribLocation(pointer.name)
          if (attribLoc >= 0) {
            contextProvider.vertexAttribPointer(attribLoc, pointer.size, pointer.normalized, this._stride, pointer.offset)
            contextProvider.enableVertexAttribArray(attribLoc)
          }
        }
      }
      else {
        switch (core.errorMode) {
          case ErrorMode.WARNME: {
            console.warn(`${this._type}.pointers must be an array.`)
          }
          default: {
            // Do nothing.
          }
        }
      }
      this.ibo.bind()
      if (this.count) {
        contextProvider.drawElements(this.mode, this.count, this.offset)
      }
      else {
        switch (core.errorMode) {
          case ErrorMode.WARNME: {
            console.warn(`${this._type}.indices must be an array.`)
          }
          default: {
            // Do nothing.
          }
        }
      }
      this.ibo.unbind()
      this.vbo.unbind()
    }
  }

  /**
   * @method hasPrincipalScale
   * @param name {string}
   * @return {boolean}
   */
  hasPrincipalScale(name: string): boolean {
    throw new Error(notImplemented(`hasPrincipalScale(${name})`).message)
  }

  /**
   * @method getPrincipalScale
   * @param name {string}
   * @return {number}
   */
  public getPrincipalScale(name: string): number {
    throw new Error(notImplemented('getPrincipalScale').message)
  }

  /**
   * @method setPrincipalScale
   * @param name {string}
   * @param value {number}
   * @return {void}
   */
  public setPrincipalScale(name: string, value: number): void {
    throw new Error(notImplemented('setPrincipalScale').message)
  }
}
