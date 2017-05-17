"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ShareableBase_1 = require("../core/ShareableBase");
/**
 * Displays details about the WegGL version to the console.
 */
var VersionLogger = (function (_super) {
    tslib_1.__extends(VersionLogger, _super);
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
}(ShareableBase_1.ShareableBase));
exports.VersionLogger = VersionLogger;
