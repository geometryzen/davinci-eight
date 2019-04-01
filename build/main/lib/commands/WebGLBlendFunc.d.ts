import { BlendingFactorDest } from '../core/BlendingFactorDest';
import { BlendingFactorSrc } from '../core/BlendingFactorSrc';
import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';
export declare class WebGLBlendFunc extends ShareableBase {
    private contextManager;
    sfactor: BlendingFactorSrc;
    dfactor: BlendingFactorDest;
    constructor(contextManager: ContextManager, sfactor: BlendingFactorSrc, dfactor: BlendingFactorDest);
    destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    private execute;
}
