import BlendingFactorDest from '../core/BlendingFactorDest';
import BlendingFactorSrc from '../core/BlendingFactorSrc';
import ContextProvider from '../core/ContextProvider';
import {ShareableBase} from '../core/ShareableBase';

export default class WebGLBlendFunc extends ShareableBase {
    public sfactor: BlendingFactorSrc;
    public dfactor: BlendingFactorDest;

    constructor(sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest) {
        super()
        this.setLoggingName('WebGLBlendFunc')
        this.sfactor = sfactor;
        this.dfactor = dfactor;
    }

    destructor(levelUp: number): void {
        this.sfactor = void 0
        this.dfactor = void 0
        super.destructor(levelUp + 1)
    }

    contextFree(manager: ContextProvider): void {
        // do nothing
    }

    contextGain(manager: ContextProvider): void {
        this.execute(manager.gl)
    }

    contextLost(): void {
        // do nothing
    }

    private execute(gl: WebGLRenderingContext): void {
        gl.blendFunc(this.sfactor, this.dfactor);
    }
}
