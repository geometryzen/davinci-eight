/// <reference path="./RenderingContextUser.d.ts" />
interface Drawable extends RenderingContextUser {
  drawGroupName: string;
  useProgram(context: WebGLRenderingContext);
  draw(context: WebGLRenderingContext, time: number, camera: Camera);
}
