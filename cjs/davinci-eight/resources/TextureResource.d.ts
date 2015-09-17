import ITexture = require('../core/ITexture');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
declare class TextureResource implements ITexture {
    private _gl;
    private _monitor;
    private _texture;
    private _refCount;
    private _uuid;
    private _target;
    constructor(monitors: ContextMonitor[], target: number);
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(manager: ContextManager): void;
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
