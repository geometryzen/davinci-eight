var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../checks/mustBeNumber', '../checks/mustBeObject', '../utils/Shareable', '../core/GraphicsProgramSymbols'], function (require, exports, Color_1, mustBeNumber_1, mustBeObject_1, Shareable_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'AmbientLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        function AmbientLight(color) {
            _super.call(this, 'AmbientLight');
            mustBeObject_1.default('color', color);
            this.color = Color_1.default.white.clone();
            this.color.r = mustBeNumber_1.default('color.r', color.r);
            this.color.g = mustBeNumber_1.default('color.g', color.g);
            this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        AmbientLight.prototype.getProperty = function (name) {
            return void 0;
        };
        AmbientLight.prototype.setProperty = function (name, value) {
        };
        AmbientLight.prototype.setUniforms = function (visitor, canvasId) {
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, coords, canvasId);
        };
        return AmbientLight;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AmbientLight;
});
