import { ContextManager } from './ContextManager';
import { Texture } from './Texture';
import { TextureTarget } from './TextureTarget';
export declare class ImageTexture extends Texture {
    private image;
    /**
     * @param image
     * @param target
     * @param contextManager
     * @param levelUp
     */
    constructor(image: HTMLImageElement, target: TextureTarget, contextManager: ContextManager, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    get naturalHeight(): number;
    get naturalWidth(): number;
    upload(): void;
}
