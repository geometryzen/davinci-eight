import { exchange } from "../base/exchange";
import { Facet } from "../core/Facet";
import { FacetVisitor } from "../core/FacetVisitor";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";
import { ShareableBase } from "../core/ShareableBase";
import { Texture } from "../core/Texture";
import { TextureUnit } from "../core/TextureUnit";

/**
 * A `Facet` implementation
 */
export class TextureFacet extends ShareableBase implements Facet {
    private _texture: Texture;
    public unit = TextureUnit.TEXTURE0;
    constructor() {
        super();
        this.setLoggingName("TextureFacet");
    }
    protected destructor(levelUp: number): void {
        this._texture = exchange(this._texture, void 0);
        super.destructor(levelUp + 1);
    }
    get texture(): Texture {
        return this._texture;
    }
    set texture(value: Texture) {
        this._texture = exchange(this._texture, value);
    }
    setUniforms(visitor: FacetVisitor): void {
        if (this._texture) {
            visitor.activeTexture(this.unit);
            this._texture.bind();
            // TODO: What is the significance of setting the 'uImage' uniform to zero?
            visitor.uniform1i(GraphicsProgramSymbols.UNIFORM_IMAGE, 0);
            // TODO: Is this the correct place to unbind? Should be we have a bindUniforms, unbindUniforms instead of setUniforms?
            // this._texture.unbind();
        }
    }
}
