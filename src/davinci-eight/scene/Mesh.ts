import checkGeometry = require('../dfx/checkGeometry');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import DrawElements = require('../dfx/DrawElements');
import Geometry = require('../geometries/Geometry');
import GeometryInfo = require('../dfx/GeometryInfo');
import IDrawable = require('../core/IDrawable');
import IMesh = require('../dfx/IMesh');
import IProgram = require('../core/IProgram');
import Material = require('../materials/Material')
import NumberIUnknownMap = require('../utils/NumberIUnknownMap');
import refChange = require('../utils/refChange');
import Simplex = require('../dfx/Simplex');
import toDrawElements = require('../dfx/toDrawElements');
import UniformData = require('../core/UniformData');
import uuid4 = require('../utils/uuid4');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'Mesh';

/**
 * @class Mesh
 * @implements IDrawable
 */
class Mesh<G extends Geometry, M extends IProgram, U extends UniformData> implements IDrawable {
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  public geometry: G;
  public _material: M;
  /**
   * FIXME This is a bad name because it is not just a collection of meshLookup.
   * A map from canvas to IMesh.
   * It's a function that returns a mesh, given a canvasId; a lokup
   */
  private meshLookup: NumberIUnknownMap<IMesh>;
  public model: U;
  private mode: number;
  // FIXME: Do we insist on a ContextMonitor here.
  // We can also assume that we are OK because of the Scene - but can't assume that there is one?
  constructor(geometry: G, material: M, model: U) {
    this.geometry = geometry;
    this._material = material;
    this._material.addRef();

    this.meshLookup = new NumberIUnknownMap<IMesh>();

    this.model = model;
    refChange(this._uuid, LOGGING_NAME, +1);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME, -1);
    if (this._refCount === 0) {
      this.meshLookup.release();
      this.meshLookup = void 0;
      this._material.release();
      this._material = void 0;
    }
    return this._refCount;
  }
  draw(canvasId: number): void {
    // We're interleaving calls to different contexts!
    // FIXME: It seems that by going this route we're
    // going to be traversing the objects the same way :(?
    let self = this;
    // Be careful not to call through the public API and cause addRef!
    // FIXME: Would be nice to be able to check that a block does not alter the reference count?
    let material = self._material;
    let model = self.model;
    let mesh = this.meshLookup.get(canvasId);
    material.use(canvasId);
    model.accept(material);
    mesh.bind(material/*, aNameToKeyName*/); // FIXME: Why not part of the API.
    mesh.draw();
    mesh.unbind();
    mesh.release();
  }
  contextFree(canvasId: number): void {
    this._material.contextFree(canvasId);
  }
  contextGain(manager: ContextManager): void {
    let geometry = this.geometry;
    if (geometry) {
      let data = geometry.data;
      let meta = geometry.meta;
      // FIXME: Why is the meta not being used?
      let mesh = manager.createDrawElementsMesh(data);
      this.meshLookup.put(manager.canvasId, mesh);
      mesh.release();

      this._material.contextGain(manager);
    }
    else {
      console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId);
    }
  }
  contextLoss(canvasId: number): void {
    this._material.contextLoss(canvasId);
  }
  /**
   * @property material
   *
   * Provides a reference counted reference to the material.
   */
  get material(): IProgram {
    this._material.addRef();
    return this._material;
  }
}

export = Mesh;