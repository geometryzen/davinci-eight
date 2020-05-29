"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAttributesLogger = void 0;
var tslib_1 = require("tslib");
var readOnly_1 = require("../i18n/readOnly");
var ShareableBase_1 = require("../core/ShareableBase");
/**
 * Displays details about the WegGL version to the console.
 */
var ContextAttributesLogger = /** @class */ (function (_super) {
    tslib_1.__extends(ContextAttributesLogger, _super);
    /**
     *
     */
    function ContextAttributesLogger(contextManager) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        return _this;
    }
    ContextAttributesLogger.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    ContextAttributesLogger.prototype.contextFree = function () {
        // Do nothing.
    };
    ContextAttributesLogger.prototype.contextGain = function () {
        var gl = this.contextManager.gl;
        var attributes = gl.getContextAttributes();
        console.log("alpha                        => " + attributes.alpha);
        console.log("antialias                    => " + attributes.antialias);
        console.log("depth                        => " + attributes.depth);
        console.log("failIfMajorPerformanceCaveat => " + attributes.failIfMajorPerformanceCaveat);
        // TODO: preferLowPowerToHighPerformance?
        console.log("premultipliedAlpha           => " + attributes.premultipliedAlpha);
        console.log("preserveDrawingBuffer        => " + attributes.preserveDrawingBuffer);
        console.log("stencil                      => " + attributes.stencil);
    };
    ContextAttributesLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    Object.defineProperty(ContextAttributesLogger.prototype, "name", {
        get: function () {
            return this.getLoggingName();
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('name').message);
        },
        enumerable: false,
        configurable: true
    });
    return ContextAttributesLogger;
}(ShareableBase_1.ShareableBase));
exports.ContextAttributesLogger = ContextAttributesLogger;
