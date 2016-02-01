define(["require", "exports"], function (require, exports) {
    var GraphicsProgramSymbols = (function () {
        function GraphicsProgramSymbols() {
        }
        GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
        GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
        GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
        GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
        GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
        GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
        GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
        GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
        GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
        GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
        return GraphicsProgramSymbols;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramSymbols;
});
