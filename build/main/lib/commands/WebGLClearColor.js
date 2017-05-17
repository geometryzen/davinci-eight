"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var ShareableBase_1 = require("../core/ShareableBase");
var WebGLClearColor = (function (_super) {
    tslib_1.__extends(WebGLClearColor, _super);
    function WebGLClearColor(contextManager, r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 1; }
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLClearColor');
        _this.r = mustBeNumber_1.mustBeNumber('r', r);
        _this.g = mustBeNumber_1.mustBeNumber('g', g);
        _this.b = mustBeNumber_1.mustBeNumber('b', b);
        _this.a = mustBeNumber_1.mustBeNumber('a', a);
        return _this;
    }
    /**
     *
     */
    WebGLClearColor.prototype.destructor = function (levelUp) {
        this.r = void 0;
        this.g = void 0;
        this.b = void 0;
        this.a = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLClearColor.prototype.contextFree = function () {
        // Do nothing;
    };
    WebGLClearColor.prototype.contextGain = function () {
        mustBeNumber_1.mustBeNumber('r', this.r);
        mustBeNumber_1.mustBeNumber('g', this.g);
        mustBeNumber_1.mustBeNumber('b', this.b);
        mustBeNumber_1.mustBeNumber('a', this.a);
        this.contextManager.gl.clearColor(this.r, this.g, this.b, this.a);
    };
    WebGLClearColor.prototype.contextLost = function () {
        // Do nothing;
    };
    return WebGLClearColor;
}(ShareableBase_1.ShareableBase));
exports.WebGLClearColor = WebGLClearColor;
