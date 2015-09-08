import RenderingContextUser = require('../core/RenderingContextUser');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
declare class Texture implements RenderingContextUser {
    private _context;
    private _monitor;
    private _texture;
    private _refCount;
    constructor(monitor: RenderingContextMonitor);
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    /**
     * @method bind
     * @parameter target {number}
     */
    bind(target: number): void;
}
export = Texture;
