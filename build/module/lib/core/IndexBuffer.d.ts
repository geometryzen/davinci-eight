import { ContextManager } from './ContextManager';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { Usage } from './Usage';
/**
 * A wrapper around a WebGLBuffer with binding to ELEMENT_ARRAY_BUFFER.
 */
export declare class IndexBuffer extends ShareableContextConsumer {
    private data;
    private usage;
    private webGLBuffer;
    /**
     *
     */
    constructor(contextManager: ContextManager, data: Uint16Array, usage: Usage, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    upload(): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    /**
     * Binds the underlying WebGLBuffer to the ELEMENT_ARRAY_BUFFER target.
     */
    bind(): void;
    unbind(): void;
}
