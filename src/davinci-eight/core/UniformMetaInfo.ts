/**
 * @module EIGHT
 * @submodule core
 * @class UniformMetaInfo
 */
interface UniformMetaInfo {
    /**
     * Specifies an optional override of the name used as a key.
     * @property name
     * @type {string}
     * @optional
     */
    name?: string;
    /**
     * The type keyword as it appears in the GLSL shader program.
     * @property glslType
     * @type {string}
     */
    glslType: string;
}

export default UniformMetaInfo;
