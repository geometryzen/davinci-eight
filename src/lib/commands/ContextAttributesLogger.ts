import { ContextManager } from '../core/ContextManager';
import { readOnly } from '../i18n/readOnly';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about the WegGL version to the console.
 */
export class ContextAttributesLogger extends ShareableBase {
    /**
     *
     */
    constructor(private contextManager: ContextManager) {
        super();
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }

    contextFree(): void {
        // Do nothing.
    }

    contextGain(): void {
        const gl = this.contextManager.gl;
        const attributes: WebGLContextAttributes = gl.getContextAttributes();
        console.log("alpha                        => " + attributes.alpha);
        console.log("antialias                    => " + attributes.antialias);
        console.log("depth                        => " + attributes.depth);
        console.log("failIfMajorPerformanceCaveat => " + attributes.failIfMajorPerformanceCaveat);
        // TODO: preferLowPowerToHighPerformance?
        console.log("premultipliedAlpha           => " + attributes.premultipliedAlpha);
        console.log("preserveDrawingBuffer        => " + attributes.preserveDrawingBuffer);
        console.log("stencil                      => " + attributes.stencil);
    }

    contextLost(): void {
        // Do nothing.
    }

    get name(): string {
        return this.getLoggingName();
    }
    set name(unused) {
        throw new Error(readOnly('name').message);
    }
}
