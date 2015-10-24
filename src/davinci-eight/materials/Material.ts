import AttribLocation = require('../core/AttribLocation')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import core = require('../core')
import isDefined = require('../checks/isDefined')
import isUndefined = require('../checks/isUndefined')
import MonitorList = require('../scene/MonitorList')
import IMaterial = require('../core/IMaterial')
import R1 = require('../math/R1')
import Matrix2 = require('../math/Matrix2')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import UniformLocation = require('../core/UniformLocation')
import uuid4 = require('../utils/uuid4')
import VectorE2 = require('../math/VectorE2')
import VectorE3 = require('../math/VectorE3')
import VectorE4 = require('../math/VectorE4')

function consoleWarnDroppedUniform(clazz: string, suffix: string, name: string, canvasId: number) {
  console.warn(clazz + " dropped uniform" + suffix + " " + name)
  console.warn("`typeof canvasId` is " + typeof canvasId)
}

let MATERIAL_TYPE_NAME = 'Material';

/**
 * @class Material
 * @extends Shareable
 * @extends IMaterial
 */
class Material extends Shareable implements IMaterial {
  // FIXME: Hide this but use a virtual method to set it.
  private inner: IMaterial;
  private readyPending: boolean = false;
  private _monitors: MonitorList;
  private type: string;
  // FIXME: Make uuid and use Shareable
  public programId = uuid4().generate();
  /**
   * @class Material
   * @constructor
   * @param contexts {IContextMonitor[]}
   * @param type {string} The class name, used for logging and serialization.
   */
  constructor(contexts: IContextMonitor[], type: string) {
    super(MATERIAL_TYPE_NAME)
    MonitorList.verify('contexts', contexts)
    mustBeString('type', type)
    this._monitors = MonitorList.copy(contexts)
    this.type = type
  }
  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this._monitors.removeContextListener(this)
    this._monitors.release();
    this._monitors = void 0;
    if (this.inner) {
      this.inner.release()
      this.inner = void 0
    }
  }
  protected makeReady(async: boolean): void {
    if (!this.readyPending) {
      this.readyPending = true
      this._monitors.addContextListener(this)
      this._monitors.synchronize(this)
    }
  }
  /**
   * @property monitors
   * @type {IContextMonitor[]}
   */
  get monitors(): IContextMonitor[] {
    return this._monitors.toArray()
  }
  get fragmentShader() {
    return this.inner ? this.inner.fragmentShader : void 0
  }
  // FIXME I'm going to need to know which monitor.
  use(canvasId: number): void {
    if (core.strict) {
      mustBeInteger('canvasid', canvasId)
    }
    if (this.inner) {
      return this.inner.use(canvasId)
    }
    else {
      let async = false
      this.makeReady(async)
      if (this.inner) {
        return this.inner.use(canvasId)
      }
      else {
        if (core.verbose) {
          console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?")
        }
      }
    }
  }
  attributes(canvasId: number): {[name: string]: AttribLocation} {
    // FIXME: Why is this called.
    // FIXME: The map should be protected but that is slow
    // FIXME Clear need for performant solution.
    if (this.inner) {
      return this.inner.attributes(canvasId)
    }
    else {
      let async = false
      this.makeReady(async)
      if (this.inner) {
        return this.inner.attributes(canvasId)
      }
      else {
        return void 0
      }
    }
  }
  uniforms(canvasId: number): {[name: string]: UniformLocation} {
    if (this.inner) {
      return this.inner.uniforms(canvasId)
    }
    else {
      let async = false
      this.makeReady(async)
      if (this.inner) {
        return this.inner.uniforms(canvasId)
      }
      else {
        return void 0
      }
    }
  }
  enableAttrib(name: string, canvasId: number) {
    if (this.inner) {
      return this.inner.enableAttrib(name, canvasId)
    }
    else {
      let async = false
      this.makeReady(async)
      if (this.inner) {
        return this.inner.enableAttrib(name, canvasId)
      }
      else {
        console.warn(this.type + " enableAttrib()")
      }
    }
  }
  disableAttrib(name: string, canvasId: number) {
    if (this.inner) {
      return this.inner.disableAttrib(name, canvasId)
    }
    else {
      let async = false
      this.makeReady(async)
      if (this.inner) {
        return this.inner.disableAttrib(name, canvasId)
      }
      else {
        console.warn(this.type + " disableAttrib()")
      }
    }
  }
  contextFree(canvasId: number) {
    if (this.inner) {
      this.inner.contextFree(canvasId)
    }
  }
  contextGain(manager: IContextProvider) {
    if (isUndefined(this.inner)) {
      this.inner = this.createMaterial()
    }
    if (isDefined(this.inner)) {
      this.inner.contextGain(manager)
    }
  }
  contextLost(canvasId: number) {
    if (this.inner) {
      this.inner.contextLost(canvasId)
    }
  }
  protected createMaterial(): IMaterial {
    // FIXME Since we get contextGain by canvas, expect canvasId to be an argument?
    throw new Error("Material createMaterial method is virtual and should be implemented by " + this.type)
  }
  uniform1f(name: string, x: number, canvasId: number): void {
    if (this.inner) {
      this.inner.uniform1f(name, x, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniform1f(name, x, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '1f', name, canvasId)
        }
      }
    }
  }
  uniform2f(name: string, x: number, y: number, canvasId: number): void {
    if (this.inner) {
      this.inner.uniform2f(name, x, y, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniform2f(name, x, y, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '2f', name, canvasId)
        }
      }
    }
  }
  uniform3f(name: string, x: number, y: number, z: number, canvasId: number): void {
    if (this.inner) {
      this.inner.uniform3f(name, x, y, z, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniform3f(name, x, y, z, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '3f', name, canvasId)
        }
      }
    }
  }
  uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number): void {
    if (this.inner) {
      this.inner.uniform4f(name, x, y, z, w, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniform4f(name, x, y, z, w, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, '4f', name, canvasId)
        }
      }
    }
  }
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformMatrix2(name, transpose, matrix, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformMatrix2(name, transpose, matrix, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix2', name, canvasId)
        }
      }
    }
  }
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformMatrix3(name, transpose, matrix, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformMatrix3(name, transpose, matrix, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'Matrix3', name, canvasId)
        }
      }
    }
  }
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformMatrix4(name, transpose, matrix, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformMatrix4(name, transpose, matrix, canvasId)
      }
      else {
        if (!readyPending) {
          if (core.verbose) {
            consoleWarnDroppedUniform(this.type, 'Matrix4', name, canvasId)
          }
        }
      }
    }
  }
  uniformVectorE2(name: string, vector: VectorE2, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformVectorE2(name, vector, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformVectorE2(name, vector, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'R2', name, canvasId)
        }
      }
    }
  }
  uniformVectorE3(name: string, vector: VectorE3, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformVectorE3(name, vector, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformVectorE3(name, vector, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'R3', name, canvasId)
        }
      }
    }
  }
  uniformVectorE4(name: string, vector: VectorE4, canvasId: number): void {
    if (this.inner) {
      this.inner.uniformVectorE4(name, vector, canvasId)
    }
    else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.uniformVectorE4(name, vector, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'R4', name, canvasId)
        }
      }
    }
  }
  vector2(name: string, data: number[], canvasId: number): void {
      if (this.inner) {
      this.inner.vector2(name, data, canvasId)
    }
      else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.vector2(name, data, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'vector2', name, canvasId)
        }
      }
    }
  }
  vector3(name: string, data: number[], canvasId: number): void {
      if (this.inner) {
      this.inner.vector3(name, data, canvasId)
    }
      else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.vector3(name, data, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'vector3', name, canvasId)
        }
      }
    }
  }
  vector4(name: string, data: number[], canvasId: number): void {
      if (this.inner) {
      this.inner.vector4(name, data, canvasId)
    }
      else {
      let async = false
      let readyPending = this.readyPending
      this.makeReady(async)
      if (this.inner) {
        this.inner.vector4(name, data, canvasId)
      }
      else {
        if (!readyPending) {
          consoleWarnDroppedUniform(this.type, 'vector4', name, canvasId)
        }
      }
    }
  }
  get vertexShader() {
    return this.inner ? this.inner.vertexShader : void 0
  }
}

export = Material