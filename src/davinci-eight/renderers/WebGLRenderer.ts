/// <reference path='../renderers/Renderer'/>
/// <reference path='../worlds/World'/>
import renderer = require('../renderers/renderer');
  
class WebGLRenderer implements Renderer {
  private renderer: Renderer;
  constructor() {
    this.renderer = renderer();
  }
  render(world: World, ambientUniforms: UniformProvider) {
    return this.renderer.render(world, ambientUniforms);
  }
  contextFree(context: WebGLRenderingContext) {
    return this.renderer.contextFree(context);
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
