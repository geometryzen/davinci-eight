var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber, Shareable) {
    var QUALIFIED_NAME = 'WebGLRenderingContext.enable';
    /**
     * <p>
     * enable(capability: number): void
     * <p>
     * @class WebGLEnable
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLEnable = (function (_super) {
        __extends(WebGLEnable, _super);
        /**
         * @class WebGLEnable
         * @constructor
         */
        function WebGLEnable(capability) {
            if (capability === void 0) { capability = 1; }
            _super.call(this, QUALIFIED_NAME);
            this.capability = mustBeNumber('capability', capability);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLEnable.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLEnable.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLEnable.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method execute
         * @param gl {WebGLRenderingContext}
         * @return {void}
         */
        WebGLEnable.prototype.execute = function (gl) {
            mustBeNumber('capability', this.capability);
            gl.enable(this.capability);
        };
        /**
         * @method destructor
         * @return {void}
         */
        WebGLEnable.prototype.destructor = function () {
            this.capability = void 0;
        };
        Object.defineProperty(WebGLEnable.prototype, "name", {
            get: function () {
                return QUALIFIED_NAME;
            },
            enumerable: true,
            configurable: true
        });
        return WebGLEnable;
    })(Shareable);
    return WebGLEnable;
});
