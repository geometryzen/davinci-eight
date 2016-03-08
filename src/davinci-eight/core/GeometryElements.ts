import AbstractMaterial from './AbstractMaterial'
import ContextProvider from './ContextProvider'
import core from '../core'
import Engine from './Engine'
import ErrorMode from './ErrorMode'
import GeometryLeaf from './GeometryLeaf'
import incLevel from '../base/incLevel'
import IndexBuffer from './IndexBuffer'
import isArray from '../checks/isArray'
import isNull from '../checks/isNull'
import isObject from '../checks/isObject'
import isUndefined from '../checks/isUndefined'
import mustBeArray from '../checks/mustBeArray'
import mustBeObject from '../checks/mustBeObject'
import readOnly from '../i18n/readOnly'
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
 * @extends GeometryLeaf
 */
export default class GeometryElements extends GeometryLeaf {

  /**
   * @property _indices
   * @type number[]
   * @private
   */
  private _indices: number[];

  /**
   * @property _attributes
   * @type number[]
   * @private
   */
  private _attributes: number[];

  /**
   * @property count
   * @type number
   * @private
   */
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

  /**
   * @property ibo
   * @type IndexBuffer
   * @private
   */
  private ibo: IndexBuffer;

  /**
   * @property vbo
   * @type VertexBuffer
   * @private
   */
  private vbo: VertexBuffer;

  /**
   * @class GeometryElements
   * @constructor
   * @param type {string}
   * @param data {VertexArrays}
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   * @param level {number}
   */
  constructor(type: string, data: VertexArrays, engine: Engine, level: number) {
    super(type, engine, incLevel(level))
    this.ibo = new IndexBuffer(engine, 0)
    this.vbo = new VertexBuffer(engine, 0)

    if (!isNull(data) && !isUndefined(data)) {
      if (isObject(data)) {
        this.drawMode = data.drawMode;
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
    this.ibo.release()
    this.ibo = void 0
    this.vbo.release()
    this.vbo = void 0
    super.destructor(incLevel(level))
  }

  /**
   * @property attributes
   * @type number[]
   */
  public get attributes(): number[] {
    return this._attributes
  }
  public set attributes(attributes: number[]) {
    if (isArray(attributes)) {
      this._attributes = attributes
      this.vbo.data = new Float32Array(attributes)
    }
  }

  /**
   * @property data
   * @type VertexArrays
   * @private
   * @readOnly
   */
  private get data(): VertexArrays {
    // FIXME: This should return a deep copy.
    return {
      drawMode: this.drawMode,
      indices: this._indices,
      attributes: this._attributes,
      stride: this._stride,
      pointers: this._pointers
    }
  }
  private set data(data: VertexArrays) {
    throw new Error(readOnly('data').message)
  }

  /**
   * @property indices
   * @type number[]
   */
  public get indices(): number[] {
    return this._indices
  }
  public set indices(indices: number[]) {
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
  public get pointers(): VertexAttribPointer[] {
    return this._pointers
  }
  public set pointers(pointers: VertexAttribPointer[]) {
    this._pointers = pointers
  }

  /**
   * The total number of <em>bytes</em> for each element.
   * 
   * @property stride
   * @type number
   */
  public get stride(): number {
    return this._stride
  }
  public set stride(stride: number) {
    this._stride = stride
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
}
