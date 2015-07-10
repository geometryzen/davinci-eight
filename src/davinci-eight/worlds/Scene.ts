/// <reference path='../worlds/World.d.ts'/>
import world = require('../worlds/world');
/**
 * @class Scene
 * @extends World
 */
class Scene implements World {
  /**
   * @property world
   * @type World
   * @default world()
   * @private
   */
  private world: World;
  /**
   * @constructor
   */
  constructor() {
    this.world = world();
  }
  /**
   * @method add
   * @param drawable {Drawable} The drawable to add to the Scene.
   */
  add(drawable: Drawable) {
    return this.world.add(drawable);
  }
  /**
   * A mapping from a drawGroupName to an array of Drawable.
   * This is used to make rendering more efficient by minimizing WebGLProgram switching.
   * @property drawGroups
   * @type { [drawGroupName: string]: Drawable[] }
   */
  get drawGroups() {
    return this.world.drawGroups;
  }
  contextFree(context: WebGLRenderingContext) {
    return this.world.contextFree(context);
  }
  contextGain(context: WebGLRenderingContext, contextId: string) {
    return this.world.contextGain(context, contextId);
  }
  contextLoss() {
    return this.world.contextLoss();
  }
  hasContext() {
    return this.world.hasContext();
  }
}

export = Scene;