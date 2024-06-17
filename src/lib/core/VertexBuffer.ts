import { mustBeUndefined } from "../checks/mustBeUndefined";
import { BufferObjects } from "./BufferObjects";
import { ContextManager } from "./ContextManager";
import { ShareableContextConsumer } from "./ShareableContextConsumer";
import { Usage } from "./Usage";

/**
 * A wrapper around a WebGLBuffer with binding to ARRAY_BUFFER.
 */
export class VertexBuffer extends ShareableContextConsumer {
    /**
     * The underlying WebGL buffer resource.
     */
    private webGLBuffer: WebGLBuffer;

    /**
     *
     */
    constructor(
        contextManager: ContextManager,
        private data: Float32Array,
        private usage: Usage,
        levelUp = 0
    ) {
        super(contextManager);
        this.setLoggingName("VertexBuffer");
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     *
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName("VertexBuffer");
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined(this.getLoggingName(), this.webGLBuffer);
        super.destructor(levelUp + 1);
    }

    upload(): void {
        const gl = this.gl;
        if (gl) {
            if (this.webGLBuffer) {
                if (this.data) {
                    gl.bufferData(BufferObjects.ARRAY_BUFFER, this.data, this.usage);
                }
            }
        }
    }

    contextFree(): void {
        if (this.webGLBuffer) {
            const gl = this.gl;
            if (gl) {
                gl.deleteBuffer(this.webGLBuffer);
            } else {
                console.error(`${this.getLoggingName()} must leak WebGLBuffer because WebGLRenderingContext is ` + typeof gl);
            }
            this.webGLBuffer = void 0;
        } else {
            // It's a duplicate, ignore.
        }
        super.contextFree();
    }

    contextGain(): void {
        super.contextGain();
        const gl = this.gl;
        if (!this.webGLBuffer) {
            this.webGLBuffer = gl.createBuffer();
            this.bind();
            this.upload();
            this.unbind();
        } else {
            // It's a duplicate, ignore the call.
        }
    }

    contextLost(): void {
        this.webGLBuffer = void 0;
        super.contextLost();
    }

    /**
     * Binds this buffer to the ARRAY_BUFFER target.
     */
    bind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ARRAY_BUFFER, this.webGLBuffer);
        }
    }

    /**
     * Unbinds this buffer from the ARRAY_BUFFER target.
     */
    unbind() {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ARRAY_BUFFER, null);
        }
    }
}
