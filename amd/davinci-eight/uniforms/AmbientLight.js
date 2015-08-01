define(["require", "exports", '../core/Color', '../core/Symbolic', '../uniforms/UniformColor', '../checks/expectArg'], function (require, exports, Color, Symbolic, UniformColor, expectArg) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class AmbientLight
     */
    var AmbientLight = (function () {
        /**
         * @class AmbientLight
         * @constructor
         * @param options {{color?: Color; name?: string}}
         */
        function AmbientLight(options) {
            options = options || {};
            options.color = options.color || new Color([1.0, 1.0, 1.0]);
            options.name = options.name || Symbolic.UNIFORM_AMBIENT_LIGHT;
            expectArg('options.name', options.name).toBeString().toSatisfy(options.name.length > 0, "options.name must have at least one character");
            this.uColor = new UniformColor(options.name, Symbolic.UNIFORM_AMBIENT_LIGHT);
            this.uColor.data = options.color;
        }
        Object.defineProperty(AmbientLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            set: function (color) {
                throw new Error("color is readonly");
            },
            enumerable: true,
            configurable: true
        });
        AmbientLight.prototype.getUniformFloat = function (name) {
            return this.uColor.getUniformFloat(name);
        };
        AmbientLight.prototype.getUniformMatrix2 = function (name) {
            return this.uColor.getUniformMatrix2(name);
        };
        AmbientLight.prototype.getUniformMatrix3 = function (name) {
            return this.uColor.getUniformMatrix3(name);
        };
        AmbientLight.prototype.getUniformMatrix4 = function (name) {
            return this.uColor.getUniformMatrix4(name);
        };
        AmbientLight.prototype.getUniformVector2 = function (name) {
            return this.uColor.getUniformVector2(name);
        };
        AmbientLight.prototype.getUniformVector3 = function (name) {
            return this.uColor.getUniformVector3(name);
        };
        AmbientLight.prototype.getUniformVector4 = function (name) {
            return this.uColor.getUniformVector4(name);
        };
        AmbientLight.prototype.getUniformMetaInfos = function () {
            return this.uColor.getUniformMetaInfos();
        };
        return AmbientLight;
    })();
    return AmbientLight;
});
