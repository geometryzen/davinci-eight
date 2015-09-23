import toGeometryMeta = require('../dfx/toGeometryMeta')
import ContextManager = require('../core/ContextManager')
import ContextMonitor = require('../core/ContextMonitor')
import core = require('../core');
import GeometryData = require('../dfx/GeometryData')
import Geometry = require('../geometries/Geometry')
import GeometryMeta = require('../dfx/GeometryMeta')
import IDrawable = require('../core/IDrawable')
import IBufferGeometry = require('../dfx/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import IMaterial = require('../core/IMaterial')
import Material = require('../materials/Material')
import mustBeDefined = require('../checks/mustBeDefined')
import NumberIUnknownMap = require('../utils/NumberIUnknownMap')
import refChange = require('../utils/refChange')
import Simplex = require('../dfx/Simplex')
import toGeometryData = require('../dfx/toGeometryData')
import UniformData = require('../core/UniformData')
import uuid4 = require('../utils/uuid4')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'Mesh'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class Mesh
 * @implements IDrawable
 */
class Mesh<G extends Geometry, M extends IMaterial, U extends UniformData> implements IDrawable {
  private _refCount = 1
  private _uuid: string = uuid4().generate()
  public geometry: G
  public _material: M
  /**
   * FIXME This is a bad name because it is not just a collection of meshLookup.
   * A map from canvas to IBufferGeometry.
   * It's a function that returns a mesh, given a canvasId a lokup
   */
  private meshLookup: NumberIUnknownMap<IBufferGeometry>
  public model: U
  private mode: number
  // FIXME: Do we insist on a ContextMonitor here.
  // We can also assume that we are OK because of the Scene - but can't assume that there is one?
  constructor(geometry: G, material: M, model: U) {
    this.geometry = geometry
    this._material = material
    this._material.addRef()

    this.meshLookup = new NumberIUnknownMap<IBufferGeometry>()

    this.model = model
    refChange(this._uuid, LOGGING_NAME, +1)
  }
  addRef(): number {
    this._refCount++
    refChange(this._uuid, LOGGING_NAME, +1)
    return this._refCount
  }
  release(): number {
    this._refCount--
    refChange(this._uuid, LOGGING_NAME, -1)
    if (this._refCount === 0) {
      this.meshLookup.release()
      this.meshLookup = void 0
      this._material.release()
      this._material = void 0
    }
    return this._refCount
  }
  draw(canvasId: number): void {
    // We know we are going to need a "good" canvasId to perform the buffers lookup.
    // So we may as well test that condition now rather than waste information.
    // (Energy is always conserved, entropy almost always increases, its information we waste!) 
    if (isDefined(canvasId)) {
      // We're interleaving calls to different contexts!
      // FIXME: It seems that by going this route we're
      // going to be traversing the objects the same way :(?
      let self = this
      // Be careful not to call through the public API and cause addRef!
      // FIXME: Would be nice to be able to check that a block does not alter the reference count?
      let material = self._material
      let model = self.model
      let buffers: IBufferGeometry = this.meshLookup.getWeakReference(canvasId)
      if (isDefined(buffers)) {
        material.use(canvasId)
        model.setUniforms(material, canvasId)
        // FIXME Does canvasId affect the next steps?...
        // Nope! We've already picked it by canvas.
        buffers.bind(material/*, aNameToKeyName*/) // FIXME: Why not part of the API.
        buffers.draw()
        buffers.unbind()
      }
      else {
        if (core.verbose) {
          console.warn("Mesh is unable to draw because it has not be prepared for the specified canvas. canvasId => " + canvasId);
        }
      }
    }
    else {
      if (core.verbose) {
        console.warn("Mesh unable to look up buffer geometry because `typeof canvasId` is " + typeof canvasId)
      }
    }
  }
  contextFree(canvasId: number): void {
    this._material.contextFree(canvasId)
  }
  contextGain(manager: ContextManager): void {
    let geometry = this.geometry
    if (geometry) {
      let data = geometry.data
      let meta = geometry.meta

      mustBeDefined('geometry.data', data, contextBuilder)
      mustBeDefined('geometry.meta', meta, contextBuilder)

      // FIXME: Why is the meta not being used?
      this.meshLookup.putWeakReference(manager.canvasId, manager.createBufferGeometry(data))

      this._material.contextGain(manager)
    }
    else {
      console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId)
    }
  }
  contextLoss(canvasId: number): void {
    this._material.contextLoss(canvasId)
  }
  /**
   * @property material
   *
   * Provides a reference counted reference to the material.
   */
  get material(): IMaterial {
    this._material.addRef()
    return this._material
  }
}

export = Mesh