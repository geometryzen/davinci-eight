/// <reference path="../scenes/Scene.d.ts" />
/// <reference path="../cameras/Camera.d.ts" />
// The dependency on the WebGLContext may not be permanent.
interface Renderer extends RenderingContextUser {
  render(scene: Scene, camera: Camera): void;
}