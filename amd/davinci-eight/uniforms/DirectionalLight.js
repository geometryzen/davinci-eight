define(["require", "exports", '../core/Symbolic', '../uniforms/UniformColor', '../uniforms/UniformVec3', '../uniforms/MultiUniformProvider'], function (require, exports, Symbolic, UniformColor, UniformVec3, MultiUniformProvider) {
    var UNIFORM_DIRECTIONAL_LIGHT_COLOR_NAME = Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR;
    var UNIFORM_DIRECTIONAL_LIGHT_DIRECTION_NAME = Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION;
    /**
     * Provides a uniform variable representing a directional light.
     * @class DirectionalLight
     */
    var DirectionalLight = (function () {
        /**
         * @class DirectionalLight
         * @constructor
         */
        function DirectionalLight() {
            this.uColor = new UniformColor(UNIFORM_DIRECTIONAL_LIGHT_COLOR_NAME, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
            this.uDirection = new UniformVec3(UNIFORM_DIRECTIONAL_LIGHT_DIRECTION_NAME, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
            this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);
        }
        Object.defineProperty(DirectionalLight.prototype, "color", {
            set: function (value) {
                this.uColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            set: function (value) {
                this.uDirection.value = [value.x, value.y, value.z];
            },
            enumerable: true,
            configurable: true
        });
        DirectionalLight.prototype.getUniformFloat = function (name) {
            return this.multi.getUniformFloat(name);
        };
        DirectionalLight.prototype.getUniformMatrix2 = function (name) {
            return this.multi.getUniformMatrix2(name);
        };
        DirectionalLight.prototype.getUniformMatrix3 = function (name) {
            return this.multi.getUniformMatrix3(name);
        };
        DirectionalLight.prototype.getUniformMatrix4 = function (name) {
            return this.multi.getUniformMatrix4(name);
        };
        DirectionalLight.prototype.getUniformVector2 = function (name) {
            return this.multi.getUniformVector2(name);
        };
        DirectionalLight.prototype.getUniformVector3 = function (name) {
            return this.multi.getUniformVector3(name);
        };
        DirectionalLight.prototype.getUniformVector4 = function (name) {
            return this.multi.getUniformVector4(name);
        };
        DirectionalLight.prototype.getUniformMetaInfos = function () {
            return this.multi.getUniformMetaInfos();
        };
        return DirectionalLight;
    })();
    return DirectionalLight;
});
