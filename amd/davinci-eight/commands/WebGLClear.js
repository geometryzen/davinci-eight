var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber, Shareable) {
    var QUALIFIED_NAME = 'WebGLRenderingContext.clear';
    /**
     * <p>
     * clear(mask: number): void
     * <p>
     * @class WebGLClear
     * @extends Shareable
     * @implements IContextCommand
     */
    var WebGLClear = (function (_super) {
        __extends(WebGLClear, _super);
        /**
         * @class WebGLClear
         * @constructor
         */
        function WebGLClear(mask) {
            _super.call(this, QUALIFIED_NAME);
            this.mask = mustBeNumber('mask', mask);
        }
        /**
         * @method destructor
         * @return {void}
         */
        WebGLClear.prototype.destructor = function () {
            this.mask = void 0;
        };
        /**
         * @method execute
         * @param gl {WebGLRenderingContext}
         * @return {void}
         */
        WebGLClear.prototype.execute = function (manager) {
            manager.gl.clear(this.mask);
        };
        Object.defineProperty(WebGLClear.prototype, "name", {
            /**
             * @property name
             * @type {string}
             * @readOnly
             */
            get: function () {
                return QUALIFIED_NAME;
            },
            enumerable: true,
            configurable: true
        });
        return WebGLClear;
    })(Shareable);
    return WebGLClear;
});
