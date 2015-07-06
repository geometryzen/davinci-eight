/// <reference path='../worlds/World.d.ts'/>
import world = require('../worlds/world');
class Scene implements World {
  private world: World;
  constructor() {
    this.world = world();
  }
  add(drawable: Drawable) {
    return this.world.add(drawable);
  }
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