import ContextProvider from './ContextProvider';
import DataBuffer from './DataBuffer';
import {Engine} from './Engine';
import incLevel from '../base/incLevel';
import mustBeObject from '../checks/mustBeObject';
import mustBeUndefined from '../checks/mustBeUndefined';
import {ShareableContextConsumer} from './ShareableContextConsumer';
import {checkUsage} from './Usage';
import Usage from './Usage';
import usageToGL from './usageToGL';

/**
 * <p>
 * A wrapper around a WebGLBuffer with binding to ELEMENT_ARRAY_BUFFER.
 * </p>
 *
 * @class IndexBuffer
 * @extends ShareableContextConsumer
 */
export default class IndexBuffer extends ShareableContextConsumer implements DataBuffer<Uint16Array> {

    /**
     * @property webGLBuffer
     * @type WebGLBuffer
     * @private
     */
    private webGLBuffer: WebGLBuffer;

    /**
     * @property _data
     * @type Uint16Array
     * @private
     */
    private _data: Uint16Array;

    /**
     * A hint as to how the buffer will be used.
     */
    public _usage = Usage.STATIC_DRAW;

    /**
     * @class IndexBuffer
     * @constructor
     * @param engine {Engine}
     */
    constructor(engine: Engine) {
        super(engine)
        this.setLoggingName('IndexBuffer')
        this.synchUp()
    }

    /**
     * @method destructor
     * @param level {number}
     * @return {void}
     * @protected
     */
    protected destructor(level: number): void {
        this.cleanUp()
        // Verify that the cleanUp did its work.
        mustBeUndefined(this._type, this.webGLBuffer)
        super.destructor(incLevel(level))
    }

    /**
     * @property data
     * @type Uint16Array
     */
    get data(): Uint16Array {
        return this._data
    }
    set data(data: Uint16Array) {
        this._data = data;
        this.bufferData();
    }

    get usage(): Usage {
        return this._usage;
    }
    set usage(usage: Usage) {
        checkUsage('usage', usage);
        this._usage = usage;
        this.bufferData();
    }

    bufferData(): void {
        if (this.contextProvider) {
            const gl = this.contextProvider.gl;
            if (gl) {
                if (this.webGLBuffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGLBuffer)
                    if (this._data) {
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._data, usageToGL(this.usage, gl));
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                }
            }
        }
    }

    contextFree(contextProvider: ContextProvider): void {
        mustBeObject('contextProvider', contextProvider)
        if (this.webGLBuffer) {
            const gl = contextProvider.gl
            if (gl) {
                gl.deleteBuffer(this.webGLBuffer)
            }
            else {
                console.error(`${this._type} must leak WebGLBuffer because WebGLRenderingContext is ` + typeof gl)
            }
            this.webGLBuffer = void 0
        }
        else {
            // It's a duplicate, ignore.
        }
        super.contextFree(contextProvider)
    }

    contextGain(contextProvider: ContextProvider): void {
        mustBeObject('contextProvider', contextProvider)
        const gl = contextProvider.gl
        if (!this.webGLBuffer) {
            this.webGLBuffer = gl.createBuffer();
            this.bufferData();
        }
        else {
            // It's a duplicate, ignore the call.
        }
        super.contextGain(contextProvider)
    }

    contextLost(): void {
        this.webGLBuffer = void 0;
        super.contextLost();
    }

    bind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGLBuffer);
        }
    }

    unbind(): void {
        const gl = this.gl;
        if (gl) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
}
