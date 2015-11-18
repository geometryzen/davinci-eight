/**
 * <p>
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * </p>
 *
 * @class Symbolic
 */
declare class Symbolic {
    /**
     * 'aColor'
     * @property ATTRIBUTE_COLOR
     * @type {string}
     * @static
     */
    static ATTRIBUTE_COLOR: string;
    /**
     * 'aGeometryIndex'
     * @property ATTRIBUTE_GEOMETRY_INDEX
     * @type {string}
     * @static
     */
    static ATTRIBUTE_GEOMETRY_INDEX: string;
    /**
     * 'aNormal'
     * @property ATTRIBUTE_NORMAL
     * @type {string}
     * @static
     */
    static ATTRIBUTE_NORMAL: string;
    /**
     * 'aPosition'
     * @property ATTRIBUTE_POSITION
     * @type {string}
     * @static
     */
    static ATTRIBUTE_POSITION: string;
    /**
     * 'aTextureCoords'
     * @property ATTRIBUTE_TEXTURE_COORDS
     * @type {string}
     * @static
     */
    static ATTRIBUTE_TEXTURE_COORDS: string;
    /**
     * 'uAlpha'
     * @property UNIFORM_ALPHA
     * @type {string}
     * @static
     */
    static UNIFORM_ALPHA: string;
    /**
     * 'uAmbientLight'
     * @property UNIFORM_AMBIENT_LIGHT
     * @type {string}
     * @static
     */
    static UNIFORM_AMBIENT_LIGHT: string;
    /**
     * 'uColor'
     * @property UNIFORM_COLOR
     * @type {string}
     * @static
     */
    static UNIFORM_COLOR: string;
    /**
     * 'uDirectionalLightE3Color'
     * @property UNIFORM_DIRECTIONAL_LIGHT_COLOR
     * @type {string}
     * @static
     */
    static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
    /**
     * 'uDirectionalLightE3Direction'
     * @property UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
     * @type {string}
     * @static
     */
    static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
    /**
     * 'uPointLightColor'
     * @property UNIFORM_POINT_LIGHT_COLOR
     * @type {string}
     * @static
     */
    static UNIFORM_POINT_LIGHT_COLOR: string;
    /**
     * 'uPointLightPosition'
     * @property UNIFORM_POINT_LIGHT_POSITION
     * @type {string}
     * @static
     */
    static UNIFORM_POINT_LIGHT_POSITION: string;
    /**
     * 'uPointSize'
     * @property UNIFORM_POINT_SIZE
     * @type {string}
     * @static
     */
    static UNIFORM_POINT_SIZE: string;
    /**
     * 'uProjection'
     * @property UNIFORM_PROJECTION_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_PROJECTION_MATRIX: string;
    /**
     * 'uReflectionOne'
     * @property UNIFORM_REFLECTION_ONE_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_REFLECTION_ONE_MATRIX: string;
    /**
     * 'uReflectionTwo'
     * @property UNIFORM_REFLECTION_TWO_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_REFLECTION_TWO_MATRIX: string;
    /**
     * 'uModel'
     * @property UNIFORM_MODEL_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_MODEL_MATRIX: string;
    /**
     * 'uNormal'
     * @property UNIFORM_NORMAL_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_NORMAL_MATRIX: string;
    /**
     * 'uView'
     * @property UNIFORM_VIEW_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_VIEW_MATRIX: string;
    /**
     * 'vColor'
     * @property VARYING_COLOR
     * @type {string}
     * @static
     */
    static VARYING_COLOR: string;
    /**
     * 'vLight'
     * @property VARYING_LIGHT
     * @type {string}
     * @static
     */
    static VARYING_LIGHT: string;
}
export = Symbolic;
