var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, glCapability_1, mustBeNumber_1, Shareable_1) {
    var WebGLDisable = (function (_super) {
        __extends(WebGLDisable, _super);
        function WebGLDisable(capability) {
            _super.call(this, 'WebGLDisable');
            this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLDisable.prototype.contextFree = function (manager) {
        };
        WebGLDisable.prototype.contextGain = function (manager) {
            manager.gl.disable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLDisable.prototype.contextLost = function (canvasId) {
        };
        WebGLDisable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLDisable;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLDisable;
});
