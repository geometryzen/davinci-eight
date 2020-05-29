import { __extends } from "tslib";
import { ShareableBase } from '../core/ShareableBase';
var WebGLBlendFunc = /** @class */ (function (_super) {
    __extends(WebGLBlendFunc, _super);
    function WebGLBlendFunc(contextManager, sfactor, dfactor) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLBlendFunc');
        _this.sfactor = sfactor;
        _this.dfactor = dfactor;
        return _this;
    }
    WebGLBlendFunc.prototype.destructor = function (levelUp) {
        this.sfactor = void 0;
        this.dfactor = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLBlendFunc.prototype.contextFree = function () {
        // do nothing
    };
    WebGLBlendFunc.prototype.contextGain = function () {
        this.execute(this.contextManager.gl);
    };
    WebGLBlendFunc.prototype.contextLost = function () {
        // do nothing
    };
    WebGLBlendFunc.prototype.execute = function (gl) {
        gl.blendFunc(this.sfactor, this.dfactor);
    };
    return WebGLBlendFunc;
}(ShareableBase));
export { WebGLBlendFunc };
