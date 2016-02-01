var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../commands/BlendFactor', '../utils/Shareable'], function (require, exports, BlendFactor_1, Shareable_1) {
    var factors = [
        BlendFactor_1.default.DST_ALPHA,
        BlendFactor_1.default.DST_COLOR,
        BlendFactor_1.default.ONE,
        BlendFactor_1.default.ONE_MINUS_DST_ALPHA,
        BlendFactor_1.default.ONE_MINUS_DST_COLOR,
        BlendFactor_1.default.ONE_MINUS_SRC_ALPHA,
        BlendFactor_1.default.ONE_MINUS_SRC_COLOR,
        BlendFactor_1.default.SRC_ALPHA,
        BlendFactor_1.default.SRC_ALPHA_SATURATE,
        BlendFactor_1.default.SRC_COLOR,
        BlendFactor_1.default.ZERO
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
            case BlendFactor_1.default.ONE: return gl.ONE;
            case BlendFactor_1.default.SRC_ALPHA: return gl.SRC_ALPHA;
            default: {
                throw new Error(factor + " is not a valid factor.");
            }
        }
    }
    var WebGLBlendFunc = (function (_super) {
        __extends(WebGLBlendFunc, _super);
        function WebGLBlendFunc(sfactor, dfactor) {
            _super.call(this, 'WebGLBlendFunc');
            this.sfactor = mustBeFactor('sfactor', sfactor);
            this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        WebGLBlendFunc.prototype.contextFree = function (canvasId) {
        };
        WebGLBlendFunc.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        WebGLBlendFunc.prototype.contextLost = function (canvasId) {
        };
        WebGLBlendFunc.prototype.execute = function (gl) {
            gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
        };
        WebGLBlendFunc.prototype.destructor = function () {
            this.sfactor = void 0;
            this.dfactor = void 0;
        };
        return WebGLBlendFunc;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLBlendFunc;
});
