var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, glCapability_1, mustBeNumber_1, Shareable_1) {
    var WebGLEnable = (function (_super) {
        __extends(WebGLEnable, _super);
        function WebGLEnable(capability) {
            _super.call(this, 'WebGLEnable');
            this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLEnable.prototype.contextFree = function (manager) {
        };
        WebGLEnable.prototype.contextGain = function (manager) {
            manager.gl.enable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLEnable.prototype.contextLost = function (canvasId) {
        };
        WebGLEnable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLEnable;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLEnable;
});
