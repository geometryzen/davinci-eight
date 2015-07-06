/// <reference path="../core/RenderingContextUser.d.ts" />
/// <reference path="../geometries/VertexAttributeProvider.d.ts" />
/**
 * The role of a Material is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The Material must be able to provide introspection information that describes the program.
 */
interface Material extends RenderingContextUser {
  attributes: {modifiers: string[], type: string, name: string}[];
  uniforms: {modifiers: string[], type: string, name: string}[];
  varyings: {modifiers: string[], type: string, name: string}[];
  program: WebGLProgram;
  programId: string;
}
