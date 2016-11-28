import ContextManager from './ContextManager';
import mustBeUndefined from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { checkUsage } from './Usage';
import Usage from './Usage';

/**
 * A wrapper around a WebGLBuffer with binding to ARRAY_BUFFER.
 */
export default class VertexBuffer extends ShareableContextConsumer {

    private webGLBuffer: WebGLBuffer;
    private _data: Float32Array;
    public _usage = Usage.STATIC_DRAW;

    constructor(contextManager: ContextManager, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('VertexBuffer');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined(this.getLoggingName(), this.webGLBuffer);
        super.destructor(levelUp + 1);
    }

    get data(): Float32Array {
        return this._data;
    }
    set data(data: Float32Array) {
        this._data = data;
        this.bufferData(this._data, this._usage);
    }

    get usage(): Usage {
        return this._usage;
    }
    set usage(usage: Usage) {
        checkUsage('usage', usage);
        this._usage = usage;
        this.bufferData(this._data, this._usage);
    }

    bufferData(data?: Float32Array, usage?: Usage): void {
        if (data) {
            this._data = data;
        }
        if (usage) {
            this._usage = usage;
        }
        const gl = this.gl;
        if (gl) {
            if (this.webGLBuffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.webGLBuffer);
                if (this._data) {
                    gl.bufferData(gl.ARRAY_BUFFER, this._data, this._usage);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
            this.bufferData(this._data, this._usage);
        }
        else {
            // It's a duplicate, ignore the call.
        }
    }

    contextLost(): void {
        this.webGLBuffer = void 0;
        super.contextLost();
    }

    bind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGLBuffer);
        }
    }

    unbind() {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }
}
