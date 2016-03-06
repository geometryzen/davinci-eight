import DrawMode from './DrawMode'
import Engine from '../core/Engine'
import VertexBuffer from './VertexBuffer'
import ContextProvider from '../core/ContextProvider'
import notImplemented from '../i18n/notImplemented'
import notSupported from '../i18n/notSupported'
import AbstractMaterial from './AbstractMaterial'
import Matrix4 from '../math/Matrix4'
import VertexAttribPointer from './VertexAttribPointer'
import Geometry from './Geometry'
import readOnly from '../i18n/readOnly'
import ShareableContextConsumer from './ShareableContextConsumer'
import IndexBuffer from './IndexBuffer'
import VertexArrays from './VertexArrays'

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

  private drawMode: DrawMode;
  private indices: number[];
  private attributes: number[];
  private stride: number;
  private pointers: VertexAttribPointer[];

  private mode: number;
  private count: number;
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
    // FIXME: We should do a deep copy.
    this.drawMode = data.drawMode;
    this.indices = data.indices;
    this.attributes = data.attributes;
    this.stride = data.stride
    this.pointers = data.pointers

    this.count = this.indices.length
    this.ibo = new IndexBuffer(engine)
    this.ibo.data = new Uint16Array(this.indices)
    this.vbo = new VertexBuffer(engine)
    this.vbo.data = new Float32Array(this.attributes)
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

  /**
   * @property data
   * @type VertexArrays
   * @readOnly
   */
  get data(): VertexArrays {
    // FIXME: This should return a deep copy.
    return {
      drawMode: this.drawMode,
      indices: this.indices,
      attributes: this.attributes,
      stride: this.stride,
      pointers: this.pointers
    }
  }
  set data(data: VertexArrays) {
    throw new Error(readOnly('data').message)
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
    this.mode = contextProvider.drawModeToGL(this.drawMode)
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
      const iLength = this.pointers.length
      for (let i = 0; i < iLength; i++) {
        const pointer = this.pointers[i]
        const attribLoc = material.getAttribLocation(pointer.name)
        if (attribLoc >= 0) {
          contextProvider.vertexAttribPointer(attribLoc, pointer.size, pointer.normalized, this.stride, pointer.offset)
          contextProvider.enableVertexAttribArray(attribLoc)
        }
      }
      this.ibo.bind()
      contextProvider.drawElements(this.mode, this.count, this.offset)
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
