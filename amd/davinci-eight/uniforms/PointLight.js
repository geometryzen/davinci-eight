define(["require", "exports", '../core/Color', '../math/Vector3', '../core/Symbolic', '../uniforms/UniformColor', '../uniforms/UniformVector3', '../uniforms/MultiUniformProvider'], function (require, exports, Color, Vector3, Symbolic, UniformColor, UniformVector3, MultiUniformProvider) {
    var UNIFORM_POINT_LIGHT_COLOR_NAME = Symbolic.UNIFORM_POINT_LIGHT_COLOR;
    var UNIFORM_POINT_LIGHT_POSITION_NAME = Symbolic.UNIFORM_POINT_LIGHT_POSITION;
    /**
     * Provides a uniform variable representing a point light.
     * @class PointLight
     */
    var PointLight = (function () {
        /**
         * @class PointLight
         * @constructor
         */
        function PointLight() {
            this.uColor = new UniformColor(UNIFORM_POINT_LIGHT_COLOR_NAME, Symbolic.UNIFORM_POINT_LIGHT_COLOR);
            this.uPosition = new UniformVector3(UNIFORM_POINT_LIGHT_POSITION_NAME, Symbolic.UNIFORM_POINT_LIGHT_POSITION);
            this.multi = new MultiUniformProvider([this.uColor, this.uPosition]);
            this.uColor.data = new Color([1.0, 1.0, 1.0]);
            this.uPosition.data = new Vector3([0.0, 0.0, 0.0]);
        }
        Object.defineProperty(PointLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "position", {
            get: function () {
                return this.uPosition;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.getUniformFloat = function (name) {
            return this.multi.getUniformFloat(name);
        };
        PointLight.prototype.getUniformMatrix2 = function (name) {
            return this.multi.getUniformMatrix2(name);
        };
        PointLight.prototype.getUniformMatrix3 = function (name) {
            return this.multi.getUniformMatrix3(name);
        };
        PointLight.prototype.getUniformMatrix4 = function (name) {
            return this.multi.getUniformMatrix4(name);
        };
        PointLight.prototype.getUniformVector2 = function (name) {
            return this.multi.getUniformVector2(name);
        };
        PointLight.prototype.getUniformVector3 = function (name) {
            return this.multi.getUniformVector3(name);
        };
        PointLight.prototype.getUniformVector4 = function (name) {
            return this.multi.getUniformVector4(name);
        };
        PointLight.prototype.getUniformMetaInfos = function () {
            return this.multi.getUniformMetaInfos();
        };
        return PointLight;
    })();
    return PointLight;
});
