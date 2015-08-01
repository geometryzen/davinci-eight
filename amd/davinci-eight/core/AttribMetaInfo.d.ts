/**
 * @class AttribMetaInfo
 */
interface AttribMetaInfo {
    /**
     *
     */
    name: string;
    /**
     * @property glslType {string} The type keyword as it appears in the GLSL shader program.
     * This property is used for program generation.
     */
    glslType: string;
    /**
     *
     */
    size: number;
    /**
     * @property type {number} Specifies the data type of each component in the array.
     * Use either gl.FLOAT (default) or gl.FIXED.
     */
    type?: number;
    normalized: boolean;
    stride: number;
    offset: number;
}
export = AttribMetaInfo;
