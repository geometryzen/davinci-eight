"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DataType_1 = require("./DataType");
var PixelFormat_1 = require("./PixelFormat");
var Texture_1 = require("./Texture");
var ImageTexture = (function (_super) {
    tslib_1.__extends(ImageTexture, _super);
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
        enumerable: true,
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
        enumerable: true,
        configurable: true
    });
    ImageTexture.prototype.upload = function () {
        if (this.gl) {
            this.gl.texImage2D(this._target, 0, PixelFormat_1.PixelFormat.RGBA, PixelFormat_1.PixelFormat.RGBA, DataType_1.DataType.UNSIGNED_BYTE, this.image);
        }
        else {
            console.warn(this.getLoggingName() + ".upload() missing WebGL rendering context.");
        }
    };
    return ImageTexture;
}(Texture_1.Texture));
exports.ImageTexture = ImageTexture;
