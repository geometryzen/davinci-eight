define(["require", "exports"], function (require, exports) {
    /**
     * @class Symbolic
     * Canonical variable names, which act as semantic identifiers.
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_COLOR = 'aVertexColor';
        Symbolic.ATTRIBUTE_NORMAL = 'aVertexNormal';
        Symbolic.ATTRIBUTE_POSITION = 'aVertexPosition';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        Symbolic.UNIFORM_COLOR = 'uColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';
        Symbolic.UNIFORM_MODEL_MATRIX = 'uModelMatrix';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'uNormalMatrix';
        Symbolic.UNIFORM_VIEW_MATRIX = 'uViewMatrix';
        Symbolic.VARYING_COLOR = 'vColor';
        Symbolic.VARYING_LIGHT = 'vLight';
        // FIXME: These are stems, not uniform variable names.
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT = 'DirectionalLight';
        Symbolic.UNIFORM_POINT_LIGHT = 'PointLight';
        return Symbolic;
    })();
    return Symbolic;
});
