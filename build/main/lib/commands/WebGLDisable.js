"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var ShareableBase_1 = require("../core/ShareableBase");
/**
 * disable(capability: Capability): void
 */
var WebGLDisable = (function (_super) {
    tslib_1.__extends(WebGLDisable, _super);
    function WebGLDisable(contextManager, capability) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLDisable');
        _this._capability = mustBeNumber_1.mustBeNumber('capability', capability);
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
}(ShareableBase_1.ShareableBase));
exports.WebGLDisable = WebGLDisable;
