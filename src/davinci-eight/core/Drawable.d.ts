/// <reference path="./RenderingContextUser.d.ts" />
/// <reference path="../renderers/VertexUniformProvider.d.ts" />
interface Drawable extends RenderingContextUser {
  drawGroupName: string;
  useProgram(context: WebGLRenderingContext);
  draw(context: WebGLRenderingContext, time: number, uniformProvider: VertexUniformProvider);
}
