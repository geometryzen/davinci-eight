import simplicesToGeometryMeta = require('../geometries/simplicesToGeometryMeta')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import core = require('../core');
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GeometryMeta = require('../geometries/GeometryMeta')
import IDrawable = require('../core/IDrawable')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import IMaterial = require('../core/IMaterial')
import IUnknownArray = require('../collections/IUnknownArray')
import Material = require('../materials/Material')
import mustBeDefined = require('../checks/mustBeDefined')
import NumberIUnknownMap = require('../collections/NumberIUnknownMap')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import StringIUnknownMap = require('../collections/StringIUnknownMap')
import simplicesToDrawPrimitive = require('../geometries/simplicesToDrawPrimitive')
import IFacet = require('../core/IFacet')
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
 * @extends Shareable
 * @extends IDrawable
 */
class Drawable<M extends IMaterial> extends Shareable implements IDrawable {
  /**
   * @property primitives
   * @type {DrawPrimitive[]}
   */
  public primitives: DrawPrimitive[];
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
   * FIXME This is a bad name because it is not just a collection of buffersByCanvasId.
   * A map from canvas to IBufferGeometry.
   * It's a function that returns a mesh, given a canvasId a lokup
   */
  private buffersByCanvasId: NumberIUnknownMap<IUnknownArray<IBufferGeometry>>;
  /**
   * @property uniforms
   * @type {StringIUnknownMap<IFacet>}
   * @private
   */
  private uniforms: StringIUnknownMap<IFacet>;
  /**
   * @property mode
   * @type {number}
   * @private
   */
  private mode: number;
  // FIXME: Do we insist on a IContextMonitor here.
  // We can also assume that we are OK because of the Scene - but can't assume that there is one?
  /**
   * @class Drawable
   * @constructor
   * @param primitives {DrawPrimitive[]}
   * @param material {M}
   * @param model {U}
   */
  constructor(primitives: DrawPrimitive[], material: M) {
    super(LOGGING_NAME)
    this.primitives = primitives

    this._material = material
    this._material.addRef()

    this.buffersByCanvasId = new NumberIUnknownMap<IUnknownArray<IBufferGeometry>>()

    this.uniforms = new StringIUnknownMap<IFacet>();
  }
  protected destructor(): void {
    this.primitives = void 0;
    this.buffersByCanvasId.release()
    this.buffersByCanvasId = void 0
    this._material.release()
    this._material = void 0
    this.uniforms.release()
    this.uniforms = void 0
  }
  draw(canvasId: number): void {
    // We know we are going to need a "good" canvasId to perform the buffers lookup.
    // So we may as well test that condition now.
    if (isDefined(canvasId)) {
      let material = this._material

      let buffers: IUnknownArray<IBufferGeometry> = this.buffersByCanvasId.getWeakRef(canvasId)
      if (isDefined(buffers)) {
        material.use(canvasId)

        // FIXME: The name is unused. Think we should just have a list
        // and then access using either the real uniform name or a property name.
        this.uniforms.forEach(function(name, uniform) {
          uniform.setUniforms(material, canvasId)
        })

        for (var i = 0; i < buffers.length; i++) {
          var buffer = buffers.getWeakRef(i)
          buffer.bind(material/*, aNameToKeyName*/) // FIXME: Why not part of the API?
          buffer.draw()
          buffer.unbind()
        }
      }
    }
  }
  contextFree(canvasId: number): void {
    this._material.contextFree(canvasId)
  }
  contextGain(manager: IContextProvider): void {
    // 1. Replace the existing buffer geometry if we have geometry. 
    if (this.primitives) {
      for (var i = 0; i < this.primitives.length; i++) {
        var primitive = this.primitives[i]
        if (!this.buffersByCanvasId.exists(manager.canvasId)) {
          this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray<IBufferGeometry>([]))
        }
        var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId)
        buffers.pushWeakRef(manager.createBufferGeometry(primitive))
      }
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
   * @method getFacet
   * @param name {string}
   * @return {IFacet}
   */
  getFacet(name: string): IFacet {
    return this.uniforms.get(name)
  }
  setFacet<T extends IFacet>(name: string, value: T): T {
    this.uniforms.put(name, value)
    return value
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