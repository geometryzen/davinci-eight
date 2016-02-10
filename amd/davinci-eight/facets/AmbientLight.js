define(["require", "exports", '../core/Color', '../checks/mustBeArray', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../core/GraphicsProgramSymbols'], function (require, exports, Color_1, mustBeArray_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'AmbientLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var AmbientLight = (function () {
        function AmbientLight(color) {
            mustBeObject_1.default('color', color);
            this.color = Color_1.default.white.clone();
            this.color.r = mustBeNumber_1.default('color.r', color.r);
            this.color.g = mustBeNumber_1.default('color.g', color.g);
            this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.getProperty = function (name) {
            return void 0;
        };
        AmbientLight.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name, contextBuilder);
            mustBeArray_1.default('value', value, contextBuilder);
            return this;
        };
        AmbientLight.prototype.setUniforms = function (visitor) {
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, coords);
        };
        return AmbientLight;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AmbientLight;
});
