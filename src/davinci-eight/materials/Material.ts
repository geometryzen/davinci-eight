import AttribLocation = require('../core/AttribLocation');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import core = require('../core');
import MonitorList = require('../scene/MonitorList');
import IProgram = require('../core/IProgram');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeString = require('../checks/mustBeString');
import refChange = require('../utils/refChange');
import UniformLocation = require('../core/UniformLocation');
import uuid4 = require('../utils/uuid4');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

function consoleWarnDroppedUniform(clazz: string, suffix: string, name: string) {
  console.warn(clazz + " dropped uniform" + suffix + " " + name);
}

/**
 * @module EIGHT
 * @class Material
 * @implements IProgram
 */
class Material implements IProgram {
  // FIXME: Hide this but use a virtual method to set it.
  private inner: IProgram;
  private readyPending: boolean = false;
  public programId: string = uuid4().generate();
  // FIXME get from shaders?
  public vertexShader: string;
  public fragmentShader: string;
  private _refCount: number = 1;
  private _monitors: MonitorList;
  private type: string;
  /**
   * @class Material
   * @constructor
   * @param contexts {ContextMonitor[]}
   * @param type {string} The class name, used for logging and serialization.
   */
  constructor(contexts: ContextMonitor[], type: string) {
    MonitorList.verify('contexts', contexts);
    mustBeString('type', type);
    this._monitors = MonitorList.copy(contexts);
    // FIXME multi-context support.

    this.type = type;
    refChange(this.programId, this.type, this._refCount);
  }
  private makeReady(async: boolean): void {
    if (!this.readyPending) {
      this.readyPending = true;
      this._monitors.addContextListener(this);
    }
  }
  /**
   * @property monitors
   * @type {ContextMonitor[]}
   */
  get monitors(): ContextMonitor[] {
    return this._monitors.toArray();
  }
  /**
   * @method addRef
   * @return {number}
   */
  addRef(): number {
    this._refCount++;
    refChange(this.programId, this.type, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this.programId, this.type, -1);
    if (this._refCount === 0) {
      this._monitors.removeContextListener(this);
      if (this.inner) {
        this.inner.release();
        this.inner = void 0;
      }
    }
    return this._refCount;
  }
  // FIXME; I'm going to need to know which monitor.
  use(canvasId: number): void {
    if (core.ASSERTIVE) {
      mustBeInteger('canvasid', canvasId);
    }
    if (this.inner) {
      return this.inner.use(canvasId);
    }
    else {
      let async = false;
      this.makeReady(async);
      if (this.inner) {
        return this.inner.use(canvasId);
      }
      else {
        console.warn(this.type + " use()");
      }
    }
  }
  get attributes(): {[name: string]: AttribLocation} {
    // FIXME: Why is this called.
    // FIXME: The map should be protected but that is slow
    // FIXME Clear need for performant solution.
    if (this.inner) {
      return this.inner.attributes;
    }
    else {
      let async = false;
      this.makeReady(async);
      if (this.inner) {
        return this.inner.attributes;
      }
      else {
        return void 0;
      }
    }
  }
  get uniforms(): {[name: string]: UniformLocation} {
    if (this.inner) {
      return this.inner.uniforms;
    }
    else {
      let async = false;
      this.makeReady(async);
      if (this.inner) {
        return this.inner.uniforms;
      }
      else {
        return void 0;
      }
    }
  }
  enableAttrib(name: string) {
    if (this.inner) {
      return this.inner.enableAttrib(name);
    }
    else {
      let async = false;
      this.makeReady(async);
      if (this.inner) {
        return this.inner.enableAttrib(name);
      }
      else {
        console.warn(this.type + " enableAttrib()");
      }
    }
  }
  disableAttrib(name: string) {
    if (this.inner) {
      return this.inner.disableAttrib(name);
    }
    else {
      let async = false;
      this.makeReady(async);
      if (this.inner) {
        return this.inner.disableAttrib(name);
      }
      else {
        console.warn(this.type + " disableAttrib()");
      }
    }
  }
  contextFree(canvasId: number) {
    if (this.inner) {
      this.inner.contextFree(canvasId);
    }
  }
  contextGain(manager: ContextManager) {
    this.inner = this.createProgram();
  }
  contextLoss(canvasId: number) {
    if (this.inner) {
      this.inner.contextLoss(canvasId);
    }
  }
  protected createProgram(): IProgram {
    // FIXME; Since we get contextGain by canvas, expect canvasId to be an argument?
    // FIXME: We just delegate contextGain to the program.
    console.warn("Material createProgram method is virtual and should be implemented by " + this.type);
    return void 0;
  }
  uniform1f(name: string, x: number): void {
    if (this.inner) {
      this.inner.uniform1f(name, x);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniform1f(name, x);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '1f', name);
        }
      }
    }
  }
  uniform2f(name: string, x: number, y: number): void {
    if (this.inner) {
      this.inner.uniform2f(name, x, y);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniform2f(name, x, y);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '2f', name);
        }
      }
    }
  }
  uniform3f(name: string, x: number, y: number, z: number): void {
    if (this.inner) {
      this.inner.uniform3f(name, x, y, z);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniform3f(name, x, y, z);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '3f', name);
        }
      }
    }
  }
  uniform4f(name: string, x: number, y: number, z: number, w: number): void {
    if (this.inner) {
      this.inner.uniform4f(name, x, y, z, w);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniform4f(name, x, y, z, w);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '4f', name);
        }
      }
    }
  }
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void {
    if (this.inner) {
      this.inner.uniformMatrix1(name, transpose, matrix);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformMatrix1(name, transpose, matrix);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix1', name);
        }
      }
    }
  }
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void {
    if (this.inner) {
      this.inner.uniformMatrix2(name, transpose, matrix);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformMatrix2(name, transpose, matrix);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix2', name);
        }
      }
    }
  }
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void {
    if (this.inner) {
      this.inner.uniformMatrix3(name, transpose, matrix);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformMatrix3(name, transpose, matrix);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix3', name);
        }
      }
    }
  }
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void {
    if (this.inner) {
      this.inner.uniformMatrix4(name, transpose, matrix);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformMatrix4(name, transpose, matrix);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix4', name);
        }
      }
    }
  }
  uniformVector1(name: string, vector: Vector1): void {
    if (this.inner) {
      this.inner.uniformVector1(name, vector);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformVector1(name, vector);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Vector1', name);
        }
      }
    }
  }
  uniformVector2(name: string, vector: Vector2): void {
    if (this.inner) {
      this.inner.uniformVector2(name, vector);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformVector2(name, vector);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Vector2', name);
        }
      }
    }
  }
  uniformVector3(name: string, vector: Vector3): void {
    if (this.inner) {
      this.inner.uniformVector3(name, vector);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformVector3(name, vector);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Vector3', name);
        }
      }
    }
  }
  uniformVector4(name: string, vector: Vector4): void {
    if (this.inner) {
      this.inner.uniformVector4(name, vector);
    }
    else {
      let async = false;
      let readyPending = this.readyPending;
      this.makeReady(async);
      if (this.inner) {
        this.inner.uniformVector4(name, vector);
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Vector4', name);
        }
      }
    }
  }
}

export = Material;