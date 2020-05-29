import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { ShareableBase } from '../core/ShareableBase';
import { Texture } from '../core/Texture';
import { TextureUnit } from '../core/TextureUnit';
export declare class TextureFacet extends ShareableBase implements Facet {
    private _texture;
    unit: TextureUnit;
    constructor();
    protected destructor(levelUp: number): void;
    get texture(): Texture;
    set texture(value: Texture);
    setUniforms(visitor: FacetVisitor): void;
}
