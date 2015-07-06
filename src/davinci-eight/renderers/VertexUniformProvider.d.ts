/**
 * Provides the runtime data required to use a uniform in a vertex shader.
 */
interface VertexUniformProvider {
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array};
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array};
}