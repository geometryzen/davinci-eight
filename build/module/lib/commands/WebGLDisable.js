import { __extends } from "tslib";
import { mustBeNumber } from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';
/**
 * disable(capability: Capability): void
 */
var WebGLDisable = /** @class */ (function (_super) {
    __extends(WebGLDisable, _super);
    function WebGLDisable(contextManager, capability) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLDisable');
        _this._capability = mustBeNumber('capability', capability);
        return _this;
    }
    WebGLDisable.prototype.destructor = function (levelUp) {
        this._capability = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLDisable.prototype.contextFree = function () {
        // do nothing
    };
    WebGLDisable.prototype.contextGain = function () {
        this.contextManager.gl.disable(this._capability);
    };
    WebGLDisable.prototype.contextLost = function () {
        // do nothing
    };
    return WebGLDisable;
}(ShareableBase));
export { WebGLDisable };
