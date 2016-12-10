/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
export default class GraphicsProgramSymbols {

    /**
     * 'aColor'
     */
    public static ATTRIBUTE_COLOR: string = 'aColor';

    /**
     * 'aGeometryIndex'
     */
    public static ATTRIBUTE_GEOMETRY_INDEX: string = 'aGeometryIndex';

    /**
     * 'aNormal'
     */
    public static ATTRIBUTE_NORMAL: string = 'aNormal';

    /**
     * 'aOpacity'
     */
    public static ATTRIBUTE_OPACITY: string = 'aOpacity';

    /**
     * 'aPosition'
     */
    public static ATTRIBUTE_POSITION: string = 'aPosition';

    /**
     * 'aTangent'
     */
    public static ATTRIBUTE_TANGENT: string = 'aTangent';

    /**
     * 'aCoords'
     */
    public static ATTRIBUTE_COORDS: string = 'aCoords';

    /**
     * 'uAlpha'
     */
    public static UNIFORM_ALPHA: string = 'uAlpha';

    /**
     * 'uAmbientLight'
     */
    public static UNIFORM_AMBIENT_LIGHT: string = 'uAmbientLight';

    /**
     * 'uColor'
     */
    public static UNIFORM_COLOR: string = 'uColor';

    /**
     * 'uDirectionalLightColor'
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string = 'uDirectionalLightColor';

    /**
     * 'uDirectionalLightDirection'
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string = 'uDirectionalLightDirection';

    /**
     * 'uImage'
     */
    public static UNIFORM_IMAGE: string = 'uImage';

    /**
     * 'uOpacity'
     */
    public static UNIFORM_OPACITY: string = 'uOpacity';

    /**
     * 'uPointLightColor'
     */
    public static UNIFORM_POINT_LIGHT_COLOR: string = 'uPointLightColor';

    /**
     * 'uPointLightPosition'
     */
    public static UNIFORM_POINT_LIGHT_POSITION: string = 'uPointLightPosition';

    /**
     * 'uPointSize'
     */
    public static UNIFORM_POINT_SIZE: string = 'uPointSize';

    /**
     * 'uProjection'
     */
    public static UNIFORM_PROJECTION_MATRIX: string = 'uProjection';

    /**
     * 'uReflectionOne'
     */
    public static UNIFORM_REFLECTION_ONE_MATRIX: string = 'uReflectionOne';

    /**
     * 'uReflectionTwo'
     */
    public static UNIFORM_REFLECTION_TWO_MATRIX: string = 'uReflectionTwo';

    /**
     * 'uModel'
     */
    public static UNIFORM_MODEL_MATRIX: string = 'uModel';

    /**
     * 'uNormal'
     */
    public static UNIFORM_NORMAL_MATRIX: string = 'uNormal';

    /**
     * 'uView'
     */
    public static UNIFORM_VIEW_MATRIX: string = 'uView';

    /**
     * 'vColor'
     */
    public static VARYING_COLOR: string = 'vColor';

    /**
     * 'vCoords'
     */
    public static VARYING_COORDS: string = 'vCoords';

    /**
     * 'vLight'
     */
    public static VARYING_LIGHT: string = 'vLight';
}
