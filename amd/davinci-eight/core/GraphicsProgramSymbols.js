define(["require", "exports"], function (require, exports) {
    /**
     * <p>
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     * </p>
     *
     * @class GraphicsProgramSymbols
     */
    var GraphicsProgramSymbols = (function () {
        function GraphicsProgramSymbols() {
        }
        /**
         * 'aColor'
         * @property ATTRIBUTE_COLOR
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
        /**
         * 'aGeometryIndex'
         * @property ATTRIBUTE_GEOMETRY_INDEX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        /**
         * 'aNormal'
         * @property ATTRIBUTE_NORMAL
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
        /**
         * 'aPosition'
         * @property ATTRIBUTE_POSITION
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
        /**
         * 'aTextureCoords'
         * @property ATTRIBUTE_TEXTURE_COORDS
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        /**
         * 'uAlpha'
         * @property UNIFORM_ALPHA
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
        /**
         * 'uAmbientLight'
         * @property UNIFORM_AMBIENT_LIGHT
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        /**
         * 'uColor'
         * @property UNIFORM_COLOR
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
        /**
         * 'uDirectionalLightE3Color'
         * @property UNIFORM_DIRECTIONAL_LIGHT_COLOR
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightE3Color';
        /**
         * 'uDirectionalLightE3Direction'
         * @property UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightE3Direction';
        /**
         * 'uPointLightColor'
         * @property UNIFORM_POINT_LIGHT_COLOR
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        /**
         * 'uPointLightPosition'
         * @property UNIFORM_POINT_LIGHT_POSITION
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        /**
         * 'uPointSize'
         * @property UNIFORM_POINT_SIZE
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
        /**
         * 'uProjection'
         * @property UNIFORM_PROJECTION_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        /**
         * 'uReflectionOne'
         * @property UNIFORM_REFLECTION_ONE_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        /**
         * 'uReflectionTwo'
         * @property UNIFORM_REFLECTION_TWO_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        /**
         * 'uModel'
         * @property UNIFORM_MODEL_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
        /**
         * 'uNormal'
         * @property UNIFORM_NORMAL_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
        /**
         * 'uView'
         * @property UNIFORM_VIEW_MATRIX
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
        /**
         * 'vColor'
         * @property VARYING_COLOR
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
        /**
         * 'vLight'
         * @property VARYING_LIGHT
         * @type {string}
         * @static
         */
        GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
        return GraphicsProgramSymbols;
    })();
    return GraphicsProgramSymbols;
});
