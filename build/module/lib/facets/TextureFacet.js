import { __extends } from "tslib";
import { exchange } from '../base/exchange';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { ShareableBase } from '../core/ShareableBase';
import { TextureUnit } from '../core/TextureUnit';
/**
 * A `Facet` implementation
 */
var TextureFacet = /** @class */ (function (_super) {
    __extends(TextureFacet, _super);
    function TextureFacet() {
        var _this = _super.call(this) || this;
        _this.unit = TextureUnit.TEXTURE0;
        _this.setLoggingName('TextureFacet');
        return _this;
    }
    TextureFacet.prototype.destructor = function (levelUp) {
        this._texture = exchange(this._texture, void 0);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(TextureFacet.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = exchange(this._texture, value);
        },
        enumerable: false,
        configurable: true
    });
    TextureFacet.prototype.setUniforms = function (visitor) {
        if (this._texture) {
            visitor.activeTexture(this.unit);
            this._texture.bind();
            // TODO: What is the significance of setting the 'uImage' uniform to zero?
            visitor.uniform1i(GraphicsProgramSymbols.UNIFORM_IMAGE, 0);
            // TODO: Is this the correct place to unbind? Should be we have a bindUniforms, unbindUniforms instead of setUniforms?
            // this._texture.unbind();
        }
    };
    return TextureFacet;
}(ShareableBase));
export { TextureFacet };
