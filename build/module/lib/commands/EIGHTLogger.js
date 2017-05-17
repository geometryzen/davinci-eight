import * as tslib_1 from "tslib";
import { config } from '../config';
import { ShareableBase } from '../core/ShareableBase';
/**
 * Displays details about EIGHT to the console.
 */
var EIGHTLogger = (function (_super) {
    tslib_1.__extends(EIGHTLogger, _super);
    function EIGHTLogger() {
        var _this = _super.call(this) || this;
        _this.setLoggingName('EIGHTLogger');
        return _this;
    }
    EIGHTLogger.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    EIGHTLogger.prototype.contextFree = function () {
        // Does nothing.
    };
    /**
     * Logs the namespace, version, GitHub URL, and last modified date to the console.
     */
    EIGHTLogger.prototype.contextGain = function () {
        console.log(config.NAMESPACE + " " + config.VERSION + " (" + config.GITHUB + ") " + config.LAST_MODIFIED);
    };
    EIGHTLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    return EIGHTLogger;
}(ShareableBase));
export { EIGHTLogger };
