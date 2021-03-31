import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';
/**
 * Displays details about the WegGL version to the console.
 * @hidden
 */
export declare class VersionLogger extends ShareableBase {
    private contextManager;
    constructor(contextManager: ContextManager);
    protected destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
