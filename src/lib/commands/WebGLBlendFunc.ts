import { BlendingFactorDest } from '../core/BlendingFactorDest';
import { BlendingFactorSrc } from '../core/BlendingFactorSrc';
import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';

export class WebGLBlendFunc extends ShareableBase {
    public sfactor: BlendingFactorSrc;
    public dfactor: BlendingFactorDest;

    constructor(private contextManager: ContextManager, sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest) {
        super();
        this.setLoggingName('WebGLBlendFunc');
        this.sfactor = sfactor;
        this.dfactor = dfactor;
    }

    destructor(levelUp: number): void {
        this.sfactor = void 0;
        this.dfactor = void 0;
        super.destructor(levelUp + 1);
    }

    contextFree(): void {
        // do nothing
    }

    contextGain(): void {
        this.execute(this.contextManager.gl);
    }

    contextLost(): void {
        // do nothing
    }

    private execute(gl: WebGLRenderingContext): void {
        gl.blendFunc(this.sfactor, this.dfactor);
    }
}
