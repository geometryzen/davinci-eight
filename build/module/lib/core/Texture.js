import * as tslib_1 from "tslib";
import { mustBeUndefined } from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { TextureParameterName } from './TextureParameterName';
var Texture = (function (_super) {
    tslib_1.__extends(Texture, _super);
    function Texture(target, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager) || this;
        _this.setLoggingName('Texture');
        _this._target = target;
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    Texture.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
        mustBeUndefined(this.getLoggingName(), this._texture);
    };
    Texture.prototype.contextFree = function () {
        if (this._texture) {
            this.gl.deleteTexture(this._texture);
            this._texture = void 0;
            _super.prototype.contextFree.call(this);
        }
    };
    Texture.prototype.contextGain = function () {
        if (!this._texture) {
            _super.prototype.contextGain.call(this);
            this._texture = this.contextManager.gl.createTexture();
        }
    };
    Texture.prototype.contextLost = function () {
        this._texture = void 0;
        _super.prototype.contextLost.call(this);
    };
    /**
     *
     */
    Texture.prototype.bind = function () {
        if (this.gl) {
            this.gl.bindTexture(this._target, this._texture);
        }
        else {
            console.warn(this.getLoggingName() + ".bind() missing WebGL rendering context.");
        }
    };
    /**
     *
     */
    Texture.prototype.unbind = function () {
        if (this.gl) {
            this.gl.bindTexture(this._target, null);
        }
        else {
            console.warn(this.getLoggingName() + ".unbind() missing WebGL rendering context.");
        }
    };
    Object.defineProperty(Texture.prototype, "minFilter", {
        get: function () {
            throw new Error('minFilter is write-only');
        },
        set: function (filter) {
            if (this.gl) {
                this.bind();
                this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_MIN_FILTER, filter);
                this.unbind();
            }
            else {
                console.warn(this.getLoggingName() + ".minFilter missing WebGL rendering context.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "magFilter", {
        get: function () {
            throw new Error('magFilter is write-only');
        },
        set: function (filter) {
            if (this.gl) {
                this.bind();
                this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_MAG_FILTER, filter);
                this.unbind();
            }
            else {
                console.warn(this.getLoggingName() + ".magFilter missing WebGL rendering context.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "wrapS", {
        get: function () {
            throw new Error('wrapS is write-only');
        },
        set: function (mode) {
            if (this.gl) {
                this.bind();
                this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_WRAP_S, mode);
                this.unbind();
            }
            else {
                console.warn(this.getLoggingName() + ".wrapS missing WebGL rendering context.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "wrapT", {
        get: function () {
            throw new Error('wrapT is write-only');
        },
        set: function (mode) {
            if (this.gl) {
                this.bind();
                this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_WRAP_T, mode);
                this.unbind();
            }
            else {
                console.warn(this.getLoggingName() + ".wrapT missing WebGL rendering context.");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Texture.prototype.upload = function () {
        throw new Error(this.getLoggingName() + ".upload() must be implemented.");
    };
    return Texture;
}(ShareableContextConsumer));
export { Texture };
