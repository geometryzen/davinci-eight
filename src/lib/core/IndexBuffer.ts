import { BufferObjects } from './BufferObjects';
import { ContextManager } from './ContextManager';
import { mustBeUndefined } from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { Usage } from './Usage';

/**
 * A wrapper around a WebGLBuffer with binding to ELEMENT_ARRAY_BUFFER.
 */
export class IndexBuffer extends ShareableContextConsumer {

    private webGLBuffer: WebGLBuffer;

    /**
     * 
     */
    constructor(contextManager: ContextManager, private data: Uint16Array, private usage: Usage, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('IndexBuffer');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('IndexBuffer');
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
                    gl.bufferData(BufferObjects.ELEMENT_ARRAY_BUFFER, this.data, this.usage);
                }
            }
        }
    }

    contextFree(): void {
        if (this.webGLBuffer) {
            const gl = this.gl;
            if (gl) {
                gl.deleteBuffer(this.webGLBuffer);
            }
            else {
                console.error(`${this.getLoggingName()} must leak WebGLBuffer because WebGLRenderingContext is ` + typeof gl);
            }
            this.webGLBuffer = void 0;
        }
        else {
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
        }
        else {
            // It's a duplicate, ignore the call.
        }
    }

    contextLost(): void {
        this.webGLBuffer = void 0;
        super.contextLost();
    }

    /**
     * Binds the underlying WebGLBuffer to the ELEMENT_ARRAY_BUFFER target.
     */
    bind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ELEMENT_ARRAY_BUFFER, this.webGLBuffer);
        }
    }

    unbind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ELEMENT_ARRAY_BUFFER, null);
        }
    }
}
