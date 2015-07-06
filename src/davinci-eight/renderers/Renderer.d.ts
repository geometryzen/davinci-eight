/// <reference path="../scenes/Scene.d.ts" />
/// <reference path="../core/RenderingContextUser.d.ts" />
/// <reference path="../renderers/UniformProvider.d.ts" />
interface Renderer extends RenderingContextUser {
  domElement: HTMLCanvasElement;
  render(scene: Scene, ambientUniforms: UniformProvider): void;
  setSize(width: number, height: number): void;
}