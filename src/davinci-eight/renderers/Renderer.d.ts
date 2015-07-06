/// <reference path="../worlds/World.d.ts" />
/// <reference path="../core/RenderingContextUser.d.ts" />
/// <reference path="../renderers/VertexUniformProvider.d.ts" />
interface Renderer extends RenderingContextUser {
  domElement: HTMLCanvasElement;
  render(world: World, ambientUniforms: VertexUniformProvider): void;
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  setSize(width: number, height: number): void;
}