define(["require", "exports", '../core/Color', '../uniforms/MultiUniformProvider', '../core/Symbolic', '../uniforms/UniformColor', '../uniforms/UniformVector3', '../math/Vector3', '../checks/isDefined'], function (require, exports, Color, MultiUniformProvider, Symbolic, UniformColor, UniformVector3, Vector3, isDefined) {
    /**
     * Provides a uniform variable representing a directional light.
     * @class DirectionalLight
     */
    var DirectionalLight = (function () {
        /**
         * @class DirectionalLight
         * @constructor
         */
        function DirectionalLight(options) {
            options = options || {};
            options.color = options.color || new Color([1.0, 1.0, 1.0]);
            var direction = isDefined(options.direction) ? options.direction : { x: 0, y: 0, z: -1 };
            var colorName = isDefined(options.name) ? options.name + 'Color' : void 0;
            var directionName = isDefined(options.name) ? options.name + 'Direction' : void 0;
            this.uColor = new UniformColor(colorName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
            this.uDirection = new UniformVector3(directionName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
            this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);
            this.uColor.data = options.color;
            this.uDirection.data = new Vector3().copy(direction);
        }
        Object.defineProperty(DirectionalLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this.uDirection;
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
        DirectionalLight.prototype.getUniformMeta = function () {
            return this.multi.getUniformMeta();
        };
        return DirectionalLight;
    })();
    return DirectionalLight;
});
