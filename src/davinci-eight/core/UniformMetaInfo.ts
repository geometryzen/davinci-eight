import UniformGlslType from './UniformGlslType';

/**
 *
 */
interface UniformMetaInfo {
    /**
     * Specifies an optional override of the name used as a key.
     */
    name?: string;
    /**
     * The type keyword as it appears in the GLSL shader program.
     */
    glslType: UniformGlslType;
}

export default UniformMetaInfo;
