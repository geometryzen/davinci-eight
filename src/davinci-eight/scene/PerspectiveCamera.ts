import ContextManager = require('../core/ContextManager');
import ICamera = require('../scene/ICamera');
import IProgram = require('../core/IProgram');
import createPerspective = require('../cameras/createPerspective');
import Perspective = require('../cameras/Perspective');
import refChange = require('../utils/refChange');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import uuid4 = require('../utils/uuid4');
import Vector3 = require('../math/Vector3');

/**
 * Name used for reference count monitoring and logging.
 */
let CLASS_NAME = 'PerspectiveCamera';

/**
 * @module EIGHT
 * @class PerspectiveCamera
 * @implements ICamera
 * @implements UniformData
 */
class PerspectiveCamera implements ICamera, UniformData {
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;
  public position: Vector3 = new Vector3();
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  public material: IProgram;
  private inner: Perspective;
  constructor(fov: number = 50 * Math.PI / 180, aspect: number = 1, near: number = 0.1, far: number = 2000) {
    this.inner = createPerspective();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    // FIXME: If cameras do become drawable, then we might want monitoring.
    refChange(this._uuid, CLASS_NAME, +1);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, CLASS_NAME, +1);
    return this._refCount;
  }
  accept(visitor: UniformDataVisitor): void {
    this.inner.setFov(this.fov);
    this.inner.setAspect(this.aspect);
    this.inner.setNear(this.near);
    this.inner.setFar(this.far);
    this.inner.setEye(this.position);
    this.inner.accept(visitor);
  }
  contextFree(): void {
  }
  contextGain(manager: ContextManager): void {
  }
  contextLoss(): void {
  }
  draw(canvasId: number): void {
    console.log(CLASS_NAME + ".draw(" + canvasId + ")");
    // Do nothing.
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, CLASS_NAME, -1);
    if (this._refCount === 0) {
      return 0;
    }
    else {

    }
    return this._refCount;
  }
}

export = PerspectiveCamera;
