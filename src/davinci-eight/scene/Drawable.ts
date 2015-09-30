import toGeometryMeta = require('../geometries/toGeometryMeta')
import IContextProvider = require('../core/IContextProvider')
import ContextMonitor = require('../core/ContextMonitor')
import core = require('../core');
import GeometryData = require('../geometries/GeometryData')
import GeometryElements = require('../geometries/GeometryElements')
import GeometryMeta = require('../geometries/GeometryMeta')
import IDrawable = require('../core/IDrawable')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import IMaterial = require('../core/IMaterial')
import Material = require('../materials/Material')
import mustBeDefined = require('../checks/mustBeDefined')
import NumberIUnknownMap = require('../utils/NumberIUnknownMap')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import toGeometryData = require('../geometries/toGeometryData')
import UniformData = require('../core/UniformData')
import uuid4 = require('../utils/uuid4')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'Drawable'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class Drawable
 * @implements IDrawable
 */
class Drawable<G extends GeometryElements, M extends IMaterial, U extends UniformData> extends Shareable implements IDrawable {
  /**
   * @property geometry
   * @type {G}
   */
  public geometry: G;
  /**
   * @property _material
   * @type {M}
   * @private
   */
  public _material: M;
  /**
   * @property name
   * @type [string]
   */
  public name: string;
  /**
   * FIXME This is a bad name because it is not just a collection of buffersByCanvasid.
   * A map from canvas to IBufferGeometry.
   * It's a function that returns a mesh, given a canvasId a lokup
   */
  private buffersByCanvasid: NumberIUnknownMap<IBufferGeometry>;
  /**
   * @property model
   * @type {U}
   */
  public model: U;
  /**
   * @property mode
   * @type {number}
   * @private
   */
  private mode: number;
  // FIXME: Do we insist on a ContextMonitor here.
  // We can also assume that we are OK because of the Scene - but can't assume that there is one?
  /**
   * @class Drawable
   * @constructor
   * @param geometry {G}
   * @param material {M}
   * @param model {U}
   */
  constructor(geometry: G, material: M, model: U) {
    super(LOGGING_NAME)
    this.geometry = geometry
    this._material = material
    this._material.addRef()

    this.buffersByCanvasid = new NumberIUnknownMap<IBufferGeometry>()

    this.model = model
  }
  protected destructor(): void {
    this.geometry = void 0;
    this.buffersByCanvasid.release()
    this.buffersByCanvasid = void 0
    this._material.release()
    this._material = void 0
    this.model = void 0;
  }
  draw(canvasId: number): void {
    // We know we are going to need a "good" canvasId to perform the buffers lookup.
    // So we may as well test that condition now.
    if (isDefined(canvasId)) {
      let material = this._material
      let model = this.model
      let buffers: IBufferGeometry = this.buffersByCanvasid.getWeakReference(canvasId)
      if (isDefined(buffers)) {
        material.use(canvasId)
        model.setUniforms(material, canvasId)
        buffers.bind(material/*, aNameToKeyName*/) // FIXME: Why not part of the API?
        buffers.draw()
        buffers.unbind()
      }
    }
  }
  contextFree(canvasId: number): void {
    this._material.contextFree(canvasId)
  }
  contextGain(manager: IContextProvider): void {
    // 1. Replace the existing buffer geometry if we have geometry. 
    if (this.geometry) {
      let data = this.geometry.data
      let meta = this.geometry.meta

      mustBeDefined('geometry.data', data, contextBuilder)
      mustBeDefined('geometry.meta', meta, contextBuilder)

      // FIXME: Why is the meta not being used?
      this.buffersByCanvasid.putWeakReference(manager.canvasId, manager.createBufferGeometry(data))
    }
    else {
      console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId)
    }
    // 2. Delegate the context to the material.
    this._material.contextGain(manager)
  }
  contextLost(canvasId: number): void {
    this._material.contextLost(canvasId)
  }
  /**
   * @property material
   * @type {M}
   *
   * Provides a reference counted reference to the material.
   */
  get material(): M {
    this._material.addRef()
    return this._material
  }
}

export = Drawable