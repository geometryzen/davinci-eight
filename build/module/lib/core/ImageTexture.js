import { __extends } from "tslib";
import { DataType } from './DataType';
import { PixelFormat } from './PixelFormat';
import { Texture } from './Texture';
var ImageTexture = /** @class */ (function (_super) {
    __extends(ImageTexture, _super);
    function ImageTexture(image, target, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, target, contextManager, levelUp + 1) || this;
        _this.image = image;
        _this.setLoggingName('ImageTexture');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    ImageTexture.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(ImageTexture.prototype, "naturalHeight", {
        get: function () {
            if (this.image) {
                return this.image.naturalHeight;
            }
            else {
                return void 0;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageTexture.prototype, "naturalWidth", {
        get: function () {
            if (this.image) {
                return this.image.naturalWidth;
            }
            else {
                return void 0;
            }
        },
        enumerable: false,
        configurable: true
    });
    ImageTexture.prototype.upload = function () {
        if (this.gl) {
            this.gl.texImage2D(this._target, 0, PixelFormat.RGBA, PixelFormat.RGBA, DataType.UNSIGNED_BYTE, this.image);
        }
        else {
            console.warn(this.getLoggingName() + ".upload() missing WebGL rendering context.");
        }
    };
    return ImageTexture;
}(Texture));
export { ImageTexture };
