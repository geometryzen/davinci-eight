import AbstractMaterial from './AbstractMaterial'
import Attribute from './Attribute'
import computeAttributes from './computeAttributes'
import computeCount from './computeCount'
import computePointers from './computePointers'
import computeStride from './computeStride'
import ContextProvider from './ContextProvider'
import core from '../core'
import Engine from './Engine'
import ErrorMode from './ErrorMode'
import GeometryLeaf from './GeometryLeaf'
import incLevel from '../base/incLevel'
import VertexBuffer from './VertexBuffer'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 *
 * @example
 *     const engine = new EIGHT.Engine()
 *
 *     const geometry = new EIGHT.GeometryArrays(engine)
 *     geometry.drawMode = EIGHT.DrawMode.LINES
 *     geometry.setAttribute('aPosition', {values: [0, 0, 1, 0, 0, 0, 0, 1], size: 2})
 *     geometry.setAttribute('aColor', {values: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0], size: 3})
 *
 *     geometry.draw(material)
 *
 *     geometry.release()
 *
 * @class GeometryArrays
 * @extends GeometryLeaf
 */
export default class GeometryArrays extends GeometryLeaf {

  /**
   * The <code>first</code> parameter in the drawArrays call.
   * This is currently hard-code to zero because this class only supportes buffering one primitive.
   *
   * @property first
   * @type number
   * @private
   */
  private first: number = 0

  /**
   * The <code>count</code> parameter in the drawArrays call.
   * This is currently maintained at this level because this class only supportes buffering one primitive.
   *
   * @property count
   * @type number
   * @private
   */
  private count: number

  /**
   *
   */
  private attributes: { [name: string]: Attribute }

  /**
   * @property vbo
   * @type VertexBuffer
   * @private
   */
  private vbo: VertexBuffer;

  /**
   * @class GeometryArrays
   * @constructor
   * @param engine {Engine}
   * @param [level = 0] {number}
   */
  constructor(engine: Engine, level = 0) {
    super('GeometryArrays', engine, incLevel(level))
    this.attributes = {}
    this.vbo = new VertexBuffer(engine)
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    this.vbo.release()
    this.vbo = void 0
    super.destructor(incLevel(level))
  }

  /**
   * @method contextFree
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextFree(contextProvider: ContextProvider): void {
    this.vbo.contextFree(contextProvider)
    super.contextFree(contextProvider)
  }

  /**
   * @method contextGain
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextGain(contextProvider: ContextProvider): void {
    this.vbo.contextGain(contextProvider)
    super.contextGain(contextProvider)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
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
      this.contextProvider.drawArrays(this.mode, this.first, this.count)
      this.vbo.unbind()
    }
  }

  /**
   * @method getAttribute
   * @param name {string}
   * @return {Attribute}
   */
  getAttribute(name: string): Attribute {
    return this.attributes[name]
  }

  /**
   * @method setAttribute
   * @param name {string}
   * @param attribute {Attribute}
   * @return {void}
   */
  setAttribute(name: string, attribute: Attribute): void {
    this.attributes[name] = attribute
    // TODO: I think what should happen here is that we pass
    // attributes and aNames to a function which returns first, count, stride, pointers
    // and a VertexBuffer object?
    const aNames = Object.keys(this.attributes)
    // const x = this._engine.createVertexBuffer(this.attributes, aNames)
    // this.first = x.first
    this.count = computeCount(this.attributes, aNames)
    this._stride = computeStride(this.attributes, aNames)
    this._pointers = computePointers(this.attributes, aNames)
    const array = computeAttributes(this.attributes, aNames)
    this.vbo.data = new Float32Array(array)
    // x.release()
  }
}
