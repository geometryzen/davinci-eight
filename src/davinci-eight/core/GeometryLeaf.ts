import Material from './Material'
import ContextProvider from './ContextProvider'
import config from '../config'
import DrawMode from './DrawMode'
import Engine from './Engine'
import ErrorMode from './ErrorMode'
import Geometry from './Geometry'
import incLevel from '../base/incLevel'
import isNumber from '../checks/isNumber'
import Matrix4 from '../math/Matrix4'
import notImplemented from '../i18n/notImplemented'
import notSupported from '../i18n/notSupported'
import readOnly from '../i18n/readOnly'
import ShareableContextConsumer from './ShareableContextConsumer'
import VertexAttribPointer from './VertexAttribPointer'

/**
 * @class GeometryLeaf
 * @extends ShareableContextConsumer
 */
export default class GeometryLeaf extends ShareableContextConsumer implements Geometry {

  /**
   * @property _drawMode
   * @type DrawMode
   * @private
   */
  private _drawMode: DrawMode;

  /**
   * @property mode
   * @type number
   * @protected
   */
  protected mode: number;

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
   * @protected
   */
  protected _stride: number;

  /**
   * @property _pointers
   * @type VertexAttribPointer[]
   * @protected
   */
  protected _pointers: VertexAttribPointer[];

  /**
   * @class GeometryLeaf
   * @constructor
   * @param engine {Engine}
   */
  constructor(engine: Engine) {
    super(engine)
    this.setLoggingName('GeometryLeaf')
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
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

  /**
   * @property scaling
   * @type Matrix4
   */
  get scaling(): Matrix4 {
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
   * @method contextGain
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  public contextGain(contextProvider: ContextProvider): void {
    if (isNumber(this._drawMode)) {
      this.mode = contextProvider.drawModeToGL(this._drawMode)
    }
    else {
      switch (config.errorMode) {
        case ErrorMode.WARNME: {
          console.warn(`${this._type}.drawMode must be a number.`)
        }
        default: {
          // Do nothing.
        }
      }
    }
    if (!isNumber(this._stride)) {
      switch (config.errorMode) {
        case ErrorMode.WARNME: {
          console.warn(`${this._type}.stride must be a number.`)
        }
        default: {
          // Do nothing.
        }
      }
    }
    super.contextGain(contextProvider)
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
   * @method draw
   * @param material {Material}
   * @return {void}
   */
  draw(material: Material): void {
    throw new Error(notSupported('draw').message)
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
