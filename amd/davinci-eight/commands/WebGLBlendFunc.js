var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber, Shareable) {
    var factors = [
        'ZERO',
        'ONE',
        'SRC_COLOR',
        'ONE_MINUS_SRC_COLOR',
        'DST_COLOR',
        'ONE_MINUS_DST_COLOR',
        'SRC_ALPHA',
        'ONE_MINUS_SRC_ALPHA',
        'DST_ALPHA',
        'ONE_MINUS_DST_ALPHA',
        'SRC_ALPHA_SATURATE'
    ];
    function mustBeFactor(name, factor) {
        if (factors.indexOf(factor) >= 0) {
            return factor;
        }
        else {
            throw new Error(factor + " is not a valid factor. Factor must be one of " + JSON.stringify(factors));
        }
    }
    /**
     * @class WebGLBlendFunc
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLBlendFunc = (function (_super) {
        __extends(WebGLBlendFunc, _super);
        /**
         * @class WebGLBlendFunc
         * @constructor
         * @param sfactor {string}
         * @param dfactor {string}
         */
        function WebGLBlendFunc(sfactor, dfactor) {
            _super.call(this, 'WebGLBlendFunc');
            this.sfactor = mustBeFactor('sfactor', sfactor);
            this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        WebGLBlendFunc.prototype.execute = function (gl) {
            var sfactor = mustBeNumber('sfactor => ' + this.sfactor, (gl[this.sfactor]));
            var dfactor = mustBeNumber('dfactor => ' + this.dfactor, (gl[this.dfactor]));
            gl.blendFunc(sfactor, dfactor);
        };
        /**
         * @method destructor
         * @return {void}
         */
        WebGLBlendFunc.prototype.destructor = function () {
            this.sfactor = void 0;
            this.dfactor = void 0;
        };
        return WebGLBlendFunc;
    })(Shareable);
    return WebGLBlendFunc;
});
