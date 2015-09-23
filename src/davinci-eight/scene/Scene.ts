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
import Shareable = require('../utils/Shareable')
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
 * @extends Shareable
 * @extends IDrawList
 */
class Scene extends Shareable implements IDrawList {
  private drawList: IDrawList;
  private monitors: MonitorList;
  // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
  /**
   * <p>
   * A <code>Scene</code> is a collection of drawable instances arranged in some order.
   * The precise order is implementation defined.
   * The collection may be traversed for general processing using callback/visitor functions.
   * </p>
   * @class Scene
   * @constructor
   * @param monitors [ContextMonitor[]=[]]
   */
  constructor(monitors: ContextMonitor[] = []) {
    super(LOGGING_NAME)
    MonitorList.verify('monitors', monitors, ctorContext)

    this.drawList = createDrawList();
    this.monitors = new MonitorList(monitors)

    this.monitors.addContextListener(this)
  }
  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.monitors.removeContextListener(this)

    this.monitors = void 0

    this.drawList.release()
    this.drawList = void 0
  }
  /**
   * <p>
   * Adds the <code>drawable</code> to this <code>Scene</code>.
   * </p>
   * @method add
   * @param drawable {IDrawable}
   * @return {Void}
   * <p>
   * This method returns <code>undefined</code>.
   * </p>
   */
  add(drawable: IDrawable): void {
    this.drawList.add(drawable)
  }
  /**
   * <p>
   * Traverses the collection of drawables, drawing each one.
   * </p>
   * @method draw
   * @param ambients {UniformData}
   * @param canvasId {number}
   * @return {void}
   * @beta
   */
  draw(ambients: UniformData, canvasId: number): void {
    this.drawList.draw(ambients, canvasId)
  }
  /**
   * <p>
   * Removes the <code>drawable</code> from this <code>Scene</code>.
   * </p>
   * @method remove
   * @param drawable {IDrawable}
   * @return {Void}
   * <p>
   * This method returns <code>undefined</code>.
   * </p>
   */
  remove(drawable: IDrawable): void {
    this.drawList.remove(drawable)
  }
  /**
   * <p>
   * Traverses the collection of drawables, calling the specified callback arguments.
   * </p>
   * @method traverse
   * @param callback {(drawable: IDrawable) => void} Callback function for each drawable.
   * @param canvasId {number} Identifies the canvas.
   * @param prolog {(material: IMaterial) => void} Callback function for each material. 
   * @return {void}
   */
  traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (material: IMaterial) => void): void {
    this.drawList.traverse(callback, canvasId, prolog)
  }
  contextFree(canvasId: number): void {
    this.drawList.contextFree(canvasId)
  }
  contextGain(manager: ContextManager): void {
    this.drawList.contextGain(manager)
  }
  contextLoss(canvasId: number): void {
    this.drawList.contextLoss(canvasId)
  }
}

export = Scene
