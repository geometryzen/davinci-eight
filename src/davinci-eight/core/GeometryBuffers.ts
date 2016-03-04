import drawModeToGL from './drawModeToGL'
import DrawMode from './DrawMode'
import IContextProvider from '../core/IContextProvider'
import notImplemented from '../i18n/notImplemented'
import notSupported from '../i18n/notSupported'
import Material from './Material'
import Matrix4 from '../math/Matrix4'
import VertexAttribPointer from './VertexAttribPointer'
import Geometry from './Geometry'
import readOnly from '../i18n/readOnly'
import ShareableContextListener from './ShareableContextListener'
import VertexArrays from './VertexArrays'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A Geometry that supports interleaved vertex buffers.
 *
 * @class GeometryBuffers
 * @extends ShareableContextListener
 */
export default class GeometryBuffers extends ShareableContextListener implements Geometry {

  private drawMode: DrawMode
  private mode: number
  private count: number
  private offset = 0
  private ia: Uint16Array
  private va: Float32Array
  private ibo: WebGLBuffer
  private vbo: WebGLBuffer
  private stride: number
  private pointers: VertexAttribPointer[]
  private _data: VertexArrays

  /**
   * @class GeometryBuffers
   * @constructor
   * @param data {VertexArrays}
   */
  constructor(data: VertexArrays) {
    super('GeometryBuffers')
    this.drawMode = data.drawMode;
    this.count = data.indices.length
    this.ia = new Uint16Array(data.indices)
    this.va = new Float32Array(data.attributes)
    this.stride = data.stride
    this.pointers = data.pointers
    this._data = data
  }

  /**
   * @property data
   * @type VertexArrays
   * @readOnly
   */
  get data(): VertexArrays {
    return this._data
  }
  set data(data: VertexArrays) {
    throw new Error(readOnly('data').message)
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
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
   * @param context {IContextProvider}
   * @return {void}
   */
  public contextFree(context: IContextProvider): void {
    const gl = context.gl
    if (this.ibo) {
      gl.deleteBuffer(this.ibo)
      this.ibo = void 0
    }
    if (this.vbo) {
      gl.deleteBuffer(this.vbo)
      this.vbo = void 0
    }
    super.contextFree(context)
  }

  /**
   * @method contextGain
   * @param context {IContextProvider}
   * @return {void}
   */
  public contextGain(context: IContextProvider): void {
    const gl = context.gl
    this.mode = drawModeToGL(this.drawMode, gl)
    if (!this.ibo) {
      this.ibo = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ia, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, void 0)
    }
    if (!this.vbo) {
      this.vbo = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
      gl.bufferData(gl.ARRAY_BUFFER, this.va, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, void 0)
    }
    super.contextGain(context)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  public contextLost(): void {
    this.ibo = void 0
    this.vbo = void 0
    super.contextLost()
  }

  /**
   * @method draw
   * @param material {Material}
   * @return {void}
   */
  draw(material: Material): void {
    // FIXME: Make the buffer a wrapper and contextProvider private or encapsulating WebGL.
    const gl: WebGLRenderingContext = this.contextProvider.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    for (let i = 0; i < this.pointers.length; i++) {
      const pointer = this.pointers[i]
      const attribLoc = material.getAttribLocation(pointer.name)
      if (attribLoc >= 0) {
        gl.vertexAttribPointer(attribLoc, pointer.size, gl.FLOAT, pointer.normalized, this.stride, pointer.offset)
        gl.enableVertexAttribArray(attribLoc)
      }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
    // At present we manage our own buffers. In future we might delegate this task to
    // to the mirror layer which would return the offset.
    gl.drawElements(this.mode, this.count, gl.UNSIGNED_SHORT, this.offset)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, void 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, void 0)
  }

  /**
   * @method hasPrincipalScale
   * @param name {string}
   * @return {boolean}
   */
  hasPrincipalScale(name: string): boolean {
    // TODO
    throw new Error(notImplemented(`hasPrincipalScale(${name})`).message)
  }

  /**
   * @method getPrincipalScale
   * @param name {string}
   * @return {number}
   */
  public getPrincipalScale(name: string): number {
    // TODO
    throw new Error(notImplemented('getPrincipalScale').message)
  }

  /**
   * @method setPrincipalScale
   * @param name {string}
   * @param value {number}
   * @return {void}
   */
  public setPrincipalScale(name: string, value: number): void {
    // TODO
    throw new Error(notImplemented('setPrincipalScale').message)
  }
}
