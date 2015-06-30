/// <reference path="../core/RenderingContextUser.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/**
 * The role of a Material is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The Material must be able to provide introspection information that describes the program.
 */
interface Material extends RenderingContextUser {
  attributes: string[];
  program: WebGLProgram;
  programId: string;
}
