import { __extends } from "tslib";
import { ShareableBase } from '../core/ShareableBase';
/**
 * Displays details about the WegGL version to the console.
 */
var VersionLogger = /** @class */ (function (_super) {
    __extends(VersionLogger, _super);
    function VersionLogger(contextManager) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName("VersionLogger");
        return _this;
    }
    VersionLogger.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    VersionLogger.prototype.contextFree = function () {
        // Do nothing.
    };
    VersionLogger.prototype.contextGain = function () {
        var gl = this.contextManager.gl;
        console.log(gl.getParameter(gl.VERSION));
    };
    VersionLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    return VersionLogger;
}(ShareableBase));
export { VersionLogger };
