var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    var QUALIFIED_NAME = 'EIGHT.ContextAttributesLogger';
    /**
     * <p>
     * Displays details about the WegGL version to the console.
     * <p>
     * @class ContextAttributesLogger
     * @extends Shareable
     * @implements IContextCommand
     */
    var ContextAttributesLogger = (function (_super) {
        __extends(ContextAttributesLogger, _super);
        function ContextAttributesLogger() {
            _super.call(this, QUALIFIED_NAME);
        }
        ContextAttributesLogger.prototype.contextFree = function (canvasId) {
        };
        ContextAttributesLogger.prototype.contextGain = function (manager) {
            var gl = manager.gl;
            var attributes = gl.getContextAttributes();
            console.log("alpha                 => " + attributes.alpha);
            console.log("antialias             => " + attributes.antialias);
            console.log("depth                 => " + attributes.depth);
            console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
            console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
            console.log("stencil               => " + attributes.stencil);
        };
        ContextAttributesLogger.prototype.contextLost = function (canvasId) {
        };
        ContextAttributesLogger.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ContextAttributesLogger.prototype, "name", {
            get: function () {
                return QUALIFIED_NAME;
            },
            enumerable: true,
            configurable: true
        });
        return ContextAttributesLogger;
    })(Shareable);
    return ContextAttributesLogger;
});
