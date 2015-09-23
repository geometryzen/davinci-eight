import ContextManager = require('../core/ContextManager')
import ContextMonitor = require('../core/ContextMonitor')
import createDrawList = require('../scene/createDrawList')
import IDrawable = require('../core/IDrawable')
import IDrawList = require('../scene/IDrawList')
import IMaterial = require('../core/IMaterial')
import Matrix1 = require('../math/Matrix1')
import Matrix2 = require('../math/Matrix2')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import MonitorList = require('../scene/MonitorList')
import mustSatisfy = require('../checks/mustSatisfy')
import UniformData = require('../core/UniformData')
import Vector1 = require('../math/Vector1')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')
import Vector4 = require('../math/Vector4')

import refChange = require('../utils/refChange')
import uuid4 = require('../utils/uuid4')

let LOGGING_NAME = 'Scene'

function ctorContext(): string {
  return LOGGING_NAME + " constructor"
}

/**
 * @class Scene
 * @extends IDrawList
 */
 // FIXME: extend Shareable
class Scene implements IDrawList {
  private _drawList: IDrawList = createDrawList()
  private monitors: MonitorList
  private _refCount = 1
  private _uuid = uuid4().generate()
  // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
  /**
   * @class Scene
   * @constructor
   * @param monitors [ContextMonitor[]=[]]
   */
  constructor(monitors: ContextMonitor[] = []) {
    MonitorList.verify('monitors', monitors, ctorContext)
    this.monitors = new MonitorList(monitors)
    this.monitors.addContextListener(this)
    refChange(this._uuid, LOGGING_NAME, +1)
  }
  add(drawable: IDrawable) {
    this._drawList.add(drawable)
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
      this._drawList.release()
      this._drawList = void 0
      this.monitors.removeContextListener(this)
      this.monitors = void 0
      this._refCount = void 0
      this._uuid = void 0
      return 0
    }
    else {
      return this._refCount
    }
  }
  remove(drawable: IDrawable): void {
    this._drawList.remove(drawable)
  }
  traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial)=>void): void {
    this._drawList.traverse(callback, canvasId, prolog)
  }
  contextFree(canvasId: number) {
    this._drawList.contextFree(canvasId)
  }
  contextGain(manager: ContextManager) {
    this._drawList.contextGain(manager)
  }
  contextLoss(canvasId: number) {
    this._drawList.contextLoss(canvasId)
  }
}

export = Scene
