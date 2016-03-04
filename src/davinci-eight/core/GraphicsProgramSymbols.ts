/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * </p>
 *
 * @class GraphicsProgramSymbols
 */
export default class GraphicsProgramSymbols {

    /**
     * 'aColor'
     * @property ATTRIBUTE_COLOR
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_COLOR: string = 'aColor';

    /**
     * 'aGeometryIndex'
     * @property ATTRIBUTE_GEOMETRY_INDEX
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_GEOMETRY_INDEX: string = 'aGeometryIndex';

    /**
     * 'aNormal'
     * @property ATTRIBUTE_NORMAL
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_NORMAL: string = 'aNormal';

    /**
     * 'aPosition'
     * @property ATTRIBUTE_POSITION
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_POSITION: string = 'aPosition';

    /**
     * 'aTangent'
     *
     * @property ATTRIBUTE_TANGENT
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_TANGENT: string = 'aTangent';

    /**
     * 'aCoords'
     * @property ATTRIBUTE_COORDS
     * @type {string}
     * @static
     */
    public static ATTRIBUTE_COORDS: string = 'aCoords';

    /**
     * 'uAlpha'
     * @property UNIFORM_ALPHA
     * @type {string}
     * @static
     */
    public static UNIFORM_ALPHA: string = 'uAlpha';

    /**
     * 'uAmbientLight'
     * @property UNIFORM_AMBIENT_LIGHT
     * @type {string}
     * @static
     */
    public static UNIFORM_AMBIENT_LIGHT: string = 'uAmbientLight';

    /**
     * 'uColor'
     * @property UNIFORM_COLOR
     * @type {string}
     * @static
     */
    public static UNIFORM_COLOR: string = 'uColor';

    /**
     * 'uDirectionalLightColor'
     * @property UNIFORM_DIRECTIONAL_LIGHT_COLOR
     * @type {string}
     * @static
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string = 'uDirectionalLightColor';

    /**
     * 'uDirectionalLightDirection'
     * @property UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
     * @type {string}
     * @static
     */
    public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string = 'uDirectionalLightDirection';

    /**
     * 'uPointLightColor'
     * @property UNIFORM_POINT_LIGHT_COLOR
     * @type {string}
     * @static
     */
    public static UNIFORM_POINT_LIGHT_COLOR: string = 'uPointLightColor';

    /**
     * 'uPointLightPosition'
     * @property UNIFORM_POINT_LIGHT_POSITION
     * @type {string}
     * @static
     */
    public static UNIFORM_POINT_LIGHT_POSITION: string = 'uPointLightPosition';

    /**
     * 'uPointSize'
     * @property UNIFORM_POINT_SIZE
     * @type {string}
     * @static
     */
    public static UNIFORM_POINT_SIZE: string = 'uPointSize';

    /**
     * 'uProjection'
     * @property UNIFORM_PROJECTION_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_PROJECTION_MATRIX: string = 'uProjection';

    /**
     * 'uReflectionOne'
     * @property UNIFORM_REFLECTION_ONE_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_REFLECTION_ONE_MATRIX: string = 'uReflectionOne';

    /**
     * 'uReflectionTwo'
     * @property UNIFORM_REFLECTION_TWO_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_REFLECTION_TWO_MATRIX: string = 'uReflectionTwo';

    /**
     * 'uModel'
     * @property UNIFORM_MODEL_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_MODEL_MATRIX: string = 'uModel';

    /**
     * 'uNormal'
     * @property UNIFORM_NORMAL_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_NORMAL_MATRIX: string = 'uNormal';

    /**
     * 'uView'
     * @property UNIFORM_VIEW_MATRIX
     * @type {string}
     * @static
     */
    public static UNIFORM_VIEW_MATRIX: string = 'uView';

    /**
     * 'vColor'
     * @property VARYING_COLOR
     * @type {string}
     * @static
     */
    public static VARYING_COLOR: string = 'vColor';

    /**
     * 'vLight'
     * @property VARYING_LIGHT
     * @type {string}
     * @static
     */
    public static VARYING_LIGHT: string = 'vLight';
}
