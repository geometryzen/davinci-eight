import ContextManager = require('../core/ContextManager');
import ICamera = require('../scene/ICamera');
import IProgram = require('../core/IProgram');
import refChange = require('../utils/refChange');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import uuid4 = require('../utils/uuid4');
import Vector3 = require('../math/Vector3');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_PERSPECTIVE_CAMERA = 'PerspectiveCamera';

/**
 * @module EIGHT
 * @class PerspectiveCamera
 * @implements ICamera
 * @implements UniformData
 */
class PerspectiveCamera implements ICamera, UniformData {
  public position: Vector3 = new Vector3();
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  public material: IProgram;
  constructor(fov?: number, aspect?: number, near?: number, far?: number) {
    // FIXME: If cameras do become drawable, then we might want monitoring.
    refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
    return this._refCount;
  }
  accept(visitor: UniformDataVisitor): void {
    console.warn("PerspectiveCamera is ignoring visitor. How impolite!")
  }
  contextFree(): void {
  }
  contextGain(manager: ContextManager): void {
  }
  contextLoss(): void {
  }
  draw(): void {
    // Do nothing.
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, -1);
    return this._refCount;
  }
}

export = PerspectiveCamera;
