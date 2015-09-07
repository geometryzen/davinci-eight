import RenderingContextUser = require('../core/RenderingContextUser');
declare class Texture implements RenderingContextUser {
    private _context;
    private _texture;
    private _refCount;
    constructor();
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