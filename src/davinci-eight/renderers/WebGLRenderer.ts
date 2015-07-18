import renderer = require('../renderers/renderer');
import Renderer = require('../renderers/Renderer');
import World = require('../worlds/World');
import VertexUniformProvider = require('../core/VertexUniformProvider');
/**
 * @class WebGLRenderer
 * @implements Renderer
 */
class WebGLRenderer implements Renderer {
  private renderer: Renderer;
  /**
   * @class WebGLRenderer
   * @constructor
   */
  constructor() {
    this.renderer = renderer();
  }
  /**
   * @method render
   * @param world {World}
   * @param ambientUniforms {VertexUniformProvider}
   */
  render(world: World, views: VertexUniformProvider[]) {
    return this.renderer.render(world, views);
  }
  contextFree() {
    return this.renderer.contextFree();
  }
  contextGain(context: WebGLRenderingContext, contextId: string) {
    return this.renderer.contextGain(context, contextId);
  }
  contextLoss() {
    return this.renderer.contextLoss();
  }
  hasContext() {
    return this.renderer.hasContext();
  }
  clearColor(r: number, g: number, b:  number, a: number): void {
    this.renderer.clearColor(r, g, b, a);
  }
  setClearColor(color: number, alpha?: number): void {
    alpha = (typeof alpha === 'number') ? alpha : 1.0;
    // TODO:
    this.renderer.clearColor(1.0, 1.0, 1.0, alpha);
  }
  setSize(width: number, height: number) {
    return this.renderer.setSize(width, height);
  }
  get domElement() {
    return this.renderer.domElement;
  }
}

export = WebGLRenderer;
