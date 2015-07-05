/// <reference path="../scenes/Scene.d.ts" />
/// <reference path="../renderers/UniformProvider.d.ts" />
// The dependency on the WebGLContext may not be permanent.
interface Renderer extends RenderingContextUser {
  render(scene: Scene, uniformProvider: UniformProvider): void;
}