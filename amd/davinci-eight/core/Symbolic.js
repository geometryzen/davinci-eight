define(["require", "exports"], function (require, exports) {
    /**
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     * @class Symbolic
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_COLOR = 'aVertexColor';
        Symbolic.ATTRIBUTE_NORMAL = 'aVertexNormal';
        Symbolic.ATTRIBUTE_POSITION = 'aVertexPosition';
        Symbolic.ATTRIBUTE_TEXTURE = 'aTexCoord';
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
        return Symbolic;
    })();
    return Symbolic;
});
