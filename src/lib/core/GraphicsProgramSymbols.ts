/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
export class GraphicsProgramSymbols {

    /**
     * 'aColor'
     */
    public static ATTRIBUTE_COLOR = 'aColor';

    /**
     * 'aGeometryIndex'
     */
    public static ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';

    /**
     * 'aNormal'
     */
    public static ATTRIBUTE_NORMAL = 'aNormal';

    /**
     * 'aOpacity'
     */
    public static ATTRIBUTE_OPACITY = 'aOpacity';

    /**
     * 'aPosition'
     */
    public static ATTRIBUTE_POSITION = 'aPosition';

    /**
     * 'aTangent'
     */
    public static ATTRIBUTE_TANGENT = 'aTangent';

    /**
     * 'aCoords'
     */
    public static ATTRIBUTE_COORDS = 'aCoords';

    /**
     * 'uAlpha'
     */
    public static UNIFORM_ALPHA = 'uAlpha';

    /**
     * 'uAmbientLight'
     */
    public static UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';

    /**
     * 'uColor'
     */
    public static UNIFORM_COLOR = 'uColor';

    /**
     * 'uDirectionalLightColor'
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';

    /**
     * 'uDirectionalLightDirection'
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';

    /**
     * 'uImage'
     */
    public static UNIFORM_IMAGE = 'uImage';

    /**
     * 'uOpacity'
     */
    public static UNIFORM_OPACITY = 'uOpacity';

    /**
     * 'uPointLightColor'
     */
    public static UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';

    /**
     * 'uPointLightPosition'
     */
    public static UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';

    /**
     * 'uPointSize'
     */
    public static UNIFORM_POINT_SIZE = 'uPointSize';

    /**
     * 'uProjection'
     */
    public static UNIFORM_PROJECTION_MATRIX = 'uProjection';

    /**
     * 'uReflectionOne'
     */
    public static UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';

    /**
     * 'uReflectionTwo'
     */
    public static UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';

    /**
     * 'uModel'
     */
    public static UNIFORM_MODEL_MATRIX = 'uModel';

    /**
     * 'uNormal'
     */
    public static UNIFORM_NORMAL_MATRIX = 'uNormal';

    /**
     * 'uView'
     */
    public static UNIFORM_VIEW_MATRIX = 'uView';

    /**
     * 'vColor'
     */
    public static VARYING_COLOR = 'vColor';

    /**
     * 'vCoords'
     */
    public static VARYING_COORDS = 'vCoords';

    /**
     * 'vLight'
     */
    public static VARYING_LIGHT = 'vLight';
}
