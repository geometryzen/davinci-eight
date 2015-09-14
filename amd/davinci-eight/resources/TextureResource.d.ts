import Texture = require('../core/Texture');
import ContextManager = require('../core/ContextManager');
declare class TextureResource implements Texture {
    private _context;
    private _monitor;
    private _texture;
    private _refCount;
    private _uuid;
    private _target;
    constructor(monitor: ContextManager, target: number);
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    /**
     * @method bind
     */
    bind(): void;
    /**
     * @method unbind
     */
    unbind(): void;
}
export = TextureResource;
