/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
export declare class GraphicsProgramSymbols {
    /**
     * 'aColor'
     */
    static ATTRIBUTE_COLOR: string;
    /**
     * 'aGeometryIndex'
     */
    static ATTRIBUTE_GEOMETRY_INDEX: string;
    /**
     * 'aNormal'
     */
    static ATTRIBUTE_NORMAL: string;
    /**
     * 'aOpacity'
     */
    static ATTRIBUTE_OPACITY: string;
    /**
     * 'aPosition'
     */
    static ATTRIBUTE_POSITION: string;
    /**
     * 'aTangent'
     */
    static ATTRIBUTE_TANGENT: string;
    /**
     * 'aCoords'
     */
    static ATTRIBUTE_COORDS: string;
    /**
     * 'uAlpha'
     */
    static UNIFORM_ALPHA: string;
    /**
     * 'uAmbientLight'
     */
    static UNIFORM_AMBIENT_LIGHT: string;
    /**
     * 'uColor'
     */
    static UNIFORM_COLOR: string;
    /**
     * 'uDirectionalLightColor'
     */
    static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
    /**
     * 'uDirectionalLightDirection'
     */
    static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
    /**
     * 'uImage'
     */
    static UNIFORM_IMAGE: string;
    /**
     * 'uOpacity'
     */
    static UNIFORM_OPACITY: string;
    /**
     * 'uPointLightColor'
     */
    static UNIFORM_POINT_LIGHT_COLOR: string;
    /**
     * 'uPointLightPosition'
     */
    static UNIFORM_POINT_LIGHT_POSITION: string;
    /**
     * 'uPointSize'
     */
    static UNIFORM_POINT_SIZE: string;
    /**
     * 'uProjection'
     */
    static UNIFORM_PROJECTION_MATRIX: string;
    /**
     * 'uReflectionOne'
     */
    static UNIFORM_REFLECTION_ONE_MATRIX: string;
    /**
     * 'uReflectionTwo'
     */
    static UNIFORM_REFLECTION_TWO_MATRIX: string;
    /**
     * 'uModel'
     */
    static UNIFORM_MODEL_MATRIX: string;
    /**
     * 'uNormal'
     */
    static UNIFORM_NORMAL_MATRIX: string;
    /**
     * 'uView'
     */
    static UNIFORM_VIEW_MATRIX: string;
    /**
     * 'vColor'
     */
    static VARYING_COLOR: string;
    /**
     * 'vCoords'
     */
    static VARYING_COORDS: string;
    /**
     * 'vLight'
     */
    static VARYING_LIGHT: string;
}
