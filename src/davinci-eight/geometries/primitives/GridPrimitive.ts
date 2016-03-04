import DrawMode from '../../core/DrawMode'
import GeometryPrimitive from './GeometryPrimitive'
import numPostsForFence from './numPostsForFence'
import numVerticesForGrid from './numVerticesForGrid'
import notSupported from '../../i18n/notSupported'
import readOnly from '../../i18n/readOnly'
import Transform from './Transform'
import Vertex from './Vertex'

/**
 * @module EIGHT
 * @submodule primitives
 */

/**
 * Used for creating TRIANGLE_STRIP primitives.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 *
 * @class GridPrimitive
 * @extends GeometryPrimitive
 */
export default class GridPrimitive extends GeometryPrimitive {

  /**
   * @property _uSegments
   * @type number
   * @private
   */
  private _uSegments: number;
  private _uClosed = false;

  /**
   * @property _vSegments
   * @type number
   * @private
   */
  private _vSegments: number;
  private _vClosed = false;

  /**
   * @class GridPrimitive
   * @constructor
   * @param uSegments {number}
   * @param vSegments {number}
   */
  constructor(mode: DrawMode, uSegments: number, vSegments: number) {
    super(mode, numVerticesForGrid(uSegments, vSegments), 2)
    this._uSegments = uSegments
    this._vSegments = vSegments
  }

  /**
   * @property uSegments
   * @type number
   * @readOnly
   */
  get uSegments(): number {
    return this._uSegments
  }
  set uSegments(unused: number) {
    throw new Error(readOnly('uSegments').message)
  }

  /**
   * uLength = uSegments + 1
   *
   * @property uLength
   * @type number
   * @readOnly
   */
  get uLength(): number {
    return numPostsForFence(this._uSegments, this._uClosed)
  }
  set uLength(unused: number) {
    throw new Error(readOnly('uLength').message)
  }

  /**
   * @property vSegments
   * @type number
   * @readOnly
   */
  get vSegments(): number {
    return this._vSegments
  }
  set vSegments(unused: number) {
    throw new Error(readOnly('vSegments').message)
  }

  /**
   * vLength = vSegments + 1
   *
   * @property vLength
   * @type number
   * @readOnly
   */
  get vLength(): number {
    return numPostsForFence(this._vSegments, this._vClosed)
  }
  set vLength(unused: number) {
    throw new Error(readOnly('vLength').message)
  }

  public vertexTransform(transform: Transform): void {
    const iLen = this.vertices.length
    for (var i = 0; i < iLen; i++) {
      const vertex = this.vertices[i]
      const u = vertex.coords.getComponent(0)
      const v = vertex.coords.getComponent(1)
      transform.exec(vertex, u, v, this.uLength, this.vLength)
    }
  }

  /**
   * Derived classes must override.
   *
   * @method vertex
   * @param i {number}
   * @param j {number}
   * @return {Vertex}
   */
  vertex(i: number, j: number): Vertex {
    throw new Error(notSupported('vertex').message)
  }
}
