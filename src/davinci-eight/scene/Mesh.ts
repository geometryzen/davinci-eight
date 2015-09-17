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
  private meshes: NumberIUnknownMap<IMesh>;
  public model: U;
  private elements: DrawElements;
  private mode: number;
  // FIXME: Do we insist on a ContextMonitor here.
  // We can also assume that we are OK because of the Scene - but can't assume that there is one?
  constructor(geometry: G, material: M, model: U) {
    this.geometry = geometry;

    this._material = material;
    this._material.addRef();

    this.meshes = new NumberIUnknownMap<IMesh>();

    this.model = model;
    refChange(this._uuid, LOGGING_NAME, +1);
    // 1. Apply subdivide and boundary if needed, acting on simplices.
    // 2. Check the geometry to produce the geometry info.
    // 3 Compute DrawElements from the Simplex geometry.
    // 4 Wait for contextGain.
//    var simplices = Simplex.subdivide(geometry.simplices, 2);
//    simplices = Simplex.boundary(simplices, 1);
//    let geometryInfo: GeometryInfo = checkGeometry(simplices);
//    this.elements = toDrawElements(simplices, geometryInfo);
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
      this.meshes.release();
      this.meshes = void 0;
      this._material.release();
      this._material = void 0;
    }
    return this._refCount;
  }
  draw(): void {
    console.warn("Mesh.draw() needs canvas id")
    // FIXME: We need a canvasID;
    let canvasId = void 0;
    let mesh = this.meshes.get(canvasId);
    if (mesh) {
      this.material.use(canvasId);
      this.model.accept(this._material);
      mesh.bind(this._material);
      mesh.draw();
      mesh.unbind();

      mesh.release();
    }
    else {
      console.warn(LOGGING_NAME + " draw method has mesh or canvasId, canvasId => " + canvasId);
    }
  }
  contextFree(canvasId: number): void {
    this._material.contextFree(canvasId);
  }
  contextGain(manager: ContextManager): void {
    // 5. create the mesh and cache the IMesh result.
    if (this.elements) {

      let mesh = manager.createDrawElementsMesh(this.elements);
      this.meshes.put(manager.canvasId, mesh);
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