import { ContextManager } from './ContextManager';
import { Texture } from './Texture';
import { TextureTarget } from './TextureTarget';
export declare class ImageTexture extends Texture {
    private image;
    constructor(image: HTMLImageElement, target: TextureTarget, contextManager: ContextManager, levelUp?: number);
    protected destructor(levelUp: number): void;
    readonly naturalHeight: number;
    readonly naturalWidth: number;
    upload(): void;
}
