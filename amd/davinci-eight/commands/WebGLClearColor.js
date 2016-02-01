var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber_1, Shareable_1) {
    var WebGLClearColor = (function (_super) {
        __extends(WebGLClearColor, _super);
        function WebGLClearColor(red, green, blue, alpha) {
            if (red === void 0) { red = 0; }
            if (green === void 0) { green = 0; }
            if (blue === void 0) { blue = 0; }
            if (alpha === void 0) { alpha = 1; }
            _super.call(this, 'WebGLClearColor');
            this.red = mustBeNumber_1.default('red', red);
            this.green = mustBeNumber_1.default('green', green);
            this.blue = mustBeNumber_1.default('blue', blue);
            this.alpha = mustBeNumber_1.default('alpha', alpha);
        }
        WebGLClearColor.prototype.contextFree = function (canvasId) {
        };
        WebGLClearColor.prototype.contextGain = function (manager) {
            mustBeNumber_1.default('red', this.red);
            mustBeNumber_1.default('green', this.green);
            mustBeNumber_1.default('blue', this.blue);
            mustBeNumber_1.default('alpha', this.alpha);
            manager.gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        WebGLClearColor.prototype.contextLost = function (canvasId) {
        };
        WebGLClearColor.prototype.destructor = function () {
            this.red = void 0;
            this.green = void 0;
            this.blue = void 0;
            this.alpha = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLClearColor;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLClearColor;
});
