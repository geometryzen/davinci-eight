import ContextManager from '../core/ContextManager';
import Texture from '../core/Texture';
import TextureTarget from '../core/TextureTarget';

export default class TextureLoader {
    constructor(private contextManager: ContextManager) {
        // Nothing else yet.
    }
    load(src: string, callback: (err: any, texture: Texture) => any): void {
        const image = new Image();
        image.onload = () => {
            const texture = new Texture(TextureTarget.TEXTURE_2D, this.contextManager);
            texture.image = image;
            callback(void 0, texture);
        }
        image.src = src;
    }
}
