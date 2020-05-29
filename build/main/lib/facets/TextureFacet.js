"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureFacet = void 0;
var tslib_1 = require("tslib");
var exchange_1 = require("../base/exchange");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var ShareableBase_1 = require("../core/ShareableBase");
var TextureUnit_1 = require("../core/TextureUnit");
var TextureFacet = /** @class */ (function (_super) {
    tslib_1.__extends(TextureFacet, _super);
    function TextureFacet() {
        var _this = _super.call(this) || this;
        _this.unit = TextureUnit_1.TextureUnit.TEXTURE0;
        _this.setLoggingName('TextureFacet');
        return _this;
    }
    TextureFacet.prototype.destructor = function (levelUp) {
        this._texture = exchange_1.exchange(this._texture, void 0);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(TextureFacet.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = exchange_1.exchange(this._texture, value);
        },
        enumerable: false,
        configurable: true
    });
    TextureFacet.prototype.setUniforms = function (visitor) {
        if (this._texture) {
            visitor.activeTexture(this.unit);
            this._texture.bind();
            visitor.uniform1i(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE, 0);
            // this._texture.unbind();
        }
    };
    return TextureFacet;
}(ShareableBase_1.ShareableBase));
exports.TextureFacet = TextureFacet;
