/**
 * @interface UniformMetaInfo
 */
interface UniformMetaInfo {
  /**
   * @property name {string} Specifies an optional override of the name used as a key.
   */
  name?: string;
  /**
   * @property glslType {string} The type keyword as it appears in the GLSL shader program.
   */
  glslType: string;
}

export = UniformMetaInfo;
