define(["require", "exports"], function (require, exports) {
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_POSITION = 'position';
        Symbolic.ATTRIBUTE_COLOR = 'color';
        Symbolic.ATTRIBUTE_NORMAL = 'normal';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'projectionMatrix';
        Symbolic.UNIFORM_MODEL_MATRIX = 'modelMatrix';
        Symbolic.UNIFORM_VIEW_MATRIX = 'viewMatrix';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'normalMatrix';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'ambientLight';
        return Symbolic;
    })();
    return Symbolic;
});
