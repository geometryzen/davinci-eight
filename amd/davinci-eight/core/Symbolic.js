define(["require", "exports"], function (require, exports) {
    /**
     * <p>
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     * </p>
     *
     * @class Symbolic
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        /**
         * 'aColor'
         * @property ATTRIBUTE_COLOR
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_COLOR = 'aColor';
        /**
         * 'aGeometryIndex'
         * @property ATTRIBUTE_GEOMETRY_INDEX
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        /**
         * 'aNormal'
         * @property ATTRIBUTE_NORMAL
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_NORMAL = 'aNormal';
        /**
         * 'aPosition'
         * @property ATTRIBUTE_POSITION
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_POSITION = 'aPosition';
        /**
         * 'aTextureCoords'
         * @property ATTRIBUTE_TEXTURE_COORDS
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        /**
         * 'uAmbientLight'
         * @property UNIFORM_AMBIENT_LIGHT
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        Symbolic.UNIFORM_COLOR = 'uColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        /**
         * 'uProjection'
         * @property UNIFORM_PROJECTION_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        /**
         * 'uModel'
         */
        Symbolic.UNIFORM_MODEL_MATRIX = 'uModel';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'uNormal';
        Symbolic.UNIFORM_VIEW_MATRIX = 'uView';
        /**
         * 'vColor'
         * @property VARYING_COLOR
         * @type {string}
         * @static
         */
        Symbolic.VARYING_COLOR = 'vColor';
        /**
         * 'vLight'
         * @property VARYING_LIGHT
         * @type {string}
         * @static
         */
        Symbolic.VARYING_LIGHT = 'vLight';
        return Symbolic;
    })();
    return Symbolic;
});
