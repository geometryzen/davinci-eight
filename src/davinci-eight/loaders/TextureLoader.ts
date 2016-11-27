import ContextManager from '../core/ContextManager';
import ImageTexture from '../core/ImageTexture';
import mustBeString from '../checks/mustBeString';
import mustBeFunction from '../checks/mustBeFunction';
import TextureTarget from '../core/TextureTarget';

export default class TextureLoader {
    constructor(private contextManager: ContextManager) {
        // Nothing else yet.
    }
    loadImageTexture(url: string, onLoad: (texture: ImageTexture) => any): void {
        mustBeString('url', url);
        mustBeFunction('onLoad', onLoad);
        const image = new Image();
        image.onload = () => {
            const texture = new ImageTexture(image, TextureTarget.TEXTURE_2D, this.contextManager);
            texture.bind();
            texture.upload();
            texture.unbind();
            onLoad(texture);
        };
        image.src = url;
    }
}
