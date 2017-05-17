"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var ShareableBase_1 = require("../core/ShareableBase");
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
        console.log(config_1.config.NAMESPACE + " " + config_1.config.VERSION + " (" + config_1.config.GITHUB + ") " + config_1.config.LAST_MODIFIED);
    };
    EIGHTLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    return EIGHTLogger;
}(ShareableBase_1.ShareableBase));
exports.EIGHTLogger = EIGHTLogger;
