var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
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
            _super.call(this, 'ContextAttributesLogger');
        }
        ContextAttributesLogger.prototype.execute = function (gl) {
            var attributes = gl.getContextAttributes();
            console.log("alpha                 => " + attributes.alpha);
            console.log("antialias             => " + attributes.antialias);
            console.log("depth                 => " + attributes.depth);
            console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
            console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
            console.log("stencil               => " + attributes.stencil);
        };
        ContextAttributesLogger.prototype.destructor = function () {
        };
        return ContextAttributesLogger;
    })(Shareable);
    return ContextAttributesLogger;
});
