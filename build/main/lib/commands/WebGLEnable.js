"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLEnable = void 0;
var tslib_1 = require("tslib");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var ShareableBase_1 = require("../core/ShareableBase");
/**
 * enable(capability: Capability): void
 */
var WebGLEnable = /** @class */ (function (_super) {
    tslib_1.__extends(WebGLEnable, _super);
    function WebGLEnable(contextManager, capability) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLEnable');
        _this._capability = mustBeNumber_1.mustBeNumber('capability', capability);
        return _this;
    }
    WebGLEnable.prototype.destructor = function (levelUp) {
        this._capability = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLEnable.prototype.contextFree = function () {
        // do nothing
    };
    WebGLEnable.prototype.contextGain = function () {
        this.contextManager.gl.enable(this._capability);
    };
    WebGLEnable.prototype.contextLost = function () {
        // do nothing
    };
    return WebGLEnable;
}(ShareableBase_1.ShareableBase));
exports.WebGLEnable = WebGLEnable;
