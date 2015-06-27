/// <reference path="../core/RenderingContextUser.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
interface Material extends RenderingContextUser {
  attributes: string[];
  enableVertexAttributes(context: WebGLRenderingContext): void;
  disableVertexAttributes(context: WebGLRenderingContext): void;
  bindVertexAttributes(context: WebGLRenderingContext): void;
  update(context: WebGLRenderingContext, time: number, geometry: Geometry): void;
  program: WebGLProgram;
  programId: string;
}
