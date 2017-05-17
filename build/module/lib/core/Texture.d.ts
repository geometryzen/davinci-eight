import { ContextManager } from './ContextManager';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { TextureMagFilter } from './TextureMagFilter';
import { TextureMinFilter } from './TextureMinFilter';
import { TextureTarget } from './TextureTarget';
import { TextureWrapMode } from './TextureWrapMode';
export declare class Texture extends ShareableContextConsumer {
    private _texture;
    protected _target: TextureTarget;
    constructor(target: TextureTarget, contextManager: ContextManager, levelUp?: number);
    protected destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    /**
     *
     */
    bind(): void;
    /**
     *
     */
    unbind(): void;
    minFilter: TextureMinFilter;
    magFilter: TextureMagFilter;
    wrapS: TextureWrapMode;
    wrapT: TextureWrapMode;
    /**
     *
     */
    upload(): void;
}
