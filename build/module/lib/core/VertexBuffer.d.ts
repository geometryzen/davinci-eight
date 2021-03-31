import { ContextManager } from './ContextManager';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { Usage } from './Usage';
/**
 * A wrapper around a WebGLBuffer with binding to ARRAY_BUFFER.
 * @hidden
 */
export declare class VertexBuffer extends ShareableContextConsumer {
    private data;
    private usage;
    /**
     * The underlying WebGL buffer resource.
     */
    private webGLBuffer;
    /**
     *
     */
    constructor(contextManager: ContextManager, data: Float32Array, usage: Usage, levelUp?: number);
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
     * Binds this buffer to the ARRAY_BUFFER target.
     */
    bind(): void;
    /**
     * Unbinds this buffer from the ARRAY_BUFFER target.
     */
    unbind(): void;
}
