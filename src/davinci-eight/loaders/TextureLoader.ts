import ContextManager from '../core/ContextManager';
import mustBeString from '../checks/mustBeString';
import mustBeFunction from '../checks/mustBeFunction';
import Texture from '../core/Texture';
import TextureTarget from '../core/TextureTarget';

export default class TextureLoader {
    constructor(private contextManager: ContextManager) {
        // Nothing else yet.
    }
    load(url: string, onLoad: (texture: Texture) => any): void {
        mustBeString('url', url);
        mustBeFunction('onLoad', onLoad);
        const image = new Image();
        image.onload = () => {
            const texture = new Texture(TextureTarget.TEXTURE_2D, this.contextManager);
            texture.image = image;
            texture.bind();
            texture.upload();
            texture.unbind();
            onLoad(texture);
        };
        image.src = url;
    }
}
