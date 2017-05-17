import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';
export declare class WebGLClearColor extends ShareableBase {
    private contextManager;
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(contextManager: ContextManager, r?: number, g?: number, b?: number, a?: number);
    /**
     *
     */
    destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
