var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeNumber, mustBeString, Shareable) {
    /**
     * <p>
     * enable(capability: string): void
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
         * @param capability {string} The name of the WebGLRenderingContext property to be enabled.
         */
        function WebGLEnable(capability) {
            _super.call(this, 'WebGLEnable');
            this._capability = mustBeString('capability', capability);
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
            manager.gl.enable(mustBeNumber(this._capability, (manager.gl[this._capability])));
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
         * @method destructor
         * @return {void}
         * @protected
         */
        WebGLEnable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLEnable;
    })(Shareable);
    return WebGLEnable;
});
