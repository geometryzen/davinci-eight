var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber, Shareable) {
    var QUALIFIED_NAME = 'WebGLRenderingContext.clearColor';
    /**
     * <p>
     * clearColor(red: number, green: number, blue: number, alpha: number): void
     * <p>
     * @class WebGLClearColor
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLClearColor = (function (_super) {
        __extends(WebGLClearColor, _super);
        /**
         * @class WebGLClearColor
         * @constructor
         */
        function WebGLClearColor(red, green, blue, alpha) {
            if (red === void 0) { red = 0; }
            if (green === void 0) { green = 0; }
            if (blue === void 0) { blue = 0; }
            if (alpha === void 0) { alpha = 1; }
            _super.call(this, 'WebGLRenderingContext.clearColor');
            this.red = mustBeNumber('red', red);
            this.green = mustBeNumber('green', green);
            this.blue = mustBeNumber('blue', blue);
            this.alpha = mustBeNumber('alpha', alpha);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLClearColor.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLClearColor.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLClearColor.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method execute
         * @param gl {WebGLRenderingContext}
         * @return {void}
         */
        WebGLClearColor.prototype.execute = function (gl) {
            mustBeNumber('red', this.red);
            mustBeNumber('green', this.green);
            mustBeNumber('blue', this.blue);
            mustBeNumber('alpha', this.alpha);
            gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        /**
         * @method destructor
         * @return {void}
         */
        WebGLClearColor.prototype.destructor = function () {
            this.red = void 0;
            this.green = void 0;
            this.blue = void 0;
            this.alpha = void 0;
        };
        Object.defineProperty(WebGLClearColor.prototype, "name", {
            get: function () {
                return QUALIFIED_NAME;
            },
            enumerable: true,
            configurable: true
        });
        return WebGLClearColor;
    })(Shareable);
    return WebGLClearColor;
});
