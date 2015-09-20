import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import MonitorList = require('../scene/MonitorList');
import mustSatisfy = require('../checks/mustSatisfy');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
import createDrawList = require('../scene/createDrawList');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');

let LOGGING_NAME = 'Scene';

function ctorContext(): string {
  return LOGGING_NAME + " constructor";
}

/**
 * @module EIGHT
 * @class Scene
 * @implements IDrawList
 */
class Scene implements IDrawList {
  private _drawList: IDrawList = createDrawList();
  private monitors: MonitorList;
  private _refCount = 1;
  private _uuid = uuid4().generate();
  // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
  constructor(monitors: ContextMonitor[]) {
    MonitorList.verify('monitors', monitors, ctorContext);
    this.monitors = new MonitorList(monitors);
    this.monitors.addContextListener(this);
    refChange(this._uuid, LOGGING_NAME, +1);
  }
  add(drawable: IDrawable) {
    this._drawList.add(drawable);
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
      this._drawList.release();
      this._drawList = void 0;
      this.monitors.removeContextListener(this);
      this.monitors = void 0;
      this._refCount = void 0;
      this._uuid = void 0;
      return 0;
    }
    else {
      return this._refCount;
    }
  }
  remove(drawable: IDrawable): void {
    this._drawList.remove(drawable);
  }
  traverse(callback: (drawable: IDrawable) => void): void {
    this._drawList.traverse(callback);
  }
  contextFree(canvasId: number) {
    this._drawList.contextFree(canvasId);
  }
  contextGain(manager: ContextManager) {
    this._drawList.contextGain(manager);
  }
  contextLoss(canvasId: number) {
    this._drawList.contextLoss(canvasId);
  }
  uniform1f(name: string, x: number, canvasId: number) {
    this._drawList.uniform1f(name, x, canvasId);
  }
  uniform2f(name: string, x: number, y: number) {
    this._drawList.uniform2f(name, x, y);
  }
  uniform3f(name: string, x: number, y: number, z: number) {
    this._drawList.uniform3f(name, x, y, z);
  }
  uniform4f(name: string, x: number, y: number, z: number, w: number) {
    this._drawList.uniform4f(name, x, y, z, w);
  }
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1) {
    this._drawList.uniformMatrix1(name, transpose, matrix);
  }
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
    this._drawList.uniformMatrix2(name, transpose, matrix);
  }
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
    this._drawList.uniformMatrix3(name, transpose, matrix);
  }
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
    this._drawList.uniformMatrix4(name, transpose, matrix);
  }
  uniformVector1(name: string, vector: Vector1) {
    this._drawList.uniformVector1(name, vector);
  }
  uniformVector2(name: string, vector: Vector2) {
    this._drawList.uniformVector2(name, vector);
  }
  uniformVector3(name: string, vector: Vector3) {
    this._drawList.uniformVector3(name, vector);
  }
  uniformVector4(name: string, vector: Vector4) {
    this._drawList.uniformVector4(name, vector);
  }
}

export = Scene;
