import BlendFactor from '../commands/BlendFactor';
import IContextProvider from '../core/IContextProvider';
import IContextCommand from '../core/IContextCommand';
import Shareable from '../utils/Shareable';

var factors = [
    BlendFactor.DST_ALPHA,
    BlendFactor.DST_COLOR,
    BlendFactor.ONE,
    BlendFactor.ONE_MINUS_DST_ALPHA,
    BlendFactor.ONE_MINUS_DST_COLOR,
    BlendFactor.ONE_MINUS_SRC_ALPHA,
    BlendFactor.ONE_MINUS_SRC_COLOR,
    BlendFactor.SRC_ALPHA,
    BlendFactor.SRC_ALPHA_SATURATE,
    BlendFactor.SRC_COLOR,
    BlendFactor.ZERO
]

function mustBeFactor(name: string, factor: BlendFactor): BlendFactor {
    if (factors.indexOf(factor) >= 0) {
        return factor;
    }
    else {
        throw new Error(factor + " is not a valid factor.")
    }
}

function factor(factor: BlendFactor, gl: WebGLRenderingContext): number {
    switch (factor) {
        case BlendFactor.ONE: return gl.ONE;
        case BlendFactor.SRC_ALPHA: return gl.SRC_ALPHA;
        default: {
            throw new Error(factor + " is not a valid factor.")
        }
    }
}

/**
 * @class WebGLBlendFunc
 * @extends Shareable
 * @implements IContextCommand
 * @implements IContextConsumer
 */
export default class WebGLBlendFunc extends Shareable implements IContextCommand {
    public sfactor: BlendFactor;
    public dfactor: BlendFactor;
    /**
     * @class WebGLBlendFunc
     * @constructor
     * @param sfactor {BlendFactor}
     * @param dfactor {BlendFactor}
     */
    constructor(sfactor: BlendFactor, dfactor: BlendFactor) {
        super('WebGLBlendFunc')
        this.sfactor = mustBeFactor('sfactor', sfactor)
        this.dfactor = mustBeFactor('dfactor', dfactor)
    }

    contextFree(manager: IContextProvider): void {
        // do nothing
    }

    contextGain(manager: IContextProvider): void {
        this.execute(manager.gl)
    }

    contextLost(canvasId: number): void {
        // do nothing
    }

    private execute(gl: WebGLRenderingContext): void {
        gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl))
    }

    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void {
        this.sfactor = void 0
        this.dfactor = void 0
        super.destructor()
    }
}
