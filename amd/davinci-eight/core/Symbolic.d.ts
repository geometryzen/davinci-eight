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
     * 'uAmbientLight'
     * @property UNIFORM_AMBIENT_LIGHT
     * @type {string}
     * @static
     */
    static UNIFORM_AMBIENT_LIGHT: string;
    static UNIFORM_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
    static UNIFORM_POINT_LIGHT_COLOR: string;
    static UNIFORM_POINT_LIGHT_POSITION: string;
    static UNIFORM_POINT_SIZE: string;
    /**
     * 'uProjection'
     * @property UNIFORM_PROJECTION_MATRIX
     * @type {string}
     * @static
     */
    static UNIFORM_PROJECTION_MATRIX: string;
    /**
     * 'uModel'
     */
    static UNIFORM_MODEL_MATRIX: string;
    static UNIFORM_NORMAL_MATRIX: string;
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
