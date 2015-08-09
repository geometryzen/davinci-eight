define(["require", "exports"], function (require, exports) {
    /**
     * @class Symbolic
     * Canonical variable names, which act as semantic identifiers.
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_COLOR = 'vertexColor';
        Symbolic.ATTRIBUTE_NORMAL = 'vertexNormal';
        Symbolic.ATTRIBUTE_POSITION = 'vertexPosition';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'ambientLight';
        Symbolic.UNIFORM_COLOR = 'color';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'directionalLightColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'directionalLightDirection';
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'pointLightColor';
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'pointLightPosition';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'projectionMatrix';
        Symbolic.UNIFORM_MODEL_MATRIX = 'modelMatrix';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'normalMatrix';
        Symbolic.UNIFORM_VIEW_MATRIX = 'viewMatrix';
        Symbolic.VARYING_COLOR = 'vColor';
        Symbolic.VARYING_LIGHT = 'vLight';
        // FIXME: These are stems, not uniform variable names.
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT = 'DirectionalLight';
        Symbolic.UNIFORM_POINT_LIGHT = 'PointLight';
        return Symbolic;
    })();
    return Symbolic;
});
