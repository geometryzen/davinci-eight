var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeNumber, mustBeString, Shareable) {
    /**
     * <p>
     * disable(capability: string): void
     * <p>
     * @class WebGLDisable
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLDisable = (function (_super) {
        __extends(WebGLDisable, _super);
        /**
         * @class WebGLDisable
         * @constructor
         * @param capability {string} The name of the WebGLRenderingContext property to be disabled.
         */
        function WebGLDisable(capability) {
            _super.call(this, 'WebGLDisable');
            this._capability = mustBeString('capability', capability);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLDisable.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLDisable.prototype.contextGain = function (manager) {
            manager.gl.disable(mustBeNumber(this._capability, (manager.gl[this._capability])));
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLDisable.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        WebGLDisable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLDisable;
    })(Shareable);
    return WebGLDisable;
});
