import { Capability } from '../core/Capability';
import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';
/**
 * disable(capability: Capability): void
 */
export declare class WebGLDisable extends ShareableBase {
    private contextManager;
    private _capability;
    constructor(contextManager: ContextManager, capability: Capability);
    protected destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
