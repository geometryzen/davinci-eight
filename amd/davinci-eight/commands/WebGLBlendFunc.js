var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../commands/BlendFactor', '../utils/Shareable'], function (require, exports, BlendFactor, Shareable) {
    var factors = [
        BlendFactor.DST_ALPHA,
        BlendFactor.DST_COLOR,
        BlendFactor.ONE,
        BlendFactor.ONE_MINUS_DST_ALPHA,
        BlendFactor.ONE_MINUS_DST_COLOR,
        BlendFactor.ONE_MINUS_SRC_ALPHA,
        BlendFactor.ONE_MINUS_SRC_COLOR,
        BlendFactor.SRC_ALPHA,
        BlendFactor.SRC_ALPHA_SATURATE,
        BlendFactor.SRC_COLOR,
        BlendFactor.ZERO
    ];
    function mustBeFactor(name, factor) {
        if (factors.indexOf(factor) >= 0) {
            return factor;
        }
        else {
            throw new Error(factor + " is not a valid factor.");
        }
    }
    function factor(factor, gl) {
        switch (factor) {
            case BlendFactor.ONE: return gl.ONE;
            case BlendFactor.SRC_ALPHA: return gl.SRC_ALPHA;
            default: {
                throw new Error(factor + " is not a valid factor.");
            }
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
         * @param sfactor {BlendFactor}
         * @param dfactor {BlendFactor}
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
            gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
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
