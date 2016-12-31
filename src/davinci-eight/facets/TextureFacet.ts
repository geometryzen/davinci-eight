import exchange from '../base/exchange';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import ShareableBase from '../core/ShareableBase';
import Texture from '../core/Texture';
import TextureUnit from '../core/TextureUnit';

export default class TextureFacet extends ShareableBase implements Facet {
    private _texture: Texture;
    public unit = TextureUnit.TEXTURE0;
    constructor() {
        super();
        this.setLoggingName('TextureFacet');
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
            visitor.uniform1i(GraphicsProgramSymbols.UNIFORM_IMAGE, 0);
            // this._texture.unbind();
        }
    }
}
