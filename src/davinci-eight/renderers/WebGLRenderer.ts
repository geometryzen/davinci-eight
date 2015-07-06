/// <reference path='../renderers/Renderer'/>
import renderer = require('../renderers/renderer');

class WebGLRenderer implements Renderer {
  private renderer: Renderer;
  constructor() {
    this.renderer = renderer();
  }
  render(scene: Scene, ambientUniforms: UniformProvider) {
    return this.renderer.render(scene, ambientUniforms);
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
  setSize(width: number, height: number) {
    return this.renderer.setSize(width, height);
  }
  get domElement() {
    return this.renderer.domElement;
  }
}

export = WebGLRenderer;
