/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
var GraphicsProgramSymbols = (function () {
    function GraphicsProgramSymbols() {
    }
    /**
     * 'aColor'
     */
    GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
    /**
     * 'aGeometryIndex'
     */
    GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
    /**
     * 'aNormal'
     */
    GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
    /**
     * 'aOpacity'
     */
    GraphicsProgramSymbols.ATTRIBUTE_OPACITY = 'aOpacity';
    /**
     * 'aPosition'
     */
    GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
    /**
     * 'aTangent'
     */
    GraphicsProgramSymbols.ATTRIBUTE_TANGENT = 'aTangent';
    /**
     * 'aCoords'
     */
    GraphicsProgramSymbols.ATTRIBUTE_COORDS = 'aCoords';
    /**
     * 'uAlpha'
     */
    GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
    /**
     * 'uAmbientLight'
     */
    GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
    /**
     * 'uColor'
     */
    GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
    /**
     * 'uDirectionalLightColor'
     */
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
    /**
     * 'uDirectionalLightDirection'
     */
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
    /**
     * 'uImage'
     */
    GraphicsProgramSymbols.UNIFORM_IMAGE = 'uImage';
    /**
     * 'uOpacity'
     */
    GraphicsProgramSymbols.UNIFORM_OPACITY = 'uOpacity';
    /**
     * 'uPointLightColor'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
    /**
     * 'uPointLightPosition'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
    /**
     * 'uPointSize'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
    /**
     * 'uProjection'
     */
    GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
    /**
     * 'uReflectionOne'
     */
    GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
    /**
     * 'uReflectionTwo'
     */
    GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
    /**
     * 'uModel'
     */
    GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
    /**
     * 'uNormal'
     */
    GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
    /**
     * 'uView'
     */
    GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
    /**
     * 'vColor'
     */
    GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
    /**
     * 'vCoords'
     */
    GraphicsProgramSymbols.VARYING_COORDS = 'vCoords';
    /**
     * 'vLight'
     */
    GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
    return GraphicsProgramSymbols;
}());
export { GraphicsProgramSymbols };
