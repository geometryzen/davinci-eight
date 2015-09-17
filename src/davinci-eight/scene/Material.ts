import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import MonitorList = require('../scene/MonitorList');
import IProgram = require('../core/IProgram');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

let LOGGING_NAME = 'Material';

function ctorContext(): string {
  return LOGGING_NAME + " constructor";
}

// FIXME: Exposing  the WebGLProgram goes against the IUnknown mechanism.

/**
 * @module EIGHT
 * @class Material
 * @implements IProgram
 */
class Material implements IProgram {
  // FIXME: multi-context.
  public program: WebGLProgram;
  public programId: string = uuid4().generate();
  // FIXME get from shaders?
  public vertexShader: string;
  public fragmentShader: string;
  private _refCount: number = 1;
  private _monitors: MonitorList;
  private _name: string;
  constructor(monitors: ContextMonitor[], name: string) {
    MonitorList.verify('monitors', monitors, ctorContext);
    this._monitors = MonitorList.copy(monitors);
    // FIXME multi-context support.
    this._name = name;
    this._monitors.addContextListener(this);
    refChange(this.programId, this._name, this._refCount);
  }
  addRef(): number {
    this._refCount++;
    refChange(this.programId, this._name, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this.programId, this._name, -1);
    if (this._refCount === 0) {
      this._monitors.removeContextListener(this);
      // FIXME: Also need to clean up programs.
    }
    return this._refCount;
  }
  // FIXME; I'm going to need to know which monitor.
  use(): void {
    // FIXME TODO
  }
  get attributes() {
    return void 0;
  }
  get uniforms() {
    return void 0;
  }
  enableAttrib(name: string) {
  }
  disableAttrib(name: string) {
  }
  contextFree() {
  }
  contextGain(manager: ContextManager) {
    console.error("Material.contextGain method is virtual.");
  }
  contextLoss() {
  }
  uniform1f(name: string, x: number): void {
    // FIXME. Hope this works with multi-program.
  }
  uniform2f(name: string, x: number, y: number): void {

  }
  uniform3f(name: string, x: number, y: number, z: number): void {

  }
  uniform4f(name: string, x: number, y: number, z: number, w: number): void {

  }
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void {

  }
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void {

  }
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void {

  }
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void {

  }
  uniformVector1(name: string, vector: Vector1): void {

  }
  uniformVector2(name: string, vector: Vector2): void {

  }
  uniformVector3(name: string, vector: Vector3): void {

  }
  uniformVector4(name: string, vector: Vector4): void {

  }
}

export = Material;